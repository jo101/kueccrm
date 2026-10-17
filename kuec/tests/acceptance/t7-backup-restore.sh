#!/usr/bin/env bash
# T7: back up the disposable instance the way scripts/backup.sh does, restore
# into a fresh Postgres 16 container the way scripts/restore-test.sh does, boot
# Twenty against the copy, and compare record counts and one work package's
# full history. Test instances only.
#
# Needs: TWENTY_SERVER_DIR (packages/twenty-server of a built checkout),
# TWENTY_API_KEY, a running source instance on SOURCE_URL, docker, psql,
# pg_dump/pg_restore 16. Writes evidence to EVIDENCE_DIR and keeps the dump and
# the files copy in WORK_DIR for T8.
set -euo pipefail

: "${TWENTY_SERVER_DIR:?}" "${TWENTY_API_KEY:?}"
SOURCE_URL="${SOURCE_URL:-http://localhost:3000}"
SOURCE_DB_URL="${SOURCE_DB_URL:-postgres://postgres:postgres@localhost:5432/default}"
RESTORE_PORT="${RESTORE_PORT:-3999}"
RESTORE_DB_PORT="${RESTORE_DB_PORT:-55432}"
POSTGRES_IMAGE="${POSTGRES_IMAGE:-postgres:16}"
WORK_DIR="${WORK_DIR:?}"
EVIDENCE_DIR="${EVIDENCE_DIR:?}"
STOP_SOURCE="${STOP_SOURCE:?command that stops the source server and worker}"
START_SOURCE="${START_SOURCE:?command that starts them again}"
CONTAINER=kuec-t7-restore
RESTORED_DB_URL="postgres://restore:restore@localhost:$RESTORE_DB_PORT/restore"

mkdir -p "$WORK_DIR" "$EVIDENCE_DIR"
api() { curl -fsS -H "Authorization: Bearer $TWENTY_API_KEY" -H 'Content-Type: application/json' "$@"; }
json() { python3 -c "import json,sys; d=json.load(sys.stdin); print($1)"; }

workspace_schema() {
  psql "$1" -tAc "select \"databaseSchema\" from core.workspace where \"displayName\" = 'Apple'"
}

# Every table's row count (soft-deleted rows included) in the workspace, core
# and metadata schemas, then the work package, its timeline and its tasks.
snapshot() {
  local db_url="$1" record_id="$2" schema
  schema="$(workspace_schema "$db_url")"
  psql "$db_url" -tA <<SQL
select 'count ' || table_schema || '.' || table_name || ' ' ||
  (xpath('/row/c/text()', query_to_xml(format('select count(*) as c from %I.%I', table_schema, table_name), false, true, '')))[1]::text
from information_schema.tables
where table_type = 'BASE TABLE' and table_schema in ('core', 'metadata', '$schema')
order by table_schema, table_name;
select 'record ' || row_to_json(w)::text from $schema."_workPackage" w where id = '$record_id';
select 'timeline ' || row_to_json(t)::text from (
  select id, "happensAt", "timelineActivityTypeSnapshot"->>'name' as type, properties, "targetWorkPackageId", "targetOpportunityId", "linkedRecordId", "createdAt"
  from $schema."timelineActivity" where "targetWorkPackageId" = '$record_id' or "linkedRecordId" = '$record_id'
  order by "happensAt", id) t;
select 'task ' || row_to_json(t)::text from (
  select k.id, k.title, k."assigneeId", k."createdAt", k."deletedAt"
  from $schema.task k join $schema."taskTarget" tt on tt."taskId" = k.id
  where tt."targetWorkPackageId" = '$record_id' order by k."createdAt", k.id) t;
SQL
}

echo "== 1. a work package with a history"
member_id="$(api "$SOURCE_URL/rest/workspaceMembers?limit=1" | json 'd["data"]["workspaceMembers"][0]["id"]')"
opportunity_id="$(api -X POST "$SOURCE_URL/rest/opportunities" -d "{\"name\":\"T7 history case\",\"ownerId\":\"$member_id\"}" | json 'd["data"]["createOpportunity"]["id"]')"
record_id="$(api -X POST "$SOURCE_URL/rest/workPackages" -d "{\"name\":\"T7 history\",\"status\":\"PLANNED\",\"ownerId\":\"$member_id\",\"opportunityId\":\"$opportunity_id\",\"dueAt\":\"2026-12-01T13:00:00.000Z\",\"doneCriteria\":\"Restore keeps every row\",\"declinedReason\":\"Kept for T8: written before the T7 backup\"}" | json 'd["data"]["createWorkPackage"]["id"]')"
for step in '{"status":"OFFERED"}' '{"status":"ACCEPTED"}' '{"status":"BLOCKED","blockedReason":"Waiting for the sample"}' '{"status":"ACCEPTED"}' '{"status":"SUBMITTED"}' '{"status":"DONE"}'; do
  api -X PATCH "$SOURCE_URL/rest/workPackages/$record_id" -d "$step" >/dev/null
  sleep 12
done
echo "$record_id" > "$WORK_DIR/record-id"
echo "$opportunity_id" > "$WORK_DIR/opportunity-id"
echo "work package $record_id on opportunity $opportunity_id"

echo "== 2. backup (source stopped so the snapshot and the dump see the same rows)"
env -u NODE_ENV $STOP_SOURCE
snapshot "$SOURCE_DB_URL" "$record_id" > "$EVIDENCE_DIR/t7-source-snapshot.txt"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
DUMP="$WORK_DIR/twenty-test-db-$STAMP.dump"
pg_dump "$SOURCE_DB_URL" -Fc --no-owner > "$DUMP"
table_data="$(pg_restore --list "$DUMP" | grep -c 'TABLE DATA' || true)"
[ "$table_data" -gt 0 ] || { echo "dump $DUMP is empty or unreadable"; exit 1; }
( cd "$WORK_DIR" && sha256sum "$(basename "$DUMP")" > "$(basename "$DUMP").sha256" )
rm -rf "$WORK_DIR/files"
cp -a "$TWENTY_SERVER_DIR/.local-storage" "$WORK_DIR/files"
echo "$DUMP" > "$WORK_DIR/dump-path"
env -u NODE_ENV $START_SOURCE
echo "dump $(basename "$DUMP"): $(du -h "$DUMP" | cut -f1), $table_data TABLE DATA entries; files $(du -sh "$WORK_DIR/files" | cut -f1)"

echo "== 3. restore into a fresh container"
docker rm -f "$CONTAINER" >/dev/null 2>&1 || true
docker run -d --name "$CONTAINER" -e POSTGRES_DB=restore -e POSTGRES_USER=restore -e POSTGRES_PASSWORD=restore \
  -p "127.0.0.1:$RESTORE_DB_PORT:5432" "$POSTGRES_IMAGE" >/dev/null
until docker exec "$CONTAINER" pg_isready -U restore -d restore >/dev/null 2>&1; do sleep 2; done
sleep 3
( cd "$WORK_DIR" && sha256sum -c "$(basename "$DUMP").sha256" )
docker exec -i "$CONTAINER" pg_restore -U restore -d restore --no-owner --exit-on-error < "$DUMP"
# Before anything boots against it, so the comparison is of the restore alone.
snapshot "$RESTORED_DB_URL" "$record_id" > "$EVIDENCE_DIR/t7-restored-snapshot.txt"
echo "container $(docker inspect -f '{{.Config.Image}} {{.State.StartedAt}}' "$CONTAINER")"

echo "== 4. boot Twenty against the copy (no worker, logic functions disabled)"
(
  cd "$TWENTY_SERVER_DIR"
  PG_DATABASE_URL="$RESTORED_DB_URL" REDIS_URL=redis://localhost:6379/3 NODE_PORT="$RESTORE_PORT" \
    SERVER_URL="http://localhost:$RESTORE_PORT" STORAGE_LOCAL_PATH="$WORK_DIR/files" LOGIC_FUNCTION_TYPE=DISABLED \
    nohup node dist/main.js > "$WORK_DIR/restored-server.log" 2>&1 &
  echo $! > "$WORK_DIR/restored-server.pid"
)
for _ in $(seq 1 90); do curl -fsS "http://localhost:$RESTORE_PORT/healthz" >/dev/null 2>&1 && break; sleep 2; done
curl -fsS "http://localhost:$RESTORE_PORT/healthz"; echo

echo "== 5. compare"
api "$SOURCE_URL/rest/workPackages/$record_id" > "$WORK_DIR/source-api.json"
api "http://localhost:$RESTORE_PORT/rest/workPackages/$record_id" > "$WORK_DIR/restored-api.json"
api "http://localhost:$RESTORE_PORT/rest/timelineActivities?filter=targetWorkPackageId%5Beq%5D%3A%22$record_id%22&limit=50" \
  | json '"\n".join(sorted(t["happensAt"] + " " + (t.get("timelineActivityTypeSnapshot") or {}).get("name", "") for t in d["data"]["timelineActivities"]))' \
  > "$EVIDENCE_DIR/t7-restored-api-timeline.txt"
(cd "$TWENTY_SERVER_DIR" && PG_DATABASE_URL="$RESTORED_DB_URL" REDIS_URL=redis://localhost:6379/3 node dist/command/command.js upgrade:status 2>&1 | sed -E 's/\x1b\[[0-9;]*m//g' | grep -vE '^\[Nest\]|^\s*$' | tail -5) > "$EVIDENCE_DIR/t7-restored-upgrade-status.txt" || true

result=PASS
if diff "$EVIDENCE_DIR/t7-source-snapshot.txt" "$EVIDENCE_DIR/t7-restored-snapshot.txt" > "$EVIDENCE_DIR/t7-snapshot.diff"; then
  echo "snapshots identical: $(grep -c '^count ' "$EVIDENCE_DIR/t7-source-snapshot.txt") table counts, $(grep -c '^timeline ' "$EVIDENCE_DIR/t7-source-snapshot.txt") timeline rows, $(grep -c '^task ' "$EVIDENCE_DIR/t7-source-snapshot.txt") tasks"
else
  echo "snapshots differ:"; head -40 "$EVIDENCE_DIR/t7-snapshot.diff"; result=FAIL
fi
if python3 - "$WORK_DIR/source-api.json" "$WORK_DIR/restored-api.json" <<'PY'
import json, sys
source, restored = (json.load(open(path))["data"]["workPackage"] for path in sys.argv[1:3])
sys.exit(0 if source == restored else 1)
PY
then echo "API read of the work package identical on both instances"; else echo "API read differs"; result=FAIL; fi

kill "$(cat "$WORK_DIR/restored-server.pid")" 2>/dev/null || true
echo "T7 $result"
