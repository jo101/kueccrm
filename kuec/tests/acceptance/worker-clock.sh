#!/usr/bin/env bash
# Restarts the worker of a from-source test instance, either on the real clock
# or with its clock moved by an offset in milliseconds (see fake-clock.cjs).
# Usage: worker-clock.sh real | worker-clock.sh offset <ms>
# Needs TWENTY_SERVER_DIR (packages/twenty-server of the checkout) and WORKER_LOG.
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
: "${TWENTY_SERVER_DIR:?}" "${WORKER_LOG:?}"

pkill -f 'dist/queue-worker/queue-worker.js' || true
for _ in $(seq 1 30); do pgrep -f 'dist/queue-worker/queue-worker.js' >/dev/null || break; sleep 1; done

cd "$TWENTY_SERVER_DIR"
# Callers such as vitest export NODE_ENV=test, which points Twenty at its test database.
export NODE_ENV="${TWENTY_NODE_ENV:-development}"
lines_before="$(wc -l < "$WORKER_LOG" 2>/dev/null || echo 0)"
if [ "${1:-real}" = offset ]; then
  KUEC_FAKE_CLOCK_OFFSET_MS="$2" nohup node --require "$HERE/fake-clock.cjs" dist/queue-worker/queue-worker.js >> "$WORKER_LOG" 2>&1 &
else
  nohup node dist/queue-worker/queue-worker.js >> "$WORKER_LOG" 2>&1 &
fi

# Started once it has logged its module initialisation.
for _ in $(seq 1 60); do [ "$(tail -n +"$((lines_before + 1))" "$WORKER_LOG" | grep -c InstanceLoader)" -gt 20 ] && break; sleep 1; done
sleep 5
if [ "${1:-real}" != offset ]; then
  # Repeating cron jobs were rescheduled on the moved clock; put them back on the real one.
  node dist/command/command.js cron:register:all > /dev/null 2>&1
fi
echo "worker restarted (${1:-real} ${2:-})"
