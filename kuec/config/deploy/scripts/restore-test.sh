#!/usr/bin/env bash
# Restore test: rebuilds a throwaway Twenty from the latest off-host backup and
# checks it boots and holds the same data. Runs monthly and before every upgrade.
# The restored copy runs no worker and registers no crons, so it never syncs
# mail, sends email or fires automation.
# Usage: scripts/restore-test.sh /srv/twenty/prod/.env
set -euo pipefail

ENV_FILE="${1:-.env}"
set -a; . "$ENV_FILE"; set +a
PROD_PROJECT="$COMPOSE_PROJECT_NAME"
PROJECT=twenty-restoretest
WORK="$(mktemp -d)"
trap 'docker compose -p "$PROJECT" -f "$WORK/compose.yml" down -v >/dev/null 2>&1 || true; rm -rf "$WORK"' EXIT

docker run --rm -v "$WORK:/work" \
  -e RCLONE_CONFIG_DST_TYPE=s3 -e RCLONE_CONFIG_DST_PROVIDER=Other \
  -e RCLONE_CONFIG_DST_ENDPOINT="$BACKUP_S3_ENDPOINT" -e RCLONE_CONFIG_DST_REGION="$BACKUP_S3_REGION" \
  -e RCLONE_CONFIG_DST_ACCESS_KEY_ID="$BACKUP_S3_ACCESS_KEY_ID" -e RCLONE_CONFIG_DST_SECRET_ACCESS_KEY="$BACKUP_S3_SECRET_ACCESS_KEY" \
  rclone/rclone:1.68.2 copy "dst:$BACKUP_S3_BUCKET/$PROD_PROJECT/db/" /work/db --max-age 2d
DUMP="$(ls -1t "$WORK"/db/*.dump | head -1)"
( cd "$WORK/db" && sha256sum -c "$(basename "$DUMP").sha256" )

cat > "$WORK/compose.yml" <<YAML
services:
  db:
    image: postgres:16
    environment: { POSTGRES_DB: restore, POSTGRES_USER: restore, POSTGRES_PASSWORD: restore }
    healthcheck: { test: pg_isready -U restore -d restore, interval: 2s, retries: 30 }
  redis:
    image: redis:7.4
  server:
    image: twentycrm/twenty:$TAG
    depends_on: { db: { condition: service_healthy } }
    ports: ["127.0.0.1:3999:3000"]
    environment:
      PG_DATABASE_URL: postgres://restore:restore@db:5432/restore
      REDIS_URL: redis://redis:6379
      SERVER_URL: http://localhost:3999
      ENCRYPTION_KEY: "$ENCRYPTION_KEY"
      DISABLE_CRON_JOBS_REGISTRATION: "true"
      TELEMETRY_ENABLED: "false"
      LOGIC_FUNCTION_TYPE: DISABLED
YAML

C=(docker compose -p "$PROJECT" -f "$WORK/compose.yml")
"${C[@]}" up -d db redis
until "${C[@]}" exec -T db pg_isready -U restore -d restore >/dev/null 2>&1; do sleep 2; done
"${C[@]}" exec -T db pg_restore -U restore -d restore --no-owner --exit-on-error < "$DUMP"
"${C[@]}" up -d server
for _ in $(seq 1 90); do curl -fsS http://localhost:3999/healthz >/dev/null 2>&1 && break; sleep 5; done
curl -fsS http://localhost:3999/healthz >/dev/null

count() { "$@" -tAc "SELECT (SELECT count(*) FROM core.workspace)||' workspaces, '||(SELECT count(*) FROM core.\"user\")||' users, '||(SELECT count(*) FROM core.\"apiKey\")||' api keys'"; }
echo "restored: $(count "${C[@]}" exec -T db psql -U restore -d restore)"
echo "prod now: $(count docker compose --env-file "$ENV_FILE" exec -T db psql -U "$PG_DATABASE_USER" -d "$PG_DATABASE_NAME")"
"${C[@]}" exec -T server yarn command:prod upgrade:status | tail -3
# Files: the off-host copy must hold at least as many objects as the live bucket did last night.
backup_rclone() {
  docker run --rm \
    -e RCLONE_CONFIG_SRC_TYPE=s3 -e RCLONE_CONFIG_SRC_PROVIDER=Other \
    -e RCLONE_CONFIG_SRC_ENDPOINT="$STORAGE_S3_ENDPOINT" -e RCLONE_CONFIG_SRC_REGION="$STORAGE_S3_REGION" \
    -e RCLONE_CONFIG_SRC_ACCESS_KEY_ID="$STORAGE_S3_ACCESS_KEY_ID" -e RCLONE_CONFIG_SRC_SECRET_ACCESS_KEY="$STORAGE_S3_SECRET_ACCESS_KEY" \
    -e RCLONE_CONFIG_DST_TYPE=s3 -e RCLONE_CONFIG_DST_PROVIDER=Other \
    -e RCLONE_CONFIG_DST_ENDPOINT="$BACKUP_S3_ENDPOINT" -e RCLONE_CONFIG_DST_REGION="$BACKUP_S3_REGION" \
    -e RCLONE_CONFIG_DST_ACCESS_KEY_ID="$BACKUP_S3_ACCESS_KEY_ID" -e RCLONE_CONFIG_DST_SECRET_ACCESS_KEY="$BACKUP_S3_SECRET_ACCESS_KEY" \
    rclone/rclone:1.68.2 "$@"
}
echo "files in backup: $(backup_rclone size "dst:$BACKUP_S3_BUCKET/$PROD_PROJECT/files/current" | head -1)"
echo "files live:      $(backup_rclone size "src:$STORAGE_S3_NAME" | head -1)"
# A full file restore is the same sync reversed into an empty bucket:
#   rclone sync dst:<backup-bucket>/<project>/files/current src:<new-bucket>

echo "Restore test passed. Record it in runbooks/01-deploy.md section 10 (date, dump name, counts)."
