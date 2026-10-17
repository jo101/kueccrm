# kuec-bd-ops: application variables and reference data

- **Why not the manifest:** the manifest declares the variables (`kuec/app/src/application.config.ts`) but secret values are entered per instance, never committed. Role assignments and holidays are workspace data, not metadata.
- **Written against:** Twenty 2.48.0, `kuec-bd-ops` 0.1.0; the lead and forms variables since 0.9.0; the uVENTURE and pack variables since 0.11.0.
- **Prerequisites:** the ED's or an engineer's account (the **Apps** permission, `runbooks/13-roles.md`). `kuec-bd-ops` installed. From the secrets manager: the Teams incoming webhook URL (`twenty/<env>/TEAMS_WEBHOOK_URL`) and the bd-ops mailbox SMTP credentials (`twenty/<env>/BD_OPS_SMTP_*`). IT has enabled authenticated SMTP for the bd-ops mailbox (Exchange Online: SMTP AUTH on for that mailbox only).

## Steps: variables

1. Settings > **Apps** > **KUEC BD Ops** > **Variables** tab.
2. Fill in:

   | Variable | Value | Secret |
   | --- | --- | --- |
   | CRM base URL | `https://crm.uventure.kuec.example` (staging: `https://crm.uventure-staging.kuec.example`), no trailing path | no |
   | Teams incoming webhook URL | from the secrets manager | yes |
   | SMTP host | `smtp.office365.com` | no |
   | SMTP port | `587` | no |
   | SMTP username | `bd-ops@kuec.example` | yes |
   | SMTP password | from the secrets manager | yes |
   | Sender address | `bd-ops@kuec.example` | no |
| Lead value that notifies the ED (0.9.0) | The amount in AED above which a qualified lead notifies the ED, as the ED decides it, digits only, e.g. `500000`. Leave empty until the ED has decided: then only Intellectual property licence interest notifies (`runbooks/19-leads.md` section 3) | no |
| Forms signing secret (0.9.0) | from the secrets manager (`twenty/<env>/FORMS_SIGNING_SECRET`), set when the first form is connected (`runbooks/19-leads.md` section 6.2). While it is empty the intake route answers 503 | yes |
| Forms signing secret (previous) (0.9.0) | empty, except for the week after a rotation: the secret it replaced | yes |
| uVENTURE signing secret (0.11.0) | from the secrets manager (`twenty/<env>/UVENTURE_SIGNING_SECRET`), the same value the uVENTURE sender holds. While it is empty the uVENTURE routes answer 503 and the snapshot watchdog stays quiet (`runbooks/21-uventure-readiness.md` section 4) | yes |
| uVENTURE signing secret (previous) (0.11.0) | empty, except for the week after a rotation | yes |
| uVENTURE webhook URL (0.11.0) | the endpoint the uVENTURE team gives, e.g. `https://uventure.kuec.example/integrations/crm/events` (staging: the staging uVENTURE host). Empty: nothing is sent to uVENTURE | no |
| uVENTURE outbound signing secret (0.11.0) | from the secrets manager (`twenty/<env>/UVENTURE_OUTBOUND_SIGNING_SECRET`), shared with the uVENTURE team; a different value from the inbound secret | yes |
| CRM pack on, PM pack on, GTM pack on (0.11.0) | on, unless the ED switches a pack off (`runbooks/21-uventure-readiness.md` section 5) | no |

3. **Save**. Secret values are stored encrypted and are not shown again.

## Steps: reference data

These are records, kept by the ops coordinator with the ED.

1. **Playbook role assignments** (open it from the command menu, Ctrl+K, "Playbook role assignments"): one record per person per playbook role, Active on. Exactly one active **Executive director** and one active **Operations coordinator** (the playbook role options, called ED and Ops coordinator until 0.10.0). Add every BD officer, developer, data analyst, and the legal and finance contacts. The Researcher role is external and needs no record. When a role has several people, new work goes to whoever has the fewest open work packages.
2. **UAE public holidays**: one record per holiday date for the coming year, entered when the dates are announced. Moon-sighting changes: edit the date.

## Expected result

The app's settings page shows no missing-configuration banner. Role assignments list one ED and one ops coordinator.

## Verify

1. Set an opportunity's Type to Technical service (research as a service) (labelled RFQ / technical service before 0.8.0) on a test opportunity owned by you. Within a minute: seven work packages, the first Offered to the right person, a Teams post in the BD channel, and an email from bd-ops to the step 1 owner.
2. `yarn twenty dev:function:logs -n w01-instantiate-opportunity-playbook` (see `runbooks/04-automation.md` section 4) shows no `skipped` line for email or Teams.
3. Delete the test opportunity (its work packages go with it).

## Undo

Clear a variable to stop that channel: the functions log `email skipped` or `teams post skipped` and carry on with tasks. Deactivate a role assignment (Active off) rather than deleting it, so history stays readable. Rotate the SMTP password, the webhook, the forms signing secret and both uVENTURE secrets with the quarterly key rotation. Clearing the forms secret stops the intake route (503, the forms retry for 24 hours); clearing the lead value threshold leaves only Intellectual property licence interest notifying the ED.
