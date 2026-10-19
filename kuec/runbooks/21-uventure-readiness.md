# 21: uVENTURE readiness

Written against Twenty 2.48.0 and `kuec-bd-ops` 0.11.0. Owner: the engineering lead. Decisions: the ED. Readers: engineers, the ops coordinator, the ED, the uVENTURE administrator, KUEC IT.

How the CRM and uVENTURE become one product for the commercialization vertical: one site for the browser, one person per email on both sides, one taxonomy, data contracts in both directions with one owner per record type, best-practice packs shipped as app content, and the checklist the ED signs before the pilot.

**What changed on 2026-10-17.** Gate G1 of `16-integration-map.md` is lifted: `kuec/CLAUDE.md` section 5 now allows a Capability pointer and signed uVENTURE feeds, with uVENTURE still the system of record. `kuec-bd-ops` 0.11.0 builds sections 1 to 5 of this runbook. Nothing in uVENTURE is copied beyond the fields named in section 4.

Contents

0. What 0.11.0 ships
1. Domain and embedding
2. Identity
3. One taxonomy
4. Data contracts
5. Best-practice packs
6. Pilot readiness checklist
7. Other files this changes

---

## 0. What 0.11.0 ships

| Area | In the manifest | Outside it (click-runbook or other system) |
| --- | --- | --- |
| Embedding and navigation | uVENTURE page (sidebar **uVENTURE**, three iFrame tabs), **Capabilities** and **Open uVENTURE** sidebar items | Settings > Security iframe origin (`config/dashboards/iframe-embedding.md`); uVENTURE's own menu and `frame-ancestors` (section 1.5, 1.6) |
| Identity | Roles **Commercialization** (department) and **uVENTURE reader** (API key) | Role map `config/roles/uventure-role-map.json` confirmed by the uVENTURE administrator; reader key (`config/dashboards/uventure-api-key.md`) |
| Taxonomy | Lists Capability status and Campaign channel, option Invention disclosure; route `uventure-lookups-route` | `kuec/playbooks/diff-lookups.ts` for the quarterly review |
| Data model | Object **Capability** (pointer); object **Campaign target**; Capability relation on Opportunity, Engagement and Contract; uVENTURE record link on Opportunity, Contract and Lead; External id and Source system on Contract; campaign fields on Project | none |
| uVENTURE to Twenty | `uventure-route`, `uventure-event-job`, `uventure-sweep` | The uVENTURE sender (section 4.2) |
| Twenty to uVENTURE | `uventure-outbound-opportunity`, `-lead`, `-engagement`, `uventure-outbound-job` | uVENTURE's endpoint and its nightly read (section 4.3) |
| Packs | CRM, PM and GTM pack content: views, three BD dashboard tabs, guidance, `c01-stage-exit-check`, `p01-raid-log`, `p02-weekly-review`, `g01-campaign-targets`, `packs-sweep`; switches `CRM_PACK_ENABLED`, `PM_PACK_ENABLED`, `GTM_PACK_ENABLED` | Playbooks `kuec/playbooks/crm-pack.md`, `pm-pack.md`, `gtm-pack.md` |
| Variables | `UVENTURE_SIGNING_SECRET` (and `_PREVIOUS`), `UVENTURE_WEBHOOK_URL`, `UVENTURE_OUTBOUND_SIGNING_SECRET`, the three pack switches | Values per instance: `config/dashboards/kuec-bd-ops-variables.md` |

Everything is additive (`kuec/CLAUDE.md` section 2): `npx twenty plan` shows creations and label changes only. Tests: `yarn test:unit` in `kuec/app` (uVENTURE feed `src/automation/uventure/uventure.test.ts`, packs `src/automation/rules/pack-rules.test.ts` and `src/packs/packs.test.ts`, roles and the role map `src/roles/*.test.ts`).

---

## 1. Domain and embedding

### 1.1 Hosts

| Environment | uVENTURE | Twenty (`SERVER_URL`) |
| --- | --- | --- |
| Production | `https://uventure.<domain>` (examples here: `uventure.kuec.example`) | `https://crm.uventure.<domain>` (`crm.uventure.kuec.example`) |
| Staging | `https://uventure-staging.<domain>` | `https://crm.uventure-staging.<domain>` |

Twenty is a subdomain of uVENTURE's host, so both have the same registrable domain and the browser treats them as **one site**. That is what makes embedding work signed in: Twenty keeps its session in a `SameSite=Lax` cookie (`twenty-front/src/utils/cookie-storage.ts`), which the browser sends to a same-site iframe and withholds from a cross-site one. Put Twenty on another domain and every embedded view shows the sign-in page.

`SERVER_URL` is public: the uVENTURE servers reach it on 443 for the signed routes (`config/deploy/it-request.md` section 3), and people reach it from the KUEC network and VPN. The DNS record, TLS certificate, Entra redirect URIs and inbound rules are in `config/deploy/it-request.md`; the proxy is `config/deploy/Caddyfile.example`.

### 1.2 If Twenty already runs on another host

Moving `SERVER_URL` after the first deploy, in one window:

1. IT adds the new redirect URIs to the Entra app (`it-request.md` item 1) before the switch; the old ones stay a week.
2. DNS and TLS for the new host; the proxy serves both names, the old one answering `308` to the new one so a form that posts to an old route keeps working.
3. `.env`: `SERVER_URL=https://crm.uventure.<domain>`; `docker compose up -d`; `scripts/verify-config.sh`.
4. App variable **CRM base URL** to the new host (`config/dashboards/kuec-bd-ops-variables.md`), so notification links point to it.
5. Every sender of a signed route (forms, uVENTURE) switches to the new host; then the old name is removed.
6. Members sign in again once; connected mailboxes keep syncing.

### 1.3 The uVENTURE origin inside the app

The iFrame widgets and the **Open uVENTURE** link need uVENTURE's address in the manifest, which is static. `kuec/app/src/constants/uventure.ts` reads `KUEC_UVENTURE_ORIGIN` when the manifest is built and defaults to production. Staging is published with it set (`01-deploy.md` section 8):

```bash
KUEC_UVENTURE_ORIGIN=https://uventure-staging.kuec.example npx twenty plan
KUEC_UVENTURE_ORIGIN=https://uventure-staging.kuec.example npx twenty app:publish --private -r staging
```

`plan` against an instance shows the widget URLs that would change; a staging plan that shows production URLs means the variable was not set. Logic functions never read it: every link they write comes in the uVENTURE payload.

The embedded page paths (`/embed/technologies`, `/embed/equipment`, `/embed/challenges`) are confirmed with the uVENTURE administrator before the first staging publish; a changed path is a one-line change in that file and a release.

### 1.4 uVENTURE embeds Twenty

1. **Allow the origin:** `config/dashboards/iframe-embedding.md`, Settings > Security > Iframe embedding > `https://uventure.<domain>`. Twenty then answers every page with `Content-Security-Policy: frame-ancestors 'self' https://uventure.<domain>` and drops `X-Frame-Options` (`frontend.service.ts`). One origin per environment; nothing else is added.
2. **The proxy adds no frame header** (`Caddyfile.example`), or it would override Twenty's.
3. **What uVENTURE embeds** (an `<iframe>` per page, `src` as below):

   | In uVENTURE | Twenty URL |
   | --- | --- |
   | Technology page: the cases selling it | `https://crm.uventure.<domain>/object/capability/<capability id>` (the Capability record lists its opportunities and engagements) |
   | Portfolio overview | `https://crm.uventure.<domain>/page/<BD dashboard page id>` |
   | Commercialization pipeline | `https://crm.uventure.<domain>/objects/opportunities?viewId=<Pipeline view id>` |
   | Challenges turned leads | `https://crm.uventure.<domain>/objects/leads?viewId=<Lead inbox view id>` |

   Record ids come from the events Twenty sends (section 4.3, `crmUrl`) or from the nightly read. Page and view ids are assigned at install: after each production install the engineering lead opens each page or view, copies its id from the address bar into the table of section 1.6 and sends it to the uVENTURE administrator. They stay the same until the app is reinstalled.
4. **Sign-in:** Microsoft's sign-in page refuses to load in a frame. A person signed out of Twenty sees the Twenty sign-in page inside uVENTURE: they open **Open the CRM** (a plain link uVENTURE shows above every embedded view, to `https://crm.uventure.<domain>`), sign in once, and come back. The session then lasts like any Twenty session.
5. **Permissions are Twenty's:** an embedded view shows what that person's Twenty role allows (`13-roles.md`), nothing more.

### 1.5 Twenty embeds uVENTURE

- **Sidebar > uVENTURE** opens a page with three tabs, **Technologies**, **Equipment and labs** and **Challenges**, each its guidance text over an iFrame widget showing the uVENTURE page.
- The widget sandbox allows scripts, forms, popups and same-origin, so uVENTURE works normally inside it; downloads and top-level navigation are not allowed, so uVENTURE's own links that leave the frame open in a new tab.
- **uVENTURE's side** (`it-request.md` section 3): the embedded pages answer with `Content-Security-Policy: frame-ancestors 'self' https://crm.uventure.<domain>`, and the uVENTURE session cookie is `SameSite=Lax` or `None; Secure`, never `Strict`.
- Sign-in is the same in reverse: a person signed out of uVENTURE uses **Open uVENTURE** in the sidebar once.
- A record-specific uVENTURE page cannot be an iFrame widget (its URL is fixed in the manifest), so every Capability, Opportunity, Contract and Lead carries a **uVENTURE record** link that opens the record itself.

### 1.6 Navigation both ways

Twenty's sidebar (manifest, `src/navigation-menu-items`): ... Contracts, Documents, **Capabilities** (the pointer list, view All capabilities), Milestones, Data quality, **uVENTURE** (the embedded page), **Open uVENTURE** (link to uVENTURE's home), Help.

uVENTURE's menu, kept by the uVENTURE administrator:

| uVENTURE menu item | Opens | Twenty id to fill after install |
| --- | --- | --- |
| CRM: pipeline | `/objects/opportunities?viewId=<id>` | Opportunities > Pipeline view id |
| CRM: leads | `/objects/leads?viewId=<id>` | Leads > Lead inbox view id |
| CRM: BD dashboard | `/page/<id>` | BD dashboard page id |
| CRM: my work | `/objects/workPackages?viewId=<id>` | Work packages > My work view id |
| Open the CRM | `/` | none |

The labels on both sides use the same words (Pipeline, Leads, Capabilities), so a person moving between them reads one product.

### 1.7 Checks, after each deploy

1. `curl -sI https://crm.uventure.<domain>/ | grep -i content-security-policy` shows the uVENTURE origin.
2. Signed in to both, the three uVENTURE tabs in Twenty load uVENTURE, and the four uVENTURE pages load Twenty, without a sign-in page.
3. A different site cannot frame Twenty: an HTML file with an iframe to the CRM, opened from disk, shows a blocked frame.

---

## 2. Identity

### 2.1 The join key

**One KUEC work email per person, identical in Entra ID, Twenty and uVENTURE, lower case.** It is the only thing that says "the same person" across the two systems: the role map, the joiner and leaver steps, the owner email in the events (section 4.3) and the access review all match on it. Nobody gets a second account under another address in either system; a shared or generic mailbox never holds a person's role.

### 2.2 Microsoft login on both

- Twenty: **Continue with Microsoft** through the Entra app of `it-request.md` item 1 (multitenant, Assignment required, group `CRM-Users`); password sign-in may be turned off once every member has signed in with Microsoft (optional, `01-deploy.md` section 5).
- uVENTURE: signs in with Microsoft too, through its own Entra app, with the same KUEC email. Its access follows the `CRM-Users` group, or is changed by hand the same day (2.5).
- A person removed from `CRM-Users` loses Twenty at the next sign-in.

### 2.3 Roles mirrored

Each person holds one role in Twenty (`13-roles.md`, Prompt 13) and the matching role in uVENTURE. The mapping is `config/roles/uventure-role-map.json`; `src/roles/uventure-role-map.test.ts` fails when a Twenty role a person can hold is missing from it, or a label drifts.

| Twenty role | Department | uVENTURE role (proposed) | In uVENTURE |
| --- | --- | --- | --- |
| ED | | Executive approver | Reads everything; approves licences and agreements |
| Ops coordinator | | Portfolio coordinator | Reads everything; triages challenges and sign-ups |
| BD officer | Business development | Business development | Reads technologies, equipment, labs, challenges; records the playbook hand-offs |
| Commercialization (new in 0.11.0) | Commercialization | Commercialization | Owns technologies and their marketing status; records licences and options |
| IP office | Intellectual property office | IP office | Owns disclosures and patents |
| Leasing | Leasing | Leasing | Owns space listings and leasing agreements |
| Lab access | Lab access | Lab access | Owns lab and equipment listings and availability |
| Startups and investment | Startups and investment | Startups and investment | Owns startup and subsidiary records |
| Engineer | | Read only | No business edits in production |
| Leadership viewer | | Leadership viewer | Dashboards only |

The five Commercialization department roles (Commercialization, IP office, Leasing, Lab access, Startups and investment) share one Twenty permission set (`roles/utils/build-department-role.ts`): read everything; write leads, opportunities, engagements, documents, campaign targets, tasks and notes; no delete, import, settings or workflows. Service accounts are not people: **uVENTURE reader** is uVENTURE's API key into Twenty (read only, section 4.3), **Automation** has no uVENTURE account.

The uVENTURE administrator confirms the uVENTURE role names and rights; the engineering lead then sets `status` to `confirmed`, `confirmedBy` and `confirmedOn` in the role map, in the same release.

### 2.4 SSO

SAML or OIDC single sign-on is an Organization-plan feature of Twenty (`kuec/CLAUDE.md` section 3) and is **deferred until the paid plan**. Until then the shared Microsoft identity gives the same effect for people: one account, one password, one MFA, one group.

### 2.5 Joiner and leaver: both systems, the same day

Whoever starts the change finishes it in both systems before the end of the working day, and records it in the access review table of `13-roles.md` section 6 with one line for both.

**Joiner** (the ED for Twenty, the uVENTURE administrator for uVENTURE, the ops coordinator for records):

1. IT creates the KUEC account and adds it to `CRM-Users` (and uVENTURE's group if separate).
2. Look up the person's Twenty role and its uVENTURE role in `config/roles/uventure-role-map.json`.
3. Twenty: `13-roles.md` section 7 steps 2 to 8 (invite with the role, Microsoft sign-in, mailbox, playbook role assignment).
4. uVENTURE: the administrator creates the user with the same email and the mapped role, the same day.
5. Check: the person signs in to both, opens Sidebar > uVENTURE in Twenty and the CRM pipeline in uVENTURE, and sees both without a sign-in page.

**Leaver** (same people):

1. Twenty: `13-roles.md` section 8 steps 1 to 4 first (find and reassign open records, deactivate playbook role assignments, decide on the mailbox), then remove the member.
2. uVENTURE: the administrator reassigns the person's uVENTURE records and disables the account, the same day.
3. IT disables the KUEC account and removes it from `CRM-Users`. That alone closes both doors at the next sign-in; steps 1 and 2 make sure nothing they owned is orphaned.
4. A leaver who held a secret (engineer) or owned an API key: rotate the uVENTURE signing secrets and the reader key with the others (`13-roles.md` section 8 step 7).

**A move between roles:** the new Twenty role and the new uVENTURE role are set the same day; the role map says which.

---

## 3. One taxonomy

### 3.1 One file, read by both

`kuec/playbooks/lookups.json` is the only source of every KUEC-wide picklist (`18-taxonomy.md`). The app ships a copy (`yarn playbooks:sync`), so a release carries the taxonomy it was built with, and **uVENTURE reads that copy from Twenty**:

- `GET https://crm.uventure.<domain>/s/integrations/uventure/lookups`, signed like every route (section 4.2) over an empty body.
- Answers the whole `lookups.json`, with `ETag: "<version>"`; a request with `If-None-Match: "<version>"` gets `304`.
- uVENTURE reads it nightly before its snapshot (section 4.2, U6) and after every Twenty release; it matches on `value`, never on labels, and enforces `requiresNote` on Other.

New in 0.11.0: **Capability status** (`CAPABILITY_STATUS`, Capability > Status), **Campaign channel** (`CAMPAIGN_CHANNEL`, Project > Channel plan), the option **Invention disclosure** in Capability type, and Capability type mapped to Capability > Kind. Company sector and Offering also apply to the campaign fields on Project.

### 3.2 A new option starts in lookups.json

Any option either system needs is added to `lookups.json` first, through the quarterly review (`18-taxonomy.md` sections 6 and 7), and reaches both from there: the manifest mirrors it in the next app release, and uVENTURE picks it up from the route. Neither side adds an option in its own settings. A uVENTURE request for an option goes to the ops coordinator like any other.

### 3.3 Quarterly diff review

In the review of `18-taxonomy.md` section 6 (first two weeks of January, April, July, October), the engineer lists what changed since the last review's release:

```bash
node kuec/playbooks/diff-lookups.ts <tag-or-commit-of-the-last-review>
```

It prints one table row per list added, option added, relabelled, description changed or deprecated, and fails if anything was removed (rule 2: deprecate, never delete). The table goes:

1. into the review record, for the ED's approval of each row;
2. to the uVENTURE administrator with the new `version`, who confirms within 5 business days that uVENTURE reads it (the `ETag` matches) and has no record on a value the review deprecated without a replacement.

The first review after this release is in the first two weeks of January 2027.

---

## 4. Data contracts

### 4.1 Who owns what

One owner system per record type. The other system holds a pointer or a link and never edits the owner's fields.

| Record type | Owner | In uVENTURE | In Twenty |
| --- | --- | --- | --- |
| Technology, invention disclosure | uVENTURE | The record: TRL, patents, inventors, owners, documents | Capability pointer: name, kind, status, link (U1) |
| Equipment, lab, space listing | uVENTURE | The listing and its availability | Capability pointer and its status (U4) |
| Industry challenge | uVENTURE | The challenge | A Lead with the challenge's link (U2) |
| Licence, option and other agreements signed in uVENTURE | uVENTURE | The agreement and its terms | A Contract with metadata only: kind, status, dates, value, link (U3) |
| Sign-ups taken on uVENTURE pages (gala, workshop, website) | uVENTURE until submitted | The submission | A Lead (U5) |
| Lead, opportunity, engagement, project, work package, task, note | Twenty | Nothing, or the event it was told about (T1 to T3) | The record |
| Company, person | Twenty | Its own contacts, matched by domain and email | The record |
| Contract not signed in uVENTURE (Service, NDA, MoU...) | Twenty | Nothing | The record |
| Taxonomy | `lookups.json` | Read from Twenty (section 3) | The manifest |

Rules that hold for every contract:

- Keyed on the **Unique `externalId`**: `uventure:<uVENTURE id>` for Capability, Contract and Lead from a challenge; the form prefixes `web:`, `gala:`, `workshop:` for sign-ups (`19-leads.md` section 6.2). Set once, never changed, never reused. uVENTURE ids are unique across uVENTURE's record types.
- `externalId` and `sourceSystem` are locked for every person role and `writability: OPEN` for the app (`13-roles.md` section 2). Capability is read-only for every role, the ED and the ops coordinator included: a wrong pointer is corrected in uVENTURE.
- A feed never deletes. A record gone from uVENTURE is noticed (Last seen), not mirrored.
- A human edit outranks a feed on every field the feed does not own (`16-integration-map.md` section 2.3).

### 4.2 uVENTURE to Twenty

**One route.** `POST https://crm.uventure.<domain>/s/integrations/uventure/events` (`uventure-route`), the contract of `16-integration-map.md` section 2.4:

| Item | Rule |
| --- | --- |
| Headers | `x-kuec-timestamp` (Unix seconds), `x-kuec-signature: v1=<hex HMAC-SHA256(secret, timestamp + "." + raw body)>`, `x-kuec-delivery` (1 to 100 letters, digits, dot, dash or underscore, unique per delivery) |
| Secret | App variable `UVENTURE_SIGNING_SECRET`, then `UVENTURE_SIGNING_SECRET_PREVIOUS` during a rotation |
| Answers | `202` accepted and queued; `400` bad shape (whole delivery refused, reason in the body); `401` bad, missing or 5-minute-old signature; `413` more than 100 events; `503` secret not set or queue unavailable |
| Then | One job `uventure-event-job`, job id `uventure-<delivery id>` (a resent delivery is a no-op), retried 3 times on transient errors, events applied in the order sent |
| Sender | Retries `5xx` and network errors with backoff for 24 hours, never `4xx`; keeps 7 days of deliveries and can replay from a given time |

**Body:**

```json
{
  "run": { "runId": "2026-10-18", "page": 1, "pageCount": 3 },
  "events": [
    { "eventId": "evt-0001", "type": "technology.created", "occurredAt": "2026-10-18T01:00:00+04:00", "data": { } }
  ]
}
```

`run` is only on the nightly snapshot and replay (U6). `occurredAt` is when the change happened in uVENTURE; it orders the events (4.4). Any attribute not named below is dropped, unread.

**U1. Technology or invention disclosure created (or a technology changed) → Capability pointer**

| uVENTURE event | `type` |
| --- | --- |
| Technology created | `technology.created` |
| Technology renamed, relinked, status changed | `technology.updated` |
| Invention disclosure created | `disclosure.created` |

| `data` | Capability field | Rule |
| --- | --- | --- |
| `id` | `externalId` = `uventure:<id>`; `sourceSystem` = uVENTURE | Required |
| (from the type) | `kind` = Technology, or Invention disclosure | Fixed by the type |
| `title` | `name` | Required; overwritten when it differs |
| `url` | `uventureRecord` (https only) | Required; overwritten when it differs |
| `status` (optional) | `status`, and `statusChangedAt` = now when it changes | One of `CAPABILITY_STATUS`; absent leaves it as it is |
| `otherDetails` (optional) | `otherDetails` | Sent when kind or status is Other |
| (every event) | `lastSeenInUventureAt` = now; `staleFrom` = now + 7 days | Stamped by the app |

People link the pointer: Opportunity > **Capability**, Engagement > **Capability**. A disclosure that becomes a technology arrives as a new technology; uVENTURE sends the disclosure as `listing.changed` with status Withdrawn.

**U2. Challenge submitted → Lead with source Challenge Sprint or Technical committee**

`type` `challenge.submitted`:

| `data` | Lead field | Rule |
| --- | --- | --- |
| `id` | `externalId` = `uventure:<id>`; `sourceSystem` = uVENTURE | Required. A lead with this id already: left as it is |
| `programme` | `source` | `CHALLENGE_SPRINT` → Challenge Sprint; `TECHNICAL_COMMITTEE` → Technical committee |
| `title`, `company.name` | `name` = "title, company" | |
| `title`, `description` | `need` | Title, a blank line, the description |
| `url` | `uventureRecord` | Required |
| `offeringInterest` | `offeringInterest` | Values of `OFFERING` only; others dropped |
| `company.name`, `company.website` | Company | Matched by website domain, then name; created only if none matches |
| `contact.*` | Person | Matched by email and never overwritten; created if none; an empty company filled |
| | `status` = New | Then L1 triage: owner the ops coordinator, Triage task due the next working day |

**U3. Licence or other agreement signed → Contract**

`type` `agreement.signed`:

| `data` | Contract field | Rule |
| --- | --- | --- |
| `id` | `externalId` = `uventure:<id>`; `sourceSystem` = uVENTURE | Required |
| `agreementType` | `kind` | A `CONTRACT_TYPE` value: Licence, Option, Joint development agreement... |
| `title` | `name` | Overwritten |
| (fixed) | `status` = Signed | |
| `signedOn`, `expiresOn` | `signedOn`, `expiresOn` | Dates, `YYYY-MM-DD` |
| `value.amount`, `value.currency` | `value` | Three-letter currency |
| `url` | `uventureRecord` | |
| `crmOpportunityId` | `opportunity` | Only when empty. uVENTURE has it from T1 |
| `counterparty.name`, `counterparty.website` | `counterparty` | Only when empty; matched like U2, created if none, else the opportunity's company |
| `technologyId` | `capability` | Only when empty; the pointer `uventure:<technologyId>` |
| (from the opportunity) | `owner` | Only when empty |

- **Adoption.** When the case was signed in Twenty first, W7 already made a contract of the same kind on that opportunity. The feed **adopts** it (writes its `externalId` and the fields above) instead of adding a second. Either order ends with one contract.
- **No case or no owner matched:** a Task "Link contract" for the ops coordinator (the ED if none), with the record link.
- uVENTURE owns kind, status, dates, value and link on these contracts. A correction is made in uVENTURE; an edit in Twenty is overwritten by the next event. Relations a person set stay.
- Only metadata: the agreement text stays in uVENTURE and SharePoint (`kuec/CLAUDE.md` section 4).

**U4. Equipment or lab listing changed → Capability status**

`type` `listing.changed`, `data` as U1 plus `kind` (Lab, Equipment, Space, Technical service, Expertise, Startup, Subsidiary, Other) and a required `status`:

| `status` | Label | What Twenty does |
| --- | --- | --- |
| `AVAILABLE` | Available to offer | Updates the pointer |
| `LIMITED` | Limited availability | Updates the pointer |
| `UNAVAILABLE` | Temporarily unavailable | Updates the pointer; the owner of every open opportunity with this capability gets a Task and an email "uVENTURE no longer offers what this case sells" |
| `WITHDRAWN` | Withdrawn | Same as Unavailable |
| `OTHER` | Other | Updates the pointer and its Other details |

The notice goes once per capability, status and event time. Capabilities > **Not available to offer** lists the rest.

**U5. Gala, workshop and website sign-ups → Lead with the right source**

`type` `signup.submitted`, `data: { "form": "GALA_QR" | "WORKSHOP_SIGNUP" | "WEBSITE", "submission": { ... } }`. The submission is exactly the forms contract of `19-leads.md` section 6.2 and goes through the same code (`recordIntakeLead`):

| `form` | Lead `source` | `sourceSystem` | `externalId` |
| --- | --- | --- | --- |
| `GALA_QR` | Gala QR code | Gala QR code form | `gala:<submissionId>` |
| `WORKSHOP_SIGNUP` | Workshop | Workshop sign-up form | `workshop:<submissionId>` |
| `WEBSITE` | Inbound (web / email / phone) | Website form | `web:<submissionId>` |

`campaignId` attributes the lead to its campaign or workshop project (GTM pack). **One sender per form:** a form that uVENTURE hosts posts through uVENTURE only, never also to the forms route, so a submission id is never seen from two senders.

**U6. Nightly snapshot and replay** (the reconciliation of U1 to U5)

At 01:00 Asia/Dubai uVENTURE sends one run, in pages of at most 100 events, each page with `run: { runId, page, pageCount }`:

- every active technology, disclosure and listing as `technology.updated` or `listing.changed` with its current status;
- every challenge, agreement and sign-up event of the last 7 days again (30 days for agreements).

When the last page of a run is applied, the run is complete (`uventure:run:last-complete` in the app's key-value store). Every pointer in it gets Last seen = now; a pointer missing from the snapshot keeps its values and its cases, and 7 days later shows in Capabilities > **Not seen in uVENTURE for 7 days**, checked in the Monday sweep (`14-hygiene.md`).

**U7. Taxonomy read:** section 3.1.

### 4.3 Twenty to uVENTURE

Two paths, both always on: a **signed webhook** the app sends on each change (fast path), and uVENTURE's **nightly API read** (guarantee). Neither changes anything in Twenty.

**Signed webhook.** `POST <UVENTURE_WEBHOOK_URL>` (app variable, given by the uVENTURE team), headers as section 4.2 with `x-kuec-delivery` = the delivery id below, signed with `UVENTURE_OUTBOUND_SIGNING_SECRET` (a different secret from the inbound one). Body `{ "eventId", "type", "occurredAt", "data" }`, `eventId` = delivery id, `occurredAt` = the record's last update. uVENTURE answers `2xx` (or `409` if it already holds that delivery id).

| # | When | `type` | Delivery id (fixed per record) | Fast path |
| --- | --- | --- | --- | --- |
| T1 | An opportunity of Type Technology licensing moves to Signed | `crm.licence_opportunity.signed` | `crm-licence-signed-<opportunity id>` | `uventure-outbound-opportunity` on `opportunity.updated` (stage) |
| T2 | A lead whose Offering interest includes Intellectual property licence moves to Converted | `crm.lead.converted_ip_licence` | `crm-lead-converted-<lead id>` | `uventure-outbound-lead` on `lead.updated` (status) |
| T3 | An engagement gets a Capability that is a Technology or an Invention disclosure | `crm.engagement.technology_referenced` | `crm-engagement-<engagement id>-<capability record id>` | `uventure-outbound-engagement` on `engagement.updated` (capability) |

Each trigger only queues `uventure-outbound-job`, which reads the record again and builds the event from what it says now: a case moved back from Signed before the job ran sends nothing.

**T1 data** (licence signed):

| Field | From |
| --- | --- |
| `crmOpportunityId`, `crmUrl` | The opportunity's id and its record link |
| `name` | Opportunity name |
| `signedAt` | Stage entered at |
| `technology.uventureId`, `technology.uventureUrl` | The opportunity's Capability (its `externalId` without `uventure:`, its link); null when none |
| `uventureRecordUrl` | Opportunity > uVENTURE record |
| `licensee.name`, `licensee.domain` | The opportunity's company |
| `ownerEmail` | The owner's KUEC email (the join key, section 2.1) |
| `value.amount`, `value.currency` | Opportunity amount |

uVENTURE records the licence against the technology and, when it signs the agreement, answers with U3 carrying `crmOpportunityId`.

**T2 data** (lead converted, IP licence): `crmLeadId`, `crmOpportunityId` (the opportunity the conversion created), `crmUrl`, `name`, `offeringInterest`, `uventureRecordUrl`, `company.name`, `company.domain`, `ownerEmail`. uVENTURE uses it to know which technologies have a live licensing case.

**T3 data** (engagement on a technology): `crmEngagementId`, `crmUrl`, `name`, `kind`, `date`, `outcome`, `technology.uventureId`, `technology.uventureUrl`, `company.name`, `company.domain`, `ownerEmail`. uVENTURE counts it as market interest on the technology. Engagements on labs, equipment and the rest are not sent.

No personal contact details leave Twenty in these events beyond the owner's work email.

**Nightly API read.** uVENTURE reads with the key `uventure-reader-<env>-<yyyy-mm>` on the role **uVENTURE reader** (reads Opportunity, Lead, Engagement, Contract, Capability, Company, Person; writes nothing; `config/dashboards/uventure-api-key.md`), pages of 200 with `starting_after`, `since` = the start of its previous successful read minus 2 minutes:

```text
GET /rest/opportunities?filter=and(stage[eq]:SIGNED,playbookType[eq]:TECHNOLOGY_LICENSING,updatedAt[gte]:"<since>")
GET /rest/leads?filter=and(status[eq]:CONVERTED,offeringInterest[containsAny]:[IP_LICENCE],updatedAt[gte]:"<since>")
GET /rest/engagements?filter=and(capabilityId[is]:NOT_NULL,updatedAt[gte]:"<since>")
GET /rest/capabilities?filter=id[in]:[<capability ids of those engagements>]   (keep kind TECHNOLOGY or INVENTION_DISCLOSURE)
```

It builds the same three events from the records and stores them under the same delivery ids, so a record already received by webhook is not stored twice. Its API calls count against the instance-wide limit (`16-integration-map.md` section 7.4); the read stays under 50 requests.

### 4.4 Retry and reconciliation

| Contract | Retry | Order and duplicates | Reconciliation | Watch |
| --- | --- | --- | --- | --- |
| U1 Capability | Sender 24 h on 5xx and network; job 3 times on transient errors | Upsert on `externalId`; an event older than the last one applied to that record is skipped (`uventure:applied:capability:<externalId>`) | Nightly snapshot (U6): every active record restated; missing ones shown after 7 days | `uventure-sweep` 07:40: no complete snapshot for 26 hours → Task for the ops coordinator, once a day |
| U2 Challenge lead | As U1 | Create once per `externalId`; later events change nothing | Snapshot replays 7 days | Same; the Lead inbox |
| U3 Contract | As U1 | Upsert on `externalId`, older events skipped; adopts the W7 contract | Snapshot replays 30 days of agreements | Same; "Link contract" tasks |
| U4 Status | As U1 | As U1; the case owner notice once per status and event time | Snapshot restates every status | Same; Not available to offer |
| U5 Sign-up lead | As U1 | Create once per form `externalId` | Snapshot replays 7 days | Same; the Lead inbox |
| T1 to T3 | Job 3 times on 429, 5xx, network; other 4xx recorded as failed | Delivery id fixed per record; uVENTURE keeps one per id (`409` on a repeat) | `uventure-sweep` resends every T1 to T3 of the last 30 days uVENTURE has not acknowledged (`uventure:outbound:<delivery id>` not SENT), daily; older ones the nightly read covers | The sweep's log line; uVENTURE reports a nightly read that failed |
| After a restore | The sender replays from the dump's time (`16-integration-map.md` section 10.3); the sweep resends T1 to T3; the key-value store went back with the dump, so each event applies again, once |

A permanent `4xx` from uVENTURE on T1 to T3 means a contract bug on one side: the job logs `failed permanently: <status>`, the sweep tries again daily for 30 days, and the engineering lead raises it with the uVENTURE team the same week.

### 4.5 End-to-end tests on staging

Every contract is proven on staging before production (`01-deploy.md` section 11: staging holds test data only), then once more on production with one real record for the pilot (section 6). The kit is `kuec/tests/uventure/`: `send-delivery.mjs` signs a fixture and posts it as uVENTURE would; `receive-crm-events.mjs` stands in for uVENTURE's endpoint and verifies Twenty's signature. Secrets come from `twenty/staging/*` in the secrets manager, in the shell only. Save each command's output and what you saw in the CRM as `kuec/tests/uventure/evidence/<date>-<test>.txt`.

Setup: staging on 0.11.0 published with `KUEC_UVENTURE_ORIGIN` set; `UVENTURE_SIGNING_SECRET`, `UVENTURE_OUTBOUND_SIGNING_SECRET` set; `UVENTURE_WEBHOOK_URL` = the stub's address (`http://<stub host>:8787/integrations/crm/events`); `yarn twenty dev:function:logs -n uventure-event-job` open in a second terminal (`04-automation.md` section 4).

```bash
export CRM=https://crm.uventure-staging.kuec.example
export UVENTURE_SIGNING_SECRET="$(<read twenty/staging/UVENTURE_SIGNING_SECRET>)"
cd kuec/tests/uventure
```

| Test | Do | Pass when |
| --- | --- | --- |
| S1 Signature | `node send-delivery.mjs $CRM fixtures/u1-technology-created.json --bad-signature`, then `--stale`; then clear the secret in staging and send once more | `401`, `401`, then `503`; nothing in the job log |
| U1 Capability | `node send-delivery.mjs $CRM fixtures/u1-technology-created.json`; send it again; `u1-technology-renamed.json`; `u1-stale-older-event.json`; `u1-disclosure-created.json` | `202` each. One Capability `uventure:STG-TECH-0042`, Kind Technology, Status Available to offer, uVENTURE record set, Source system uVENTURE. The repeat logs `1 unchanged`. The rename changes the name and keeps any case linked to it. The old event logs `1 stale` and changes nothing. The disclosure is Kind Invention disclosure. Signed in as a BD officer, the Capability's fields are read-only |
| U2 Challenge lead | `u2-challenge-sprint.json`, then `u2-technical-committee.json`, then the first again | Two Leads, Source Challenge Sprint and Technical committee, Source system uVENTURE, uVENTURE record set, Status New, owner the ops coordinator with a Triage task; the person and company matched or created. The repeat creates nothing |
| U3 Contract | Create a staging Technology licensing opportunity, link Capability STG-TECH-0042, move it to Signed (W7 makes a licence contract). `OPPORTUNITY_ID=<its id> node send-delivery.mjs $CRM fixtures/u3-licence-signed.json`. Then send it again with `OPPORTUNITY_ID` unset | Still **one** licence contract on the opportunity, now with External id `uventure:STG-AGR-0001`, Source system uVENTURE, Signed on, Expires on, Value AED 250,000, uVENTURE record and Capability set. The second send (no case) adds no contract and creates no task, because the contract already exists; deleting it first and resending creates a contract with no case and a "Link contract" task for the ops coordinator |
| U4 Status | `u4-equipment-listed.json`; create an open opportunity owned by you with Capability "Staging: scanning electron microscope"; then `u4-equipment-unavailable.json`; send that again | After the first send the pointer is Available to offer. After the second it shows Temporarily unavailable and Status changed at, you get one Task and one email "uVENTURE no longer offers what this case sells", and it lists under Capabilities > Not available to offer. The repeat sends no second notice |
| U5 Sign-ups | `u5-signups.json` | Three Leads: Gala QR code, Workshop, Inbound (web / email / phone); source systems Gala QR code form, Workshop sign-up form, Website form; external ids `gala:STG-GALA-1`, `workshop:STG-WS-1`, `web:STG-WEB-1`; each triaged |
| U6 Snapshot and watchdog | Before any snapshot: `yarn twenty dev:function:exec -n uventure-sweep`. Then `RUN_ID=stg-1 node send-delivery.mjs $CRM fixtures/u6-snapshot-page-2-of-2.json` and `RUN_ID=stg-1 ... page-1-of-2.json`; exec the sweep again | First exec: one Task "uVENTURE feed silent" for the ops coordinator (exec again the same day: no second). After both pages, in either order, the job log says `run complete` and STG-TECH-0042's Last seen moves; the second exec raises nothing |
| U7 Taxonomy | `node send-delivery.mjs $CRM fixtures/u7-lookups-read.json`; then `curl` with `If-None-Match: "<version>"` and the same signed headers | `200` with the body of `lookups.json` and `ETag` equal to its `version`; then `304` |
| T1 Licence signed | Start `UVENTURE_OUTBOUND_SIGNING_SECRET=... node receive-crm-events.mjs`; move a staging Technology licensing opportunity with a Capability to Signed | Within a minute the stub prints `202 crm-licence-signed-<id>` with the technology, licensee, owner email and value. Restart the stub with `RESPOND_WITH=500` and sign another: the job log shows up to 3 retries, each one an attempt on the stub; exec `uventure-sweep`: one more attempt; back to `202`, exec again: sent once, nothing more |
| T2 Lead converted | Tick Intellectual property licence on a qualified staging lead and convert it | The stub prints `crm-lead-converted-<id>` with the new opportunity's id. A lead converted without that interest sends nothing |
| T3 Engagement | Set Capability STG-TECH-0042 on a staging engagement; then set a lab capability on another | The first prints `crm-engagement-<engagement id>-<capability id>`; the second sends nothing |
| R Nightly read | The three `GET` of section 4.3 with the staging reader key; then a `PATCH` with it | The records of T1 to T3 come back; the `PATCH` is refused |

A failed test is fixed and the whole row run again; the evidence file records both runs.

### 4.6 Operating it

| To | Run (from `kuec/app`, `04-automation.md` section 3) |
| --- | --- |
| See what came in | `yarn twenty dev:function:logs -n uventure-event-job`: one line per delivery with created, updated, unchanged, stale counts; never record contents |
| See refusals | `yarn twenty dev:function:logs -n uventure-route`: `uventure delivery refused <id>: BAD_SIGNATURE` |
| Check the watchdog and resend now | `yarn twenty dev:function:exec -n uventure-sweep` |
| Pause the inbound feed | Clear `UVENTURE_SIGNING_SECRET`: the routes answer 503 and the sender keeps retrying for 24 hours |
| Pause the outbound feed | Clear `UVENTURE_WEBHOOK_URL`: nothing is sent; the nightly read still works |
| Rotate | With the quarterly key rotation (`13-roles.md` section 6): new inbound secret in `UVENTURE_SIGNING_SECRET`, old one in `_PREVIOUS`, tell the uVENTURE administrator, clear `_PREVIOUS` a week later; new outbound secret agreed with uVENTURE first, then set |

---

## 5. Best-practice packs

### 5.1 What a pack is

A pack is a way of working shipped **as app content**: a playbook (how people work, in plain words), views, a BD dashboard tab, and the guidance texts on that tab and on the record pages it touches, plus the automations that keep the practice honest. It lives in `kuec-bd-ops` and is **versioned with the app**: the pack a workspace runs is the one in the installed app version, and changing it is an app release with `plan` read like any other. `src/packs/packs.ts` lists each pack's content; `src/packs/packs.test.ts` fails if a pack's playbook, tab, guidance, views or switch goes missing.

**Switchable through application variables:** `CRM_PACK_ENABLED`, `PM_PACK_ENABLED`, `GTM_PACK_ENABLED` (BOOLEAN, on by default; Settings > Apps > KUEC BD Ops > Variables). Off, the pack's automations return "<pack> pack is off" and do nothing; the views, the tab and the guidance stay, because removing manifest entities drops data (`kuec/CLAUDE.md` section 2). No switch ever stands down the operating rules of `kuec/CLAUDE.md` section 7. The ED decides which packs are on; the engineering lead records the change in `config/dashboards/kuec-bd-ops-variables.md`.

| Pack | Playbook | Dashboard tab | Guidance | Automations it switches |
| --- | --- | --- | --- | --- |
| CRM | `kuec/playbooks/crm-pack.md` | BD > **Pipeline pack** | `packPipeline` | L2 contact time, L3 auto-close, L6 referral thanks and credit (and the lead sweep's credit repair), C1 stage exit check |
| PM | `kuec/playbooks/pm-pack.md` | BD > **Project pack** | `packProjects` | P1 RAID log, P2 weekly review, the RAID part of `packs-sweep` |
| GTM | `kuec/playbooks/gtm-pack.md` | BD > **Campaign pack** | `packCampaigns` | G1 campaign target list, the campaign part of `packs-sweep` |

### 5.2 CRM pack

Lead to opportunity with contact times (triage next working day, first contact in 3 working days with the ED told at 7, 30 quiet days close a lead), the five qualification checks, **stage exit criteria** for each stage (Company, Owner, Source and Type to leave Qualify; Point of contact and Offering to leave Screening; Amount, Close date and Funding path to leave Meeting; Probability to leave Proposal; SharePoint folder, and for a licence its Capability and uVENTURE record, to leave Customer), **account tiers** (Tier 1 strategic, Tier 2 active, Tier 3 watch; 60 days without an engagement flags Tier 1 and 2), and **referral credit** for whoever brought the lead in. C1 (`c01-stage-exit-check`, `opportunity.updated` on stage) gives the owner a task naming the missing criteria of every stage a case moved past; the tab lists late-stage gaps. Full text: `crm-pack.md`.

### 5.3 PM pack

Project, milestones and work packages with owners, dates and done criteria; **health** recalculated each morning (Amber when a milestone is due within 7 days, Red when one is missed, cleared by the owner); a **RAID log as a Note** on every active project with an owner (P1 on `project.updated` owner or status, repaired daily by `packs-sweep`; template `src/packs/raid-log-template.ts`: risks, assumptions, issues, dependencies); and the **weekly review** (P2, Monday 08:00 Asia/Dubai, one task per project owner listing their active projects, worst health first, with the six review steps of `pm-pack.md` section 4). Work package escalations stay core.

### 5.4 GTM pack

A **campaign is a Project of Type Go-to-market campaign** with **Target sector**, **Target size class** and **Offering promoted**, and a **Channel plan** (multi-select from `CAMPAIGN_CHANNEL`). The **target list is built from the registry**: G1 (`g01-campaign-targets`, on the campaign fields) adds one **Campaign target** per company whose Sector and Size class match, at most 500 by name; sector and size class come from the quarterly registry import (`16-integration-map.md` section 5). **Leads attributed to the campaign** carry it in Lead > Campaign (forms send `campaignId`); `packs-sweep` marks their company's target Lead created daily and adds the company if it was not targeted. The **campaign dashboard** (BD > Campaign pack) shows targets per campaign by status, leads per campaign by status and every active campaign with its plan. **Cost per qualified lead is left blank** on that tab, with the reason written in the widget, until finance provides campaign costs; it then becomes a field on the campaign and a pack change.

### 5.5 Changing a pack

Like any app change: the playbook, the views or tab, the guidance (`guidance.json`, then `yarn guidance:render`), `packs.ts`, tests, `plan`, release. The Help page section for the pack (`20-guidance.md` section 5) is updated in the same change.

---

## 6. Pilot readiness checklist

The pilot is the commercialization vertical (BD, Commercialization, IP office, Leasing, Lab access, Startups and investment) working in the CRM and uVENTURE together. Dates are Asia/Dubai working days; UAE public holidays on 1 to 3 December 2026 are avoided. Each item is ticked by its owner with the evidence named; the ED's decision closes the list.

| # | Item | Owner | Due | Done when (evidence) | Done |
| --- | --- | --- | --- | --- | --- |
| 1 | IT approvals granted | ED, with KUEC IT | 2026-11-02 | `config/deploy/it-request.md` signed, including the uVENTURE items (hosts, redirect URIs, inbound from uVENTURE, outbound to the uVENTURE webhook host, uVENTURE's `frame-ancestors`) and the written SMTP AUTH answer due before 1 December (`16-integration-map.md` section 11, item 7) | |
| 2 | Backups and restore tested | Deploy engineer | 2026-11-09 | `scripts/restore-test.sh` passes on the production host, and the full drill of `16-integration-map.md` section 10.4 is recorded in its table | |
| 3 | Roles assigned to every member of the vertical | ED (Twenty), uVENTURE administrator (uVENTURE) | 2026-11-09 | Every member holds the role of `13-roles.md` section 1 in Twenty and the mapped role in uVENTURE; `uventure-role-map.json` status confirmed; one line per person in the access review table; nobody on the default role | |
| 4 | Lookups loaded | Engineering lead, uVENTURE administrator | 2026-11-10 | Production on 0.11.0 (`plan` read, no removal); `yarn test:unit` green on the deployed commit; uVENTURE reads `/s/integrations/uventure/lookups` and its `ETag` equals the `version` in `lookups.json` | |
| 5 | The three playbooks live | Ops coordinator | 2026-11-12 | `CRM_PACK_ENABLED`, `PM_PACK_ENABLED`, `GTM_PACK_ENABLED` on in production; the three BD pack tabs open; `crm-pack.md`, `pm-pack.md`, `gtm-pack.md` published on the Help page; every active project has its RAID log note | |
| 6 | Guidance texts in place | Ops coordinator | 2026-11-12 | Every record page and dashboard tab opens with its five lines in English and Arabic (`20-guidance.md` section 10 matches the app, `guidance.test.ts` green); Help page sections and screencast list updated (`20-guidance.md` sections 5 and 7) | |
| 7 | Seed data migrated, no lead or opportunity without an owner or a next action | Ops coordinator | 2026-11-13 | Day-one import done (`09-import.md`); **Hygiene: missing key fields** and **No next action** on Opportunities, and Leads with no owner or no next action date, all return zero rows; screenshot of each in the evidence folder | |
| 8 | Cadence running for two weeks | ED | 2026-11-16 to 2026-11-27 | Two Monday standups, two Thursday updates (`06-weekly-update.md`), two Monday hygiene sweeps (`14-hygiene.md`) and two weekly reviews (PM pack) held and recorded; Exceptions empty at each Thursday update | |
| 9 | One uVENTURE contract proven end to end: the Capability sync | Engineering lead, uVENTURE administrator | Staging 2026-11-05; production 2026-11-19 | Staging: tests S1, U1 and U6 of section 4.5 pass, evidence saved. Production: three nightly snapshots in a row complete (job log `run complete`), one real technology created in uVENTURE appears as a Capability the same night, is linked to a case, and `uventure-sweep` raised nothing | |
| 10 | Go or no-go | ED | 2026-11-30 | The ED reads items 1 to 9 and writes go (pilot starts Monday 7 December 2026) or no-go with the items to fix and a new date, in this table | |

Items 1 to 9 can run in parallel where their owners differ; item 8 needs items 3, 5 and 7, and item 10 needs all of them.

---

## 7. Other files this changes

| File | Change |
| --- | --- |
| `kuec/CLAUDE.md` | Section 5 amended: Capability pointer and signed uVENTURE feeds allowed, uVENTURE still the system of record; G1 lifted |
| `16-integration-map.md` | G1 marked lifted; sections 1 and 3 point here for the contracts as built |
| `18-taxonomy.md` | Capability type maps to Capability > Kind; new lists Capability status and Campaign channel; the uVENTURE read route and the diff script |
| `05-views.md`, `12-global-features.md` | The decision of 2026-10-15 (no Capability object) superseded |
| `13-roles.md` | Commercialization and uVENTURE reader roles; locks on Capability and Contract integration fields; Capability read-only for every role; joiner and leaver point to section 2.5 |
| `04-automation.md` | The uVENTURE and pack functions |
| `19-leads.md` | Challenge and uVENTURE sign-up leads |
| `14-hygiene.md` | Monday sweep: Capabilities > Not seen in uVENTURE for 7 days |
| `20-guidance.md` | New guidance pages rendered; Help page sections for the packs and uVENTURE |
| `01-deploy.md` | Staging publish with `KUEC_UVENTURE_ORIGIN`; iframe origin step; new roles |
| `config/deploy/*` | Hosts under the uVENTURE domain; IT request items; proxy note |
| `config/dashboards/iframe-embedding.md`, `uventure-api-key.md` | New click-runbooks |
| `config/roles/uventure-role-map.json` | New: the role mirror |
| `kuec/playbooks/crm-pack.md`, `pm-pack.md`, `gtm-pack.md`, `diff-lookups.ts` | New |
| `kuec/tests/uventure/` | New: the staging kit |
| `roadmap/2027-q1.md` | N1, N2 and C4 shipped in 0.11.0; C5 replaced by U3 adoption |
