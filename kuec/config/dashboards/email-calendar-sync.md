# Email and calendar sync: every member's Microsoft account

- **Why not the manifest:** a connected account is an OAuth grant by its owner, and its visibility and contact-creation settings belong to that account. Twenty 2.48 has no workspace-wide visibility setting and does not let an admin change another member's account settings, so each member sets their own. The internal-email switch is a workspace setting, not metadata.
- **Written against:** Twenty 2.48.0.
- **Prerequisites:** Microsoft login and the Microsoft mail and calendar providers are on (`admin-panel-config-variables.md`), IT has granted admin consent (it-request item 1), and the member's role includes the **Sync Account** permission (every role except Automation; `members-and-roles.md`). The bd-ops mailbox has its own runbook (`connect-bd-ops-mailbox.md`).

## What the team agreed

| Setting | Value | Where | Who |
| --- | --- | --- | --- |
| Email visibility | **Subject and metadata** | each account | each member |
| Contact auto-creation (email) | **None** | each account | each member |
| Exclude non-professional emails, Exclude group emails | on (default) | each account | each member |
| Calendar event visibility | **Everything** | each account | each member |
| Calendar auto-creation | off | each account | each member |
| Sync Internal Emails | off (default) | workspace | ED |

What the team sees of a colleague's synced mail at **Subject and metadata**: on the Emails tab, a row per thread with the sender, the subject and the date, locked as "Not shared"; the body is never shown. The other recipients are stored but only appear in the open thread, which needs **Everything**, so in the UI they are not visible. That is the closest 2.48 level to "sender, recipients, subject and date"; there is no level that shows recipients without the body.

People are not created from mail or meetings. Anyone new is added by hand as a Person after checking for an existing record (search by email first), which is the manual approval step: 2.48 has no review queue for suggested contacts.

## Steps: workspace, once (the ED)

1. Turn on **Advanced mode** (toggle at the bottom of Settings).
2. Settings > **Communication** > section **Sync**: **Sync Internal Emails** is off ("Include emails where all participants share the same domain"). Leave it off.
3. Do not add `@kuec.example` to the workspace blocklist to achieve the same: a blocklisted participant drops the whole thread, so client threads that copy a colleague would disappear too.

## Steps: each member, on their first day

1. Settings > **Accounts** > **Emails** > **Connect with Microsoft**. Sign in with the KUEC account.
2. **1. Email**: Visibility **Subject and metadata**. Contact auto-creation **None**. Leave **Exclude non-professional emails** and **Exclude group emails** on. Next.
3. **2. Calendar**: Event visibility **Everything**. **Auto-creation** off. **Finish Setup**.

Changing a setting later: Settings > Accounts > Emails (or Calendars) > the account.

## Expected result

Settings > Accounts lists the account with Emails and Calendars both syncing within about 10 minutes. A client email to the member shows on that client's Person and Company records within about 10 minutes. A meeting with a client shows on the Calendar tab of the Person and Company, with its title.

## Verify (ops coordinator, monthly and after each new joiner)

Read-only, on the host:

```sql
SELECT 'email' AS channel, m.handle, m.visibility::text, m."contactAutoCreationPolicy"::text AS auto_creation
FROM core."messageChannel" m
WHERE m."workspaceId" = (SELECT id FROM core.workspace WHERE "displayName" = '<workspace name>')
UNION ALL
SELECT 'calendar', c.handle, c.visibility::text, CASE WHEN c."isContactAutoCreationEnabled" THEN 'ON' ELSE 'OFF' END
FROM core."calendarChannel" c
WHERE c."workspaceId" = (SELECT id FROM core.workspace WHERE "displayName" = '<workspace name>')
ORDER BY 2, 1;

SELECT "isInternalMessagesImportEnabled" FROM core.workspace WHERE "displayName" = '<workspace name>';
```

Expected: one email and one calendar row per member; email `SUBJECT` / `NONE`; calendar `SHARE_EVERYTHING` / `OFF`; the internal flag `f`. The bd-ops rows follow `connect-bd-ops-mailbox.md` instead. A member who is missing or differs is asked to fix their own settings: nobody else can.

## Where synced mail shows, and what it means for linking

| Record | Emails and Calendar tabs | Linked by |
| --- | --- | --- |
| Person | yes | the person's emails match a participant |
| Company | yes | a matched person belongs to the company |
| Opportunity | yes | only threads with the opportunity's **Point of Contact**; the company's other people do not count |
| Engagement, Project, Contract, Work package, Milestone | no tab | not linked to mail |

So: every Engagement and Project links to its Company (Engagement > Company, Project > Company), and the company's Emails tab is where its mail is read. Every open Opportunity has a Point of Contact. Setting or changing the Point of Contact later does not pull in threads already synced; only new mail links.

## Undo

- Visibility, auto-creation: the member changes them in Settings > Accounts at any time; visibility applies to already-synced mail at once.
- Stop sync for one member: Settings > Accounts > the account > **Remove**. Imported messages that no other account shares are deleted.
- Revoke for everyone: IT removes the users from the Entra app (Enterprise applications > the app > Users).
