# Members, role assignment, the break-glass Admin and the default role

- **Why not the manifest:** the app defines the roles (`kuec/app/src/roles/`, listed in `config/roles/role-definitions.md`), but inviting a person, assigning a role and the workspace default role are workspace data, not metadata.
- **Written against:** Twenty 2.48.0, `kuec-bd-ops` 0.6.0.
- **Prerequisites:** the ED signed up first, so the ED holds the built-in **Admin** role and the server Admin Panel. `kuec-bd-ops` is installed, so the roles in `runbooks/13-roles.md` section 1 exist. IT has created the break-glass account (`crm-breakglass@kuec.example`), assigned it to the Twenty enterprise application, and put its credentials in the secrets manager at `twenty/prod/BREAKGLASS`.
- **Role needed:** Admin for the first run (steps 1 to 6). Afterwards the ED role (Members and Roles permissions) for invitations and assignments, and the break-glass account for anything that changes the ED's own role.

## Steps

### First run

1. Settings > Members > **Invite**. Enter `crm-breakglass@kuec.example`, choose **Admin** in the role list, **Invite**.
2. In a private window, accept the invitation as the break-glass account (**Continue with Microsoft**).
3. Still as the break-glass account: Settings > Members > **Roles** tab > **ED** > **Assignment** > add the ED. Confirm.
4. Settings > Members > **Roles** tab, section **Default Role**: choose **Leadership viewer**. Anyone who joins without a role chosen lands on the narrowest role.
5. Sign out of the break-glass account. Its credentials stay sealed in the secrets manager.
6. As the ED (now on the ED role): Settings > Members > Roles > **Admin** > **Assignment** lists only the break-glass account.

### Each new member

7. Settings > Members > **Invite**. Enter the work address and choose the member's role in the role list next to it (`runbooks/13-roles.md` section 1). One role per person:
   - **ED**: the ED (already done in step 3).
   - **Ops coordinator**: the ops coordinator.
   - **BD officer**: the BD staff.
   - **Engineer**: the engineers.
   - **IP office**, **Leasing**, **Lab access**, **Startups and investment**: the members of that department.
   - **Leadership viewer**: nobody until the ED decides.
   - The `bd-ops` service member (`connect-bd-ops-mailbox.md`): **BD officer**. It connects its mailbox and is never used to work in the CRM.
8. The invitee signs up with **Continue with Microsoft** using the invited address. Then follow `runbooks/13-roles.md` section 7.

## Expected result

Each member has exactly one role. Admin holds only the break-glass account. Member (Twenty's starter role) holds nobody. Default Role is Leadership viewer.

## Verify

- Settings > Members > Roles: each role's **Assignment** tab matches the list in step 7.
- Sign in as a BD officer: Settings shows no Data model, Apps, MCP & APIs or Admin Panel entries; on an opportunity, **Delete** is not offered.
- Each quarter, the whole of `runbooks/13-roles.md` section 6.

## Undo

- A wrong role: Settings > Members > Roles > the right role > **Assignment** > add the member; it replaces the old role. Nobody can change their own role: the ED's role is changed by the break-glass account.
- Default Role: choose another role in the same section.
- Removing a member: `runbooks/13-roles.md` section 8 first (removal unassigns them from all their records), then Settings > Members > the member > **Remove member**.
