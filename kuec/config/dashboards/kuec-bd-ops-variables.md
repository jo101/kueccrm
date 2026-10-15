# kuec-bd-ops: application variables and reference data

- **Why not the manifest:** the manifest declares the variables (`kuec/app/src/application.config.ts`) but secret values are entered per instance, never committed. Role assignments and holidays are workspace data, not metadata.
- **Written against:** Twenty 2.48.0, `kuec-bd-ops` 0.1.0.
- **Prerequisites:** the ED's Admin account (Applications permission). `kuec-bd-ops` installed. From the secrets manager: the Teams incoming webhook URL (`twenty/<env>/TEAMS_WEBHOOK_URL`) and the bd-ops mailbox SMTP credentials (`twenty/<env>/BD_OPS_SMTP_*`). IT has enabled authenticated SMTP for the bd-ops mailbox (Exchange Online: SMTP AUTH on for that mailbox only).

## Steps: variables

1. Settings > **Apps** > **KUEC BD Ops** > **Variables** tab.
2. Fill in:

   | Variable | Value | Secret |
   | --- | --- | --- |
   | CRM base URL | `https://crm.kuec.example` (staging: `https://crm-staging.kuec.example`), no trailing path | no |
   | Teams incoming webhook URL | from the secrets manager | yes |
   | SMTP host | `smtp.office365.com` | no |
   | SMTP port | `587` | no |
   | SMTP username | `bd-ops@kuec.example` | yes |
   | SMTP password | from the secrets manager | yes |
   | Sender address | `bd-ops@kuec.example` | no |

3. **Save**. Secret values are stored encrypted and are not shown again.

## Steps: reference data

These are records, kept by the ops coordinator with the ED.

1. **Playbook role assignments** (open it from the command menu, Ctrl+K, "Playbook role assignments"): one record per person per playbook role, Active on. Exactly one active **ED** and one active **Ops coordinator**. Add every BD officer, developer, data analyst, and the legal and finance contacts. The Researcher role is external and needs no record. When a role has several people, new work goes to whoever has the fewest open work packages.
2. **UAE public holidays**: one record per holiday date for the coming year, entered when the dates are announced. Moon-sighting changes: edit the date.

## Expected result

The app's settings page shows no missing-configuration banner. Role assignments list one ED and one ops coordinator.

## Verify

1. Set an opportunity's Type to RFQ / technical service on a test opportunity owned by you. Within a minute: seven work packages, the first Offered to the right person, a Teams post in the BD channel, and an email from bd-ops to the step 1 owner.
2. `yarn twenty dev:function:logs -n w01-instantiate-opportunity-playbook` (see `runbooks/04-automation.md` section 4) shows no `skipped` line for email or Teams.
3. Delete the test opportunity (its work packages go with it).

## Undo

Clear a variable to stop that channel: the functions log `email skipped` or `teams post skipped` and carry on with tasks. Deactivate a role assignment (Active off) rather than deleting it, so history stays readable. Rotate the SMTP password and the webhook with the quarterly key rotation.
