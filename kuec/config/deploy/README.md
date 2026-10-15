# Deploy config

Stock Twenty 2.48.0 (`VERSION`) on our own container host. The procedure is `../../runbooks/01-deploy.md`.

| File | Purpose |
| --- | --- |
| `VERSION` | Pinned Twenty version. The image tag in `.env` is `v` + this. |
| `docker-compose.yml` | server, worker, Postgres 16, Redis. Used for prod and staging (different `.env`). |
| `.env.example` | Template for `/srv/twenty/<env>/.env`. Secrets are filled from the secrets manager, never committed. |
| `Caddyfile.example` | TLS reverse proxy example for prod and staging. |
| `logic-function-type.md` | LOCAL vs LAMBDA decision and the accepted risk. |
| `it-request.md` | One-page request to KUEC IT. |
| `scripts/verify-config.sh` | Guard rails in force, no Admin Panel override, SERVER_URL reachable. |
| `scripts/verify-crons.sh` | Required cron jobs registered and running. |
| `scripts/backup.sh` | Nightly Postgres dump plus bucket mirror, off-host. |
| `scripts/restore-test.sh` | Rebuilds a throwaway instance from the latest backup. |
