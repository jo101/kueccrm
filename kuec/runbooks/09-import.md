# 09: Day-one import and later refreshes

Written against Twenty 2.48.0 and `kuec-bd-ops` 0.4.0. Owner: the ops coordinator, with the engineering lead for sections 3.2 and 5. Readers: whoever runs the import.

The import loads the contact exports, the industrial register clusters, the workshop attendee lists and the BD pipeline spreadsheet into Twenty with its own CSV importer. A script in the app prepares the files: it deduplicates, maps values to the KUEC options, rejects what would break the operating rules, and writes CSVs whose headers Twenty matches on its own.

Order: **companies, people, opportunities, projects, milestones, contracts**. Each file's relations point at records an earlier file created.

## 0. Platform facts this runbook relies on

Checked against the 2.48.0 source.

| Fact | Consequence here |
| --- | --- |
| The importer (command menu > **Import records** on an object's list) upserts: a row whose `ID` exists, or whose unique field matches (company domain, person primary email), updates that record; any other row creates one. | The same importer is the "update existing records" import. The script gives every record a stable ID (section 2.3), so importing a refreshed file updates instead of duplicating. |
| A relation column connects to an existing record through a unique field of the target: `Company / ID`, `Owner / User Email`. Custom objects (Project, Milestone, Contract) have no unique field other than ID. | Every relation in the files is an ID or, for owners, the member's login email. Owners must be workspace members before the import. |
| Column headers are matched to fields by label. | The files use the exact labels (`field-mapping.csv`). Check the matching anyway (section 4). |
| One file takes up to 10,000 rows. Records are written 200 per request. | Files are split at 1,999 rows (`-part-1-of-3`). |
| Fields the app owns (`Stage entered at`, project `Health` and `Percent complete`, `Playbook applied`) cannot be written by an import. | Section 8. |
| An update event carries only the fields whose value changed; an unchanged row fires nothing. | A refresh that changes nothing triggers nothing. |
| The 5,000 runs per hour limit is the workflow-builder throttle (`WORKFLOW_EXEC_HARD_THROTTLE_LIMIT`). KUEC has no workflows (`CLAUDE.md` section 6); its automation is app logic functions, throttled at 1,000 runs per minute (`LOGIC_FUNCTION_EXEC_THROTTLE_LIMIT`). | A day-one import creates records, and no KUEC function listens on `*.created`, so W1 does not fire for imported rows. A refresh that changes Type, Stage or a work-package status does fire W1, W8 and the rest. Automation is paused for every import anyway (`CLAUDE.md` section 8). |
| A logic function has no on/off switch in 2.48. | Pausing means `LOGIC_FUNCTION_TYPE=DISABLED` on the server and worker for the import window (section 3.2). Events raised in that window fail and are not replayed, which is the point. Crons and the work package card's actions stop too. |

## 1. Collect the sources

Work in a folder **outside the repository**, on a KUEC-managed, encrypted device. The files hold personal data; the script refuses to read or write inside the repo. Nothing from this folder is ever attached to a Twenty record.

```
<import folder>/in/
  owners.csv            required: Owner (as written in the sheets), Email (the member's KUEC login)
  register/             one CSV per industrial register cluster
  contacts/             contact exports (Outlook, phone, LinkedIn...)
  workshops/            one CSV per attendee list
  opportunities/        the pipeline sheet's opportunities tab
  projects/             its projects tab
  milestones/           its milestones tab
  contracts/            its contracts-under-negotiation tab
  value-map.csv         optional: Field, Source value, Target value
  column-map.csv        optional: Kind, Column, Header
```

Save every sheet as **CSV UTF-8** (Excel: File > Save a copy > CSV UTF-8). A register file without a sector column takes its sector from the file name, so name cluster files after the cluster (`Oil and Gas cluster.csv`).

Headers are recognised by common names (`Company`, `Website`, `E-mail Address`, `Next Action Date`, `Owner`...). `field-mapping.csv` shows which header was read for each field. When a header is not recognised, name it in `column-map.csv`: `Kind` is the folder name, `Column` the script's name for it (the keys in `scripts/import/source-columns.ts`, for example `opportunities,nextActionDate,Follow-up by`).

What the pipeline tabs need:

| Tab | Required | Read when present |
| --- | --- | --- |
| opportunities | Opportunity name, Stage, Owner; Next action and Next action date unless Signed, Lost or Parked | Ref (strongly recommended: it is the opportunity's identity across refreshes), Company, Company website, Type, Motion, Amount, Currency, Close date, Probability, Source, Client deadline, Contact email or name |
| projects | Project name | Project ID, Type (Workshop, Proposal, Delivery), Status, Owner, Opportunity (its Ref or name), Event date, End date |
| milestones | Project (its ID or name), Milestone name | Due date, Status, Owner |
| contracts | Counterparty or contract name | Ref, Kind, Status, Opportunity, Value, Currency, Owner, Documents link (SharePoint), Signed on, Expires on |

## 2. Prepare the files

From `kuec/app`, with Node 22.18 or later (the app pins 24):

```bash
yarn import:prepare --in <import folder>/in --out <import folder>/out
```

`--today 2026-10-20` sets the date the next-action check compares with; the default is today in Asia/Dubai. Use the day you will import.

### 2.1 Outputs

| File | What it is |
| --- | --- |
| `01-companies.csv` ... `06-contracts.csv` | The import files, in import order, in Twenty's import format |
| `rejected-opportunities.csv` | Opportunity rows not imported, with the reason first and the original columns after it. Goes back to the pipeline sheet's owner |
| `dedupe-report.csv` | Every merge, ambiguity, rejection and warning, with the source rows (`file:row`) |
| `field-mapping.csv` | For each import column: the Twenty field, the source header it was read from, and the rule. Also every source column that is not imported |
| `value-mapping.csv` | Every source value of a select field and the option it became, or `unmapped` |
| `held-values.csv` | Values of `sizeClass` and `motion`, which have no field in Twenty yet (section 8) |
| `post-import-check.sql` | The section 6 check, with this run's opportunity IDs |
| `summary.txt` | Counts per object and per stage |

### 2.2 Review until clean

1. `value-mapping.csv`: every `unmapped` row is a value that will be left empty, or for Stage, a rejected opportunity. Add a line to `value-map.csv` (`stage,Hot lead,MEETING`; fields: `sector`, `stage`, `opportunityType`, `opportunitySource`, `probability`, `projectType`, `projectStatus`, `milestoneStatus`, `contractKind`, `contractStatus`; targets are API values) and rerun.
2. `field-mapping.csv`: each import column reads the source header you expect. Fix misses in `column-map.csv` and rerun.
3. `dedupe-report.csv`, `ambiguous` rows: decide each one. Usually the fix is in the source: add the website so two same-named companies separate or merge, correct a company name, or remove a shared mailbox. Rerun.
4. `rejected-opportunities.csv`: send it to the pipeline sheet's owner. They fix the rows in the sheet (owner, next action, a date from today on, a KUEC stage), and you export and rerun. Rows still rejected on import day stay out and are imported by the next refresh.
5. `dedupe-report.csv`, `rejected` and `warning` rows for the other objects: fix what matters at the source.

Rerunning is safe: the same sources give the same IDs.

### 2.3 Rules the script applies

- **Companies**: merged on website domain first, then on the name with case, punctuation and legal suffixes removed (LLC, L.L.C., PJSC, PSC, FZE, FZ-LLC, Ltd, Co...). Same name with two different websites: kept as two companies and reported as ambiguous; rows naming them without a website are not linked. A company with no website gets the domain its people mail from when no other company uses it. Someone mailing from another company's domain joins it only if one name starts with the other ("Gulf Drilling" joins "Gulf Drilling Services LLC"); otherwise it stays a separate company and is reported ("Gulf Drilling Offshore": a subsidiary or the same company?). Public and ISP mail domains (gmail.com, outlook.com, emirates.net.ae, eim.ae...) never identify a company. Sector, size class and offset obligor come from the highest-ranked source that has them: register, then pipeline sheet, then contact exports, then attendee lists; offset obligor is Yes if any source says yes. ID key: website domain, else normalised name.
- **People**: merged on email, then on name plus company. Two people with the same name at the same company but different emails stay two people and are reported. A person with neither email nor company is rejected. Decision role is read from the job title by keyword and left empty when the title says nothing (`value-mapping.csv`, field `decisionRole`, lists every title and its role). ID key: email, else name and company.
- **Opportunities**: one row each; a repeated Ref (or name and company, without a Ref) is rejected as a duplicate. Rejected: no owner, an owner not in `owners.csv`, a stage that is not a KUEC stage (never `CUSTOMER`, deprecated), an ambiguous company, and for open stages a missing next action, a missing or unreadable next action date, or one before today (W4 would flag it the morning after the import, and the record would sit in No next action). ID key: Ref, else name and company.
- **Projects and milestones**: milestones attach to a project by its ID or name; a milestone without a project is rejected. Milestones are due at 17:00 Asia/Dubai.
- **Contracts**: only contracts under negotiation (a blank status counts as under negotiation). Metadata only: the documents link goes into **SharePoint folder**, and only if it is an `https://*.sharepoint.com` address; anything else (a file path, another drive) is left out and reported. No document is uploaded.
- Dates are read day first (05/11/2026 is 5 November), except when the second number cannot be a month.

## 3. Before importing

1. Every owner in `owners.csv` is a workspace member who has accepted the invitation (`config/dashboards/members-and-roles.md`). `Owner / User Email` only connects to an existing member.
2. Stage options Signed, Lost and Parked exist (`config/dashboards/opportunity-stages.md`).
3. Day one: Companies, People, Opportunities, Projects, Milestones and Contracts are empty apart from test records you delete now.
4. Take a backup (`01-deploy.md` section 10) and note its file name in the import log.
5. Agree a window outside working hours and tell the team: automation, reminders and the work package card's actions stop for its length.
6. Import signed in as the ops coordinator, the only role with **Import CSV** (`runbooks/13-roles.md`). Section 3.1 needs the **Workflows** permission, so the ED or an engineer does it.

### 3.1 Deactivate workflows triggered by the imported objects

1. Settings > **Workflows**.
2. For each workflow with status **Active** whose trigger is a record trigger (created, updated, deleted, or created or updated) on Companies, People, Opportunities, Projects, Milestones or Contracts: open it, **Deactivate**, and write its name in the import log.
3. Expected: there are none, because KUEC automation is app logic functions. Any you find is a finding for the ED (`CLAUDE.md` section 6).

### 3.2 Pause the app's record-triggered automation

On the host:

```bash
sed -i 's/^LOGIC_FUNCTION_TYPE=.*/LOGIC_FUNCTION_TYPE=DISABLED/' /srv/twenty/prod/.env
docker compose --env-file /srv/twenty/prod/.env up -d server worker
docker compose --env-file /srv/twenty/prod/.env exec server printenv LOGIC_FUNCTION_TYPE   # DISABLED
```

Wait until the server log shows it is up again (`01-deploy.md` section 3).

## 4. Import

For each file, in order (`01-companies` first; parts of one file in part order):

1. Open the object in the sidebar (Companies, People, Opportunities, Projects, Milestones, Contracts). Press Cmd+K (Ctrl+K on Windows) and choose **Import records**.
2. Upload the file. Keep the first row as the header row.
3. **Match columns**: every column is matched to the field with the same label. Compare with `field-mapping.csv` (column "CSV column"); pick the right field for any column left unmatched. Nothing is set to "Do not import" on day one.
4. **Validate data**: expect no errors. If there are errors, cancel; do not drop the invalid rows in the dialog. Fix the source, rerun section 2, and start this file again.
5. Confirm and wait for the import to finish.
6. The object's list shows as many records as the file has rows, plus what earlier files did not touch. `summary.txt` has the counts.

If a file fails halfway, import it again: rows already in were written with their ID and are updated, not duplicated.

## 5. Resume automation

1. On the host:

   ```bash
   sed -i 's/^LOGIC_FUNCTION_TYPE=.*/LOGIC_FUNCTION_TYPE=LOCAL/' /srv/twenty/prod/.env
   docker compose --env-file /srv/twenty/prod/.env up -d server worker
   docker compose --env-file /srv/twenty/prod/.env exec server printenv LOGIC_FUNCTION_TYPE   # LOCAL
   ```

2. Run the checks after a restart (`01-deploy.md` section 13), including `scripts/verify-crons.sh`.
3. From `kuec/app`, signed in as the ED or an engineer (`04-automation.md` section 3): run `timer-sweep`, `derived-dates-sweep`, `w04-next-action-guard` and `w10-project-health-daily` once each. W4 must report no flag for an imported opportunity.
4. Reactivate the workflows written in the import log in section 3.1, if any.
5. Imported opportunities and projects carry their Type but have no playbook work packages, because creating a record does not start W1 or W9. For one that should get its playbook now: clear Type, save, set it again (`04-automation.md` section 3).

## 6. Post-import check

Every imported opportunity shows in exactly one stage column, and none is in **No next action**.

1. **Database** (read-only). Find the workspace schema, then run the check from the output folder:

   ```bash
   docker compose --env-file /srv/twenty/prod/.env exec -T db psql -U twenty -d twenty -c 'SELECT "displayName", "databaseSchema" FROM core.workspace;'
   { echo 'SET search_path TO "<databaseSchema>";'; cat <import folder>/out/post-import-check.sql; } \
     | docker compose --env-file /srv/twenty/prod/.env exec -T db psql -U twenty -d twenty
   ```

   Expected: `imported` equals the Opportunities count in `summary.txt`; `missing`, `not_in_a_kuec_stage`, `stage_differs_from_file` and `in_no_next_action` are 0. `not_in_a_kuec_stage` 0 means each record has one non-empty KUEC stage (never the deprecated Customer), so it shows in exactly one stage column.
2. **Pipeline** (Opportunities > Pipeline): the column counts New to Signed match the per-stage counts in `summary.txt`. Lost and Parked are hidden columns on that board; check their counts in the Lost with reasons and Parked views.
3. **No next action** (Opportunities > No next action): none of the imported opportunities is listed. On day one the view is empty.
4. Spot-check five records of each object against the sources: name, company, owner, point of contact, and the project and opportunity links.
5. Write the results and the backup name in the import log.

If a check fails: find the records with the SQL's `imported` CTE, fix them in the UI (stage, next action date), and rerun the check. If many are wrong, restore the backup from section 3 and start again.

## 7. Later refreshes (update existing records)

Day one makes Twenty the system of record for the pipeline. A refresh is for adding records that come in through the sources (a new register cluster, a new attendee list, rejected opportunities fixed in the sheet) and for deliberate corrections.

1. Rerun section 2 on the complete, current sources (not only the new rows) so every ID and link resolves. Same `owners.csv`, `value-map.csv` and `column-map.csv`.
2. Sections 3.1 and 3.2.
3. Import in the same order. On **Match columns**, set every column you are not deliberately updating to **Do not import**. An imported column overwrites the field wherever the file has a value (a blank cell leaves the field as it is), so a stale sheet would undo work done in Twenty. For opportunities that already exist, keep at most ID, Name and the columns you mean to correct; never Stage, Owner or Next action from an old sheet.
4. Sections 5 and 6. The SQL check lists all opportunities in the run; `stage_differs_from_file` counts any whose stage moved in Twenty since, which is expected when Stage was not imported.

IDs stay stable while the keys stay stable: a company's website domain (or its name when it has none), a person's email (or name and company), an opportunity's Ref. When a key changes (a company gains a website, an opportunity gets a Ref), the refresh creates a second record. `dedupe-report.csv` cannot see records that exist only in Twenty: after a refresh, open the company and people lists sorted by name, and combine any pair with the **Merge records** command.

## 8. Known limits

- **App-only fields are not set by the import.** `Stage entered at` stays empty on imported opportunities until their first stage change, so they do not count on the dashboard's Stale tile until then, and No next action sorts them first. Project `Health` stays Green and `Percent complete` empty until a milestone's status changes, even for a project with a Missed milestone; W10's 08:00 run still turns projects with an open milestone due within 7 days Amber. A one-off backfill in the app would close this.
- **No `sizeClass` or `motion` field.** The app has no company size class or opportunity motion field. The script reads both and lists their values in `held-values.csv`; nothing is imported for them. Adding them is a manifest change (two `SELECT` fields, options from `held-values.csv`, `plan` reviewed), then a refresh that imports only ID and those columns.
- **Contracts carry a SharePoint folder, not "documentsLink".** The source column `documentsLink` maps to the existing **SharePoint folder** field (`CLAUDE.md` section 4 names link fields by destination).
- **Phones**: UAE numbers are split into +971 and the national number; other numbers keep their + prefix and no calling code.
- **Source defaults to Inbound enquiry** (since 0.5.0, the quick-create default in `12-global-features.md` section 9). A new opportunity row with an empty Source cell is created as Inbound enquiry; check `value-mapping.csv` for blank sources before importing and fill them in the sheet if Inbound is wrong. Existing records and rows with a value are not affected.
- **Search keywords and Name (Arabic)** are not filled by the import. Fill them for Tier 1 and Tier 2 companies by hand afterwards (`12-global-features.md` section 1.3).

## 9. Undo

- One bad file on day one: select its records in the object's list (they are the only ones) and delete them, then filter the list on **Deleted** and destroy them, so a re-import does not meet soft-deleted records with the same IDs. Import it again after fixing.
- Anything larger, or a refresh that overwrote good data: restore the backup taken in section 3 (`01-deploy.md` section 10), then resume automation (section 5).
- After restoring, delete the output folder's import files you no longer need; keep `dedupe-report.csv` and `rejected-opportunities.csv` until the rejected rows are imported.
