# Decision: LOGIC_FUNCTION_TYPE

Written against Twenty 2.48.0. Owner: engineering lead. Review: every upgrade, and whenever a role changes.

## Decision

| If | Then |
| --- | --- |
| KUEC IT provides an AWS account for us (see it-request.md, item 4) | `LOGIC_FUNCTION_TYPE=LAMBDA` |
| No AWS account | `LOGIC_FUNCTION_TYPE=LOCAL` (current setting) |

`CODE_INTERPRETER_TYPE=DISABLED` in both cases. We use no AI features, and the alternatives are `LOCAL` (unsandboxed) or `E_2_B` (a third-party execution service, which `CLAUDE.md` rules out).

In production the default is `DISABLED`. With that default no logic function runs, so the `kuec-bd-ops` sweeps, escalations and routes never execute. The value has to be set.

## What LOCAL does

Twenty writes the function bundle to a temp directory and runs it in a Node child process inside the `server` or `worker` container. That process gets only the variables Twenty passes it, but it has:

- the container's OS user and filesystem, including the built server code;
- the container's network: Postgres, Redis and the object store on the compose network, and anything the host can reach. `OUTBOUND_HTTP_ALLOWED_INTERNAL_HOSTS` does not apply to it, because that guard covers Twenty's own HTTP, webhook, SSO and IMAP/SMTP calls, not raw sockets opened by function code;
- no CPU, memory or syscall isolation apart from Twenty's timeout.

Any code that runs as a logic function can therefore read the database credentials from the container and reach every service on the network.

## Why LOCAL is acceptable here, and only while these hold

1. **The only logic-function code is our own app**, `kuec-bd-ops`, built from this repo, reviewed and versioned. No marketplace or third-party app is installed (Settings > Apps shows `kuec-bd-ops` only).
2. **No BD user can create code.** No role other than the ED's Admin role has the Workflows permission flag or the Applications flag. Workflow-builder Code actions are not used (`CLAUDE.md` section 6). The Automation role and API key have no settings permissions at all.
3. **The ED's Admin account is the only one that could change either.** It signs in through Microsoft 365 with KUEC's MFA policy.
4. `CODE_INTERPRETER_TYPE=DISABLED`.

If any of these stops being true (a new app, a role that gains Workflows or Applications, a BD user made admin), switch to `LAMBDA` or set `LOGIC_FUNCTION_TYPE=DISABLED` before the change goes live.

## Residual risk (accepted by the ED)

- A bug or a compromised dependency in our app runs with database-level access. Mitigation: app dependencies are pinned and reviewed in PRs; `plan` before every deploy.
- An attacker who takes over the ED's account could add a workflow Code step that runs on the host. Mitigation: M365 MFA and Conditional Access on the ED; quarterly role review against this file.
- A runaway function can starve the server or worker. Mitigation: Twenty's function timeout; `LOGIC_FUNCTION_EXEC_THROTTLE_LIMIT` stays at its default.

Accepted by: ____________ (ED)  Date: ____________

## Switching to LAMBDA later

Set in `.env` and restart: `LOGIC_FUNCTION_TYPE=LAMBDA`, `LOGIC_FUNCTION_LAMBDA_REGION`, `LOGIC_FUNCTION_LAMBDA_ROLE` (an IAM role Lambda assumes for execution), `LOGIC_FUNCTION_LAMBDA_ACCESS_KEY_ID` and `LOGIC_FUNCTION_LAMBDA_SECRET_ACCESS_KEY` (an IAM user that can create, update and invoke Lambda functions and layers and pass that role). Then redeploy the app so functions are built for Lambda, and run the logic-function check in `01-deploy.md` section 7. The host then needs outbound HTTPS to `lambda.<region>.amazonaws.com`, `iam.amazonaws.com` and `sts.<region>.amazonaws.com`.
