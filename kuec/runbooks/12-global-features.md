# 12: Global features (search, command menu, duplicates, import and export, sidebar, mail sync, notifications, bulk actions, shortcuts, record pages)

Written against Twenty 2.48.0 and `kuec-bd-ops` 0.5.0. Owner: engineering lead. Readers: engineers, the ops coordinator and the ED; section 12, "How to find anything", is for the whole team.

Everything the manifest can express is in `kuec/app` (0.5.0). Everything else is a click-runbook in `config/dashboards/`. Facts below were read from the 2.48.0 source in this repository; the ones marked **tested** were also run on a disposable 2.48.0 instance built from this checkout with 0.5.0 synced (2026-10-17).

## 0. Native in 2.48 or not

**Native**: 2.48 does it as asked, at most with a setting. **Partly**: 2.48 covers part of it and the gap is stated. **No**: 2.48 cannot do it; the column says what replaces it. **n/a**: not built, by decision.

| # | Requirement | Native in 2.48 | How it is met | Where |
| --- | --- | --- | --- | --- |
| 1 | Choose the searchable fields per object | Native | Field `isSearchable` in the app manifest. Settings can show the list, but editing it there is behind a feature flag, and the next app sync resets it anyway | manifest |
| 1 | Company: name, domain | Native | Twenty indexes them by default | |
| 1 | Company: Name (Arabic), Search keywords | Native, once the fields exist | New fields `nameArabic` and `keywords` in 0.5.0, searchable (**tested**) | manifest |
| 1 | Person: name, email, phone | Native | Indexed by default, with job title. Phone matches with or without +971 or the leading 0 (**tested**) | |
| 1 | Person: Name (Arabic) | Native, once the field exists | New field `nameArabic`, searchable | manifest |
| 1 | Opportunity: name, next action | Native | Name by default; `nextAction` made searchable in 0.5.0 | manifest |
| 1 | Project name; Work package title and objective | Native | The title is indexed by default on app objects; `objective` made searchable in 0.5.0 | manifest |
| 1 | Capability name | n/a | There is no Capability object: capabilities live in uVENTURE (`kuec/CLAUDE.md` section 5, decision of 2026-10-15 in `05-views.md`) | |
| 1 | Arabic tokenisation | Native | Arabic words are split and indexed correctly (**tested**) | |
| 1 | Arabic matching of the forms people type | No | No Arabic normalisation: a word without its article, without the hamza or without diacritics is not found. Search keywords field and the team rule (section 1.3) | manifest, team rule |
| 2 | Ctrl/Cmd+K searches every object and offers record actions | Native | | |
| 2 | Command items "New request" (Intake) and "My work" | Partly | An app command item must open a front component, so both wait for Phase B. Ids and labels reserved (section 2.2) | Phase B |
| 3 | Company duplicates by domain | Native | Domain is unique: a second company with the same domain is refused (**tested**) | |
| 3 | Company duplicates by name | Partly | Exact same name only, found by the duplicates API and the Merge command; "Gulf Drilling" and "Gulf Drilling LLC" are not matched (**tested**). Monthly check (section 3.2) | SQL check |
| 3 | Person duplicates by email | Native | Email is unique: a second person with the same email is refused | |
| 3 | Person duplicates by name + company | No | 2.48 matches first name + last name alone (or LinkedIn, or email), not name + company, and the rule cannot be changed. Monthly check by name + company (section 3.2) | SQL check |
| 3 | Duplicates shown on the record page | No | 2.48 has no Duplicates section or widget. Same monthly check | SQL check |
| 3 | Merge, and who may merge | Partly | **Merge** for Companies and People, 2 to 9 records, cannot be undone. It needs Update and Destroy on the object, so only roles holding Destroy can merge: ED and ops coordinator (section 3.4) | roles |
| 4 | CSV import per object | Native | **Import** on every object's list, app objects included | |
| 4 | CSV export per view | Native | **Export View**, or **Export** on a selection; the view's visible columns, filters and sort | |
| 4 | Export restricted by role | Native | Role permission **Export CSV**: ED, ops coordinator, BD officer and the department roles. It hides the commands; it does not limit what the role can read through the API, and it cannot be limited to the user's own views (`13-roles.md` section 10) | roles |
| 5 | Sidebar in the agreed order | Native | App sidebar entries with positions below Twenty's own (**tested**) | manifest |
| 5 | BD Executive and BD Team as separate entries | Partly | Both are tabs of one BD page. BD Executive is the app entry; BD Team is a link to the Team tab added in the UI, because a tab link carries per-install ids | `sidebar.md` |
| 5 | Hide unused standard objects, never delete one | Native | Remove their entries in Edit navigation. 2.48 cannot delete a standard object at all | `sidebar.md` |
| 5 | Capabilities entry | n/a | No Capability object (row 1) | |
| 6 | Each member connects Microsoft mail and calendar | Native | Settings > Accounts, per member | `email-calendar-sync.md` |
| 6 | Team sees sender, recipients, subject and date, not the body | Partly | Level **Subject and metadata** hides the body. In the UI a colleague's thread shows sender, subject and date; the other recipients only appear in the open thread, which this level does not allow. Each member sets it; an admin cannot enforce it, so it is checked monthly | `email-calendar-sync.md` |
| 6 | Internal email sync off | Native | Workspace setting **Sync Internal Emails**, off by default | `email-calendar-sync.md` |
| 6 | Mail on Company, Person and Opportunity only | Native (fact) | Opportunity only through its Point of Contact. Engagement and Project link to their Company (Project gets a Company field in 0.5.0) | manifest, team rule |
| 6 | Calendar events visible to the team | Native | Calendar visibility **Everything** per account | `email-calendar-sync.md` |
| 6 | No automatic contacts; manual approval | Partly | Auto-creation **None** / off is native. There is no approval queue: new people are added by hand | `email-calendar-sync.md` |
| 7 | In-app notification | No | No notification centre in 2.48. Every alert is a Task, an email from bd-ops, or a Teams post (section 7) | app logic |
| 7 | Email from the shared bd-ops mailbox, one recipient, no CC | Native in the app | The app sends one plain-text message per recipient, To only, through the bd-ops SMTP account | app logic |
| 8 | Multi-select edit, export, delete | Native | **Update** (2 or more records), **Export**, **Delete** on a selection | |
| 8 | Delete limited to ED and ops coordinator | Native | Object permission "delete records" off for every other role (`13-roles.md`) | roles |
| 9 | Keyboard shortcuts | Native | Section 9.1 | |
| 9 | Quick-create default stage Qualify | Native | Stage defaults to `NEW`. It reads "New" until the stage relabel (Phase B build list) renames it "Qualify" | |
| 9 | Quick-create default source Inbound | Native | Source default **Inbound enquiry** on the app's field, 0.5.0 (**tested**) | manifest |
| 9 | Quick-create default owner = current user | No | A relation cannot default to the current user. App function `default-opportunity-owner` sets it within seconds; the hourly sweep repairs a miss (**tested**) | app logic |
| 10 | Timeline, Notes and Tasks on every record page | Native | Default tabs on every object, standard and app | |
| 10 | Duplicates on every record page | No | Row 3 | |
| 10 | Files hidden on Opportunity and Contract | Partly | Hidden per object in the record page editor; an app cannot switch off a tab it did not create. The hidden tab stays hidden through the next app install (**tested** on Contract) | `record-page-files-tab.md` |
| 10 | Documents link shown prominently | Native | **SharePoint folder** card on the Home tab, under the field list, on Opportunity (new field) and Contract (existing field) (**tested**) | manifest |

## 1. Search

### 1.1 What is indexed

Search matches the **start of a word** in any indexed field, ignores case and Latin accents, and returns a record that matches any of the words typed (records matching all of them rank first). Up to 30 results, across every object the person can read.

| Object | Indexed fields | Set by |
| --- | --- | --- |
| Company | Name, Domain, Name (Arabic), Search keywords | Twenty; `name-arabic-on-company.field.ts`, `keywords-on-company.field.ts` |
| Person | First and last name, Emails (and the email domain), Phones, Job title, Name (Arabic) | Twenty; `name-arabic-on-person.field.ts` |
| Opportunity | Name, Next action | Twenty; `next-action-on-opportunity.field.ts` |
| Project, Contract, Milestone; Engagement | Name; Subject | the object's title field |
| Work package | Title, Objective | `work-package.object.ts` |
| Notes, Tasks | Title, body | Twenty |

A field is searchable only if the manifest says so: one made searchable in Settings reverts on the next app sync. Relations are not indexed, so a person is not found by their company's name.

### 1.2 Arabic, tested end to end

`kuec/tests/search/arabic-search.mjs` creates marked records through the API, runs each query through the same search the command menu uses, prints the matrix and destroys the records. Run it on staging after every upgrade; it fails as soon as search behaves differently from what is written here.

```bash
TWENTY_API_URL=https://crm-staging.kuec.example TWENTY_API_KEY=<staging admin key> node kuec/tests/search/arabic-search.mjs
```

Result on 2.48.0, 25 of 25 as predicted (`kuec/tests/search/evidence/2026-10-17-local-2.48.txt`). The company is شركة أبوظبي للخدمات البترولية, once with Search keywords empty and once filled per section 1.3:

| Typed | Found, keywords empty | Found, keywords filled |
| --- | --- | --- |
| شركة, شر, أبوظبي, البترولية, two words | yes | yes |
| ابوظبي (no hamza) | no | yes |
| بترولية, بترول (no article) | no | yes |
| خدمات (no لل) | no | yes |
| abudhabi | no | yes |
| شركه (ه for ة) | no | no |

People and other records, no keywords: محمد finds محمد الحمادي; الحمادي finds him, حمادي does not; أحمد does not find a name stored as أَحْمَد. A next action إرسال العرض الفني is found by إرسال and العرض, not by ارسال or عرض. Work packages are found by Arabic words in the title and objective.

**Conclusion:** tokenisation works; matching does not. Postgres's `simple` text search keeps every Arabic word exactly as written, and 2.48 adds no Arabic normalisation (no article stripping, no hamza or alef folding, no diacritic removal), so a search must start the same way as the stored word. The Search keywords field carries the other forms.

### 1.3 Search keywords: the workaround and the team rule

Who: the account owner, when creating a Tier 1 or Tier 2 company or the first time they edit one. Anyone may add to it for other companies. The ops coordinator checks monthly that no Tier 1 or Tier 2 company has it empty (SQL in section 11).

What to put in **Search keywords**, separated by spaces, no punctuation, at most about 15 words:

1. Every word of the Arabic name that carries the article or an attached preposition (ال, لل, بال, وال), again without it: البترولية → بترولية, للخدمات → خدمات.
2. Every word with أ, إ or آ, again with a plain ا: أبوظبي → ابوظبي.
3. The English short name and acronym, and the common transliterations written as one word: abudhabi, adnoc, adps.
4. Former names and the name people use for the company in conversation.

Never put descriptions, contacts, prices or anything confidential in it; it is visible to everyone and indexed.

For people, there is no keywords field. **Name (Arabic)** is written without diacritics (tashkeel) and without tatweel, so that محمد finds it. English names go in First name and Last name. Search people by English name, email or phone first.

For everyone, when searching in Arabic: type the start of the word as it is written in the name, with ال if the name has it; if nothing comes up, try without the article, then the English name.

## 2. Command menu

### 2.1 What 2.48 gives

Ctrl+K (Cmd+K on a Mac) opens the command menu anywhere. Typing searches every object the person can read (section 1). Its sections: **Selection** (actions on the selected records), **View**, **This object**, **Create record**, **Workspace**, **Go to** (Twenty's own objects, such as Companies, People, Opportunities and Tasks, and Settings; app objects get no Go to item in 2.48). On a list: **Create**, **Import**, **Export View**, **See deleted**, **Create View**. With records selected: **Delete**, **Export**, **Update** (2 or more), **Merge** (Companies and People, 2 to 9), **Add to favorites**. On a record: **Delete**, **Add to favorites**, next and previous record. Each action shows only to a role allowed to use it.

The app adds **Open work package card** when one work package is selected (`open-work-package-card.command-menu-item.ts`).

### 2.2 Reserved for Phase B

An app command item has to open a front component (2.48 rejects one without), so neither can ship in Phase A. Ids are generated and must be used as they are:

| Item | Label | Availability | Opens | Universal identifier |
| --- | --- | --- | --- | --- |
| Intake | New request | GLOBAL, pinned | Intake front component in the side panel (`design/wireframes.md` section 4) | `a0f90ab9-23cd-4ece-a854-8e346d7b32f2` |
| My work | My work | GLOBAL, pinned | Headless front component that navigates to Work packages > My work | `6071ed3b-73d8-457f-91a3-b63bc6ef2900` |

Files when built: `src/command-menu-items/new-request.command-menu-item.ts`, `src/command-menu-items/my-work.command-menu-item.ts`. Until then, "My work" is the second sidebar entry; Work packages have no Go to item or G key in 2.48.

## 3. Duplicates

### 3.1 What 2.48 detects

| Object | Refused at creation | Matched as duplicates (API and Merge only) |
| --- | --- | --- |
| Company | same domain | exactly the same name, same case, 3 characters or more |
| Person | same primary email | exactly the same first and last name (same case, each 3 characters or more), or the same LinkedIn URL, or the same email |

These rules are fixed in 2.48 (no setting, no manifest option), and no screen shows "possible duplicates". The CSV import also updates instead of duplicating when the domain, the email or the record ID matches (`09-import.md`).

### 3.2 Finding duplicates (ops coordinator, monthly and after each import refresh)

Read-only, on the host (`09-import.md` section 6 shows how to find the schema):

```sql
SET search_path TO "<databaseSchema>";

-- companies with the same name, ignoring case and spaces
SELECT lower(regexp_replace(trim(name), '\s+', ' ', 'g')) AS company_name, count(*) AS records, string_agg(id::text, ' ') AS ids
FROM company WHERE "deletedAt" IS NULL AND coalesce(trim(name), '') <> ''
GROUP BY 1 HAVING count(*) > 1 ORDER BY 2 DESC;

-- people with the same name at the same company
SELECT lower(trim("nameFirstName") || ' ' || trim("nameLastName")) AS person_name, "companyId", count(*) AS records, string_agg(id::text, ' ') AS ids
FROM person WHERE "deletedAt" IS NULL AND coalesce(trim("nameFirstName") || trim("nameLastName"), '') <> ''
GROUP BY 1, 2 HAVING count(*) > 1 ORDER BY 3 DESC;
```

Also sort Companies by name in the Everything (expert) view and look for near-identical names (legal suffixes, Arabic and English spellings).

### 3.3 Merge procedure

1. Decide which record survives: the one with the right domain or email, the most activity, the correct owner. Note the others' links if in doubt; a merge cannot be undone.
2. Companies (or People) list: select the survivor **first**, then the duplicates (2 to 9 records in all). Do not use select-all.
3. Ctrl+K > **Merge Companies** (or **Merge People**). The side panel opens on **Merge preview**.
4. **Settings** tab: **Fields conflicts** = "First record holds priority" (the survivor). Where the survivor has a value, it wins; where it is empty, the first non-empty value of the others is used. Emails, phones and links are combined, with the survivor's primary kept.
5. Check the preview, then **Merge**. Twenty opens the surviving record. Opportunities, engagements, tasks, notes and people that pointed at a duplicate now point at the survivor.
6. The duplicates are destroyed, not moved to Deleted. If the merge was wrong, recreate the record by hand from the note in step 1.

### 3.4 Who may merge

The ED and the ops coordinator. 2.48 has no merge permission of its own: Merge needs **Update** and **Destroy** records on the object, so Destroy on Companies and People is given to those two roles only (`13-roles.md`).

## 4. Import and export

| Action | Where | Permission | Checked |
| --- | --- | --- | --- |
| Import a CSV | Object list > Ctrl+K > **Import** (for example **Import Companies**); every object, app objects included | role permission **Import CSV**; the rows themselves need Update on the object | the command is hidden without Import CSV; the server does not check the flag, only the object permission |
| Export a view | Ctrl+K or the view's options > **Export View**: visible columns, filters and sort | role permission **Export CSV** | the commands are hidden without it; the data stays readable through the API for anyone with Read |
| Export a selection | select rows > **Export** | **Export CSV** | same |

Import follows `09-import.md` (automation paused, prepared files, upsert by ID). Import CSV is the ops coordinator's only; Export CSV is held by the ED, the ops coordinator, BD officers and the department roles (`13-roles.md`). The per-view export check is `05-views.md` section 5.

## 5. Sidebar

Order (`kuec/app/src/constants/sidebar-positions.ts`, test `src/navigation-menu-items/sidebar.test.ts`):

| | Entry | Opens | From |
| --- | --- | --- | --- |
| | Home | Home page | app |
| | Exceptions | Exceptions page | app |
| 1 | Pipeline | Opportunities > Pipeline | app |
| 2 | My work | Work packages > My work | app |
| 3 | BD Executive | BD page, Executive tab | app (renamed from "BD") |
| 4 | BD Team | BD page, Team tab | link added in the UI (`sidebar.md`) |
| 5 | Projects | Projects > Portfolio | app (renamed from "Portfolio") |
| 6 | Companies | Companies, last view used | app |
| 7 | People | People, last view used | app |
| 8 | Engagements | Engagements > This month | app |
| 9 | Contracts | Contracts > Expiring | app |
| 10 | Capabilities | not built: no Capability object | |
| | Milestones | Milestones > Open | app |
| | Tasks | Tasks | Twenty (kept: every alert is a Task) |

Home and Exceptions stay above the agreed list: Home is the first entry, and the first entry is everyone's landing page after sign-in. To make Pipeline the landing page instead, move HOME and EXCEPTIONS below MILESTONES in `sidebar-positions.ts` (and update the order test).

Twenty seeds its own entries at positions 0 to 6 and sorts by position only, so every app entry sits below 0. Twenty's entries for Companies, People, Opportunities, Notes, Dashboards and Workflows are removed in Edit navigation (`sidebar.md`). Removing an entry changes nothing else: the objects stay active, searchable and reachable by URL. None is deleted (2.48 cannot delete a standard object) or deactivated (Tasks and Notes are in daily use, and nothing is gained by switching the others off).

## 6. Email and calendar sync

Settings, per member and for the workspace: `config/dashboards/email-calendar-sync.md`. In short: every member connects their Microsoft account; email visibility **Subject and metadata**; contact auto-creation **None**; calendar visibility **Everything**, calendar auto-creation off; workspace **Sync Internal Emails** off. The bd-ops mailbox keeps its own settings (`connect-bd-ops-mailbox.md`).

Synced mail and meetings show only on Company, Person and Opportunity records, and on an Opportunity only those with its **Point of Contact**. Team rules that follow:

- Every Engagement has its **Company** set; every Project has its **Company** set (new field in 0.5.0; for a project with an opportunity, the opportunity's company). Mail about a project or an engagement is read on that company's Emails tab.
- Every open Opportunity has a **Point of Contact**. Changing it later does not bring in threads synced before the change.
- New people are created by hand, after searching their email (section 1). Nothing is created from mail.

## 7. Notifications

2.48 has no in-app notification centre and no generic notify action. The app's logic functions are the only senders (`04-automation.md`); there are no UI workflows. Three channels:

- **Task**: assigned to the recipient, linked to the record, due today (Asia/Dubai). Seen in Tasks and on the record.
- **Email**: from the bd-ops mailbox through its SMTP account, plain text, one message per recipient in To, never CC or BCC, under 20 words with the record link. Every Task in "Task + email" below comes with this email.
- **Teams**: one line plus the record link, posted to the BD channel's incoming webhook (W12 is this channel, not a function).

| Function | Event | Task + email to | Task only | Teams |
| --- | --- | --- | --- | --- |
| W1 instantiate opportunity playbook | type set | each owner of a work package offered | ED, "Confirm plan" (licence playbook) | yes |
| W2 work package offered | status Offered | owner | | |
| W2 acceptance timer, 2 business days | not accepted | owner, ED | | |
| W2 acceptance timer, 5 business days | not accepted; reassigned to ops coordinator | previous owner, new owner, ED | | yes |
| W3 overdue timer | due date passed; +2 business days | owner; then ED | | |
| W4 next-action guard, 08:00 | no next action or date past | owner (ED if none) | | |
| W5 work package blocked | status Blocked | ED, with the reason | | yes |
| W6 work package released | Submitted; Done | reviewer; Done offers the next work packages (W2 notifies) | | |
| W7 opportunity signed | stage Signed | ED | | yes |
| W8 stage tracking | Lost without a reason | | owner (ED if none), "Record lost reason" | |
| W9 instantiate project template | type set | each owner of a work package offered | | |
| W10 project health, 08:00 | all milestones done | owner, "Close the project" | | |
| W11, timer and dates sweeps, transition log, default owner | | no notification of their own | | |

## 8. Bulk actions

Select rows with their checkboxes (or **x** on a focused row, **Shift+x** for a range), then Ctrl+K:

| Action | Needs | Notes |
| --- | --- | --- |
| **Update** \<objects\> | 2 or more records; Update on the object | Sets one or more fields on every selected record; unique fields and one-to-many relations are not offered. Asks for confirmation; cannot be undone |
| **Export** | Export CSV | As section 4 |
| **Delete** | delete records on the object | Moves to Deleted (**See deleted** to restore); **Permanently destroy** from there needs Destroy |

Delete is for the ED and the ops coordinator only: "delete records" and "destroy records" are off on every object for every other role (`13-roles.md`). A wrong delete is restored from **See deleted** by the ops coordinator.

## 9. Shortcuts and quick create

### 9.1 The five shortcuts everyone learns

| Keys | Does |
| --- | --- |
| Ctrl+K (Cmd+K) | Command menu: search everything, run any action, go anywhere |
| / | Straight to search |
| G then C, P, O or T | Go to Companies, People, Opportunities or Tasks (G then S: Settings) |
| x, then Ctrl+K | Select the focused row (Shift+x for a range), then act on the selection |
| Ctrl+Enter (Cmd+Enter) | Open the focused row or card in the side panel; Esc closes it |

Shift+? shows Twenty's own shortcut list. Arrow keys (or j and k) move through a table, Enter edits a cell, Esc leaves it. App objects (work packages, projects, engagements, contracts, milestones) have no G key and no Go to item in 2.48; use the sidebar, or search for one of their records.

### 9.2 Quick-create defaults

Applies to **+ New** on a list, the **+** in a kanban column, and Ctrl+K > Create.

| Field | Default | How |
| --- | --- | --- |
| Owner | the person creating it | `default-opportunity-owner`: on the first edit (the name), an opportunity created in the UI without an owner gets its creator; the hourly `derived-dates-sweep` catches a miss. Only in the record's first 24 hours, and never for imported, API or app-created records. Within that day, clearing the owner gives it back to the creator: hand over by choosing the new owner instead |
| Source | Inbound enquiry | default value of the app's Source field |
| Stage | New (to be relabelled Qualify) | Twenty's default for Stage; a kanban column sets its own stage |

Filters do not prefill the owner: a view filtered "Owner is me" leaves Owner empty on a new record (2.48 prefills "me" only for a field labelled Assignee), which is why the function exists.

## 10. Record pages

| Object | Tabs | Changed in 0.5.0 |
| --- | --- | --- |
| Company, Person | Home, Timeline, Tasks, Notes, Files, Emails, Calendar | |
| Opportunity | Home, Timeline, Tasks, Notes, Emails, Calendar | Files hidden (`record-page-files-tab.md`); **SharePoint folder** card under the field list, with Point of Contact, Company and Owner |
| Contract | Home, Timeline, Tasks, Notes | Files hidden; **SharePoint folder** card under the field list |
| Work package | Home (with the work package card), Timeline, Tasks, Notes, Files | |
| Project, Engagement, Milestone | Home, Timeline, Tasks, Notes, Files | |

Timeline, Tasks and Notes are on every record page by default. There is no Duplicates section in 2.48 (section 3). The SharePoint folder cards are `src/page-layout-widgets/opportunity-sharepoint-folder.page-layout-widget.ts` and `contract-sharepoint-folder.page-layout-widget.ts`; the Opportunity field is new (`sharepoint-folder-on-opportunity.field.ts`, label by destination per `kuec/CLAUDE.md` section 4; the brief's "documentsLink"), the Contract field already existed.

## 11. Install 0.5.0 and verify

1. `npx twenty plan`. On a 0.4.0 instance it ends "38 to add, 34 to change, 0 to destroy". Added: the 6 fields (Company Name (Arabic), Search keywords and Projects; Person Name (Arabic); Opportunity SharePoint folder; Project Company, which the plan lists once with its Projects pair), 5 search entries, 18 view fields (6 expert-view columns, the rest Twenty's own field lists for the new fields), 7 widgets (the 2 SharePoint cards and Twenty's creation-form entries), the Companies and People sidebar entries, and `default-opportunity-owner`. Changed: `nextAction` and `objective` searchable, the Source default, 9 sidebar entries moved or renamed, and the code checksum of every logic function and the front component. Anything removed or recreated blocks the deploy.
2. `app:publish` and `app:install` (`05-views.md` section 5).
3. Click-runbooks, in order: `sidebar.md`, `record-page-files-tab.md`, `email-calendar-sync.md` (workspace part).
4. Verify:
   - `node kuec/tests/search/arabic-search.mjs` against staging: all cases pass.
   - Sidebar order as in section 5, signed in as a BD officer.
   - Create an opportunity from Pipeline > + New, type a name: within a minute Owner is you and Source is Inbound enquiry.
   - An opportunity and a contract show the SharePoint folder card and no Files tab.
   - The mail settings query in `email-calendar-sync.md`.
5. Monthly (ops coordinator): the duplicates queries (section 3.2), the mail settings query, and Tier 1 and Tier 2 companies without keywords:

   ```sql
   SELECT name, "accountTier" FROM "<databaseSchema>".company
   WHERE "deletedAt" IS NULL AND "accountTier" IN ('TIER_1', 'TIER_2') AND coalesce(trim(keywords), '') = '';
   ```

Open items: the Phase B command items (2.2); the stage relabel to Qualify; Person keywords, if section 1.2's people cases matter in practice.

## 12. How to find anything (for the team)

**Press Ctrl+K** (Cmd+K on a Mac) or **/**, and type the start of a name: a company, a person, an opportunity, a project, a work package. "adn" finds ADNOC. Enter opens the result. You only see what your role lets you see.

**What search reads.** Companies: English and Arabic name, website, search keywords. People: name, Arabic name, email, phone (with or without +971 or the first 0), job title. Opportunities: name and next action. Work packages: title and objective. Projects, engagements, contracts, milestones: their name. It does not look inside related records: to see everyone at a company, open the company.

**In Arabic**, type the word as it is written, with ال: "البترولية", not "بترولية". Nothing found? Try without ال, then the English name. When you add an important company, fill in its **Search keywords** so it is found either way (section 1.3).

**Your work.** **My work** is everything you own that is still open, earliest due first. **Pipeline** shows every opportunity by stage. **BD Executive** and **BD Team** are the dashboards, **Exceptions** what needs attention. Every reminder the system sends you is also a task under **Tasks**. On any list, the view name at the top switches views (Opportunities > Closing this quarter); **Filter**, **Sort** and **Save as new view** do the rest.

**Email and meetings** with a client are on the **Emails** and **Calendar** tabs of the person, their company, and any opportunity where they are the point of contact. Colleagues see the sender, subject and date of your mail, never the text.

**Documents** are never in Twenty: open the record's **SharePoint folder** link.

**Before creating anything**, search by email or website: Twenty refuses a second company with the same website or a second person with the same email. Spot a duplicate? Tell the ops coordinator; only the ED and the ops coordinator merge.
