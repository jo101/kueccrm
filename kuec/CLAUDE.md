# CLAUDE.md: KUEC BD Ops on Twenty

Read this file in full before every task in `kuec/`. If a task conflicts with a rule here, stop and ask; do not work around it.

## What this is

Twenty CRM 2.48.0, self-hosted, is the work-management layer for the KUEC technology-commercialization business-development team in Abu Dhabi. Team: 4 BD staff who are new to BD, 2 to 4 engineers, and one executive director (ED). The ED should stop firefighting and chasing follow-ups. The configuration exists to make sure nothing open goes without an owner, a next step and a date, and to escalate automatically when that slips.

The repo `jo101/kueccrm` is a fork that tracks upstream Twenty. Everything KUEC-specific lives under `kuec/`. Nothing outside `kuec/` is edited, so upstream syncs stay conflict-free, except the branding files listed in section 1. The upstream root `CLAUDE.md` still applies to Twenty conventions (TypeScript style, named exports, no `any`, `isDefined` and similar guards).

## Layout

```
kuec/
  CLAUDE.md            this file
  app/                 the SDK app kuec-bd-ops (create-twenty-app scaffold)
  config/deploy/       env templates, compose overrides, version pin, deploy and upgrade steps
  config/dashboards/   click-runbooks for anything configured in the Settings UI
  playbooks/           how BD staff work: stages, next actions, handoffs, in plain language
  runbooks/            how engineers and the ops coordinator run the system: incidents, key rotation, restore, import
  roadmap/             one file per quarter: metrics, every gap in one bucket, what ships next
  tests/               app tests that run outside the app package (rules, sweeps, end-to-end)
```

## Non-negotiables

### 1. No core changes. One app.

- Never modify `packages/twenty-server`, `packages/twenty-front`, or any other upstream package. No patches, no forks of core files, no `patch-package`.
- One exception, branding only (requested by KUEC management on 2026-10-21): the uVENTURE icon set in `packages/twenty-front/public/images/icons/`, the app name and titles in `packages/twenty-front/index.html`, `public/manifest.json`, `src/utils/title-utils.ts`, `src/pages/auth/SignInUp.tsx` and `src/pages/not-found/NotFound.tsx`, the default workspace logo constant, and the email logo, head title, footer and "What is" block in `packages/twenty-emails/src/components/`. Images, names and links only; no behaviour changes. Keep these files as they are when syncing upstream, and regenerate the icons with `python kuec/design/brand/make-icons.py kuec/design/brand/uventure-icon.png packages/twenty-front/public/images/icons` if upstream adds or changes sizes. Because of this, the server image is built from this fork, not pulled from `twentycrm/twenty`.
- Everything we add lives in one SDK app, `kuec-bd-ops`, in `kuec/app`, scaffolded with `create-twenty-app`: objects, fields, relations, views, navigation menu items, page layouts, logic functions, front components, roles, and install hooks.
- Reference pattern: `packages/twenty-apps/internal/real-estate` (one entity per file under `src/objects`, `src/fields`, `src/views`, `src/page-layouts`, `src/navigation-menu-items`, `src/roles`, `src/logic-functions`; `application.config.ts` with `defineApplication`). Copy its structure, not its shortcuts: it uses TypeScript `enum` and `as any`. We use `as const` string-literal objects and typed clients.
- The Settings UI is used only for what the manifest cannot express. Every such step has a click-runbook in `config/dashboards/` (see Click-runbooks below). If it is not in a runbook, it does not exist.

### 2. Manifests are additive only

- Never delete an object, field, view, role, select option, or logic function from the manifest. On apply, a missing entity is dropped, and that drops its table or column and the data in it.
- To retire something: relabel it with a `(deprecated)` suffix, set `isActive: false`, remove it from views and page layouts, and note the date and reason in a comment.
- `universalIdentifier` values and select option `id`s are generated once (`uuidgen`) and never changed. Changing one is a delete plus a create.
- Never rename a field's `name` (API name). Relabel instead.
- Before any `apply` or `deploy`, run `plan` and read it. Any line that removes or recreates an entity blocks the deploy.

### 3. Platform and hosting

- Twenty version pinned at exactly `2.48.0` for the server image, `twenty-sdk`, and `twenty-client-sdk`. No floating tags (`latest`, `v2`). Upgrades are a deliberate task with their own runbook.
- Telemetry off: `TELEMETRY_ENABLED=false`.
- Branding follows `.github/TRADEMARK.md`. The instance is branded uVENTURE CRM (see the branding exception in section 1): it never presents itself as an official Twenty product and never uses or alters the Twenty logo as our own. Saying it is built on Twenty is allowed and truthful. Keep the AGPL licence notices and the public source.
- One API key for automation, scoped to a dedicated role with only the objects and permissions it needs. Rotated quarterly per `runbooks/`. Never committed; never pasted into a runbook, test, or log.
- Plan: free self-hosted, which includes the Pro feature set. Row-level permissions, SSO, audit logs, and additional workspaces are Organization-plan features: do not design anything that depends on them. Access control is object- and field-level through roles.

### 4. Data classes

- Twenty holds relationships and work: companies, people, leads, opportunities, projects, milestones, work packages, tasks, notes, contract metadata (counterparty, type, status, key dates, value, owner), and document metadata (type, status, confidentiality, version, expiry, and the link to the file).
- Never upload contracts, proposals, IP disclosures, or confidential documents to Twenty, including as attachments, notes, or pasted text. A record carries a link (SharePoint or uVENTURE) instead.
- Link fields are `LINKS` type. Label them by destination, e.g. "SharePoint folder", "uVENTURE record".

### 5. uVENTURE is the system of record

- Technologies, patents, licences, equipment, and industry challenges live in uVENTURE. Twenty never copies their attributes beyond the pointer fields below.
- Since 2026-10-17 (gate G1 of `runbooks/16-integration-map.md` lifted, `runbooks/21-uventure-readiness.md`): one **Capability** pointer object holds a technology, disclosure or listing's name, kind, status and uVENTURE link, nothing else, written only by the uVENTURE feed and read-only for every person role. TRL, patents, inventors, owners, descriptions and licence terms are never copied.
- uVENTURE writes to Twenty only through the signed server route (section 8), keyed on the Unique `externalId`, and only the record types its source-of-truth matrix gives it (runbooks/21 section 4.1): Capability pointers, leads from challenges and sign-ups, and the metadata of contracts signed in uVENTURE. Twenty tells uVENTURE through signed app calls and a read-only API key, never by writing into uVENTURE.
- Opportunities, contracts and leads carry a uVENTURE link field labelled "uVENTURE record". A pointer gone from uVENTURE is shown, never deleted.

### 6. Automation

- All automation is app logic functions in TypeScript: database-event triggers, cron triggers, background jobs, and server routes. Written by an engineer, tested in `tests/` or the app, versioned in this repo.
- Workflow-builder Code actions are not used. Do not create workflows in the UI to stand in for app logic.
- BD users never hold workflow-management permission. Check this in every role definition.
- Phase A: data model, views, page layouts, roles, logic functions. Phase B: front components. Do not build front components in Phase A.
- No AI features (agents, AI fields, AI chat) and no separate execution service, in either phase.

### 7. Operating rules the configuration enforces

| Rule | Enforcement |
| --- | --- |
| Every open opportunity has an owner, a next action, and a next-action date | Required on the record page; a sweep flags open opportunities missing any of them to the owner (or the ED when there is no owner) |
| Every work package has an owner, a due date, and done criteria | Same pattern |
| Work package not accepted within 2 business days | Notify owner and ED |
| Work package not accepted within 5 business days | Reassign to the ops coordinator, notify old owner, new owner, ED |
| Overdue work | Notify owner on day 0; notify ED at +2 days |
| Blocked work package | Blocking requires a reason; the ED is notified every time, with the reason |

Definitions to apply consistently:
- Business days: Monday to Friday (UAE weekend is Saturday and Sunday), excluding UAE public holidays held in a holiday list in the app. Never hardcode a year's holidays in logic.
- Local time is Asia/Dubai (UTC+4, no DST). "Day" boundaries are computed in Asia/Dubai, not UTC.
- "Accepted" and "blocked" are explicit select states on the work package, with timestamps the app sets, not inferred.
- The ops coordinator is a workspace member identified by configuration, not a hardcoded id.
- Each escalation is idempotent: record that it fired (e.g. a timestamp field per escalation level) so a sweep or a retry never notifies twice.

### 8. Platform facts to design around

- A Record-created trigger fires before a manually created record is filled. Do not react to `*.created` for business rules. Listen on `*.updated` with `updatedFields` filters, and gate on a guard field (e.g. the field that marks the record as complete or accepted).
- Cron patterns are UTC. Asia/Dubai 08:00 is `0 4 * * *`. Write the local time in a comment next to every pattern.
- Logic functions are disabled in production unless `LOGIC_FUNCTION_TYPE` is set (`LOCAL` for us). App crons and scheduled workflows run only if the worker's cron jobs are registered (`cron:register:all`). Both are in the deploy checklist and verified after every deploy.
- A database event can be lost on a server restart. Every timer and escalation is also re-derived by an hourly sweep from record state alone. Event handlers are a fast path, the sweep is the guarantee, and both call the same rule code.
- Workflow-builder runs never retry. Background jobs retry up to 3 times when the handler asks. Handlers must be idempotent and must signal retryable failures.
- Table and kanban grouping is Select-field only. Anything people need to group by (stage, status, health, escalation level) is a `SELECT` field, kept in sync by the app if it is derived.
- Record-triggered automation is paused before any CSV import and resumed after, per the import runbook. Run the sweep after resuming.
- Workflow-builder webhook triggers have no authentication and are not used. Inbound integrations use a server-route logic function that verifies a signature (HMAC over the raw body with a shared secret, constant-time compare, timestamp window) before doing anything.

## App conventions

- Package name `kuec-bd-ops`. One file per entity, named like real-estate: `work-package.object.ts`, `owner-on-work-package.field.ts`, `open-opportunities.view.ts`, `bd-staff.role.ts`.
- Export each `universalIdentifier` as a SCREAMING_SNAKE_CASE constant from the file that defines it, and import it everywhere else.
- Select values: `as const` objects of string literals, stored in the field file and imported by logic.
- Field and object descriptions come from `app/src/i18n/fields.json` through `fieldDescription()` and `objectDescription()`, never a string literal in the field file. The Arabic of every catalog string lives in `app/src/i18n` and reaches `locales/ar-SA.json` through `yarn i18n:sync`.
- Business rules are pure functions (input: record state and "now"; output: actions) in their own module. Handlers and sweeps only load data, call the rule, and apply the actions. Tests target the pure functions with a fixed clock.
- Install hooks seed reference data only (holiday list, config records). Never demo data, never personal data.
- Roles: at minimum ED, BD staff, engineer, ops coordinator, and the automation role behind the API key. Least privilege; no BD role gets workflow, data model, or API key settings.

## Click-runbooks

One Markdown file per Settings-UI change in `config/dashboards/`. Each states: why the manifest cannot do it, the Twenty version it was written against, prerequisites and role needed, numbered click steps with exact labels, expected result, how to verify, and how to undo. Update the runbook in the same change that relies on it.

## Definition of done

The people using this CRM have never used one, so the system explains itself. Every change ships with its field descriptions, its widget text and its tooltip, or it does not ship. Rules and steps: `runbooks/20-guidance.md` sections 1 to 8.

- [ ] **Field descriptions.** Every field added or changed has a one-sentence description in English and Arabic (what to put, and when) in `app/src/i18n/fields.json`, and its definition reads it with `fieldDescription('object.field')`. Every select option added or changed has a label in plain words with no abbreviations and a one-sentence description in English and Arabic, in `playbooks/lookups.json` for a KUEC-wide list or `app/src/i18n/options.json` for a Twenty-only list; Other stays last, and a list without a natural order starts with its most common case.
- [ ] **Widget text.** Every record page or dashboard tab added or changed opens with its five lines (what it is, who owns it, what must be filled, what happens automatically, where to get help) in English and Arabic in `app/src/i18n/guidance.json`, and section 10 of `runbooks/20-guidance.md` is re-rendered (`yarn guidance:render`). A page that shows work packages says that Request help is the way out when you don't know what to do.
- [ ] **Tooltip.** Every front-component control added or changed has an info icon with a one-sentence tooltip (twenty-ui `Tooltip`, `WithInfo` or `InfoTooltip` in `app/src/front-components/shared/info-tooltip.tsx`), and every screen ends with a "What do I do now?" line naming the next action. The texts are `msg()` or `t()` calls in the front component's own file, with their Arabic in `app/src/i18n/interface.json`.
- [ ] **Catalog.** `yarn twenty dev:translations-extract`, `yarn i18n:sync` and `yarn test:unit` run clean in `app/`; `locales/ar-SA.json` is never edited by hand.
- [ ] **Outside the app.** The Help page sections and the screencast list that the change makes out of date are updated (`runbooks/20-guidance.md` sections 5 and 7).

## Before every task

1. Re-read this file.
2. Confirm the work belongs in `kuec/` and touches no upstream package.
3. If it changes the manifest: additive only, new UUIDs generated, `plan` reviewed.
4. If it adds automation: event fast path plus sweep, idempotent, Asia/Dubai business-day math, tested with a fixed clock.
5. If it needs the Settings UI: write or update the click-runbook.
6. Commits carry no AI attribution.
7. Before calling it done, tick every box of the Definition of done.
