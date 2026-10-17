# Sidebar: remove Twenty's standard entries, add the BD Team link

- **Why not the manifest:** Twenty seeds its own sidebar entries (Companies, People, Opportunities, Tasks, Notes, Dashboards, Workflows) as workspace rows owned by the standard app; an app cannot remove them. The BD Team entry opens one tab of the BD page, and a tab link carries the page's and the tab's workspace ids, which differ per install, so it cannot be written in the manifest.
- **Written against:** Twenty 2.48.0, `kuec-bd-ops` 0.5.0.
- **Prerequisites:** the ED's or an engineer's account (the **Layouts** permission, `runbooks/13-roles.md`; Edit navigation is desktop only). `kuec-bd-ops` 0.5.0 or later installed, so the app's entries exist at positions below 0 (`kuec/app/src/constants/sidebar-positions.ts`).

## Steps

### Remove the standard entries

1. In the sidebar, hover the **Workspace** section title and click the tool icon (**Edit navigation**). The **Layout customization** bar opens at the top.
2. For each standard entry below, open its **⋯** menu (**Menu item actions**) and choose **Remove from sidebar**:

   | Entry | Why |
   | --- | --- |
   | Companies | Replaced by the app's Companies entry, which sits in the agreed order |
   | People | Same, People |
   | Opportunities | Replaced by Pipeline |
   | Notes | Notes are read and written on the record they belong to |
   | Dashboards | The BD dashboards are the app's BD page; the Dashboard object is not used |
   | Workflows (folder) | No UI workflows (`kuec/CLAUDE.md` section 6) |

   Keep **Tasks**: every notification is a Task, and the Tasks list is where a person sees all of theirs.

### Add BD Team

3. Still in customization mode, open a second browser tab, click **BD Executive** in the sidebar, then the **Team** tab on that page. Copy the path from the address bar from `/page/` on, including the `#...` part (for example `/page/1b6f.../#9c2e...`). Do not copy the host.
4. Back in the first tab, open the **⋯** menu of **BD Executive** and choose **Add menu item after** > **Link**. Name `BD Team`, URL the path from step 3.
5. Click **Save** in the Layout customization bar.

The link takes a position between BD Executive and Projects. Moving an item only changes that item's position, so the app's entries keep theirs.

## Expected result

The Workspace section reads, top to bottom: Home, Exceptions, Pipeline, My work, BD Executive, BD Team, Projects, Companies, People, Engagements, Contracts, Milestones, Tasks. Each person's own Favorites section stays above it.

## Verify

1. Sign in as a BD officer: the same list, no second Companies or People entry, and the first page after sign-in is Home.
2. Click **BD Team**: the BD page opens on the Team tab.
3. After the next `app:install`, check the order again. The app re-applies its own positions and leaves the BD Team link alone.

## Undo

- A removed standard entry: **Edit navigation** > **Add** (plus icon) > **Object** > pick it, then move it with **Move up** / **Move down**. Removing an entry never deletes or deactivates the object, and its records stay reachable by search and by URL.
- BD Team: its **⋯** menu > **Remove from sidebar**.
- If the BD page is ever reinstalled (a new page id), the link breaks: repeat steps 3 to 5 and remove the old link.
