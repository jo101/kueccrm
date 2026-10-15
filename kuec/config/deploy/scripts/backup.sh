#!/usr/bin/env bash
# Nightly backup: Postgres dump and object-storage mirror, both shipped off-host.
# Cron on the host (Asia/Dubai 02:30 = 22:30 UTC):
#   30 22 * * * cd /srv/twenty/kuec/config/deploy && scripts/backup.sh /srv/twenty/prod/.env >> /var/log/twenty-backup.log 2>&1
set -euo pipefail

ENV_FILE="${1:-.env}"
COMPOSE=(docker compose --env-file "$ENV_FILE")
set -a; . "$ENV_FILE"; set +a

RCLONE_IMAGE=rclone/rclone:1.68.2
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
mkdir -p "$BACKUP_LOCAL_DIR"
DUMP="$BACKUP_LOCAL_DIR/${COMPOSE_PROJECT_NAME}-db-${STAMP}.dump"

# Database first: a file uploaded after the dump is harmless, a missing one is not.
"${COMPOSE[@]}" exec -T db pg_dump -U "$PG_DATABASE_USER" -d "$PG_DATABASE_NAME" -Fc --no-owner > "$DUMP"
pg_list_ok="$("${COMPOSE[@]}" exec -T db pg_restore --list < "$DUMP" | grep -c 'TABLE DATA' || true)"
[ "$pg_list_ok" -gt 0 ] || { echo "dump $DUMP is empty or unreadable"; exit 1; }
sha256sum "$DUMP" > "$DUMP.sha256"

rclone() {
  docker run --rm -v "$BACKUP_LOCAL_DIR:/backup" \
    -e RCLONE_CONFIG_SRC_TYPE=s3 -e RCLONE_CONFIG_SRC_PROVIDER=Other \
    -e RCLONE_CONFIG_SRC_ENDPOINT="$STORAGE_S3_ENDPOINT" -e RCLONE_CONFIG_SRC_REGION="$STORAGE_S3_REGION" \
    -e RCLONE_CONFIG_SRC_ACCESS_KEY_ID="$STORAGE_S3_ACCESS_KEY_ID" -e RCLONE_CONFIG_SRC_SECRET_ACCESS_KEY="$STORAGE_S3_SECRET_ACCESS_KEY" \
    -e RCLONE_CONFIG_DST_TYPE=s3 -e RCLONE_CONFIG_DST_PROVIDER=Other \
    -e RCLONE_CONFIG_DST_ENDPOINT="$BACKUP_S3_ENDPOINT" -e RCLONE_CONFIG_DST_REGION="$BACKUP_S3_REGION" \
    -e RCLONE_CONFIG_DST_ACCESS_KEY_ID="$BACKUP_S3_ACCESS_KEY_ID" -e RCLONE_CONFIG_DST_SECRET_ACCESS_KEY="$BACKUP_S3_SECRET_ACCESS_KEY" \
    "$RCLONE_IMAGE" "$@"
}

PREFIX="dst:$BACKUP_S3_BUCKET/$COMPOSE_PROJECT_NAME"
rclone copy "/backup/$(basename "$DUMP")" "$PREFIX/db/"
rclone copy "/backup/$(basename "$DUMP").sha256" "$PREFIX/db/"
# Deleted or overwritten files are kept under deleted/<stamp> instead of lost.
rclone sync "src:$STORAGE_S3_NAME" "$PREFIX/files/current" --backup-dir "$PREFIX/files/deleted/$STAMP"

# Retention: 14 local dumps, 35 days off-host.
ls -1t "$BACKUP_LOCAL_DIR"/*-db-*.dump 2>/dev/null | tail -n +15 | while read -r old; do rm -f "$old" "$old.sha256"; done
rclone delete "$PREFIX/db/" --min-age 35d
rclone delete "$PREFIX/files/deleted/" --min-age 35d --rmdirs

echo "$STAMP backup ok: $(basename "$DUMP") ($(du -h "$DUMP" | cut -f1))"
