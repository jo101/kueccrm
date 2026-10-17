# Record pages: hide the Files tab on Opportunity and Contract

- **Why not the manifest:** the Files tab belongs to the record page Twenty generates (Opportunity) or generates for the app's object (Contract). A tab in the app manifest has no "inactive" setting, so an app cannot switch off a tab it did not create. Replacing the whole record page from the app would also replace Twenty's Home, Emails and Calendar tabs, which the app would then have to rebuild and keep in step with each upgrade. Hiding one tab in the UI is stored as an override that "Reset to default" undoes.
- **Written against:** Twenty 2.48.0, `kuec-bd-ops` 0.5.0.
- **Prerequisites:** the ED's or an engineer's account (the **Layouts** permission, `runbooks/13-roles.md`). At least one Opportunity and one Contract exist (the editor opens on a record). `kuec-bd-ops` 0.5.0 installed, so both pages already carry the **SharePoint folder** card on their Home tab.

Documents never go into Twenty (`kuec/CLAUDE.md` section 4); the record carries its SharePoint folder link instead. Hiding Files removes the upload target from these two pages. It does not stop an attachment through the API, and the Files tab stays on Company, Person, Project and the other objects.

## Steps

Do this twice: once for **Opportunities**, once for **Contracts**.

1. Settings > **Data model** > the object > **Layout** tab.
2. Under **Record page**, **Customize record page** > **Customize**. A record of that object opens in edit mode with the **Layout customization** bar at the top.
3. Click the **Files** tab. Its settings open in the side panel.
4. Choose **Delete**.
5. Click **Save** in the Layout customization bar.

## Expected result

Opening any opportunity or contract shows Home, Timeline, Tasks and Notes (plus Emails and Calendar on opportunities), and no Files tab. The Home tab shows a **SharePoint folder** card under the field list.

## Verify

1. As a BD officer, open an opportunity and a contract: no Files tab.
2. Settings > Data model > Opportunities > Layout: **Reset to default** is enabled, which shows the override is stored.
3. After the next `app:install`, open a contract again: still no Files tab. The override is kept through app syncs (checked on 2.48.0 with `kuec-bd-ops` 0.5.0).
4. Read-only check that nothing was uploaded before the change (run on the host, replace the schema):

   ```sql
   SELECT count(*) FROM "<databaseSchema>".attachment
   WHERE "deletedAt" IS NULL AND ("targetOpportunityId" IS NOT NULL OR "targetContractId" IS NOT NULL);
   ```

   Expected 0. Anything else is a confidential-document finding for the ED: move the file to SharePoint, put the link on the record, and delete the attachment.

## Undo

Settings > Data model > the object > Layout > **Reset to default**. This removes every override on that record page, so redo any other UI change to it afterwards.
