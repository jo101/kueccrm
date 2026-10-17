# 16: Integration map

Written against Twenty 2.48.0 and `kuec-bd-ops` 0.7.0. Owner: the engineering lead. Decisions: the ED. Readers: engineers, the ops coordinator, the ED, KUEC IT.

**Since 0.11.0 (2026-10-17):** gate G1 is lifted and the uVENTURE contracts are built. The contracts as they run, their field mappings, retry rules and staging tests are in `21-uventure-readiness.md` section 4, which supersedes sections 3.2 to 3.6 here where they differ: the Capability pointer also carries a status, challenges become Leads and signed agreements become Contracts (instead of a Task), and Twenty tells uVENTURE about signed licences, IP licence conversions and technology engagements.

Every system Twenty exchanges data with, in which direction, who owns the exchange, how often, which fields and keyed on what. Sections 3 to 10 specify each one. Section 11 lists what today's configuration would have to change under each future scenario and proposes the changes that are cheap now.

This is a spec. It builds nothing and changes no configuration. Every item marked "proposed" needs the ED's yes and then goes through the normal release: additive manifest change, new UUIDs from `uuidgen`, `npx twenty plan` read (`kuec/CLAUDE.md` section 2), runbooks updated in the same change.

Contents

0. Sources and gates
1. The map
2. Rules every integration follows
3. uVENTURE
4. Apollo
5. Industrial registry
6. Microsoft 365
7. The future execution service
8. One workspace or several
9. AI, later
10. Backups, retention and the quarterly restore test
11. What today's configuration would have to change, and what to change now

---

## 0. Sources and gates

**Sources.** `kuec/CLAUDE.md`; `01-deploy.md` section 0 (gates G1 to G9); `04-automation.md`; `09-import.md` (the "Prompt 9" import and its dedupe rules, section 2.3); `12-global-features.md`; `13-roles.md`; `14-hygiene.md`; `config/deploy/it-request.md`; `design/backlog.md`. The Phase 0 architecture audit is not in this repository; its decisions are taken as recorded in `kuec/CLAUDE.md` and `01-deploy.md` section 0. Platform facts were read from the 2.48.0 source in this checkout (file paths in the text); none of the integrations below has been run.

**Names.** "W12" is the BD Teams channel, which W1, W2, W5 and W7 post to (`04-automation.md` section 2); it is not a logic function. "documentsLink" is the import column that fills the existing **SharePoint folder** field (`sharepointFolder`) on Opportunity and Contract (`09-import.md` section 8). "uventureLink" is the uVENTURE link field that `design/backlog.md` (B4) names `uventureRecord`; section 11 proposes that name.

**Gates.** Four parts of this spec describe things `kuec/CLAUDE.md` does not allow today. They are specified so the decision can be taken against a concrete design, not built.

| # | This spec | `kuec/CLAUDE.md` today | Until the rule changes |
| --- | --- | --- | --- |
| G1 | Section 3: a Capability pointer object and a nightly uVENTURE to Twenty sync | **Lifted 2026-10-17.** Section 5 now allows the pointer and the signed feeds | Built in 0.11.0: `21-uventure-readiness.md` |
| G2 | Section 7: a separate execution service | Section 6: "no separate execution service, in either phase" | Only the reserved names exist (`version`, `serviceCaseId`, in the lock list). No fields, no contract |
| G3 | Section 9: Twenty's agents and tools | Section 6: "No AI features (agents, AI fields, AI chat)" | Everything AI stays off (9.1) |
| G4 | Section 8: additional workspaces | Section 3: additional workspaces are an Organization-plan feature; design nothing that depends on them | One workspace; departments are a value on the record |

---

## 1. The map

| System | Direction | Owner | Frequency | Fields | Identifier |
| --- | --- | --- | --- | --- | --- |
| uVENTURE: capability pointers (gated, G1) | uVENTURE to Twenty, signed server route | uVENTURE administrator sends; engineering lead owns the route and job | Nightly, 01:00 Asia/Dubai | Capability: `name`, `kind`, `uventureRecord`, `externalId`, `sourceSystem`, `lastSeenInUventureAt` | `externalId` = `uventure:<technology or equipment id>`, Unique |
| uVENTURE: licence signed (gated, G1) | uVENTURE to Twenty, signed route; becomes a Task for a person | Same; the Task goes to the contract owner | On the event | Licence id, URL, technology id, licensee name, signed date. Writes only a Task | Dedupe key `uventure:licence.signed:<licence id>` |
| uVENTURE: new industry challenge (gated, G1) | uVENTURE to Twenty, signed route; becomes a Task for a person | Same; the Task goes to the ops coordinator | On the event | Challenge id, URL, title, company name, company domain. Writes only a Task | Dedupe key `uventure:challenge.created:<challenge id>` |
| uVENTURE: record links | Link only; no data moves | The case owner pastes it | When a case opens | Opportunity `uventureRecord` (proposed, 11); Contract `uventureRecord` (proposed) | The uVENTURE URL |
| uVENTURE: hand-offs | Twenty to uVENTURE, by a person | BD officer, Legal (per playbook) | At the playbook step | Done criteria and Tasks name the uVENTURE update (`templates.json`, `uventureHandoffs`). Nothing automatic | The uVENTURE link on the case |
| Apollo: companies and people | Apollo to Twenty, CSV import | BD officer exports; ops coordinator prepares and imports | Every two weeks at most, batched; on demand before a campaign | Company: name, domain, employees, LinkedIn, address. Person: name, verified email, job title, phone, LinkedIn, company | `externalId` = `apollo:<account id>` / `apollo:<contact id>`, then domain and email per `09-import.md` 2.3 |
| Apollo: sequence enrolment | Logged in Twenty by a person | The BD officer who enrols | At each enrolment, same day | Engagement: Subject `Apollo: <sequence>`, Kind Email, Date, Company, Opportunity, Owner, Outcome | One Engagement per company per sequence |
| Apollo: sequences, steps, replies | Stay in Apollo | Apollo users | n/a | None | n/a |
| Industrial registry | Registry to Twenty, CSV import | Ops coordinator | Quarterly, second week of January, April, July, October | Company: name, Name (Arabic), sector, size class (three-way rule); domain, address, employees (fill only) | `externalId` = `registry:<registration number>`, then domain and normalised name |
| Microsoft 365: sign-in | Entra ID to Twenty | KUEC IT (app registration); each member | Each sign-in | Identity, email | Member email |
| Microsoft 365: mail | Mailbox to Twenty, native sync | Each member, own account; the ED for workspace settings | Discovery every 5 min, import every minute | Subject and metadata (sender, participants, date); never the body for colleagues | Participant email matched to Person email |
| Microsoft 365: calendar | Calendar to Twenty, native sync | Each member | Discovery every 5 min, import every minute | Title, time, participants | Participant email matched to Person email |
| Microsoft 365: bd-ops SMTP | Twenty to people (app notifications, system mail) | Engineering lead (app variables); ED (Admin Panel) | On each notification | One line plus the record link | App key-value store dedupe key per notification |
| Lead forms: website, gala QR, workshop sign-up (0.9.0) | Form to Twenty, signed server route `lead-intake-route` | Form operator sends; engineering lead owns the route and job; the ops coordinator triages | On each submission, or batched up to 100 | Lead: name, source, source system, need, offering interest, campaign; Person: name, email, job title; Company: name, website. An existing person is linked, not changed; only an empty company is filled | `externalId` = `web:`, `gala:` or `workshop:` + the submission id, Unique; then email for the person, domain then name for the company (`19-leads.md` section 6.2) |
| SharePoint | Link only; no data moves | The record owner | When a case or contract opens; per work package output (B1) | Opportunity and Contract `sharepointFolder` (the "documentsLink"); Document `documentLink`, one record per file with its type, status, confidentiality and expiry (0.9.0, `19-leads.md` section 9); Work package `outputLink` (B1, planned); Project `sharepointFolder` (proposed) | `https://*.sharepoint.com` folder URL |
| Teams (W12) | Twenty to Teams, incoming webhook | Engineering lead (app variable); BD channel owner (webhook) | On W1, W2 reassignment, W5, W7 | One line plus the record link | App key-value store dedupe key |
| Execution service (future, G2) | Both ways: Twenty webhooks and polling out, API upserts in | Service owner; engineering lead on the Twenty side | Webhook per event; poll every 5 min; full reconciliation nightly | Work package `status` and its stamps, `version`; case `serviceCaseId` | Twenty record `id` (client-generated UUID) plus `version` |
| Second workspace or instance | None | n/a | n/a | Nothing is shared (section 8) | n/a |
| AI provider (future, G3) | Twenty to model provider | ED decision first (9.3) | n/a | None today | n/a |
| Off-host backup store | Twenty host to backup bucket | Deploy engineer | Nightly, 02:30 Asia/Dubai | Whole database dump, files bucket mirror | Dump file name plus sha256 |

---

## 2. Rules every integration follows

### 2.1 Ways in

A machine writes to Twenty in exactly one of two ways:

1. **A signed server route** in `kuec-bd-ops` (2.4): a logic function with an HTTP route trigger that verifies an HMAC signature and enqueues a background job. The job does the writes as the app.
2. **An API upsert** with a dedicated API key bound to its own least-privilege role, keyed on a Unique field (`externalId`) or on the record `id`.

Never a workflow-builder webhook trigger: it has no authentication (`kuec/CLAUDE.md` section 8). The CSV importer is the path for files a person brings (Apollo, registry), never for a machine feed.

Prefer the route. It keeps the mapping, validation and dedupe in this repository, tested, and it keeps every API key off other systems' servers. Use the API path only when the sender cannot sign requests but can call a REST API.

### 2.2 Identifiers

| Field | Type | On | Rule |
| --- | --- | --- | --- |
| `sourceSystem` | SELECT: `UVENTURE`, `APOLLO`, `REGISTRY` | Company, Person (proposed, 11); Capability (G1). Since 0.9.0 also Lead (adds `WEBSITE_FORM`, `GALA_QR_FORM`, `WORKSHOP_SIGNUP_FORM`) and Document (`UVENTURE`, `SHAREPOINT`) | The system that created the record, or the first system that matched a record that had none. Empty means a person made it, or a day-one source other than the register (section 11, item 3). Never changed once set |
| `externalId` | TEXT, Unique | Same; on Lead and Document since 0.9.0 (`web:`, `gala:`, `workshop:` for the forms) | `<system>:<id in that system>`, lower-case prefix: `registry:CN-1234567`, `apollo:5f2b9c...`, `uventure:TECH-0042`. Set together with `sourceSystem`, never changed, never reused. The prefix stops ids from two systems colliding in one unique column |

- **One external identity per record.** A company in both the registry and Apollo keeps the identity of whichever source reached it first. The other source matches it by its dedupe keys (domain, email) and never writes `externalId` or `sourceSystem`.
- **Empty is null.** A record without an external identity has `externalId` null, never `''`: the unique index covers every row. Prove on staging that two records with no `externalId` can coexist before the field ships.
- **Soft-deleted records keep their id.** The 2.48 unique index has no `deletedAt` predicate, and an upsert matches deleted records and restores them (`common-create-many-query-runner.service.ts`: `withDeleted()`, then `deletedAt: null`). A record a feed owns comes back on the next run if someone deletes it.
- **Who may write them.** `externalId`, `sourceSystem`, `serviceCaseId` and `version` are already on the lock list (`app/src/roles/utils/field-locks.ts`, `LOCKED_FIELD_NAMES`). When a field is added: `writability: OPEN` so the app, the ED, the ops coordinator and an integration key can write it; an entry in `LOCKED_FIELDS` so no other role can; `roles.test.ts` fails until both are done (`13-roles.md` section 2).

### 2.3 Field ownership and precedence

Every field has one owner. A source never overwrites a field it does not own.

| Rank | Writer | Owns |
| --- | --- | --- |
| 1 | The app (`writability: APPLICATION`) | Stamps and derived values: `stageEnteredAt`, `lastEngagementAt`, `health`, `percentComplete`, `offeredAt`... Nobody else writes them |
| 2 | The execution service, once it exists (G2) | Work package `status` and its stamps, `version` (section 7) |
| 3 | A person in Twenty | Everything a person can edit. A human edit is never overwritten by a feed |
| 4 | uVENTURE | The Capability pointer fields (G1) |
| 5 | Industrial registry | Company name, Name (Arabic), sector, size class, under the three-way rule (5.4) |
| 6 | Apollo | Nothing outright: fills empty fields only (4.2) |
| 7 | Day-one spreadsheets, contact exports, attendee lists | Fills empty fields only (`09-import.md` 2.3 ranks them below the register) |

Rank 3 above ranks 4 to 7 is enforced by how each feed writes: uVENTURE pointers are locked for people, the registry uses the three-way rule, Apollo fills empty fields only.

### 2.4 The signed server route

Every inbound route in `kuec-bd-ops` follows this contract.

| Item | Rule |
| --- | --- |
| URL | `POST https://crm.uventure.kuec.example/s/integrations/<system>/<feed>`. 2.48 serves app routes on `/s/` while `PUBLIC_DOMAIN_URL` and `LOGIC_FUNCTION_LEGACY_ROUTE_CUTOFF` are unset, the self-hosting default. Recheck both at every upgrade (`01-deploy.md` section 12) |
| Trigger | `httpRouteTriggerSettings: { path, httpMethod: 'POST', isAuthRequired: false, forwardedRequestHeaders: ['x-kuec-timestamp', 'x-kuec-signature', 'x-kuec-delivery'] }`. The signature is the authentication. On the workspace host only the listed headers reach the function |
| Signature | `x-kuec-signature: v1=<hex HMAC-SHA256(secret, timestamp + "." + rawBody)>`, `x-kuec-timestamp` in Unix seconds. Computed over `event.rawBody` (2.48 passes the raw request body to route functions), never over a re-serialised `event.body` |
| Checks, in order | Both headers present; timestamp within 300 seconds of now; signature compared with `crypto.timingSafeEqual` on equal-length buffers, against the current secret and then the previous one (rotation). Any failure: 401 with no detail, nothing logged but the delivery id and the reason code |
| Then | Validate the body's shape (400 if wrong; 413 if more than 100 records, Twenty's per-mutation maximum `MUTATION_MAXIMUM_AFFECTED_RECORDS`). Enqueue one job with `enqueueJobs` and a job id built from the delivery id, so a resent delivery is a no-op. Return 202 with the delivery id. The route writes no record |
| Job | Retries 3 times on `RetryableLogicFunctionError` (rate limit, 5xx, network). Idempotent: an upsert keyed on `externalId`; a Task only if its dedupe key is not yet in the app's key-value store (the same pattern as `04-automation.md` section 2, "Channels") |
| Secrets | App variables, `isSecret: true`: `<SYSTEM>_SIGNING_SECRET` and `<SYSTEM>_SIGNING_SECRET_PREVIOUS`. In the secrets manager under `twenty/<env>/`. Rotated quarterly with the API key (`13-roles.md` section 6): set the new one, move the old one to PREVIOUS, tell the sender, clear PREVIOUS a week later |
| Sender duties | Retries on 5xx and network errors with backoff for 24 hours; never on 4xx. Keeps 7 days of deliveries and can replay everything since a given time (used after a restore, section 10) |
| Logs | Delivery id, feed, counts, outcome. Never the body, never the signature |
| Network | The sender's address reaches `crm.uventure.kuec.example:443`. Inbound is open from the KUEC network and VPN (`it-request.md` item 3); a sender outside it needs its own inbound rule |
| Tests | Unit tests for the signature check with a fixed clock: valid, wrong secret, previous secret, stale timestamp, missing header, body changed by one byte |

### 2.5 Never delete, never pause silently

- No feed deletes a record. A source record that disappears is noticed (3.3, `lastSeenInUventureAt`), not mirrored.
- Every CSV import pauses record-triggered automation and resumes it after (`kuec/CLAUDE.md` section 8, `09-import.md` sections 3.2 and 5). Route and API feeds do not pause anything: they write as the app or a key and are idempotent.
- Every scheduled feed has a watchdog that makes a missing run visible as a Task (3.3), because a feed that silently stops looks exactly like a quiet night.

---

## 3. uVENTURE

uVENTURE is the system of record for technologies, patents, licences, equipment and industry challenges. Twenty holds pointers only.

### 3.1 What lives where

| Thing | In uVENTURE | In Twenty |
| --- | --- | --- |
| Technology, equipment | The record and all its attributes: TRL, status, inventors, patents, owners, descriptions | A Capability pointer (G1): id, name, kind, link. Nothing else |
| Patent | The record | Nothing. Reached through its technology's uVENTURE page |
| Licence | The record | A Contract (kind Licence) with contract metadata only (`kuec/CLAUDE.md` section 4), linked to the opportunity; a `uventureRecord` link to the licence (proposed) |
| Industry challenge | The record | A Pull opportunity a person opened, carrying the challenge's link in `uventureRecord` |
| A case about any of them | Nothing | The opportunity, with `uventureRecord` |

The link field is allowed today and required by `kuec/CLAUDE.md` section 5, but missing: `design/backlog.md` lists Opportunity `uventureRecord` under B4. Section 11 proposes shipping it now, and on Contract too.

### 3.2 The Capability pointer (G1)

| Field | Type | Written by | Notes |
| --- | --- | --- | --- |
| `name` | TEXT, label identifier | Sync job | The title in uVENTURE, overwritten every night. Needed so a relation picker shows something readable |
| `kind` | SELECT: `TECHNOLOGY`, `EQUIPMENT` | Sync job | Group-by needs a Select |
| `uventureRecord` | LINKS, label "uVENTURE record" | Sync job | The record's page in uVENTURE |
| `externalId` | TEXT, Unique | Sync job | `uventure:<id>` |
| `sourceSystem` | SELECT | Sync job | Always `UVENTURE` |
| `lastSeenInUventureAt` | DATE_TIME, `writability: APPLICATION`, `isAuditLogged: false` | Sync job | Stamped every run the record appears in; not audit-logged so a nightly stamp does not fill the timeline |
| Opportunity `capability` | RELATION, many to one, label "Technology or equipment" | People | The only thing people set. The inverse on Capability lists the cases |

Every role that reads Opportunity reads Capability. No person writes any Capability field: object write off for every role, and the fields above in `LOCKED_FIELDS`. Not copied, ever: status, TRL, inventors, patent numbers, owners, descriptions, licence terms. A field that is not on this list does not exist on Capability.

Undo: a Capability object cannot be removed without dropping its data (`kuec/CLAUDE.md` section 2). If G1 is reversed later, the object is deprecated, not deleted.

### 3.3 Nightly sync, uVENTURE to Twenty

- **Who sends.** A scheduled export on the uVENTURE side, owned by the uVENTURE administrator, at 01:00 Asia/Dubai (before the 02:30 backup). It sends the full list of active technologies and equipment, every night.
- **Request.** `POST /s/integrations/uventure/capabilities`, pages of at most 100:

  ```json
  {
    "runId": "2026-10-18T01:00:00+04:00",
    "page": 1,
    "pageCount": 3,
    "records": [
      { "id": "TECH-0042", "kind": "TECHNOLOGY", "title": "Low-cost desalination membrane", "url": "https://uventure.example/technologies/TECH-0042" }
    ]
  }
  ```

  Any other attribute in a record is dropped by the job, unread.
- **Functions.** `uventure-capabilities-route` (route, 2.4) enqueues `uventure-capabilities-apply` with job id `uventure-capabilities-<runId>-<page>`.
- **Job.** For each record: upsert by `externalId` as the app; create when new, update `name`, `kind` and `uventureRecord` when they differ; stamp `lastSeenInUventureAt`. Never deletes, never touches `capability` on opportunities. Records the page in the key-value store under `uventure:run:<runId>`. Logs one line: created, updated, unchanged, rejected (each rejection with the uVENTURE id and reason).
- **Gone from uVENTURE.** A record missing from tonight's list keeps its last values and its cases; its `lastSeenInUventureAt` stops moving. A Capability view "Not seen in uVENTURE for 7 days" (`lastSeenInUventureAt` before 7 days ago) is checked by the ops coordinator in the Monday sweep (`14-hygiene.md`): the case owner decides whether the case still makes sense.
- **Watchdog.** `uventure-sync-watchdog`, cron `40 3 * * *` (07:40 Asia/Dubai): if the last complete run (all pages) is older than 26 hours, a Task for the engineering lead, "uVENTURE sync has not run since {date}", deduped per day.
- **API path instead.** Only if the uVENTURE side cannot sign requests: a key `uventure-sync-<env>-<yyyy-mm>` in the inventory (`13-roles.md` section 4.1) on a new role that writes Capability only; `POST /rest/batch/capabilities?upsert=true`, at most 100 records per call, keyed on `externalId`. The mapping then lives on the uVENTURE side, outside this repository's tests, which is why the route is preferred.
- **Pull instead.** If uVENTURE can neither push nor call an API, a cron function in the app could read uVENTURE's API. That is outbound, needs an `it-request.md` section 5 line and a uVENTURE credential in app variables, and is not specified here.

### 3.4 Events, uVENTURE to Twenty: a Task for a person, never a write

Both events go to `POST /s/integrations/uventure/events` (route `uventure-events-route`, job `uventure-event-apply`). Neither changes a business record: a person reads the Task and decides. That keeps one writer per field: the Contract stays the case owner's, the decision to open a case stays a person's.

| Event | Body | Matching | Task | To | Linked to |
| --- | --- | --- | --- | --- | --- |
| `licence.signed` | `eventId`, `occurredAt`, `licence: { id, url, technologyId, licenseeName, signedOn }` | 1. A Contract whose `uventureRecord` is the licence URL. 2. Else Licence contracts on opportunities whose `capability` is `uventure:<technologyId>` or whose `uventureRecord` is the technology's URL | "uVENTURE: licence {id} signed {date}. Check the contract's status, dates and value." | Exactly one contract: its owner, else the opportunity owner, else the ops coordinator. None or several: the ops coordinator, with what was found | The contract, or the opportunities found |
| `challenge.created` | `eventId`, `occurredAt`, `challenge: { id, url, title, companyName, companyDomain }` | Company by exact domain; none if no domain or no match | "uVENTURE: new industry challenge "{title}" from {company}. Open a Pull case or record no fit." | The ops coordinator | The company, if exactly one matched |

- **What the person does.** Licence: open the Contract, check status Signed, Signed on, Expires on, Value and Counterparty against uVENTURE, correct them, close the Task. If there is no contract (a licence signed outside a Twenty case), create it or write on the Task why not. Challenge: route it to a BD officer, who opens the opportunity through Intake (tile 2, `design/backlog.md` B4 and B8) with the challenge's link, or close the Task with a "No fit" note.
- **Notification.** Task plus email from bd-ops, under 20 words with the record link, like every other notification (`12-global-features.md` section 7). No Teams post.
- **Dedupe.** Key `uventure:<type>:<licence or challenge id>` in the key-value store, so a resent or replayed event creates no second Task even with a new `eventId`.

### 3.5 Twenty to uVENTURE

Nothing automatic. The playbooks name every uVENTURE update a person makes (`app/src/playbooks/templates.json`, `uventureHandoffs`: technology set to under active marketing, then licensed; licence record created; challenge record created and linked). They are done criteria on the work package and, from B12, a Task for the named role. Twenty never calls uVENTURE.

### 3.6 Done when (if G1 is lifted)

- Unsigned, wrongly signed or 6-minute-old requests: 401, nothing enqueued.
- The same delivery twice: one job. The same licence event with a new `eventId`: one Task.
- 250 capabilities arrive as 3 pages; a rename in uVENTURE renames the pointer and keeps its cases; a record dropped from the list stays, and shows in "Not seen" after 7 days.
- A BD officer cannot edit or delete a Capability, through the UI or the API.
- No run for 26 hours: the watchdog Task appears once.

---

## 4. Apollo

### 4.1 What stays where

Sequences, steps, templates, sending, reply tracking and Apollo's own prospect database stay in Apollo. Twenty receives the companies and people BD actually works, and one Engagement per enrolment so the account's history shows the outreach. Twenty never sends anything to Apollo; a contact that exists only in Twenty is added in Apollo by hand.

### 4.2 Importing exports

1. The BD officer exports the companies (accounts) and people (contacts) from Apollo as CSV and gives the files to the ops coordinator on a KUEC device. The files never go in the repository or on a record.
2. The ops coordinator also exports the current Companies and People from their **Everything (expert)** views (ID, domain, emails, `externalId`).
3. `yarn import:prepare` reads a new input folder `apollo/` (the export files) next to the Twenty export (specified here, not built: today the script has no `apollo/` kind and cannot see records that exist only in Twenty, `09-import.md` section 7).
4. Import as a refresh (`09-import.md` section 7): automation paused, matched columns only, automation resumed, sweeps run.

Because every CSV import pauses automation, Apollo files are batched: every two weeks at most, outside working hours, plus on demand before a campaign. If that becomes a burden, the alternative is the API path (2.1) with the Automation key, which needs no pause; that is a decision for later.

**Mapping.** Apollo's id columns are expected as `Apollo Account Id` and `Apollo Contact Id`; check them on the first real export and fix the names in `column-map.csv`.

| Apollo | Twenty | Rule |
| --- | --- | --- |
| Account id | Company `externalId` = `apollo:<id>`, `sourceSystem` = `APOLLO` | Only on a company Apollo creates, or a matched one with no `sourceSystem` |
| Company name, Website | Company `name`, `domainName` | Name only on create. Domain only on create or when empty |
| Employees, Company LinkedIn URL, address | `employees`, `linkedinLink`, `address` | Fill empty fields only |
| Industry | `sector` | Only when empty, and only through a `value-map.csv` line (`sector,Oil & Energy,OIL_AND_GAS`); unmapped industries are left empty |
| (nothing) | `sizeClass`, `accountTier`, `isOffsetObligor`, Account owner | Never from Apollo |
| Contact id | Person `externalId` = `apollo:<id>`, `sourceSystem` = `APOLLO` | As for companies |
| First name, Last name, Title, Phone, Person LinkedIn URL | `name`, `jobTitle`, `phones`, `linkedinLink` | Fill empty fields only. Decision role from the title by keyword, as on day one |
| Email | `emails.primaryEmail` | Only when Apollo's email status is verified. Otherwise left empty and the person is matched by name and company |
| Company of the contact | Person `company` | By the company's ID after matching |

**Dedupe**, in this order, then exactly as `09-import.md` section 2.3:

1. `externalId` already in Twenty: that record, even if its domain or email changed in Apollo.
2. Companies: website domain, then name with case, punctuation and legal suffixes removed. Same name, different websites: two companies, reported as ambiguous. Public and ISP mail domains never identify a company.
3. People: email, then name plus company. Same name at the same company with different emails: two people, reported. Neither email nor company: rejected.
4. A row that matches a Twenty record by one key and a different record by another is not imported; it goes to `dedupe-report.csv` as ambiguous.

**Precedence.** Apollo ranks last of the external sources (2.3): it fills empty fields and never overwrites one, whatever its value. A disagreement between Apollo and Twenty on a non-empty field is reported in `dedupe-report.csv` as a warning, not written.

Work contacts only: no personal email addresses or personal mobiles from Apollo. A person who asks to be removed is deleted in Apollo by the BD officer and in Twenty by the ops coordinator.

### 4.3 Logging an enrolment

When a BD officer enrols contacts in a sequence, they log one Engagement per company per sequence, the same day:

| Field | Value |
| --- | --- |
| Subject | `Apollo: <sequence name>` |
| Kind | **Email** (`EMAIL`; the option for an email thread) |
| Date | The enrolment date |
| Company | Required |
| Opportunity | The case the outreach serves, if any (for example the licence playbook's Outreach step) |
| Owner | The BD officer |
| Outcome | Written at logging: "Enrolled N contacts; replies tracked in Apollo" |

- **Why the outcome is written at once.** Without it, every enrolment would sit in **Hygiene: outcome overdue** two days later (`14-hygiene.md` view 4), and sequences run for weeks.
- **A reply** is a conversation: log it as its own Engagement (Call, Meeting or Email) with its real outcome and next step. W11 copies the next step to the opportunity.
- **Side effect to know.** W11 stamps the company's Last engagement from the enrolment date, so an enrolled Tier 1 or Tier 2 account leaves the dashboard's "not engaged in 60 days" list even if nobody answers. If the ED wants enrolments not to count, W11 has to filter them, which needs `sourceSystem` on Engagement (11, scenario B).
- **Not logged.** Individual sequence steps. If Apollo sends through the member's connected Outlook mailbox, those messages sync into Twenty on their own at Subject and metadata (section 6).
- **Automating it later.** Only through a signed route (2.4). If Apollo cannot sign its requests, enrolment logging stays manual.

---

## 5. Industrial registry

### 5.1 Cadence

Quarterly, in the second week of January, April, July and October (the first week holds the access review and key rotation, `13-roles.md` section 6). The ops coordinator runs it with `09-import.md` sections 2 to 6, register files in `register/` as on day one, plus the two extra inputs of 5.4.

New companies are created only for clusters the ED has asked BD to cover; the rest stay in the register. Every created company has no Account owner, so it lands in **Hygiene: missing key fields** (`14-hygiene.md` view 2) until one is set.

### 5.2 Identity

`externalId` = `registry:<registration or trade licence number>`, `sourceSystem` = `REGISTRY`, on companies the registry creates, and on day-one register companies once the fields exist (section 11). A register row with no stable number is matched by domain, then normalised name (`09-import.md` 2.3), and gets no `externalId`: no id is made up.

### 5.3 Fields the registry may write

| Field | Rule |
| --- | --- |
| `name` (legal name in English, `14-hygiene.md` naming rule) | Three-way (5.4) |
| `nameArabic` | Three-way |
| `sector` | Three-way |
| `sizeClass` | Three-way. Register values go through a `sizeClass` mapping in `scripts/import/target-values.ts` (today they are held, `09-import.md` section 8) |
| `domainName` | On create, or when empty. Never changed afterwards: it is the dedupe key and unique |
| `address`, `employees` | Fill empty only |
| Everything else | Never: account tier, owner, offset obligor, keywords, every relation |

### 5.4 Precedence: never overwrite a human edit

For each three-way field the script compares three values:

- **B**, base: what the previous registry import wrote. From the previous run's snapshot `registry-snapshot-<yyyy>-q<n>.csv` (ID plus the three-way fields), kept in the import folder on the KUEC device for two quarters. The first base is the day-one prepared `01-companies.csv` (section 11 proposes keeping it).
- **T**, Twenty now: from a fresh export of Companies > Everything (expert).
- **R**, register now.

| Case | Result |
| --- | --- |
| R empty | No change. A blank cell leaves the field as it is |
| T empty | Write R |
| T equals B: nobody changed it since the last import | Write R |
| T differs from B: a person changed it | Keep T. Listed in `registry-conflicts.csv` (ID, field, B, T, R) for the ops coordinator to take to the account owner. Never written |
| No B for this record (made by a person, or no snapshot) | Treated as a human value: write R only if T is empty |

The refresh file carries ID plus only the cells to write; every other cell is blank, and every column not being updated is set to **Do not import** on Match columns (`09-import.md` section 7).

Why not use Twenty's own history: `updatedBy` is per record, not per field, and a CSV import run by the ops coordinator is attributed to the ops coordinator, so an import and a hand edit look the same.

### 5.5 Checks after the refresh

`09-import.md` section 6, plus: the count in **Hygiene: missing key fields** for Companies rose by at most the number of companies created; `registry-conflicts.csv` reviewed and sent to the account owners; the new snapshot saved and the one from two quarters ago deleted.

---

## 6. Microsoft 365

### 6.1 Sign-in, mail and calendar: native sync

- **Sign-in.** One Entra app, multitenant with "Assignment required" (`01-deploy.md` G4, `it-request.md` item 1). Delegated Graph scopes: `Mail.ReadWrite`, `Mail.Send`, `Calendars.ReadWrite`, `User.Read` and the OpenID scopes. No `Files.*` or `Sites.*`: Twenty cannot read SharePoint or OneDrive.
- **Sync.** Each member connects their own account (`config/dashboards/email-calendar-sync.md`): email visibility Subject and metadata, contact auto-creation None, calendar visibility Everything, internal email off. Twenty polls Graph: discovery every 5 minutes, import every minute (`01-deploy.md` section 6). Push sync is off; Microsoft never calls Twenty.
- **Where it shows.** Person and Company by participant email; Opportunity only through its Point of Contact. Engagement, Project, Contract and Work package have no mail tab, so every engagement and project carries its Company (`12-global-features.md` section 6).
- **Sending from Twenty** is off for every role (`13-roles.md` decision 10). People write from Outlook and the mail syncs in.

### 6.2 bd-ops: automation sender

App notifications (W1 to W10) and Twenty's system mail (invitations, password resets) both send through `smtp.office365.com:587` as bd-ops with an app password: the app through its SMTP variables (`app/src/automation/notifications/send-email.ts`), Twenty through the Admin Panel. **Microsoft disables basic SMTP AUTH by default for existing tenants at the end of December 2026** (`01-deploy.md` G5). `it-request.md` item 2 asks IT to keep it enabled for bd-ops or provide a relay connector; the answer is needed before 1 December 2026 (section 11, item 7).

### 6.3 SharePoint: the only document store

- Documents live in SharePoint and nowhere in Twenty (`kuec/CLAUDE.md` section 4). Upload files is off for every role but engineers (`13-roles.md` decision 9) and the Files tab is hidden.
- **Link fields**, all `LINKS` and labelled by destination:

  | Object | Field | Status |
  | --- | --- | --- |
  | Opportunity | `sharepointFolder`, "SharePoint folder" | Built (0.5.0); the record page shows it as a card |
  | Contract | `sharepointFolder`, "SharePoint folder" | Built; the import's `documentsLink` column fills it |
  | Work package | `outputLink`, "SharePoint link" | Planned, B1 |
  | Project | `sharepointFolder`, "SharePoint folder" | Missing; proposed (section 11) |

- A folder link per case, not a file link. Only `https://*.sharepoint.com` addresses: the import enforces it; the UI does not, so B1's soft warning covers the card.
- Access is SharePoint's: a link in Twenty grants nothing. A member without access to the folder sees a link that does not open, and asks the owner.
- The field keeps its API name `sharepointFolder`. API names never change (`kuec/CLAUDE.md` section 2), so "documentsLink" stays an import column name.

### 6.4 Teams: incoming webhook (W12)

- One BD channel, one incoming webhook. W1 (playbook started), W2 (reassigned after 5 business days), W5 (blocked) and W7 (signed) post one line with the record link (`12-global-features.md` section 7).
- URL in the app variable `TEAMS_WEBHOOK_URL` (secret), from the secrets manager; rotated with the quarterly key rotation.
- The payload carries plain `text` and an Adaptive Card (`app/src/automation/notifications/post-to-teams.ts`), so a classic connector URL and a Teams Workflows URL both accept it. 429 and 5xx retry; other 4xx are logged as `failed permanently` and do not block the escalation. Dedupe per escalation in the key-value store.
- Nothing comes back from Teams: no bot, no outgoing webhook, no message extension.
- **Gap today:** `it-request.md` section 5 allows outbound connections to listed hosts only, and the Teams webhook host is not listed. Until it is, every Teams post fails on the network (section 11, item 6).
- `design/backlog.md` names a planned function `w12-stage-follows-step`. W12 already means this channel in the runbooks, so that function should take a free number (section 11, item 8).

---

## 7. The future execution service (G2)

A separate service that would own case execution: the work package lifecycle and its timers. Not built and not allowed in Phase A or B. This section fixes what Twenty promises it, so nothing built before then gets in the way.

### 7.1 What is already reserved

`version` and `serviceCaseId` are on the lock list (`field-locks.ts`, `LOCKED_FIELD_NAMES`) with `externalId` and `sourceSystem`; `roles.test.ts` forces the lock the day a field with one of those names is added (`13-roles.md` decision 7). No field exists. When the service exists:

| Field | Type | On | Meaning |
| --- | --- | --- | --- |
| `serviceCaseId` | TEXT, Unique | Opportunity, Project (the playbook cases) | The case's id in the service. Empty: the case is run by Twenty's own automation |
| `version` | NUMBER | Work package; Milestone if the service owns milestone status | The service's version of the record, incremented on every change it makes. Twenty never writes it |

Both `writability: OPEN` and locked for every person role, as in 2.2.

### 7.2 Status becomes a projection

Once a case has a `serviceCaseId`, its work packages' `status` and the stamps that go with it (`offeredAt`, `acceptedAt`, `submittedAt`, `blockedAt`, `completedAt`, `blockedReason`, `declinedReason`) are a projection of the service's state:

- **One writer.** Only the service's API key writes them. They join `LOCKED_FIELDS` for every role, including the BD officer, who writes status today (`13-roles.md` decision 4). Whether `ownerId` and `dueAt` move too is decided at cut-over; the default is yes, because reassignment and re-dating drive the timers.
- **People act through the service.** Accept, Decline, Submit, Block and Done on the work package card (B1) call the service, which then writes the new status back. All the card's status writes already sit in `front-components/work-package-card/work-package-card-api.ts`; keeping them there makes the swap one file.
- **Twenty's handlers stand down for those work packages.** W02, W03, W05, W06, `work-package-transition-log` and `timer-sweep` skip work packages whose case has a `serviceCaseId`; the service owns acceptance and overdue timers then. Opportunity-level rules stay in Twenty: W04, W07, W08, W11. The branch is on a property of the case, not on a migration flag.
- **Cut-over per case.** New cases go to the service; open cases finish where they started.
- **Business days.** The service uses the same definition (Asia/Dubai, Monday to Friday, the holiday list). The holiday list stays in Twenty (`publicHoliday`) and the service reads it.

### 7.3 Contract

**Twenty to the service: webhooks, the fast path.** One webhook in Settings > APIs & Webhooks on the work package, opportunity, project and milestone events. 2.48 signs each call (`metadata-modules/webhook/jobs/call-webhook.job.ts`): `X-Twenty-Webhook-Signature` = hex HMAC-SHA256(secret, `<timestamp>:<JSON body>`), `X-Twenty-Webhook-Timestamp` in milliseconds, `X-Twenty-Webhook-Nonce`. It waits 5 seconds and never retries. The service verifies over the raw body it received, rejects timestamps older than 5 minutes, remembers nonces for 10 minutes, and treats a webhook as a hint: it re-reads the record before acting. The service's address must be reachable from the Twenty host and on `it-request.md` section 5.

**Twenty to the service: polling, the guarantee.** Webhooks get lost (no retry, 5-second timeout, restarts). Every 5 minutes, per object:

- List records with `updatedAt` at or after the cursor minus 2 minutes, ordered by `updatedAt` then `id`, pages of at most 200 (`QUERY_MAX_RECORDS`).
- Skip any `(id, updatedAt)` already processed; advance the cursor to the highest `updatedAt` processed. The 2-minute overlap covers clock skew and transactions still committing.
- A second query on `deletedAt` catches soft deletions.
- Nightly, a full reconciliation of every open work package: `id`, `status`, `version` on both sides, differences repaired and logged.

**The service to Twenty: upserts.**

- `POST /rest/batch/<objects>?upsert=true` (or GraphQL `create<Objects>(data, upsert: true)`), at most 100 records per call, keyed on `id`.
- **Client-generated UUIDs.** Whoever creates a record generates its UUID. Records the service creates are sent with the service's UUID as their Twenty `id`; records Twenty created (W01) keep theirs and the service adopts it. No mapping table, and a retried create is an update.
- Every write carries the new `version`. The service writes one record's versions in order. Twenty's API has no compare-and-set, so ordering is the writer's job; the reconciliation re-pushes any record whose `version` in Twenty is behind the service's, which also repairs Twenty after a restore (section 10).
- Idempotent: writing the same values again changes nothing and fires no event.
- Retries with backoff on 429 and 5xx; 4xx is a bug and stops that record.

**Keys.** Its own API key, `execution-service-<env>-<yyyy-mm>`, on its own role: writes the projected work package fields and creates work packages; reads opportunities, projects, milestones, members and holidays. In the key inventory before it is created.

### 7.4 Rate limits to raise then

| Setting | Today | Then |
| --- | --- | --- |
| `API_RATE_LIMITING_LONG_LIMIT` (all API-key traffic on the instance, per 60 s) | 600 (`admin-panel-config-variables.md`) | 1,200. Steady state needs far less (about 1 polling request a minute, transitions in single digits per hour), but in 2.48 every API key in the workspace counts against one shared counter (`usage-limit/utils/build-speed-bucket-key.util.ts`), so the cut-over backfill and the nightly reconciliation compete with the Automation key and any uVENTURE key. Per-key limits need the Organization plan (`01-deploy.md` G7) |
| `API_RATE_LIMITING_SHORT_LIMIT` (per second) | 100, default | Unchanged. The service stays under 50 a second |
| `APPLICATION_API_RATE_LIMITING_LIMIT` (the app's own token, per 60 s) | 500, default | Unchanged unless the sweeps log 429s |
| Service's own budget | n/a | 300 requests a minute, client-side, so it never starves the Automation key |

Raise the limit in the Admin Panel the day before cut-over and record it in `admin-panel-config-variables.md`.

---

## 8. One workspace or several

### 8.1 The default

One workspace, and a **department value** on the record: the same app, the same companies and people, one pipeline that can be filtered and grouped by department. Today the departments exist as roles only (IP office, Leasing, Lab access, Startups and investment, `13-roles.md`); there is no department field, so it is proposed in section 11.

Additional workspaces are treated as an Organization-plan feature (`kuec/CLAUDE.md` section 3) and nothing is designed on them. The 2.48 code refuses only a sixth workspace without a key, and only in multi-workspace mode, which needs `IS_MULTIWORKSPACE_ENABLED=true`, a subdomain per workspace and wildcard DNS and TLS (`01-deploy.md` G3); this instance runs single-workspace mode. We do not build on that gap.

### 8.2 The test

Ask in order. The first yes decides.

| # | Question | If yes |
| --- | --- | --- |
| 1 | Is it a different legal entity or data controller: another university, an external partner, a company KUEC does not control? | **Its own instance**, not a workspace on ours: its own encryption key, backups, administrators and upgrade calendar |
| 2 | Must all of its records be hidden from KUEC BD members, not merely irrelevant to them? | **Its own workspace** (a plan decision first). If only one class of records must be hidden, a separate object with its own role access is enough (`13-roles.md` section 5) |
| 3 | Does it work the same companies and contacts as KUEC BD, so that two teams could contact one client without knowing? | **Department value.** Shared accounts are the reason to stay together, and this wins over question 4 |
| 4 | Does it need a data model or playbooks that contradict `kuec-bd-ops` (same object, incompatible stages or rules)? | **Its own workspace.** Extra options or extra playbooks are not a contradiction: extend the app |
| 5 | None of the above | **Department value** |

Examples: the four commercialization departments, department value (questions 3 and 5). A KU college's industry-liaison office working the same accounts: department value. A subsidiary that is its own company with its own confidentiality obligations: question 1, its own instance; an operating unit that is not a separate entity: department value. Another university: its own instance.

### 8.3 What cannot be shared across workspaces

- **Records.** No relation, search, view, dashboard or merge across workspaces. The same company is two records; nobody sees that the other team has contacted it.
- **People's access.** One login can belong to several workspaces, but roles, views, favourites and connected accounts are per workspace. A mailbox connected in two workspaces is synced twice, with two sets of visibility settings.
- **The app and its data.** `kuec-bd-ops` is installed per workspace: its variables (SMTP, Teams webhook), playbook role assignments, holiday list and key-value store are per workspace and kept up by hand in each.
- **Keys and webhooks.** API keys, webhooks and every integration in section 1 are per workspace; each feed has to be pointed at the right one.

And what a second workspace on the same instance cannot separate: the Twenty version and upgrade window, `ENCRYPTION_KEY`, the Admin Panel settings (SMTP, the instance-wide rate limit), `LOGIC_FUNCTION_TYPE`, the Entra app and the nightly dump, which holds every workspace (restoring one alone is a manual, per-schema job). That is why question 1 sends another organisation to its own instance.

---

## 9. AI, later (G3)

### 9.1 Today

Off everywhere: no provider keys in `.env` or the Admin Panel, `CODE_INTERPRETER_TYPE=DISABLED`, no role holds the AI or AI settings permission (`13-roles.md` section 1), no AI provider on the outbound list (`it-request.md` section 5). Until 9.3 is decided, nobody connects an AI client (an MCP client, an assistant plugin) to production with their own credentials either: that would send record data to that client's provider.

### 9.2 Where Twenty's own agents and tools would plug in

Read from the 2.48 source, not tested. Three mechanisms: app-defined agents (`defineAgent`: a prompt, a response format, its own role, database-event or cron triggers); logic functions exposed to agents as tools (`toolTriggerSettings`); and the workspace MCP endpoint (`engine/api/mcp`) for external clients. Providers are configured by key or by `AI_PROVIDERS` (custom endpoints and regions).

| Use | Plugs in at | Reads | Writes | A person still |
| --- | --- | --- | --- | --- |
| Intake classification | `intake-preview` (B4) calls an app agent on the pasted request text | Request text, company names | Nothing: a suggested tile (playbook type), sector, company match and client deadline, shown in the preview | Confirms or changes every suggestion; Confirm stays a click |
| Inbound mail triage | A cron agent over new bd-ops threads (subject and metadata) | Subject, sender, date | A Task "Looks like an RFQ from {company}: open a case?" for the ops coordinator | Opens the case through Intake |
| Drafting | A tool on the work package card, an engagement and the weekly update | The record's fields and notes | A draft in the card's unsent-draft slot (`front-components/shared/unsent-draft.ts`) or a Note marked draft | Edits and sends from Outlook; nothing is sent automatically |
| Not for AI | Stage, status, owner, escalations, lost reasons, anything a rule in `kuec/CLAUDE.md` section 7 decides | | | |

Each agent gets its own role: read what it needs, write only Tasks and Notes, never the projected or locked fields.

### 9.3 The decision that comes first

Before any provider key is set, the ED, KUEC IT security and the data protection lead record a data-residency decision answering:

1. **Provider and processing region.** Which provider, and whether processing must stay in the UAE (or a named region), for which data classes.
2. **Terms.** No training on KUEC data; retention of prompts and outputs (zero, or how long); sub-processors.
3. **Data classes allowed.** Record metadata; Notes; synced mail subjects and participants (personal data); pasted request text. And what is never sent: documents. Contracts, proposals and IP disclosures are not in Twenty (`kuec/CLAUDE.md` section 4) and must not reach a model through Twenty, including as text pasted into a Note or Intake, and no AI feature fetches a SharePoint link.
4. **Logs.** Agent conversations are stored in the workspace database and therefore in every backup for 35 days (section 10); who can read them.
5. **Who gets it.** Which roles hold the AI permission; whether external MCP clients are allowed at all.

Then, and only then: the provider configuration, one `it-request.md` section 5 line per provider host, the AI permission on the named roles, and `kuec/CLAUDE.md` section 6 amended.

---

## 10. Backups, retention and the quarterly restore test

### 10.1 What is backed up

Nightly at 02:30 Asia/Dubai (`30 22 * * *` UTC), `config/deploy/scripts/backup.sh`: a `pg_dump -Fc` of the whole database (core, metadata and the workspace schema), checked for table data, with a sha256, copied off-host; then the files bucket mirrored off-host, overwritten or deleted objects kept aside (`01-deploy.md` section 10). Redis is not backed up: queues and cron schedules are rebuilt by `cron:register:all`. A backup is useless without `ENCRYPTION_KEY`, which lives in the secrets manager only.

**Recovery point:** up to 24 hours of work. **Recovery time:** proposed target 4 hours from decision to a working instance, measured at each drill (10.4). If the ED needs less than a day of possible loss, that is continuous WAL archiving, a separate change.

### 10.2 Retention

| What | Kept | Where set |
| --- | --- | --- |
| Database dumps on the host | 14 | `backup.sh` |
| Database dumps off-host | 35 days | `backup.sh` |
| Files: overwritten or deleted objects off-host | 35 days | `backup.sh` |
| Deleted records in Twenty (Deleted filter) | 14 days, then destroyed (workspace `trashRetentionDays`, 2.48 default) | Workspace setting; unchanged. A deleted record is recoverable from Deleted for 14 days and from a backup for 35 |
| Synced mail and calendar | While the member's account is connected. Removing the account deletes messages no other account shares | `email-calendar-sync.md` |
| Logic function logs | Not stored; streamed while watched. Worker log per Docker's log settings | `04-automation.md` section 4 |
| Queue history | Completed jobs 4 hours, failed jobs 7 days | BullMQ defaults |
| Import working files | Deleted after import, except `dedupe-report.csv` and `rejected-opportunities.csv` until resolved | `09-import.md` section 9 |
| Registry snapshot | Two quarters | 5.4 |
| uVENTURE, Apollo, registry data | In their own systems; not Twenty's to keep | |

### 10.3 After a restore, per integration

- **Mail and calendar** resume from their stored cursors.
- **uVENTURE.** The next nightly run brings Capability back up to date. Events delivered after the dump are lost with it: ask the sender to replay everything since the dump's time (2.4, sender duties). Dedupe keys were rolled back with the database, so each lost Task is created again, once.
- **Execution service.** Twenty is behind the service. The nightly reconciliation (7.3) re-pushes every record whose `version` is behind; run it by hand at once.
- **Escalations.** Stamps are as of the dump, so the sweeps may send some reminders a second time. Run `timer-sweep` and `derived-dates-sweep` (`04-automation.md` section 3). A duplicate reminder is accepted; a missed one is not.
- **Apollo and registry** imports done after the dump: re-import the same prepared files.

### 10.4 Tests

- **Monthly and before every upgrade:** `scripts/restore-test.sh`, as today (`01-deploy.md` section 10). It proves the newest dump restores and boots with the prod `ENCRYPTION_KEY`.
- **Quarterly: a full restore drill**, in the first week of January, April, July and October with the access review (`13-roles.md` section 6). The deploy engineer and the ops coordinator, about 3 hours.
  1. A scratch host or VM from IT, not the staging instance (prod data never goes to staging, `01-deploy.md` section 11).
  2. Follow "Full disaster restore" in `01-deploy.md` section 10: compose and `.env` from the repository and the secrets manager, the same `ENCRYPTION_KEY`, `pg_restore` of last night's dump, `rclone sync` of `files/current`.
  3. Guard rails before the first `up`: `SERVER_URL` a scratch name, `LOGIC_FUNCTION_TYPE=DISABLED`, `DISABLE_CRON_JOBS_REGISTRATION=true` on server and worker, `EMAIL_DRIVER=LOGGER`. The restored app variables still hold the prod SMTP password and Teams webhook; with functions disabled they are never used. No mailbox is connected and no webhook is registered.
  4. Checks: `verify-config.sh`; per-table row counts equal to prod at the dump's time (the T7 method, `tests/acceptance/t7-backup-restore.sh`); five records per object read through the API on both instances and compared; `upgrade:status` clean; the files backup holds at least as many objects as the live bucket.
  5. Measure: time from start to the last check (recovery time) and the dump's age (recovery point).
  6. Tear the host down; delete the scratch copy of the data.
  7. Record it:

| Quarter | Dump | Table counts match | Records compared | Files backup / live | Recovery time | Recovery point | By |
| --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | |

A failed check is an incident: fix the backup path the same week and repeat the drill.

---

## 11. What today's configuration would have to change, and what to change now

### 11.1 By scenario

| Scenario | Today's choice | Would have to change | Cost later | Now? |
| --- | --- | --- | --- | --- |
| A. uVENTURE sync (G1) | `kuec/CLAUDE.md` section 5; the decision of 2026-10-15 (`05-views.md`); `12-global-features.md` rows 1, 5, 10; `01-deploy.md` section 9 | Amend section 5 and those runbooks; add Capability (3.2), the routes, the watchdog, the signing secrets | Text and new entities; nothing existing moves | No: the ED's decision. This spec is ready for it |
| A. | Opportunity has no uVENTURE link (B4); Contract has none | Licence matching (3.4) needs both | Every open case and licence edited by hand | **Yes, items 1 and 2** |
| A, B, C | No `externalId` or `sourceSystem` field; names only reserved | Every feed upserts and matches on them | Backfilling every company and person from the original source files, if they still exist | **Yes, item 3** |
| C. Registry refresh | Refresh = `09-import.md` section 7: no base snapshot, so a refresh cannot tell a human edit from an old import | Three-way rule (5.4) needs the day-one base | Without it the first refresh can only fill empty fields | **Yes, item 4** |
| C | Register size values held, not imported | Mapped before the first refresh | None: the three-way rule writes them where Twenty is empty | No |
| B. Apollo | No `apollo/` input in the prepare script; script cannot see Twenty-only records | 4.2 steps 2 and 3 | Script work either way | No: build with the first Apollo batch |
| B | Engagement has no `sourceSystem`; W11 counts every engagement | Only if enrolments must not count as engagement, or enrolment logging is automated | A field and a W11 filter | No |
| B | "Hygiene: outcome overdue" lists every engagement without an outcome after 2 days | Enrolment engagements carry an outcome at logging (4.3) | Noise in the Monday sweep | **Yes, item 9** (a line in the team guide) |
| D. Microsoft 365 | Teams webhook host missing from `it-request.md` section 5 | Teams posts are blocked today | Every Teams post fails | **Yes, item 6. Due now, not future** |
| D | SMTP AUTH with an app password for app and system mail | Relay connector or tenant exception by the end of December 2026 | All email notifications stop | **Yes, item 7. Due now** |
| D | Project has no SharePoint folder field | Delivery projects need one (B13 assumes it) | Every project edited by hand | **Yes, item 5** |
| D | Backlog function `w12-stage-follows-step` | W12 already names the Teams channel | Confusion in runbooks and logs | **Yes, item 8** (free before it is built) |
| E. Execution service (G2) | BD officer and card write work package status | Status and stamps locked for people; card actions go to the service (7.2) | One role file and one card module | No: keep every status write in `work-package-card-api.ts` |
| E | `version`, `serviceCaseId` reserved, no fields | Added at cut-over (7.1) | None | No: an unused field is noise |
| E | W02, W03, W05, W06, transition log and timer sweep own every work package | Skip cases with a `serviceCaseId` | One guard per handler | No |
| E | `API_RATE_LIMITING_LONG_LIMIT=600` | 1,200 at cut-over (7.4) | A setting | No |
| F. Another department, subsidiary or university | Departments exist as roles only; no department value on records | Department value on cases (8.1) | Every record classified by hand, and dashboards rebuilt | **Yes, item 10** |
| F | One instance in single-workspace mode | Another organisation gets its own instance (8.2) | A new deployment | No |
| G. AI (G3) | Everything AI off (9.1) | Provider, outbound line, AI permission, CLAUDE.md section 6, after 9.3 | Configuration only | No |
| H. Backups | Restore test monthly, scripted only | Quarterly full drill (10.4) | None; the risk is finding out during a real loss | **Yes, item 11** |
| H | Trash 14 days, backups 35 days | Nothing | | No |

### 11.2 Proposed now, while it is cheap

Manifest items are additive and ship in one app release (0.8.0), with `roles.test.ts` and the affected runbooks updated in the same change.

1. **Opportunity `uventureRecord`** (LINKS, "uVENTURE record"), shipped now instead of with Intake (B4). `kuec/CLAUDE.md` section 5 already requires it and it is missing. The API name is `uventureRecord`, not `uventureLink`: it matches the backlog and names the destination like `sharepointFolder`, and it cannot be renamed later.
2. **Contract `uventureRecord`** (LINKS, "uVENTURE record"): the licence's uVENTURE page, so a signed licence can be matched to its contract (3.4) and Legal has the link in one place.
3. **Company and Person `externalId`** (TEXT, Unique) **and `sourceSystem`** (SELECT `UVENTURE`, `APOLLO`, `REGISTRY`), per 2.2: `writability: OPEN`, added to `LOCKED_FIELDS`. Then one refresh (ID, External id, Source system only) stamps day-one register companies with `registry:<number>` while the register files are at hand. Prove on staging first that two records with an empty `externalId` coexist.
4. **Keep the day-one register base.** Save the day-one prepared `01-companies.csv` (ID, name, Name (Arabic), sector, size class) as `registry-snapshot-day-one.csv` in the import folder. It is the B of the first quarterly three-way merge (5.4). No code.
5. **Project `sharepointFolder`** (LINKS, "SharePoint folder") with the same record-page card as Opportunity and Contract.
6. **`it-request.md` section 5:** add the host of the BD channel's webhook URL (a `*.webhook.office.com` connector or the Teams Workflows host the URL names), port 443, "Teams posts (W12)". Then post a test line from staging.
7. **SMTP AUTH:** get IT's written answer to `it-request.md` item 2 (tenant exception or relay connector) before 1 December 2026, and test the chosen path on staging before the end of December.
8. **`design/backlog.md`:** rename the planned `w12-stage-follows-step` to `w19-stage-follows-step` (W13 to W18 are taken), so W12 keeps meaning the Teams channel.
9. **Team guide (`10-cadence-en.md`, `10-cadence-ar.md`):** one line under logging engagements: an Apollo enrolment is one Engagement per company per sequence, Kind Email, with its outcome written at once (4.3).
10. **`department`** (SELECT, default `BD`; options `BD`, `IP_OFFICE`, `LEASING`, `LAB_ACCESS`, `STARTUPS_AND_INVESTMENT`, matching the department roles) on Opportunity, Project and Contract. Existing records get `BD` through one ID-and-Department refresh. Add Department as a group-by to the pipeline and portfolio views where the ED wants it. This is the answer to section 8 for every department, and it costs one field now instead of reclassifying every record later.
11. **Quarterly restore drill** (10.4) on the calendar for the first week of January 2027, with the access review, and its record table kept in this runbook.

Not proposed now: the Capability object and everything else under G1, G2 and G3. Each waits for its rule in `kuec/CLAUDE.md` to change.
