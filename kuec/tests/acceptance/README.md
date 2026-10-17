# Acceptance tests T1–T9

Results and evidence: `kuec/tests/report.md`. These run against a disposable instance only: they install and uninstall the app, create roles, move a worker's clock, stop the instance, and drop and restore its database. Never point them at production or at a staging instance someone else is using.

## Instance

Twenty 2.48.0 with `LOGIC_FUNCTION_TYPE=LOCAL`, a worker, registered crons, and at least seven workspace members. The report's run built Twenty from this checkout (`bash packages/twenty-utils/setup-dev-env.sh`, `workspace:seed:dev`, `node dist/main.js` and `node dist/queue-worker/queue-worker.js` in `packages/twenty-server`). Until the SDK's typecheck passes on `kuec/app` (report, blocker 1), add `"scripts"` to `exclude` in `kuec/app/tsconfig.json` locally before running anything that syncs the app.

Environment for the specs, from `kuec/app`:

```bash
export TWENTY_API_URL=http://localhost:3000
export TWENTY_API_KEY=<admin API key of the disposable workspace>
export TWENTY_CLI_ACCESS_TOKEN=<access token of a signed-in member>   # manual function runs
export T6_ADMIN_TOKEN=<access token of a member holding Admin>        # T6 role changes
export TWENTY_SERVER_DIR=<checkout>/packages/twenty-server WORKER_LOG=<worker log file>   # T4
```

Run the files one at a time: every file's global setup reinstalls the app, so two runs at once corrupt the workspace.

| Test | Command | Time |
| --- | --- | --- |
| T1 | `npx vitest run --config vitest.config.ts src/__tests__/acceptance/t1-licence-playbook.integration-test.ts` | 2 min |
| T2, T3 | `… acceptance/t2-t3-escalation-timers.integration-test.ts` (syncs a copy with 1 business day = 20 s, then the shipped build back) | 8 min |
| T4 | `… acceptance/t4-next-action-cron.integration-test.ts` (restarts the worker through `worker-clock.sh`) | 8 min |
| T5 | `… acceptance/t5-blocked.integration-test.ts` | 2 min |
| T6 API | `… acceptance/t6-field-permissions-api.integration-test.ts` | 1 min |
| T6 UI | from the repository root: `API_URL=… FRONT_URL=… ADMIN_TOKEN=… API_KEY=… EVIDENCE_DIR=… node kuec/tests/acceptance/t6-ui-kanban.mjs` (needs a running front end and Chromium) | 5 min |
| T7 | `kuec/tests/acceptance/t7-backup-restore.sh` (variables at the top of the script; needs Docker and `pg_dump` 16) | 3 min |
| T8 | `src/__tests__/upgrade.integration-test.ts`, then `kuec/tests/acceptance/t8-field-removal-and-restore.sh` after restoring the T7 dump | 6 min |
| T9 | `runbooks/01-deploy.md` §12, once a release after 2.48.0 exists | |
