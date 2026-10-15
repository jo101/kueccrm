# Admin Panel configuration variables

- **Why not the manifest:** these are server-level settings (`core.keyValuePair`), not workspace metadata. An app cannot set them.
- **Written against:** Twenty 2.48.0.
- **Prerequisites:** the server-admin account (the ED, the first user to sign up), `IS_CONFIG_VARIABLES_IN_DB_ENABLED=true`. The ED shares the screen with the deploy engineer, who reads the secrets out of the secrets manager. Secrets are pasted, never typed into chat or tickets.

## Steps

For each row: **Settings > Admin Panel > Config** tab, search the variable name, click it, enter the value, save.

| Variable | Value | Source |
| --- | --- | --- |
| `AUTH_MICROSOFT_ENABLED` | `true` | |
| `MESSAGING_PROVIDER_MICROSOFT_ENABLED` | `true` | |
| `CALENDAR_PROVIDER_MICROSOFT_ENABLED` | `true` | |
| `AUTH_MICROSOFT_CLIENT_ID` | client ID from IT | it-request item 1 |
| `AUTH_MICROSOFT_CLIENT_SECRET` | | secrets manager `twenty/<env>/AUTH_MICROSOFT_CLIENT_SECRET` |
| `AUTH_MICROSOFT_CALLBACK_URL` | `<SERVER_URL>/auth/microsoft/redirect` | |
| `AUTH_MICROSOFT_APIS_CALLBACK_URL` | `<SERVER_URL>/auth/microsoft-apis/get-access-token` | |
| `AUTH_GOOGLE_ENABLED`, `MESSAGING_PROVIDER_GMAIL_ENABLED`, `CALENDAR_PROVIDER_GOOGLE_ENABLED` | leave `false` (default) | |
| `IS_IMAP_SMTP_CALDAV_ENABLED` | `false` | M365 only |
| `EMAIL_DRIVER` | `SMTP` | |
| `EMAIL_SMTP_HOST` | `smtp.office365.com` | |
| `EMAIL_SMTP_PORT` | `587` | STARTTLS |
| `EMAIL_SMTP_USER` | `bd-ops@kuec.example` | |
| `EMAIL_SMTP_PASSWORD` | app password | secrets manager `twenty/<env>/EMAIL_SMTP_PASSWORD` |
| `EMAIL_FROM_ADDRESS` | `bd-ops@kuec.example` | must equal the SMTP user, or Exchange rejects the send |
| `EMAIL_FROM_NAME` | `KUEC BD Ops` | |
| `API_RATE_LIMITING_LONG_LIMIT` | `600` (requests per 60 s window) | default is 100 |

Do **not** set here: anything in the `.env` guard-rail block (`TELEMETRY_ENABLED`, `SIGN_IN_PREFILLED`, `LOGIC_FUNCTION_TYPE`, `CODE_INTERPRETER_TYPE`, `OUTBOUND_HTTP_*`, `MARKETPLACE_CATALOG_SYNC_CRON_ENABLED`, `STORAGE_*`). A database value overrides `.env`, and `scripts/verify-config.sh` fails if one exists.

`API_RATE_LIMITING_LONG_LIMIT` applies to all API-key traffic on the instance. A per-key override needs the Organization plan's usage-limit entitlement, so we raise the instance default instead. With one automation key and no other integrations, that is the same thing. `API_RATE_LIMITING_SHORT_LIMIT` (100 per second) stays at its default.

## Expected result

Each variable shows source "Database". The login page shows "Continue with Microsoft". Restart is not needed: server and worker reload database config every 15 seconds.

## Verify

1. Private window, open `SERVER_URL`: "Continue with Microsoft" is shown and there is no prefilled email.
2. Settings > Members > invite a test address: the invitation arrives from bd-ops. If it does not, check server logs for the SMTP error (`docker compose logs server | grep -i smtp`).
3. `scripts/verify-config.sh .env` prints `OK`.

## Undo

Open the variable and choose reset/delete to fall back to the `.env` or default value. Setting `AUTH_MICROSOFT_ENABLED=false` hides Microsoft login without losing the other values.
