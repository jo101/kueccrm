# IT request: KUEC BD Ops CRM (self-hosted Twenty 2.48.0)

**From:** BD Ops engineering  **For approval by:** KUEC IT  **Sponsor:** Executive Director
**Hosts:** prod `crm.uventure.kuec.example`, staging `crm.uventure-staging.kuec.example` (replace with the real names), both on our container host `<host>` (public IP `<ip>`). Each is a subdomain of the uVENTURE host it works with (`uventure.kuec.example`, `uventure-staging.kuec.example`): the two systems embed each other and must be one site to the browser (`runbooks/21-uventure-readiness.md` section 1).

## 1. Azure app registration and admin consent

- [ ] Register one app, **"KUEC BD Ops CRM"**. Supported account types: **Accounts in any organizational directory (multitenant)**. Twenty 2.48 signs in through the `/common` endpoint, which a single-tenant registration rejects. To keep it KUEC-only: in Enterprise applications, set **Assignment required = Yes** and assign only the group `CRM-Users`.
- [ ] Redirect URIs (Web):
  `https://crm.uventure.kuec.example/auth/microsoft/redirect`
  `https://crm.uventure.kuec.example/auth/microsoft-apis/get-access-token`
  `https://crm.uventure-staging.kuec.example/auth/microsoft/redirect`
  `https://crm.uventure-staging.kuec.example/auth/microsoft-apis/get-access-token`
- [ ] Microsoft Graph **delegated** permissions: `Mail.ReadWrite`, `Mail.Send`, `Calendars.ReadWrite`, `User.Read`, `openid`, `email`, `profile`, `offline_access`. Twenty always asks for all of them, so read-only scopes are not enough.
- [ ] **Grant admin consent for KUEC.** Without it users get AADSTS90094 when they connect their mailbox.
- [ ] One client secret (24 months maximum). Put it straight into the secrets manager as `twenty/prod/AUTH_MICROSOFT_CLIENT_SECRET`, and add a renewal reminder 30 days before it expires. Send us the client ID.

## 2. Licences and the bd-ops mailbox

- [ ] An M365 licence with Exchange Online for every CRM member (ED, 4 BD, 2 to 4 engineers, ops coordinator) and for the `bd-ops` mailbox. That is 8 to 10 licences, plus group `CRM-Users`.
- [ ] `bd-ops@kuec.example` must be able to sign in. Twenty connects a mailbox by signing in as it, and a standard shared mailbox has sign-in blocked. Either convert it to a licensed user mailbox, or enable sign-in and assign a licence.
- [ ] SMTP for system email (invitations, password resets): enable SMTP AUTH on that mailbox only (`Set-CASMailbox bd-ops@kuec.example -SmtpClientAuthenticationDisabled $false`) and issue an **app password**. App passwords need per-user MFA; if KUEC uses Conditional Access only, tell us which alternative applies. Twenty's SMTP sender supports username and password only, not OAuth.
- [ ] **Deadline:** Microsoft disables basic SMTP AUTH by default for existing tenants at the end of December 2026 (MC786329, updated January 2026). Please confirm that the tenant will keep it enabled for this mailbox, or provide an Exchange Online SMTP relay connector bound to `<ip>` as the replacement.

## 3. DNS and TLS

- [ ] `A crm.uventure.kuec.example -> <ip>` and `A crm.uventure-staging.kuec.example -> <ip>`.
- [ ] TLS certificates for both names, through ACME on the host (needs inbound 80) or from the KUEC CA.
- [ ] Inbound 443 (and 80 if ACME) to `<ip>`, from the KUEC network/VPN at minimum. Microsoft does not need to reach us: webhook push sync stays off.
- [ ] Inbound 443 to `<ip>` from the uVENTURE servers (prod and staging), which post signed events to `/s/integrations/uventure/*` and read the API nightly. Tell us their source addresses.
- [ ] The uVENTURE team: their pages answer with `Content-Security-Policy: frame-ancestors 'self' https://crm.uventure.kuec.example` (staging: the staging CRM host) for the pages the CRM embeds, and their session cookie is not `SameSite=Strict`.

## 4. AWS account (only if we use LAMBDA for logic functions)

- [ ] An AWS account or sub-account, region `me-central-1`, with one IAM role for Lambda execution and one IAM user that may manage and invoke Lambda functions and layers and pass that role. **If no account is available we run LOCAL** and the ED signs the risk acceptance in `logic-function-type.md`. Tell us which.

## 5. Outbound connections from `<host>`

Only these. Everything else, including any private/internal address, stays blocked. Twenty's own internal-host allowlist (`OUTBOUND_HTTP_ALLOWED_INTERNAL_HOSTS`) is empty.

| Destination | Port | Why |
| --- | --- | --- |
| `login.microsoftonline.com`, `graph.microsoft.com` | 443 | Microsoft sign-in, mail and calendar sync |
| `smtp.office365.com` | 587 | System email via bd-ops |
| Object store endpoint `<objects host>` | 443 | File storage (S3-compatible) |
| Backup store endpoint `<backup host>` | 443 | Nightly off-host backup |
| `registry-1.docker.io`, `auth.docker.io`, `production.cloudflare.docker.com` | 443 | Image pulls at install and upgrade only (or point us to an internal registry mirror) |
| `lambda.me-central-1.amazonaws.com`, `sts.me-central-1.amazonaws.com`, `iam.amazonaws.com` | 443 | Only if item 4 is LAMBDA |
| The uVENTURE webhook host, `uventure.kuec.example` (staging `uventure-staging.kuec.example`) | 443 | Signed events from the CRM to uVENTURE (`runbooks/21-uventure-readiness.md` section 4.3). The app sends these itself, so only this firewall rule applies; `OUTBOUND_HTTP_ALLOWED_INTERNAL_HOSTS` covers Twenty's own webhooks, which we do not use |

Telemetry is off. The npm marketplace sync is off. No AI providers are used.

## 6. Storage and backup

- [ ] Two buckets on the host's S3-compatible object store: `kuec-twenty-prod` and `kuec-twenty-staging`, each with its own access key restricted to that bucket (List, Get, Put, Delete, AbortMultipartUpload).
- [ ] One off-host backup bucket `kuec-twenty-backups`, ideally with versioning and object lock, plus a write key. We keep 35 days.
- [ ] A secrets-manager path `twenty/prod/*` and `twenty/staging/*` that the deploy engineer can read. It holds ENCRYPTION_KEY, the DB password, storage and backup keys, the Azure secret and the SMTP app password.

We do not ask for SSO (SAML/OIDC), custom domains, audit logs, row-level permissions or per-key rate limits. Those need Twenty's paid Organization plan and are out of scope. Sign-in is Microsoft (item 1) on both the CRM and uVENTURE, with the same KUEC email; SSO is deferred to the paid plan (`runbooks/21-uventure-readiness.md` section 2).

Approved by (KUEC IT): ____________  Date: ____________
