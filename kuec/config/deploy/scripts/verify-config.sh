#!/usr/bin/env bash
# Checks the guard rails are in force: the running containers carry the .env
# values, and no Admin Panel (database) value overrides them.
# Usage: scripts/verify-config.sh [path/to/.env]
set -euo pipefail

ENV_FILE="${1:-.env}"
COMPOSE=(docker compose --env-file "$ENV_FILE")
set -a; . "$ENV_FILE"; set +a

GUARD_RAILS="IS_MULTIWORKSPACE_ENABLED TELEMETRY_ENABLED SIGN_IN_PREFILLED LOGIC_FUNCTION_TYPE CODE_INTERPRETER_TYPE OUTBOUND_HTTP_ALLOWED_INTERNAL_HOSTS OUTBOUND_HTTP_SAFE_MODE_ENABLED STORAGE_TYPE MARKETPLACE_CATALOG_SYNC_CRON_ENABLED"
EXPECTED="IS_MULTIWORKSPACE_ENABLED=false TELEMETRY_ENABLED=false SIGN_IN_PREFILLED=false LOGIC_FUNCTION_TYPE=${LOGIC_FUNCTION_TYPE} CODE_INTERPRETER_TYPE=DISABLED STORAGE_TYPE=S_3 IS_CONFIG_VARIABLES_IN_DB_ENABLED=true MARKETPLACE_CATALOG_SYNC_CRON_ENABLED=false"
status=0

for service in server worker; do
  for pair in $EXPECTED; do
    key="${pair%%=*}"; want="${pair#*=}"
    got="$("${COMPOSE[@]}" exec -T "$service" printenv "$key" || true)"
    if [ "$got" != "$want" ]; then
      echo "FAIL $service $key=$got (want $want)"; status=1
    fi
  done
done

in_list="$(printf "'%s'," $GUARD_RAILS)"; in_list="${in_list%,}"
overrides="$("${COMPOSE[@]}" exec -T db psql -U "$PG_DATABASE_USER" -d "$PG_DATABASE_NAME" -tAc \
  "SELECT key FROM core.\"keyValuePair\" WHERE type = 'CONFIG_VARIABLE' AND key IN ($in_list)")"
if [ -n "$overrides" ]; then
  echo "FAIL Admin Panel overrides a guard rail (delete it in Settings > Admin Panel > Configuration Variables):"
  echo "$overrides"; status=1
fi

case "$SERVER_URL" in https://*) ;; *) echo "FAIL SERVER_URL is not https: $SERVER_URL"; status=1 ;; esac
curl -fsS -o /dev/null "$SERVER_URL/healthz" || { echo "FAIL $SERVER_URL/healthz not reachable"; status=1; }

[ "$status" -eq 0 ] && echo "OK guard rails in force"
exit "$status"
