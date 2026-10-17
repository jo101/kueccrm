# 19: Leads and documents

Written against Twenty 2.48.0 and `kuec-bd-ops` 0.9.0. Owners: the ops coordinator (the lead inbox and the weekly lead review), the ED (the rules in sections 2 to 5 and the licence-grade threshold), the engineering lead (the automation and the intake route). Readers: everyone who meets people for KUEC, engineers.

A **lead** is a person or company with a possible need, before anyone has scoped it into a case. An **opportunity** is a case with a type, an owner, a next action and a stage (`../playbooks/`). Leads come before opportunities: a lead is triaged, worked, qualified and then converted, and the conversion creates the opportunity. A **document** is a link to a file on SharePoint or in uVENTURE, with its type, status, confidentiality and expiry. The file itself never comes into Twenty (`kuec/CLAUDE.md` section 4).

Contents

0. The one company rule
1. The lead's life in one table
2. Who does what
3. Qualification: the five checks in plain words
4. Disposition rules
5. Referral credit
6. How leads arrive: by hand and through the forms
7. Automation reference (L1 to L6)
8. Views and dashboards
9. Documents
10. Install and verify (0.9.0)
11. Known limits and changing the rules

---

## 0. The one company rule

For the cadence guide (`10-cadence-en.md` and `10-cadence-ar.md` section 1), and for everyone at KUEC:

> **A contact that is not a Lead in the CRM did not happen, and whoever logged it holds the referral credit.**

In practice: met someone with a possible need at a gala, a site visit, a conference or over coffee? Create a Lead the same working day, even with only a name and a company. If you type it in yourself, you are its referrer (**Referred by (colleague)**) unless you name another colleague. An outside referrer, such as a faculty member who made the introduction, goes in **Referred by** and keeps their credit too. A business card in a drawer earns nobody anything.

## 1. The lead's life in one table

| Status | Means | Who moves it here | What the CRM does |
| --- | --- | --- | --- |
| **New** | Logged, nobody has spoken to them yet | Every lead starts here | L1 gives an ownerless lead to the ops coordinator with a Triage task due the next working day. L2 nudges the owner after 3 working days in New and tells the ED after 7 |
| **Contacted** | We reached out (email, call, message); no conversation yet | The owner | L3 closes it as Dead (No response) after 30 days with no engagement and no status change |
| **Engaged** | A real two-way conversation is going on | The owner | Same 30-day rule as Contacted |
| **Qualified** | At least 4 of the 5 checks are true (section 3) | The CRM, when the 4th check is ticked; or the owner by hand | L4 gives the owner a task "Convert or park" and tells the ED about a licence-grade lead. L6 asks the owner to thank the referrer |
| **Nurture** | Real but not now: wrong timing, no budget this year | The owner | Gets a review date, 90 days out if left empty. Listed in **Nurture review due** from that date |
| **Dead** | Going nowhere | The owner, or L3 after 30 quiet days | Needs a **Dead reason**. Without one the owner gets a task "Record dead reason" |
| **Converted** | Became an opportunity | The owner | L5 creates the opportunity at stage Qualify and links the two. L6 asks the owner to thank the referrer |

Working days are Monday to Friday without UAE public holidays (the holiday list in the app). All times are Asia/Dubai.

## 2. Who does what

| Who | Does | Where |
| --- | --- | --- |
| **Ops coordinator** | Triages every new lead by the next working day: checks for a duplicate (same person or company already a lead or an opportunity), fills Source, Department and Offering interest, and gives the lead to the BD officer or department colleague who should work it, or works it herself. Runs the Monday lead review (below) | **Leads > Lead inbox** (her default page for leads: L1 makes her the owner of every lead that arrives without one) |
| **BD officer** (and department colleagues on their own leads) | Works the leads they own: makes contact the same week, logs every contact as an Engagement linked to the lead, keeps a next action and a date, ticks the five checks as the answers come in, and converts or parks a qualified lead | **Leads > My leads**, **Qualified not converted** |
| **ED** | Is told, by task and email, about every licence-grade lead the moment it qualifies (section 3). Is told about any lead left in New for 7 working days. Decides on threshold changes | Tasks; **BD > Executive** for the lead charts |
| **Everyone** | Logs any contact with a possible need as a Lead the same working day (section 0) | **Leads** in the sidebar, or the command menu (Ctrl+K) |

**Monday lead review** (ops coordinator, 10 minutes, before the standup): **Lead inbox** empty or every row triaged; **Nurture review due** each row reviewed (back to Contacted with a next action, a new review date, or Dead with a reason); **Dead this month by reason** read for patterns to raise at the Thursday review; **Data quality > Leads with Other and no details** fixed.

## 3. Qualification: the five checks in plain words

A lead is qualified when the answer to at least four of these is yes. Tick a check on the lead record only when you have heard the answer from them, not when you assume it.

| Check (field) | Ask yourself | Yes means | Not yet |
| --- | --- | --- | --- |
| **Need identified** | Can I say in one sentence what they want KUEC to do? | They named a concrete problem or request: "test 40 membrane samples for fouling", not "interested in AI" | General interest, a brochure request |
| **Decision maker reached** | Is the person who can say yes and sign in the conversation? | We have spoken to them, or our contact has brought them in | Only a junior contact or a gatekeeper |
| **Capability matched** | Is there a named KU technology, lab, service or team that can do it? | We can name it: "Lab X can run that test", "technology Y in uVENTURE fits" | We hope someone at KU can |
| **Funding path identified** | Do we know who would pay and how? | Their budget, a grant, an offset obligation or a sponsor, named | Price not discussed, or "we have no budget" |
| **Timing known** | Do we know when they need it? | A date or a window: "before the Q2 shutdown" | "Sometime" |

**Qualification score** is the number of ticked checks. The CRM sets it; nobody types it. At **4 or more** the CRM sets the lead to **Qualified** (from New, Contacted, Engaged or Nurture; it never moves a Dead or Converted lead) and gives the owner a task **Convert or park** due today.

**Licence-grade.** When a lead qualifies, the ED is also told, by task and email, if either is true:

- **Offering interest** includes **IP licence**; or
- **Estimated value** is above the threshold the ED sets in the app variable **Lead value that notifies the ED** (`config/dashboards/kuec-bd-ops-variables.md`). The amount is compared as entered, so enter estimates in AED. Until the threshold is set, only the IP licence rule applies.

## 4. Disposition rules

Every lead ends in one of three places: **Converted**, **Nurture** or **Dead**. A lead is never deleted to close it (only the ED and the ops coordinator delete, and only mistakes, `14-hygiene.md` section 7).

- **Convert** when the lead is Qualified and the next step is real work for KUEC: a scoping call with the decision maker, a quote, a technical assessment. Set Status to **Converted**. The CRM creates the opportunity within a minute: stage **Qualify**, Type from the first offering in **Offering interest** (in the order of the Offering list, so an IP licence interest makes a Licence case), and Source, Company, Person (as point of contact), Owner, Department, Next action and its date, Estimated value (as Amount) and Offering copied over. **Need** becomes the opportunity's **Description**. The lead shows the new case in **Converted opportunity**; the case shows the lead in **Lead**. If the type is Licence or Technical service, the playbook starts as if you had set the type yourself (W1, `04-automation.md`).
- **Cross-sell.** The same lead may convert again when the same contact wants something else. Set Status back to **Qualified**, change **Offering interest** and the next action to the new need, then set **Converted** again: each conversion is a new opportunity, and the lead's **Opportunities** list shows all of them. **Converted opportunity** always shows the latest.
- **Nurture** when the need is real but not now. Set a **Nurture review date**; if you leave it empty the CRM sets it 90 days out. On that date the lead appears in **Nurture review due**.
- **Dead** when it is going nowhere. Pick a **Dead reason**: No response, No fit, No budget, Duplicate, Competitor, Timing, Not decision maker, or Other (then say what in **Other details**). Duplicate means another lead or an opportunity already covers this contact: link or merge rather than work both. Without a reason the owner gets a task **Record dead reason**.
- **Automatic Dead.** A Contacted or Engaged lead with no engagement dated after its last status change, and no status change, for 30 days, is set to Dead with reason **No response** by the CRM at 08:10. The owner gets a task **Confirm or revive** due in 5 days: leave it Dead, or move it back to Contacted or Engaged with a next action. Logging an engagement on the lead restarts the 30 days.
- **Contact SLA.** A lead in New for 3 working days nudges its owner (task and email); after 7 working days the ED is told. Moving the lead out of New stops both; a lead that goes back to New starts a new clock.

## 5. Referral credit

- **Referred by** is a Person: someone outside the BD team who introduced the contact (faculty, a partner, a client). **Referred by (colleague)** is a workspace member: the colleague who referred the contact or logged it. When a person types a lead in themselves and nobody else is named there, L1 fills in that person (section 0). Leads from the forms have no colleague unless someone adds one.
- **Thank-you tasks.** When a referred lead reaches **Qualified**, and again when it reaches **Converted**, the owner gets a task **Thank the referrer**, once for each.
- **The credit.** When an opportunity converted from a referred lead reaches **Signed**, the CRM stamps **Referral credited at** on the lead and writes a Note "Referral credit: ..." on the referrer's Person record, the lead and the opportunity. The colleague's credit is a line in **BD > Team > Leads by referrer**, which counts credited leads per colleague; the table beside it lists them. A second signed opportunity from the same lead gets its own Note; the lead counts once on the chart.

## 6. How leads arrive: by hand and through the forms

### 6.1 By hand

**Leads** in the sidebar, **+ New record**. Type the name first (a person and company, such as "Mariam Al Hosani, ADNOC"), then Source, Company, Person, Need and Offering interest. Triage (L1) runs on the first edit of the name or source, so the lead gets its owner and the Triage task within a minute. Leave Status at New unless you have already contacted them.

Never paste a document into a lead or attach a file: add a **Document** with the SharePoint or uVENTURE link (section 9).

### 6.2 The forms: gala QR, workshop sign-up and the website

The three forms post their submissions to the CRM, so no contact is retyped. Each submission becomes a lead with **Source** and **Source system** set, a matched or new **Person** (by email) and **Company** (by website domain, then by name), and, for a workshop sign-up, the workshop or campaign project in **Campaign**. It is then triaged like any other lead (L1).

| Form | Source | Source system | External id |
| --- | --- | --- | --- |
| Website contact form | Inbound (web, email, phone) | Website form | `web:<submission id>` |
| Gala QR form | Gala QR | Gala QR form | `gala:<submission id>` |
| Workshop sign-up | Workshop | Workshop sign-up form | `workshop:<submission id>` |

An existing person is linked, never changed, except that an empty company is filled. A submission whose external id already has a lead creates nothing, so a resent form is harmless.

**The route.** `lead-intake-route` is the signed server route of `16-integration-map.md` section 2.4:

- `POST https://crm.kuec.example/s/integrations/forms/leads`
- Headers: `x-kuec-timestamp` (Unix seconds), `x-kuec-signature: v1=<hex HMAC-SHA256(secret, timestamp + "." + raw body)>`, `x-kuec-delivery` (1 to 100 letters, digits, dot, dash or underscore, unique per delivery and the same on a resend).
- Body:

  ```json
  {
    "form": "GALA_QR",
    "submissions": [
      {
        "submissionId": "scan-0001",
        "firstName": "Mariam",
        "lastName": "Al Hosani",
        "email": "mariam@example.ae",
        "jobTitle": "Head of R&D",
        "companyName": "Example Energy",
        "companyWebsite": "https://www.example.ae",
        "need": "Membrane testing for produced water",
        "offeringInterest": ["LAB_TESTING"],
        "campaignId": "<id of the workshop or campaign project>"
      }
    ]
  }
  ```

  `form` is `WEBSITE`, `GALA_QR` or `WORKSHOP_SIGNUP`. Each submission needs a `submissionId` and at least one of email, a name or a company. `offeringInterest` takes the Offering values of `18-taxonomy.md` section 8; unknown values are dropped. `campaignId` must be a Project of type GTM campaign or Workshop, otherwise Campaign stays empty. At most 100 submissions per delivery.
- Answers: **202** with the delivery id (queued; the job writes the leads within a minute); **401** for a missing header, a timestamp more than 5 minutes off, or a wrong signature; **400** for a malformed body (the reason is in the answer); **413** for more than 100 submissions; **503** while no signing secret is set or the queue is down. The sender retries 5xx and network errors with backoff for 24 hours and never retries 4xx.
- The route writes nothing itself: it enqueues one job, `lead-intake-job`, with the id `lead-intake-<delivery id>`, so the same delivery twice is one job. The job retries 3 times on rate limits, server errors and network failures. Logs carry the delivery id and counts, never names or emails.

**Set up a form** (engineering lead, with whoever runs the form):

1. Generate a secret: `openssl rand -hex 32`. Store it in the secrets manager as `twenty/<env>/FORMS_SIGNING_SECRET`.
2. Settings > Apps > KUEC BD Ops > Variables: **Forms signing secret** (`config/dashboards/kuec-bd-ops-variables.md`).
3. Give the form operator the URL, the secret through the secrets manager (never by email), and this section. For a workshop sign-up, give them the workshop project's id (the last part of its URL in the CRM).
4. Test from staging with one submission: the answer is 202, and within a minute the lead is in the ops coordinator's **Lead inbox** with its Triage task.
5. **Rotation**, quarterly with the API key (`13-roles.md` section 6): move the current secret to **Forms signing secret (previous)**, set the new one, tell the form operators, clear the previous one a week later.

The forms must collect consent to be contacted before they submit; the route does not check it.

## 7. Automation reference (L1 to L6)

All lead automation is logic functions in `kuec/app/src/logic-functions`, with the rules as pure functions in `kuec/app/src/automation/rules/lead-*.rule.ts`, tested with a fixed clock (`lead-rules.test.ts`). The conventions are those of `04-automation.md` section 2: nothing listens on `*.created`, guards are set last, every escalation level has its own stamp, notifications are deduplicated in the app's key-value store, and an hourly sweep repairs what a lost event left undone.

| Rule | Function | Trigger | Does | Writes as |
| --- | --- | --- | --- | --- |
| L1 Triage | `l01-lead-triage` | `lead.updated` on `name`, `source` | Skips a lead whose `playbookApplied` (label **Triaged**) is set. No owner: the ops coordinator (from the playbook role assignments). Stamps Status entered at for a New lead, sets the score, credits the colleague who typed it (section 5). Task **Triage** due the next working day at 17:00. Sets the guard last | app (lead fields); person (task) |
| L2 Contact SLA | `l02-lead-contact-sla` | cron `20 * * * *` (hourly) | A New lead 3 working days after Status entered at: owner nudged (task and email), stamps `contactNudgeSentAt`. After 7: the ED, stamps `contactEdNotifiedAt`. A level has fired for this clock when its stamp is later than Status entered at | app (stamps); tasks as the app |
| L3 Auto-dead | `l03-lead-auto-dead` | cron `10 4 * * *` (08:10) | Contacted or Engaged, 30 days since the later of Status entered at and Last engagement: Task **Confirm or revive** for the owner due in 5 days, then Status Dead, Dead reason No response, `autoClosedAt` | app |
| L4 Qualification | `l04-lead-qualification` | `lead.updated` on the five checks | Re-reads the lead, sets `qualificationScore`. At 4 or more on an open lead: Status Qualified, `qualifiedAt`, Task **Convert or park** for the owner; a licence-grade lead also notifies the ED. Follow-ups are keyed on `qualifiedAt` | app (score, status, stamp); person (tasks) |
| L5 Convert | `l05-lead-convert` | `lead.updated` on `status` | On a move into Converted: creates the opportunity (section 4), stamps its Stage entered at, sets its Type in a second update so W1 starts the playbook, links the lead (`convertedOpportunity`, `lastConvertedAt`). A retry finds the opportunity it already created for this conversion | person (opportunity and its type); app (stamps and links) |
| L6 Referral credit | `l06-lead-referral-thanks` | `lead.updated` on `status` | A referred lead moving into Qualified or Converted: Task **Thank the referrer** for the owner, once per status | person |
| | `l06-referral-signed` | `opportunity.updated` on `stage` | An opportunity with a Lead moving into Signed, the lead referred: stamps `referralCreditedAt` once, Note on the referrer's Person, the lead and the opportunity | app |
| | `lead-status-tracking` | `lead.updated` on `status` | Stamps `statusEnteredAt` (the L2 and L3 clocks). Nurture without a review date: 90 days out. Dead without a reason: Task **Record dead reason** | app (stamps); person (task) |
| | `w11-engagement-stamp` | `engagement.updated` on `date`, `nextStep`, `leadId` | Since 0.9.0 also: an engagement linked to a lead sets the lead's Last engagement (never backwards) | app |
| | `lead-sweep` | cron `45 * * * *` (hourly) | New leads nobody triaged 10 minutes after creation (imported, API-created, or a lost event) get L1. Re-derives every score and runs L4 where it changed. Re-derives Last engagement from the linked engagements. Finishes a conversion whose status change was stamped but has no opportunity. Credits a signed opportunity's referred lead that was not credited | app; tasks as the app |
| intake | `lead-intake-route`, `lead-intake-job` | HTTP route, job | Section 6.2 | app |

**Re-run by hand** (from `kuec/app`, signed in as the ED or an engineer, `04-automation.md` section 3). Every function is idempotent.

| To | Run |
| --- | --- |
| Repair leads now (after a restart, a restore, or resuming automation after an import) | `yarn twenty dev:function:exec -n lead-sweep` |
| Run the contact SLA or the 30-day rule now | `... -n l02-lead-contact-sla` / `... -n l03-lead-auto-dead` |
| Triage one lead again | Not possible once Triaged is set; assign the owner by hand |
| Convert a lead whose opportunity did not appear | Set Status to Qualified, save, then Converted again. Or `... -n lead-sweep` if its status change was stamped |
| Replay a form delivery | Ask the form operator to resend it (same delivery id): the job id makes it a no-op if it already ran |

Logs: `yarn twenty dev:function:logs -n lead-sweep` prints one line such as `lead sweep: checked 120 leads and 3 signed opportunities from leads; triaged 0, rescored 1, restamped 0 last engagements, converted 0, credited 0 referrals`. Intake: `lead intake <delivery> (GALA_QR): 12 submissions, 11 new leads`, or `lead intake refused <delivery>: BAD_SIGNATURE`.

## 8. Views and dashboards

**Leads** (sidebar, between Exceptions and Pipeline; opens on Lead inbox):

| Position | View | Shows | Grouped |
| --- | --- | --- | --- |
| 0 | **Lead inbox** | New leads owned by me, oldest first. For the ops coordinator this is every untriaged lead | |
| 1 | **My leads** | My leads that are not Dead or Converted, by next-action date | |
| 2 | **Qualified not converted** | Qualified leads, longest waiting first | |
| 3 | **Nurture review due** | Nurture leads whose review date is today or past | |
| 4 | **Dead this month by reason** | Leads that went Dead this calendar month | by Dead reason |
| 5 | **By source** | Every lead | by Source (deprecated sources hidden) |
| 6 | **By campaign** | Leads with a Campaign, the campaign in the fourth column. Twenty 2.48 groups by a select only; each campaign or workshop project also lists its leads on its record page | |
| 19 | **Hygiene: Other without details** | Source, Offering interest, Department or Dead reason set to Other with Other details empty | |
| 20 | **Everything (expert)** | Every column | |

A view cannot name a member by id (`05-views.md` section 6), so the inbox is "New leads owned by me". L1 makes the ops coordinator the owner of every lead that arrives without one, so for her it is the whole inbox.

**Documents** (sidebar, after Contracts; opens on Documents by type): **Documents by type** (position 0, grouped by Type), **Documents expiring in 60 days** (1; Expires on today or in the next 60 days, not Expired or Superseded), **Hygiene: Other without details** (19), **Everything (expert)** (20).

**BD > Executive** gains, at the bottom: **Leads created per month, by source** (the past 12 months, this month included) with its table, and **Lead conversion rate** (leads with Status Converted as a share of all leads) with the table of all leads.

**BD > Team** gains, after the work package board: **Open leads per owner, by status** with the open leads, and **Leads by referrer** (referral credits per colleague, section 5) with the credited leads.

**Data quality** gains two last rows: Leads with Other and no details, Documents with Other and no details. Opportunities with Other and no details now also catches Department set to Other.

## 9. Documents

A Document record is the link and its metadata. It never holds the file: there is no file field, uploads stay off for every role but engineers (`13-roles.md` section 1.1), and the Files tab is hidden on the Lead and Document record pages like on Opportunity and Contract (`config/dashboards/record-page-files-tab.md`).

| Field | Meaning |
| --- | --- |
| Name | What it is, as people say it: "ADNOC NDA 2026" |
| Type | NDA, MoU, MSA, Proposal or SOW, Quote, RFQ or RFP received, ... (`18-taxonomy.md` section 8.7) |
| Status | Draft, Shared, Under review, Signed, Expired, Superseded, Other |
| Confidentiality | Internal, Confidential (the default), Restricted, Other. A label for people: anyone who can read Documents in Twenty sees the record and its link, and SharePoint or uVENTURE decides who can open the file. Never put anything in a Document record's name or Other details that the label forbids sharing |
| SharePoint or uVENTURE link | Where the file lives |
| Version | As written on the file: v3, Final |
| Owner, Company, Person, Lead, Opportunity, Project, Contract | What it belongs to; fill all that apply |
| Expires on | When it stops applying: an NDA's term, a quote's validity |
| External id, Source system | For a future feed (uVENTURE). Locked for people |

Every Company, Person, Lead, Opportunity, Project and Contract record page has a **Documents** card on its Home tab listing the documents linked to it. A **PO or invoice** is linked for reference only: finance is the system of record.

## 10. Install and verify (0.9.0)

1. From `kuec/app`: `yarn test:unit` and `yarn typecheck`. The unit suite covers the lead rules with a fixed clock (`automation/rules/lead-rules.test.ts`), the intake signature, body and mapping (`automation/intake/lead-intake.test.ts`), the role grants and locks (`roles/roles.test.ts`), the taxonomy mirror (`playbooks/lookups.test.ts`), the views, the dashboards, the Data quality page, the sidebar order and the Documents cards (`page-layout-widgets/documents-widgets.test.ts`).
2. `npx twenty plan` on staging. Read it. It must show only additions and updates:
   - 2 objects (Lead, Document) with their fields; 32 relation fields (16 pairs) and 2 fields on Opportunity (Department, Description);
   - 17 views (9 on Lead, 4 on Document, 4 dashboard widget views) with their view fields, filters, filter groups, groups and sorts; 1 filter added to Opportunities > Hygiene: Other without details;
   - 6 Documents widgets on record pages; 8 widgets on the BD page (4 Executive, 4 Team); 4 widgets on the Data quality page;
   - 2 navigation menu items (Leads, Documents);
   - 11 logic functions (`l01-lead-triage`, `l02-lead-contact-sla`, `l03-lead-auto-dead`, `l04-lead-qualification`, `l05-lead-convert`, `l06-lead-referral-thanks`, `l06-referral-signed`, `lead-status-tracking`, `lead-sweep`, `lead-intake-route`, `lead-intake-job`), W11's trigger gaining `leadId`, and updated code in every function that shares the notification module;
   - 3 application variables;
   - updated roles: BD officer, the four department roles and Automation write Lead and Document; every role but the ED, the ops coordinator, Automation and the function role has the five new field locks.

   Any removal or recreation blocks the deploy (`kuec/CLAUDE.md` section 2). Two checks on staging before production: the plan accepts the views and the chart that use the Lead's `createdAt` (its identifier is derived, `lead.object.ts`); and two Leads and two Documents with an empty External id can coexist (the unique index, `16-integration-map.md` section 2.2).
3. Publish and install after the Thursday update (`06-weekly-update.md` section 3), then `yarn twenty dev:function:exec -n lead-sweep`.
4. Click-runbooks: hide the Files tab on Lead and Document (`config/dashboards/record-page-files-tab.md`); set **Lead value that notifies the ED** if the ED has chosen a threshold, and the forms secrets when a form is ready (`config/dashboards/kuec-bd-ops-variables.md`).

Verify (ops coordinator, on staging first):

1. The sidebar reads Home, Exceptions, **Leads**, Pipeline, ... Contracts, **Documents**, Milestones, Data quality.
2. As a BD officer, create a lead "Test lead, Test Co" with no owner. Within a minute: owner is the ops coordinator, Referred by (colleague) is the BD officer, Triaged is on, and the ops coordinator has a task **Triage: Test lead, Test Co** due the next working day at 17:00. It is in her Lead inbox.
3. Tick four checks: within a minute the score is 4, Status is Qualified, the owner has **Convert or park**, and **Thank the referrer** (the lead has a colleague referrer). Tick IP licence in Offering interest first and the ED also gets a task and an email.
4. Set Status to Converted: an opportunity at Qualify appears with Type Licence, the lead's Need in Description, and links both ways. The Licence playbook starts (W1).
5. Set that opportunity to Signed: the lead shows Referral credited at, a Note "Referral credit: ..." is on the lead, and BD > Team > Leads by referrer has a bar for the BD officer.
6. Create a Document linked to the test company with a SharePoint link: the company's Home tab shows it in the Documents card. Set Expires on to next week: it is in Documents expiring in 60 days.
7. Delete the test records afterwards (they are the mistakes `14-hygiene.md` section 7 allows deleting).

## 11. Known limits and changing the rules

- **Two quick edits can race.** L1 and the lead sweep both check Triaged before they act and set it last; a lead edited twice in the same second can get two Triage tasks only if the key-value store is unavailable. Conversion: a server restart in the second a lead is set to Converted can lose both the status stamp and the conversion; the lead then shows Converted with no Converted opportunity. Set it to Qualified and back to Converted.
- **The inbox is "owned by me".** If the ops coordinator changes, the new one sees the leads L1 gives her from then on; reassign the old inbox by hand (**Leads > Everything (expert)**, filter Owner).
- **Campaign is not restricted by type.** Twenty 2.48 cannot limit a relation to projects of one type. The intake route checks it; by hand, pick a GTM campaign or Workshop project.
- **Confidentiality does not restrict access** in Twenty (row-level permissions are an Organization-plan feature, `kuec/CLAUDE.md` section 3). SharePoint and uVENTURE permissions protect the files.
- **Imported leads.** Pause automation per `09-import.md`, import, resume, then run `lead-sweep`: every imported New lead is triaged (one Triage task each), and an imported Converted lead never gets an opportunity created for it.
- **Phase B.** A **Convert** command on the lead (`design/backlog.md`, B19) will call the same conversion code as L5, so a cross-sell will not need the status round trip.
- **Changing a number** (3 and 7 working days, 30 and 5 days, a score of 4, 90 days): the constants are at the top of `src/automation/rules/lead-*.rule.ts`. Change the constant and this runbook in the same release; the ED approves.
