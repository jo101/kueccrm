# Connect the bd-ops mailbox as the automation sender

- **Why not the manifest:** a connected account is an OAuth grant by a mailbox owner. It cannot be declared.
- **Written against:** Twenty 2.48.0.
- **Prerequisites:** IT has completed it-request item 2 (bd-ops can sign in and is licensed, admin consent granted). Microsoft login is configured (`admin-panel-config-variables.md`). The bd-ops credentials are in the secrets manager.

## Steps

1. The ED invites `bd-ops@kuec.example` (Settings > Members > Invite) and assigns it **BD staff** (`members-and-roles.md`).
2. In a private window, accept the invitation and sign in with **Continue with Microsoft** as bd-ops.
3. As bd-ops: Settings > **Accounts** > **Emails** > **Connect with Microsoft**. Admin consent is already granted, so no consent prompt should appear.
4. Emails > the bd-ops account: under **Visibility**, choose the most restrictive option (participants and metadata only) unless the ED decides otherwise. Turn **Contact auto-creation** off, so mail from unknown senders does not create people.
5. Calendars > the same account: sync on.
6. Record the workspace-member name of bd-ops in the app's config record as the automation sender. The app reads it from configuration, never from a hardcoded id.

## Expected result

Settings > Accounts lists bd-ops with Emails and Calendars both "Synced" within about 10 minutes (list fetch every 5 minutes, import every minute).

## Verify

`scripts/verify-crons.sh .env` reports OK for the messaging and calendar jobs. A test email sent to bd-ops from a KUEC address appears in Twenty within 10 minutes.

## Undo

As bd-ops: Settings > Accounts > the account > **Remove**. This stops sync and deletes imported messages that no other account shares. Revoking the grant in Entra (Enterprise applications > the app > Users) also stops it.
