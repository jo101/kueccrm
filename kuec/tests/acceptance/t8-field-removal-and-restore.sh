#!/usr/bin/env bash
# T8 second half, staging only: remove one field from the manifest, show that
# the plan destroys it and the SDK refuses without confirmation, confirm, check
# the column and its data are gone, then restore the instance from the T7
# backup and check the column and the data are back.
# Needs: APP_DIR (kuec/app with node_modules), WORK_DIR from T7, EVIDENCE_DIR,
# DB_URL of the instance, TWENTY_API_KEY, SOURCE_URL, STOP_SOURCE, START_SOURCE,
# AFTER_RESTORE (cache flush and cron registration for the instance), and
# SYNC_NODE_ENV=test when the SDK remote lives in ~/.twenty/config.test.json.
set -euo pipefail

: "${APP_DIR:?}" "${WORK_DIR:?}" "${EVIDENCE_DIR:?}" "${DB_URL:?}" "${TWENTY_API_KEY:?}"
: "${STOP_SOURCE:?}" "${START_SOURCE:?}" "${AFTER_RESTORE:?}" "${TWENTY_SERVER_DIR:?}"
SOURCE_URL="${SOURCE_URL:-http://localhost:3000}"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RECORD_ID="$(cat "$WORK_DIR/record-id")"
DUMP="$(cat "$WORK_DIR/dump-path")"
FIELD=declinedReason
api() { curl -sS -H "Authorization: Bearer $TWENTY_API_KEY" -H 'Content-Type: application/json' "$@"; }
schema="$(psql "$DB_URL" -tAc "select \"databaseSchema\" from core.workspace where \"displayName\" = 'Apple'")"
column_state() {
  echo "column: $(psql "$DB_URL" -tAc "select count(*) from information_schema.columns where table_schema = '$schema' and table_name = '_workPackage' and column_name = '$FIELD'")"
  echo "field metadata: $(psql "$DB_URL" -tAc "select count(*) from core.\"fieldMetadata\" f join core.\"objectMetadata\" o on o.id = f.\"objectMetadataId\" where o.\"nameSingular\" = 'workPackage' and f.name = '$FIELD' and o.\"workspaceId\" = '20202020-1c25-4d02-bf25-6aeccf7ea419'")"
  echo "value on T7 record: $(psql "$DB_URL" -tAc "select \"$FIELD\" from $schema.\"_workPackage\" where id = '$RECORD_ID'" 2>&1 | head -1)"
  echo "work packages: $(psql "$DB_URL" -tAc "select count(*) from $schema.\"_workPackage\"")"
}

mkdir -p "$EVIDENCE_DIR"
echo "== before"
column_state | tee "$EVIDENCE_DIR/t8-before.txt"

COPY="$(mktemp -d)/app"
mkdir -p "$COPY"
tar -C "$APP_DIR" --exclude=./node_modules --exclude=./.twenty -cf - . | tar -C "$COPY" -xf -
ln -s "$(realpath "$APP_DIR/node_modules")" "$COPY/node_modules"
python3 - "$COPY/src/objects/work-package.object.ts" <<'PY'
import re, sys
path = sys.argv[1]
source = open(path).read()
block = re.compile(r"\n    \{\n      universalIdentifier: WORK_PACKAGE_DECLINED_REASON_FIELD_UNIVERSAL_IDENTIFIER,.*?\n    \},", re.S)
patched, count = block.subn("", source, count=1)
assert count == 1, "declinedReason block not found"
open(path, "w").write(patched)
PY
cp "$HERE/sync-app.mjs" "$COPY/.sync-app.mjs"

echo "== sync without confirmation (must be refused)"
( cd "$COPY" && NODE_ENV="${SYNC_NODE_ENV:-}" node .sync-app.mjs "$COPY" ) > "$EVIDENCE_DIR/t8-refused.txt" 2>&1 && refused=no || refused=yes
grep -E "to destroy|will be destroyed|destroys|result" "$EVIDENCE_DIR/t8-refused.txt" | tail -5
column_state > "$EVIDENCE_DIR/t8-after-refused.txt"; cat "$EVIDENCE_DIR/t8-after-refused.txt"

echo "== sync with confirmation"
( cd "$COPY" && NODE_ENV="${SYNC_NODE_ENV:-}" node .sync-app.mjs "$COPY" --confirm-destroy ) > "$EVIDENCE_DIR/t8-confirmed.txt" 2>&1
grep -E "to destroy|$FIELD|destroys|result" "$EVIDENCE_DIR/t8-confirmed.txt" | tail -6
column_state | tee "$EVIDENCE_DIR/t8-after-removal.txt"
echo "API read: $(api "$SOURCE_URL/rest/workPackages/$RECORD_ID" | python3 -c "import json,sys; d=json.load(sys.stdin)['data']['workPackage']; print('$FIELD' in d, d.get('$FIELD'))")"

echo "== restore from the T7 backup"
env -u NODE_ENV $STOP_SOURCE
( cd "$(dirname "$DUMP")" && sha256sum -c "$(basename "$DUMP").sha256" )
psql "${DB_URL%/*}/postgres" -c 'DROP DATABASE "default" WITH (FORCE)' -c 'CREATE DATABASE "default"'
pg_restore -d "$DB_URL" --no-owner --exit-on-error "$DUMP"
rm -rf "$TWENTY_SERVER_DIR/.local-storage"
cp -a "$WORK_DIR/files" "$TWENTY_SERVER_DIR/.local-storage"
column_state | tee "$EVIDENCE_DIR/t8-after-restore.txt"
env -u NODE_ENV $AFTER_RESTORE
env -u NODE_ENV $START_SOURCE
echo "API read after restore: $(api "$SOURCE_URL/rest/workPackages/$RECORD_ID" | python3 -c "import json,sys; d=json.load(sys.stdin)['data']['workPackage']; print('$FIELD' in d, d.get('$FIELD'))")"

before_value="$(grep '^value' "$EVIDENCE_DIR/t8-before.txt")"
removed_column="$(grep '^column' "$EVIDENCE_DIR/t8-after-removal.txt")"
restored_value="$(grep '^value' "$EVIDENCE_DIR/t8-after-restore.txt")"
restored_column="$(grep '^column' "$EVIDENCE_DIR/t8-after-restore.txt")"
if [ "$refused" = yes ] && [ "$removed_column" = "column: 0" ] && [ "$restored_column" = "column: 1" ] && [ "$restored_value" = "$before_value" ]; then
  echo "T8 field removal and restore PASS"
else
  echo "T8 field removal and restore FAIL (refused=$refused, $removed_column, $restored_column, $restored_value)"
fi
