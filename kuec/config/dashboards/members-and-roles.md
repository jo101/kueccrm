# Members, the ED as admin, and role assignment

- **Why not the manifest:** the app defines the roles (`kuec/app/src/roles/`), but assigning a role to a person or inviting a person is workspace data, not metadata.
- **Written against:** Twenty 2.48.0.
- **Prerequisites:** the workspace exists and the ED signed up first, so the ED holds the built-in **Admin** role and the server Admin Panel. `kuec-bd-ops` is installed, so the roles ED, BD staff, Engineer, Ops coordinator and Automation exist.

## Steps

1. Settings > Members > **Invite**. Enter the KUEC addresses of the BD staff, engineers and ops coordinator. Each invitee signs up with **Continue with Microsoft** using the invited address.
2. Settings > Members > **Roles** tab > open each role > **Assignment** > add members:
   - **Admin** (built-in): the ED only.
   - **BD staff**: the 4 BD staff.
   - **Engineer**: the engineers.
   - **Ops coordinator**: the ops coordinator.
   - The `bd-ops` service member (see `connect-bd-ops-mailbox.md`): **BD staff**. It needs no settings access.
3. Settings > Members > Roles > **Admin** > confirm the ED is its only member.

## Expected result

Each member has exactly one role. No role except Admin shows the Workflows, Applications, Data model, Roles, or MCP & APIs permissions.

## Verify

Sign in as a BD user: Settings shows no Workflows, Apps, Data model, Admin Panel, or MCP & APIs entries. Repeat this check each quarter, together with `logic-function-type.md`.

## Undo

Roles tab > role > Assignment > remove the member, then assign the intended role. Settings > Members > member > remove from workspace revokes access.
