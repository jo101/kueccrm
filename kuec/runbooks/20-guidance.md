# 20: Guidance: how the CRM teaches itself

Written against Twenty 2.48.0 and `kuec-bd-ops` 0.10.0. Owners: the ops coordinator (the texts and the Help page), the ED (approves any change of meaning), the engineering lead (ships them). Readers: anyone who writes a field, a list, a page or a screen for the CRM, and engineers.

The people who use this CRM have never used one. Each screen therefore says, in English and Arabic, what it is, who owns it, what to fill in, what happens on its own and where to get help, and the work package card always ends with the next thing to do. This runbook holds every one of those texts (sections 10 to 12, generated), the rules for writing them (sections 1 to 6), the Help page (section 5), the screencasts still to record (section 7) and how a change ships (section 8).

Contents

0. What a new employee sees
1. Field and option descriptions
2. Option labels in plain words
3. The "How this record works" and "How this tab works" widgets
4. The work package card
5. The Help page
6. When you don't know what to do: Request help
7. Screencasts to record
8. Shipping a guidance change, and the definition of done
9. Install and verify (0.10.0)
10. Every widget text (generated)
11. Every option of the Twenty-only lists (generated)
12. Every field (generated)

---

## 0. What a new employee sees

| Where | What | Source |
| --- | --- | --- |
| Any field on a record page or a table column | Hover the field name: a one-sentence description, in the member's language | `kuec/app/src/i18n/fields.json` |
| Top of the Home tab of every record page | **How this record works**: five lines in English, then the same five in Arabic | `kuec/app/src/i18n/guidance.json` |
| Top of every dashboard tab (Home, Exceptions, Data quality, BD Executive, Team, Mine) | **How this tab works**: the same five lines for the tab | `guidance.json` |
| The work package card | An info icon beside every button, field and status, with a one-sentence tooltip; a **What do I do now?** line at the end of every screen | `kuec/app/src/front-components/work-package-card.front-component.tsx`, Arabic in `kuec/app/src/i18n/interface.json` |
| Sidebar, last entry | **Help**: the SharePoint page with the cadence guide, the taxonomy, the day-one checklist and the screencasts | `kuec/app/src/navigation-menu-items/help.navigation-menu-item.ts`, section 5 |
| Any open work package | **Request help** on the card for its owner, whatever the status | section 6 |

The five lines are always, in this order: **What it is**, **Who owns it**, **What must be filled**, **What happens automatically**, **Where to get help** (ما هذا، من المسؤول، ما يجب ملؤه، ما يحدث تلقائياً، أين تجد المساعدة).

## 1. Field and option descriptions

- **Every field the app adds has a description of one sentence in English and Arabic: what to put in it, and when.** A field the app fills itself says so and ends with "you never type it". The texts are in `kuec/app/src/i18n/fields.json`, keyed `object.field`, together with the Arabic label. Field files and object files take their English description from there (`fieldDescription('lead.need')`), so the manifest and the catalog cannot drift.
- **Every select option has a description of one sentence in English and Arabic.** The KUEC-wide lists are in `kuec/playbooks/lookups.json` (`18-taxonomy.md`); the Twenty-only lists (statuses, reasons, tiers, roles, probability, stage) are in `kuec/app/src/i18n/options.json`. Each select list in the manifest takes its options from exactly one of the two.
- **They ship through the app's catalog.** `yarn twenty dev:translations-extract` writes every label and description into `kuec/app/locales/en.json` and keeps the keys of `ar-SA.json` in step; `yarn i18n:sync` then writes the Arabic of `src/i18n` into `ar-SA.json`. A member whose language is Arabic sees the field label and its description in Arabic together. `src/i18n/i18n.test.ts` fails when a field, an object or a card string has no Arabic.
- **What Twenty 2.48 cannot show.** A select option has no description in 2.48, and the app catalog does not translate option labels, so option labels show in English in the Arabic interface. The option descriptions reach people through the Help page (section 5: the taxonomy and section 11) and, for the work package status, the card's status tooltip. The Arabic texts therefore quote option labels as they appear on screen, in English ("اجعل الحالة Dead"), and field labels and card buttons in Arabic.
- **Writing a description.** One sentence, ending with a full stop, no second sentence after a semicolon that could stand alone. Say what to put and when, in the words people use: "The day you will do the next action, kept today or later." Name an option by its label exactly. Spell out abbreviations; "the ED" and "the ops coordinator" are the team's names for two people and stay.

## 2. Option labels in plain words

1. **No abbreviations.** An option label is read by someone in their first week: "Non-disclosure agreement", not "NDA". Proper names (KUEC, uVENTURE, LinkedIn, Apollo, programme names) stay. `src/i18n/i18n.test.ts` rejects any word in capitals in an option label except KUEC, QR, AED and UAE.
2. **In the order a new employee expects.** A list with a natural order (a lifecycle such as a status, a scale such as probability or tier, a level of confidentiality) keeps it. Every other list starts with its most common case and groups neighbours together, such as the referral sources.
3. **Other is last**, after any deprecated option, as in `18-taxonomy.md` section 2.
4. **Values never change.** A relabel or a new position changes only the label and the position; the option `id` and `value` stay, so no record changes and uVENTURE, which matches on value, is unaffected.

Changed in 0.10.0. These are relabels without a change of meaning (`18-taxonomy.md` section 2, rule 3), out of the quarterly cycle at the ED's request; attach the ED's written approval to the release and send the list to the uVENTURE team (`18-taxonomy.md` section 6, step 6).

| List | Was | Now |
| --- | --- | --- |
| Department | BD, IP office | Business development, Intellectual property office |
| Source (lead and opportunity) | Gala QR, TRL Bridging Program, Referral: KU leadership, Referral: CEO or board, Tender or RFQ portal, Outbound sequence | Gala QR code, Technology Readiness Level Bridging Program, Referral: Khalifa University leadership, Referral: chief executive or board, Tender or quotation portal, Outbound email sequence |
| Opportunity type | Research collaboration or JDA, Offset or ICV project, Partnership or MoU | Research collaboration or joint development, Offset or in-country value project, Partnership or memorandum of understanding |
| Offering (lead and opportunity) | IP licence | Intellectual property licence |
| Funding path | ICV | In-country value programme |
| Contract kind, Document type | NDA, MoU, MSA, TSA, JDA | Non-disclosure agreement, Memorandum of understanding, Master services agreement, Technical services agreement, Joint development agreement |
| Document type | Proposal or SOW, RFQ or RFP received, PO or invoice (...), Vendor registration or KYC, Faculty profile or CV | Proposal or statement of work, Request for quotation or proposal received, Purchase order or invoice (...), Vendor registration or know-your-customer check, Faculty profile or résumé |
| Project type | GTM campaign | Go-to-market campaign |
| Task type | Admin | Administration |
| Company sector | ICT and digital | Information technology, telecoms and digital |
| Company size class | SME | Small or medium business |
| Lead dead reason | Competitor, Timing, Not decision maker | Went to a competitor, Wrong timing, Not the decision maker |
| Lost reason category | Price, Timing, Technical fit, Our capacity | Price too high, Wrong timing, Not a technical fit, No capacity on our side |
| Playbook role | ED, BD officer, Ops coordinator | Executive director, Business development officer, Operations coordinator |
| Project health | Green, Amber, Red | Green (on track), Amber (at risk), Red (off track) |
| Lead source system | Gala QR form | Gala QR code form |

Reordered in 0.10.0, most common case first: Engagement kind (Intro meeting, Call, Email thread, then the deal meetings in deal order, then events and programmes), Engagement outcome type (Follow-up agreed first), Source (Inbound, Existing customer and the referrals first), Opportunity type (Licence, then Technical service), Lead status (Converted right after Qualified, then Nurture and Dead), Lost reason category (No response first), Playbook role (Business development officer first). The grouped views follow the new order (Opportunities and Leads > By source, Opportunities > By type, Lost with reasons). Offering keeps its order, because the conversion takes the opportunity type from the first offering in that order (`19-leads.md` section 4).

## 3. The "How this record works" and "How this tab works" widgets

- **Where.** A rich-text widget opens the Home tab of every record page (Company, Person, Opportunity, Note, Task, Lead, Engagement, Project, Milestone, Work package, Contract, Document, Playbook role assignment, UAE public holiday), above Twenty's field list, and every dashboard tab (Home, Exceptions, Data quality, BD Executive, Team and Mine), above its first table. Record pages: `kuec/app/src/page-layout-widgets/*-guidance.page-layout-widget.ts`. Tabs: the first widget of each file in `kuec/app/src/page-layout-tabs/`. The Home tab is the record page's first tab (the brief's "Overview").
- **The texts are pasted once, into `kuec/app/src/i18n/guidance.json`.** The brief asked for the texts to live here and be pasted once by an engineer. In 2.48 a widget that ships in the app is rewritten by every `app:install`, which re-applies its body, as with the Thursday update (`06-weekly-update.md` section 3); a body pasted in Edit Layout would vanish at the next deploy. So the engineer pastes the texts once into `guidance.json`, the app builds the widget bodies from it, and `yarn guidance:render` writes them into section 10 of this runbook. Nobody edits a guidance widget in Edit Layout.
- **Both languages in one body.** The catalog translates the widget title but not its body, so the body carries the five English lines, then the five Arabic lines, right-aligned. The title shows in the member's language.
- **Changing a text.** Edit `guidance.json`, run `yarn guidance:render` and `yarn test:unit` in `kuec/app`, and ship it with the next release. A change of meaning (who owns a record, what the app does) is approved by the ED first, like a taxonomy change.

## 4. The work package card

- **An info icon beside every control**, with a one-sentence tooltip (twenty-ui `Tooltip`, icon `IconInfoCircle` from `twenty-ui/icon`): Open full record, Accept, Decline, Submit, Request help, Try again, Cancel, the Decline and Ask for help confirmations, the two one-line text fields, and the status badge. The status tooltip gives the status by its name in the record ("Status Offered: ...") next to the card's plain words ("Waiting to be accepted"). The icon is focusable, so the tooltip opens from the keyboard too, and it sits beside the control, never inside it.
- **Every screen ends with "What do I do now?"** and one line naming the next action: while the card loads, when it fails, when the work package is missing, for the owner on each status, for the reviewer of submitted work, for anyone else, and while the Decline or Request help form is open. Which line applies is decided by `getCardNextStep` in `work-package-card-rules.ts`, tested with every case.
- **Every card text is declared in the card's own file**, because the SDK extracts catalog strings from that file only; the Arabic is in `src/i18n/interface.json`. Until 0.10.0 the status words lived in another module and never reached the catalog.

## 5. The Help page

**Help** is the last entry of the sidebar, under Data quality (position -8.5). It opens `https://kuac.sharepoint.com/sites/BD/SitePages/CRM-Help.aspx` (`HELP_PAGE_URL` in `help.navigation-menu-item.ts`); the sidebar marks it with an arrow as a link outside the CRM. The page lives on SharePoint so that it changes without an app release and everyone at KUEC can open it with their usual sign-in.

**Before the first install of 0.10.0 (ops coordinator, with an engineer):**

1. Confirm the address with IT: a page named **CRM-Help** in the BD site's Site Pages library. If IT gives another address, an engineer changes `HELP_PAGE_URL` before the release; a different address after the release is a new release.
2. Create the page with the six sections below, in this order, each as its own heading. Paste the text from the runbooks named; link the screencasts once they exist. Arabic sections go in a right-to-left text web part.
3. Set the page permissions to everyone in the BD and department groups, read only; the ops coordinator and the ED edit.

| # | Section on the Help page | Paste from |
| --- | --- | --- |
| 1 | Start here: your first day | `10-onboarding.md`, the five questions and the mailbox step |
| 2 | How we work | `10-cadence-en.md` and `10-cadence-ar.md`, in full |
| 3 | What each list and option means | `18-taxonomy.md` section 8 and this runbook section 11 |
| 4 | What each field means | this runbook section 12 |
| 5 | Every screen | this runbook section 10, each screen with its screencast (section 7) |
| 6 | When you don't know what to do | section 6 below |
| 7 | The CRM and uVENTURE (0.11.0) | `21-uventure-readiness.md` sections 1.4 (signing in once in each), 1.6 (the links both ways) and 4.1 (who owns what), and the Capability guidance of section 10 |
| 8 | Our best-practice packs (0.11.0) | `kuec/playbooks/crm-pack.md`, `pm-pack.md` and `gtm-pack.md`, in full, each under its tab name: Pipeline pack, Project pack, Campaign pack |

**Keeping it current.** Every release that changes `src/i18n`, `lookups.json`, the cadence guide or the onboarding checklist changes the matching section of the Help page the same day; the release note names the sections. The ops coordinator checks the page against this runbook at each quarterly taxonomy review.

## 6. When you don't know what to do: Request help

**The one rule, on every page where a work package appears: if you do not know what to do with a work package, open it and press Request help on its card.** The ops coordinator gets a task due today with your question, linked to the work package, and the work stays yours with the same status and due date.

- The owner has **Request help** on every open status: Planned, Offered, Accepted, Submitted and Blocked. Until 0.10.0 it appeared only after Accept.
- The pages that show work packages say so in their last line: the Opportunity, Project, Milestone, Task and Work package record pages, and the Home, Exceptions, Data quality, Team, Mine and Project pack tabs (`showsWorkPackages` in `guidance.json`, checked by `src/i18n/guidance.test.ts`). On the Help page the rule is section 6 and it is repeated on each of those screens.
- Help is not a block: when someone else must act before you can go on, set **Blocked** with the reason (`10-cadence-en.md` section 6).

## 7. Screencasts to record

One screencast of about 10 minutes per screen, for people in their first week. Not recorded yet. The ops coordinator records them on the staging instance (`01-deploy.md` section 11) with test records only, never real names, companies or values, in English with Arabic captions, and stores them on the BD SharePoint site next to the Help page. Each one starts with the screen's five lines (section 10) and ends with its "What do I do now?".

| # | Screen | For | What it shows, in order | File name |
| --- | --- | --- | --- | --- |
| 1 | Sign-in, sidebar and Help | Everyone | Continue with Microsoft, the sidebar from Home to Help, the Help page, search with Ctrl+K in English and Arabic, hovering a field for its description | `crm-01-getting-around.mp4` |
| 2 | Home | Everyone | Needs your decision, Your next actions, Other work is progressing; opening a row; why a row leaves the list | `crm-02-home.mp4` |
| 3 | My work and the work package card | Everyone | My work, a work package record page, the card on each status: Accept, Decline with a reason, Submit, Request help on an offered and on a blocked work package, setting Blocked with a reason in the full record, every info icon | `crm-03-work-package-card.mp4` |
| 4 | Leads | Everyone | Creating a lead the same day, Lead inbox, My leads, the five checks, Qualified, Converted, Nurture and Dead with a reason, referral credit | `crm-04-leads.mp4` |
| 5 | Pipeline and the opportunity | Business development officers, the ED | Pipeline by stage, an opportunity record page, Type starting a playbook, next action and date, Source, Offering, Funding path, SharePoint folder, Lost with a reason | `crm-05-opportunity.mp4` |
| 6 | Companies and people | Everyone | Searching before creating, a company record page, Account tier and Search keywords, a person with Decision role and Arabic name, reporting a duplicate | `crm-06-companies-people.mp4` |
| 7 | Engagements | Everyone | Logging a meeting, a call and an email thread, linking the lead or opportunity, Outcome within 2 days, Next step becoming the next action | `crm-07-engagements.mp4` |
| 8 | Projects and milestones | Project owners | Picking Workshop with the event date, the milestones and work packages it creates, Health, closing a project | `crm-08-projects.mp4` |
| 9 | Contracts and documents | Business development officers, the ops coordinator | A contract record, Kind and Status, Signed on and Expires on, a Document with its SharePoint link and confidentiality, never uploading a file | `crm-09-contracts-documents.mp4` |
| 10 | Exceptions | The ED, every owner | Blocked, Overdue and No next action, fixing a row where it is listed, the Thursday review | `crm-10-exceptions.mp4` |
| 11 | BD dashboard: Executive | The ED | Reading the charts and the tables beside them, the Thursday update | `crm-11-bd-executive.mp4` |
| 12 | BD dashboard: Team | The whole team | The Monday standup from Team, the work package board, dragging a card | `crm-12-bd-team.mp4` |
| 13 | BD dashboard: Mine | Everyone | Your own numbers, clearing overdue work, giving every opportunity a next action | `crm-13-bd-mine.mp4` |
| 14 | Data quality | The ops coordinator, every owner | The Monday run, opening a count, fixing Other with Other details | `crm-14-data-quality.mp4` |
| 15 | Tasks and notes | Everyone | The Tasks list, reminders as tasks, marking Done, writing a note on a record and what never goes into one | `crm-15-tasks-notes.mp4` |
| 16 | Your mailbox and calendar | Everyone | Settings > Accounts, Connect with Microsoft, the team settings, the Emails and Calendar tabs | `crm-16-mailbox.mp4` |
| 17 | Playbook roles and public holidays | The ED, the ops coordinator | Playbook role assignments (one active Executive director and Operations coordinator), entering the year's UAE public holidays | `crm-17-configuration.mp4` |
| 18 | The CRM and uVENTURE (0.11.0) | Everyone | Sidebar > uVENTURE and its three tabs, signing in once in each system, Open uVENTURE, a Capability and its uVENTURE record link, linking a capability to an opportunity and an engagement, Not available to offer, a challenge arriving as a lead | `crm-18-uventure.mp4` |
| 19 | Pipeline pack (0.11.0) | Business development officers, the ED | The tab top to bottom, the stage exit criteria table, a C1 task and fixing it, account tiers, referral credits | `crm-19-pipeline-pack.mp4` |
| 20 | Project pack and the weekly review (0.11.0) | Project owners | The Monday review task, the tab, editing the RAID log note, clearing Red with a note | `crm-20-project-pack.mp4` |
| 21 | Campaign pack (0.11.0) | Campaign owners, the ED | Setting up a Go-to-market campaign project, the target list appearing, working targets, a campaign lead, why cost per qualified lead is blank | `crm-21-campaign-pack.mp4` |

A screencast is re-recorded when its screen changes in a release (the release note says which).

## 8. Shipping a guidance change, and the definition of done

Every change to the CRM ships with its guidance, or it does not ship (`kuec/CLAUDE.md`, Definition of done). In `kuec/app`:

1. **Fields and options.** A new or changed field: its entry in `src/i18n/fields.json` (label and description, English and Arabic) and `description: fieldDescription('object.field')` in the field definition. A new or changed option: `kuec/playbooks/lookups.json` for a KUEC-wide list (`18-taxonomy.md` section 7), `src/i18n/options.json` for a Twenty-only list, in plain words, Other last.
2. **Pages.** A new record page or dashboard tab: its five lines in `src/i18n/guidance.json` and its guidance widget (`*-guidance.page-layout-widget.ts`, or `guidanceTabWidget` first on the tab with `belowGuidance` around the rest). A page that shows work packages names Request help in its last line.
3. **Front components.** Every new control: `WithInfo` or `InfoTooltip` from `src/front-components/shared/info-tooltip.tsx` with a one-sentence tooltip; every new screen or state ends with a "What do I do now?" line. Texts are declared with `msg()` or `t()` in the front component's own file; the Arabic goes into `src/i18n/interface.json`.
4. **Catalog and runbook.** `yarn twenty dev:translations-extract`, then `yarn i18n:sync`, then `yarn guidance:render`, then `yarn test:unit`. `src/i18n/i18n.test.ts` and `src/i18n/guidance.test.ts` fail on any missing description, Arabic text, abbreviation, guidance widget or stale runbook section.
5. **Outside the app.** The Help page sections that changed (section 5) and the screencasts that are now out of date (section 7) are updated the day the release goes out.

## 9. Install and verify (0.10.0)

1. `npx twenty plan`. Added: 20 rich-text widgets (14 record pages, 6 dashboard tabs) and the Help navigation menu item. Changed: the description of most fields and of the nine objects, the label and position of the select options in section 2, the group positions of the four grouped views, the widget rows of the six dashboard tabs, and the code checksum of the front component. Nothing removed or recreated; any such line blocks the deploy.
2. The Help page exists at its address (section 5).
3. `app:publish` and `app:install` (`05-views.md` section 5). Upgrade after Thursday's update has gone out: the install resets the Thursday update text (`06-weekly-update.md` section 3).
4. Verify, signed in as a business development officer:
   - An opportunity: the Home tab opens with **How this record works** above the field list; hovering **Next action** shows its description.
   - **BD Executive**: every tab opens with **How this tab works**; on Executive the Thursday update follows it.
   - A test work package you own, Offered: the card shows Accept, Decline and Request help, each with an info icon whose tooltip opens on hover and on Tab; the last line reads "What do I do now? Accept it if it is yours to do...". Set it to Blocked with a reason: Request help is still there.
   - **Help**, the last sidebar entry with an arrow, opens the Help page.
   - Switch your language to Arabic (Settings > Experience): field labels and descriptions, the card and the widget titles are in Arabic; option labels stay in English (section 1).
   - Opportunities > By source lists Inbound, Existing customer and the referrals first.

---

<!-- Generated from kuec/app/src/i18n by kuec/app/scripts/render-guidance.mjs. Edit the JSON and re-run the script; do not edit below this line. -->

## 10. Every widget text

16 record pages and 12 dashboard tabs, from `kuec/app/src/i18n/guidance.json`. The widget shows the five English lines, then the five Arabic lines.

### 10.1 Company (الشركة)

Widget **How this record works** (كيف يعمل هذا السجل), key `company`.

| | English | العربية |
| --- | --- | --- |
| 1 | **What it is:** A company or public body KUEC works with or wants to, and everything about that relationship hangs off this page. | **ما هذا:** شركة أو جهة عامة تعمل معها KUEC أو تريد العمل معها، وكل ما يخص هذه العلاقة مرتبط بهذه الصفحة. |
| 2 | **Who owns it:** The account owner keeps it current, and anyone can add people, engagements, leads and documents to it. | **من المسؤول:** يُبقيها مسؤول الحساب محدَّثة، ويمكن لأي شخص أن يضيف إليها أشخاصاً وتواصلات وعملاء محتملين ووثائق. |
| 3 | **What must be filled:** Name, Sector, Relationship type and Account owner, plus Account tier and Search keywords for Tier 1 and Tier 2 accounts. | **ما يجب ملؤه:** الاسم والقطاع ونوع العلاقة ومسؤول الحساب، إضافة إلى فئة الحساب وكلمات البحث لحسابات Tier 1 و Tier 2. |
| 4 | **What happens automatically:** Each logged engagement moves Last engagement forward, and 60 days without one lists a Tier 1 or Tier 2 account on the dashboard as not engaged. | **ما يحدث تلقائياً:** كل تواصل مسجَّل يحدّث «آخر تواصل»، ومرور 60 يوماً بلا تواصل يُظهر حساب Tier 1 أو Tier 2 في لوحة المتابعة على أنه بلا تواصل. |
| 5 | **Where to get help:** Help in the sidebar has the guide for this page, and the ops coordinator merges any duplicate company you spot. | **أين تجد المساعدة:** في «المساعدة» بالقائمة الجانبية دليل هذه الصفحة، ومنسق العمليات يدمج أي شركة مكررة تلاحظها. |

### 10.2 Person (الشخص)

Widget **How this record works** (كيف يعمل هذا السجل), key `person`.

| | English | العربية |
| --- | --- | --- |
| 1 | **What it is:** One contact person at a company, with the part they play in the buying decision. | **ما هذا:** شخص واحد نتواصل معه في شركة، مع الدور الذي يؤديه في قرار الشراء. |
| 2 | **Who owns it:** Whoever met them keeps the details right, and the ops coordinator merges duplicates. | **من المسؤول:** من التقاه يُبقي بياناته صحيحة، ومنسق العمليات يدمج المكرر. |
| 3 | **What must be filled:** Name, Email, Company and Decision role, plus the Arabic name when they write it in Arabic. | **ما يجب ملؤه:** الاسم والبريد الإلكتروني والشركة والدور في القرار، إضافة إلى الاسم بالعربية عندما يكتبه بالعربية. |
| 4 | **What happens automatically:** Emails and meetings with them appear on the Emails and Calendar tabs once your mailbox is connected. | **ما يحدث تلقائياً:** تظهر الرسائل والاجتماعات معه في تبويبَي Emails و Calendar بعد ربط بريدك. |
| 5 | **Where to get help:** Help in the sidebar has the guide for this page, or ask the ops coordinator. | **أين تجد المساعدة:** في «المساعدة» بالقائمة الجانبية دليل هذه الصفحة، أو اسأل منسق العمليات. |

### 10.3 Opportunity (الفرصة)

Widget **How this record works** (كيف يعمل هذا السجل), key `opportunity`.

| | English | العربية |
| --- | --- | --- |
| 1 | **What it is:** One case KUEC is working to sign, from the first scoping to Signed, Lost or Parked. | **ما هذا:** ملف واحد تعمل KUEC على توقيعه، من تحديد النطاق الأول حتى Signed أو Lost أو Parked. |
| 2 | **Who owns it:** The owner, who keeps an owner, a next action and a next-action date on it at all times. | **من المسؤول:** المسؤول، الذي يُبقي عليه دائماً مسؤولاً وإجراءً تالياً وتاريخاً للإجراء التالي. |
| 3 | **What must be filled:** Name, Owner, Type, Source, Next action, Next action date and the SharePoint folder link. | **ما يجب ملؤه:** الاسم والمسؤول والنوع والمصدر والإجراء التالي وتاريخ الإجراء التالي ورابط مجلد SharePoint. |
| 4 | **What happens automatically:** Setting Type to Licence or Technical service creates its work packages, a missing or past next action gives the owner a task at 08:00, and Signed tells the ED. | **ما يحدث تلقائياً:** اختيار النوع Licence أو Technical service ينشئ حزم عمله، والإجراء التالي الناقص أو الفائت يرسل إلى المسؤول مهمة في الساعة 08:00، و Signed يُبلغ المدير التنفيذي. |
| 5 | **Where to get help:** Stuck on a work package listed here? Open it and press Request help on its card; for anything else, Help in the sidebar or the ops coordinator. | **أين تجد المساعدة:** متوقف في حزمة عمل مدرجة هنا؟ افتحها واضغط «طلب مساعدة» في بطاقتها؛ ولأي أمر آخر استخدم «المساعدة» في القائمة الجانبية أو اسأل منسق العمليات. |

### 10.4 Note (الملاحظة)

Widget **How this record works** (كيف يعمل هذا السجل), key `note`.

| | English | العربية |
| --- | --- | --- |
| 1 | **What it is:** A written note on a record, such as meeting notes, that everyone who can see that record can read. | **ما هذا:** ملاحظة مكتوبة على سجل، مثل محضر اجتماع، يقرؤها كل من يستطيع رؤية ذلك السجل. |
| 2 | **Who owns it:** Whoever wrote it. | **من المسؤول:** من كتبها. |
| 3 | **What must be filled:** A title, the text and the record it belongs to, and never a contract or a confidential document pasted in. | **ما يجب ملؤه:** عنوان ونص والسجل الذي تتبعه، ولا يُلصق فيها عقد أو وثيقة سرية أبداً. |
| 4 | **What happens automatically:** The app writes notes too, such as referral credits, and every note appears on its record's timeline. | **ما يحدث تلقائياً:** يكتب النظام ملاحظات أيضاً، مثل رصيد الإحالة، وتظهر كل ملاحظة في السجل الزمني لسجلها. |
| 5 | **Where to get help:** Help in the sidebar has the guide for this page, or ask the ops coordinator. | **أين تجد المساعدة:** في «المساعدة» بالقائمة الجانبية دليل هذه الصفحة، أو اسأل منسق العمليات. |

### 10.5 Task (المهمة)

Widget **How this record works** (كيف يعمل هذا السجل), key `task`.

| | English | العربية |
| --- | --- | --- |
| 1 | **What it is:** One thing a person must do by a date, and every reminder the CRM sends you is a task. | **ما هذا:** شيء واحد يجب على شخص أن يفعله قبل تاريخ محدد، وكل تذكير يرسله النظام إليك هو مهمة. |
| 2 | **Who owns it:** The assignee does it and marks it Done. | **من المسؤول:** المكلَّف بها ينفذها ويجعلها Done. |
| 3 | **What must be filled:** Title, Assignee, Due date and Type, linked to the record it is about. | **ما يجب ملؤه:** العنوان والمكلَّف وتاريخ الاستحقاق والنوع، مع ربطها بالسجل الذي تخصه. |
| 4 | **What happens automatically:** The app creates tasks for reminders and escalations, such as Set next action, and emails each one to its assignee. | **ما يحدث تلقائياً:** ينشئ النظام مهام للتذكير والتصعيد، مثل Set next action، ويرسل كل مهمة بالبريد إلى المكلَّف بها. |
| 5 | **Where to get help:** A task about a work package? Open the work package and press Request help on its card; for anything else, Help in the sidebar or the ops coordinator. | **أين تجد المساعدة:** مهمة تخص حزمة عمل؟ افتح حزمة العمل واضغط «طلب مساعدة» في بطاقتها؛ ولأي أمر آخر استخدم «المساعدة» في القائمة الجانبية أو اسأل منسق العمليات. |

### 10.6 Lead (العميل المحتمل)

Widget **How this record works** (كيف يعمل هذا السجل), key `lead`.

| | English | العربية |
| --- | --- | --- |
| 1 | **What it is:** A contact with a possible need before it becomes a case, because a contact that is not a lead did not happen. | **ما هذا:** جهة اتصال لديها حاجة محتملة قبل أن تصبح ملفاً، لأن التواصل غير المسجَّل عميلاً محتملاً لم يحدث. |
| 2 | **Who owns it:** The ops coordinator triages it by the next working day and hands it to the colleague who works it. | **من المسؤول:** يفرزه منسق العمليات بحلول يوم العمل التالي ويسنده إلى الزميل الذي يعمل عليه. |
| 3 | **What must be filled:** Name, Source, Company, Person and Need on the first day, then the five checks as the answers come in, and always a next action with a date. | **ما يجب ملؤه:** الاسم والمصدر والشركة والشخص والحاجة في اليوم الأول، ثم الشروط الخمسة كلما وصلت الإجابات، ودائماً إجراء تالٍ مع تاريخ. |
| 4 | **What happens automatically:** After 3 and 7 working days in New the owner and then the ED are reminded, 4 ticked checks make it Qualified, Converted creates the opportunity, and 30 quiet days set it to Dead. | **ما يحدث تلقائياً:** بعد 3 ثم 7 أيام عمل في New يُذكَّر المسؤول ثم المدير التنفيذي، و4 شروط محققة تجعله Qualified، و Converted ينشئ الفرصة، و30 يوماً بلا تواصل تجعله Dead. |
| 5 | **Where to get help:** Help in the sidebar explains the five checks, or ask the ops coordinator. | **أين تجد المساعدة:** في «المساعدة» بالقائمة الجانبية شرح الشروط الخمسة، أو اسأل منسق العمليات. |

### 10.7 Engagement (التواصل)

Widget **How this record works** (كيف يعمل هذا السجل), key `engagement`.

| | English | العربية |
| --- | --- | --- |
| 1 | **What it is:** One logged contact: a meeting, a call, an email thread, a visit or an event. | **ما هذا:** تواصل واحد مسجَّل: اجتماع أو مكالمة أو سلسلة رسائل أو زيارة أو فعالية. |
| 2 | **Who owns it:** The colleague who held the contact. | **من المسؤول:** الزميل الذي أجرى التواصل. |
| 3 | **What must be filled:** Subject, Kind, Date, Company, the lead or opportunity it was about, and the Outcome within 2 days. | **ما يجب ملؤه:** الموضوع والنوع والتاريخ والشركة والعميل المحتمل أو الفرصة التي كان بشأنها، والنتيجة خلال يومين. |
| 4 | **What happens automatically:** Next step is copied to the opportunity as its next action, and the company's and the lead's last engagement dates move forward. | **ما يحدث تلقائياً:** تُنسخ «الخطوة التالية» إلى الفرصة بصفتها إجراءها التالي، ويتحدّث تاريخ آخر تواصل للشركة وللعميل المحتمل. |
| 5 | **Where to get help:** Help in the sidebar has the guide for this page, or ask the ops coordinator. | **أين تجد المساعدة:** في «المساعدة» بالقائمة الجانبية دليل هذه الصفحة، أو اسأل منسق العمليات. |

### 10.8 Project (المشروع)

Widget **How this record works** (كيف يعمل هذا السجل), key `project`.

| | English | العربية |
| --- | --- | --- |
| 1 | **What it is:** A workshop, proposal, delivery or campaign run as dated milestones and work packages. | **ما هذا:** ورشة عمل أو مقترح أو تنفيذ أو حملة تُدار على شكل مراحل مؤرخة وحزم عمل. |
| 2 | **Who owns it:** The owner runs it and closes it when every milestone is done. | **من المسؤول:** يديره المسؤول ويغلقه بعد إنجاز كل المراحل. |
| 3 | **What must be filled:** Name, Owner, Type, Company and End date, and the Event date before you pick Workshop. | **ما يجب ملؤه:** الاسم والمسؤول والنوع والشركة وتاريخ الانتهاء المخطط، وتاريخ الفعالية قبل اختيار Workshop. |
| 4 | **What happens automatically:** Picking Workshop, Proposal or Delivery creates its milestones and work packages, Health turns amber or red from the milestones, and the owner gets a task to close it at the end. | **ما يحدث تلقائياً:** اختيار Workshop أو Proposal أو Delivery ينشئ مراحله وحزم عمله، وتصبح «سلامة المشروع» كهرمانية أو حمراء بحسب المراحل، وتصل المسؤول مهمة لإغلاقه في النهاية. |
| 5 | **Where to get help:** Stuck on a work package listed here? Open it and press Request help on its card; for anything else, Help in the sidebar or the ops coordinator. | **أين تجد المساعدة:** متوقف في حزمة عمل مدرجة هنا؟ افتحها واضغط «طلب مساعدة» في بطاقتها؛ ولأي أمر آخر استخدم «المساعدة» في القائمة الجانبية أو اسأل منسق العمليات. |

### 10.9 Milestone (المرحلة الرئيسية)

Widget **How this record works** (كيف يعمل هذا السجل), key `milestone`.

| | English | العربية |
| --- | --- | --- |
| 1 | **What it is:** A dated checkpoint in a project, such as Invitations sent. | **ما هذا:** نقطة متابعة مؤرخة في مشروع، مثل: أُرسلت الدعوات. |
| 2 | **Who owns it:** The milestone owner. | **من المسؤول:** مسؤول المرحلة. |
| 3 | **What must be filled:** Name, Project, Owner, Due and Status. | **ما يجب ملؤه:** الاسم والمشروع والمسؤول وموعد التسليم والحالة. |
| 4 | **What happens automatically:** Done updates the project's percent complete, Missed turns the project red, and an open milestone due within 7 days turns it amber. | **ما يحدث تلقائياً:** Done يحدّث نسبة إنجاز المشروع، و Missed يجعل المشروع أحمر، والمرحلة المفتوحة المستحقة خلال 7 أيام تجعله كهرمانياً. |
| 5 | **Where to get help:** Stuck on a work package listed here? Open it and press Request help on its card; for anything else, Help in the sidebar or the ops coordinator. | **أين تجد المساعدة:** متوقف في حزمة عمل مدرجة هنا؟ افتحها واضغط «طلب مساعدة» في بطاقتها؛ ولأي أمر آخر استخدم «المساعدة» في القائمة الجانبية أو اسأل منسق العمليات. |

### 10.10 Work package (حزمة العمل)

Widget **How this record works** (كيف يعمل هذا السجل), key `workPackage`.

| | English | العربية |
| --- | --- | --- |
| 1 | **What it is:** One piece of work with one owner, a due date and done criteria, and the card below says what to do now. | **ما هذا:** جزء واحد من العمل له مسؤول واحد وموعد تسليم ومعايير إنجاز، والبطاقة أدناه تخبرك بما تفعله الآن. |
| 2 | **Who owns it:** The owner delivers it, the reviewer checks it, and the ED or the ops coordinator plans it. | **من المسؤول:** ينجزه المسؤول، ويراجعه المراجِع، ويخطط له المدير التنفيذي أو منسق العمليات. |
| 3 | **What must be filled:** Title, Owner, Due, Objective, Expected output and Done criteria before it is offered, and a Blocked reason whenever it is blocked. | **ما يجب ملؤه:** العنوان والمسؤول وموعد التسليم والهدف والمُخرَج المتوقع ومعايير الإنجاز قبل عرضه، و«سبب التعطّل» كلما تعطّل. |
| 4 | **What happens automatically:** Not accepted after 2 working days reminds the owner and the ED, after 5 it moves to the ops coordinator, late work is flagged on the day and to the ED 2 working days later, and Done offers the next step. | **ما يحدث تلقائياً:** عدم القبول بعد يومي عمل يُذكّر المسؤول والمدير التنفيذي، وبعد 5 أيام ينتقل إلى منسق العمليات، والتأخير يُنبَّه إليه في يومه ثم يُبلَّغ المدير التنفيذي بعد يومي عمل، و Done يعرض الخطوة التالية. |
| 5 | **Where to get help:** Do not know what to do? Press Request help on the card, and the ops coordinator gets a task while the work stays yours. | **أين تجد المساعدة:** لا تعرف ماذا تفعل؟ اضغط «طلب مساعدة» في البطاقة، فتصل منسق العمليات مهمة ويبقى العمل لديك. |

### 10.11 Contract (العقد)

Widget **How this record works** (كيف يعمل هذا السجل), key `contract`.

| | English | العربية |
| --- | --- | --- |
| 1 | **What it is:** The details of one agreement, its kind, status, dates, value and owner, while the signed file stays on SharePoint. | **ما هذا:** تفاصيل اتفاقية واحدة، نوعها وحالتها وتواريخها وقيمتها ومسؤولها، بينما يبقى الملف الموقَّع على SharePoint. |
| 2 | **Who owns it:** The contract owner, while the ops coordinator or the ED keeps the record, because business development officers can only read it. | **من المسؤول:** مسؤول العقد، ويتولى منسق العمليات أو المدير التنفيذي تحديث السجل لأن مسؤولي تطوير الأعمال يستطيعون قراءته فقط. |
| 3 | **What must be filled:** Name, Kind, Status, Counterparty, Owner and SharePoint folder, plus Signed on and Expires on once it is signed. | **ما يجب ملؤه:** الاسم والنوع والحالة والطرف المقابل والمسؤول ومجلد SharePoint، إضافة إلى تاريخ التوقيع وتاريخ الانتهاء بعد التوقيع. |
| 4 | **What happens automatically:** A signed licence opportunity creates its licence contract, and the dashboard lists every contract in the 90 days before it expires. | **ما يحدث تلقائياً:** فرصة الترخيص الموقَّعة تنشئ عقد الترخيص الخاص بها، وتعرض لوحة المتابعة كل عقد في الأيام التسعين السابقة لانتهائه. |
| 5 | **Where to get help:** Help in the sidebar has the guide for this page, or ask the ops coordinator. | **أين تجد المساعدة:** في «المساعدة» بالقائمة الجانبية دليل هذه الصفحة، أو اسأل منسق العمليات. |

### 10.12 Document (الوثيقة)

Widget **How this record works** (كيف يعمل هذا السجل), key `document`.

| | English | العربية |
| --- | --- | --- |
| 1 | **What it is:** A link to one file on SharePoint or in uVENTURE, with its type, status and confidentiality, because the file itself never comes into the CRM. | **ما هذا:** رابط إلى ملف واحد على SharePoint أو في uVENTURE، مع نوعه وحالته ودرجة سريته، لأن الملف نفسه لا يدخل النظام أبداً. |
| 2 | **Who owns it:** The document owner keeps its status, version and expiry current. | **من المسؤول:** مسؤول الوثيقة يُبقي حالتها وإصدارها وتاريخ انتهائها محدَّثة. |
| 3 | **What must be filled:** Name, Type, Status, Confidentiality, the link, and every record it belongs to. | **ما يجب ملؤه:** الاسم والنوع والحالة والسرية والرابط، وكل سجل تتبعه الوثيقة. |
| 4 | **What happens automatically:** A document that expires within 60 days is listed under Documents expiring in 60 days. | **ما يحدث تلقائياً:** الوثيقة التي تنتهي خلال 60 يوماً تظهر في Documents expiring in 60 days. |
| 5 | **Where to get help:** Help in the sidebar has the guide for this page, or ask the ops coordinator. | **أين تجد المساعدة:** في «المساعدة» بالقائمة الجانبية دليل هذه الصفحة، أو اسأل منسق العمليات. |

### 10.13 Playbook role assignment (إسناد دور دليل العمل)

Widget **How this record works** (كيف يعمل هذا السجل), key `playbookRoleAssignment`.

| | English | العربية |
| --- | --- | --- |
| 1 | **What it is:** Who fills each playbook role, so that new work packages go to the least-loaded active member of the role. | **ما هذا:** من يشغل كل دور في دليل العمل، حتى تذهب حزم العمل الجديدة إلى أقل أعضاء الدور النشطين انشغالاً. |
| 2 | **Who owns it:** The ED and the ops coordinator. | **من المسؤول:** المدير التنفيذي ومنسق العمليات. |
| 3 | **What must be filled:** Member, Playbook role and Active, with exactly one active Executive director and one active Operations coordinator. | **ما يجب ملؤه:** العضو ودور دليل العمل و«نشط»، على أن يكون هناك Executive director نشط واحد و Operations coordinator نشط واحد بالضبط. |
| 4 | **What happens automatically:** The app reads these records to give out work, to find the ED for escalations and to find the ops coordinator for help requests. | **ما يحدث تلقائياً:** يقرأ النظام هذه السجلات ليوزع العمل، ويعرف منها المدير التنفيذي للتصعيد ومنسق العمليات لطلبات المساعدة. |
| 5 | **Where to get help:** Ask the ED before you change one, because it changes who receives work. | **أين تجد المساعدة:** اسأل المدير التنفيذي قبل أن تغيّر أي سجل، لأن ذلك يغيّر من يتلقى العمل. |

### 10.14 UAE public holiday (العطلة الرسمية)

Widget **How this record works** (كيف يعمل هذا السجل), key `publicHoliday`.

| | English | العربية |
| --- | --- | --- |
| 1 | **What it is:** One UAE public holiday, which does not count as a working day. | **ما هذا:** عطلة رسمية واحدة في الإمارات، لا تُحسب يوم عمل. |
| 2 | **Who owns it:** The ops coordinator enters each year's holidays when they are announced. | **من المسؤول:** يُدخل منسق العمليات عطلات كل سنة عند إعلانها. |
| 3 | **What must be filled:** Name and Date. | **ما يجب ملؤه:** الاسم والتاريخ. |
| 4 | **What happens automatically:** Every working-day count in the app, such as the 2-day acceptance and the lead reminders, skips these dates. | **ما يحدث تلقائياً:** كل عدّ لأيام العمل في النظام، مثل مهلة القبول البالغة يومين وتذكيرات العملاء المحتملين، يتخطى هذه التواريخ. |
| 5 | **Where to get help:** Ask the engineering lead if a reminder seems to have counted a holiday. | **أين تجد المساعدة:** اسأل قائد الفريق الهندسي إذا بدا أن تذكيراً احتسب يوم عطلة. |

### 10.15 Capability (القدرة)

Widget **How this record works** (كيف يعمل هذا السجل), key `capability`.

| | English | العربية |
| --- | --- | --- |
| 1 | **What it is:** A pointer to a technology, invention disclosure, lab or item of equipment whose full record lives in uVENTURE. | **ما هذا:** مؤشر إلى تقنية أو إفصاح عن اختراع أو مختبر أو معدات يوجد سجلها الكامل في uVENTURE. |
| 2 | **Who owns it:** uVENTURE owns it: the uVENTURE feed creates and updates it, and nobody edits it in the CRM. | **من المسؤول:** يملكه uVENTURE: ينشئه ربط uVENTURE الآلي ويحدّثه، ولا يعدّله أحد في نظام إدارة العملاء. |
| 3 | **What must be filled:** Nothing: to change the name, kind or status, change it in uVENTURE through the uVENTURE record link. | **ما يجب ملؤه:** لا شيء: لتغيير الاسم أو النوع أو الحالة، غيّرها في uVENTURE عبر رابط سجل uVENTURE. |
| 4 | **What happens automatically:** Each night the uVENTURE snapshot refreshes it, a status change to unavailable or withdrawn tells the owners of open cases, and 7 days without a snapshot lists it under Not seen in uVENTURE. | **ما يحدث تلقائياً:** تحدّثه لقطة uVENTURE كل ليلة، وتغيّر الحالة إلى غير متاحة أو مسحوبة يُبلغ مسؤولي الحالات المفتوحة، ومرور 7 أيام بلا لقطة يدرجه تحت «لم يظهر في uVENTURE». |
| 5 | **Where to get help:** Help in the sidebar explains the uVENTURE link, and the ops coordinator takes a wrong pointer to the uVENTURE administrator. | **أين تجد المساعدة:** في «المساعدة» بالقائمة الجانبية شرح لربط uVENTURE، ومنسق العمليات يحمل أي مؤشر خاطئ إلى مسؤول uVENTURE. |

### 10.16 Campaign target (الجهة المستهدفة في الحملة)

Widget **How this record works** (كيف يعمل هذا السجل), key `campaignTarget`.

| | English | العربية |
| --- | --- | --- |
| 1 | **What it is:** One company on a go-to-market campaign's target list. | **ما هذا:** شركة واحدة ضمن قائمة استهداف حملة تسويقية. |
| 2 | **Who owns it:** The campaign's owner works the list; anyone on the campaign can update a target. | **من المسؤول:** يعمل مسؤول الحملة على القائمة، ويمكن لأي عضو في الحملة تحديث أي جهة مستهدفة. |
| 3 | **What must be filled:** Status after each contact: Contacted, Responded, Not interested or Do not contact. | **ما يجب ملؤه:** الحالة بعد كل تواصل: تم التواصل، أو استجابت، أو غير مهتمة، أو لا يُتواصل معها. |
| 4 | **What happens automatically:** The app builds the list from the companies in the campaign's target sector and size class, and sets Lead created when a lead from this company is attributed to the campaign. | **ما يحدث تلقائياً:** يبني التطبيق القائمة من الشركات في القطاع وفئة الحجم المستهدفين للحملة، ويضبط «أُنشئ عميل محتمل» عندما يُنسب إلى الحملة عميل محتمل من هذه الشركة. |
| 5 | **Where to get help:** Help in the sidebar has the campaign guide, and the campaign owner decides when a company leaves the list. | **أين تجد المساعدة:** في «المساعدة» بالقائمة الجانبية دليل الحملات، ومسؤول الحملة يقرر متى تخرج شركة من القائمة. |

### 10.17 Home (الصفحة الرئيسية)

Widget **How this tab works** (كيف يعمل هذا التبويب), key `home`.

| | English | العربية |
| --- | --- | --- |
| 1 | **What it is:** Your landing page: what needs your decision, your next actions this week, and the rest of your open work. | **ما هذا:** صفحتك الأولى: ما يحتاج قرارك، وإجراءاتك التالية هذا الأسبوع، وبقية عملك المفتوح. |
| 2 | **Who owns it:** You, because every table lists only your own records. | **من المسؤول:** أنت، لأن كل جدول يعرض سجلاتك أنت فقط. |
| 3 | **What must be filled:** Nothing here, so open a row to act on it. | **ما يجب ملؤه:** لا شيء هنا، فافتح أي صف لتعمل عليه. |
| 4 | **What happens automatically:** Rows appear when work is offered or submitted to you or falls due within 7 days, and leave once you act. | **ما يحدث تلقائياً:** تظهر الصفوف عندما يُعرض عليك عمل أو يُقدَّم إليك أو يحل موعده خلال 7 أيام، وتختفي بعد أن تتصرف. |
| 5 | **Where to get help:** Stuck on a work package listed here? Open it and press Request help on its card; for anything else, Help in the sidebar or the ops coordinator. | **أين تجد المساعدة:** متوقف في حزمة عمل مدرجة هنا؟ افتحها واضغط «طلب مساعدة» في بطاقتها؛ ولأي أمر آخر استخدم «المساعدة» في القائمة الجانبية أو اسأل منسق العمليات. |

### 10.18 Exceptions (الاستثناءات)

Widget **How this tab works** (كيف يعمل هذا التبويب), key `exceptions`.

| | English | العربية |
| --- | --- | --- |
| 1 | **What it is:** What needs attention across the team: blocked and overdue work packages, and opportunities with no next action. | **ما هذا:** ما يحتاج انتباه الفريق كله: حزم العمل المتعطلة والمتأخرة، والفرص التي بلا إجراء تالٍ. |
| 2 | **Who owns it:** The ED works it at the Thursday review, and each owner fixes their own rows. | **من المسؤول:** يعمل عليها المدير التنفيذي في مراجعة الخميس، ويصحح كل مسؤول صفوفه. |
| 3 | **What must be filled:** Every row needs a person and a day: a new due date, a next action, or a decision. | **ما يجب ملؤه:** كل صف يحتاج شخصاً ويوماً: موعد تسليم جديد، أو إجراء تالياً، أو قراراً. |
| 4 | **What happens automatically:** Rows come and go as records change, and the ED has already been told about each block. | **ما يحدث تلقائياً:** تظهر الصفوف وتختفي مع تغيّر السجلات، وقد أُبلغ المدير التنفيذي مسبقاً بكل تعطّل. |
| 5 | **Where to get help:** Stuck on a work package listed here? Open it and press Request help on its card; for anything else, Help in the sidebar or the ops coordinator. | **أين تجد المساعدة:** متوقف في حزمة عمل مدرجة هنا؟ افتحها واضغط «طلب مساعدة» في بطاقتها؛ ولأي أمر آخر استخدم «المساعدة» في القائمة الجانبية أو اسأل منسق العمليات. |

### 10.19 Data quality (جودة البيانات)

Widget **How this tab works** (كيف يعمل هذا التبويب), key `dataQuality`.

| | English | العربية |
| --- | --- | --- |
| 1 | **What it is:** Counts of records with missing or inconsistent data, each beside the list of records behind it. | **ما هذا:** أعداد السجلات التي تنقصها بيانات أو فيها بيانات غير متسقة، وبجانب كل عدد قائمة السجلات التي يمثلها. |
| 2 | **Who owns it:** The ops coordinator runs it every Monday, and each owner fixes their own rows. | **من المسؤول:** يراجعها منسق العمليات كل يوم اثنين، ويصحح كل مسؤول صفوفه. |
| 3 | **What must be filled:** Open a list and fill in what it names, such as Other details when Other was picked. | **ما يجب ملؤه:** افتح القائمة واملأ ما تذكره، مثل «تفاصيل أخرى» عند اختيار Other. |
| 4 | **What happens automatically:** A record leaves its list as soon as it is fixed. | **ما يحدث تلقائياً:** يخرج السجل من قائمته بمجرد تصحيحه. |
| 5 | **Where to get help:** Stuck on a work package listed here? Open it and press Request help on its card, and Help in the sidebar explains every field and option. | **أين تجد المساعدة:** متوقف في حزمة عمل مدرجة هنا؟ افتحها واضغط «طلب مساعدة» في بطاقتها، وفي «المساعدة» بالقائمة الجانبية شرح كل حقل وكل خيار. |

### 10.20 BD dashboard, Executive tab (لوحة تطوير الأعمال، تبويب Executive)

Widget **How this tab works** (كيف يعمل هذا التبويب), key `bdExecutive`.

| | English | العربية |
| --- | --- | --- |
| 1 | **What it is:** The team's results: signed work, the open pipeline, stale and lost opportunities, contracts, projects and leads. | **ما هذا:** نتائج الفريق: الأعمال الموقَّعة، والفرص المفتوحة، والفرص الراكدة والخاسرة، والعقود، والمشاريع، والعملاء المحتملون. |
| 2 | **Who owns it:** The ED, who reads it from top to bottom for the Thursday update. | **من المسؤول:** المدير التنفيذي، الذي يقرؤها من أعلى إلى أسفل لتحديث يوم الخميس. |
| 3 | **What must be filled:** Only the Thursday update below it, written by the ED, because every number comes from the records. | **ما يجب ملؤه:** تحديث يوم الخميس أدناه فقط، ويكتبه المدير التنفيذي، لأن كل رقم يأتي من السجلات. |
| 4 | **What happens automatically:** Each chart counts exactly the records in the table beside it and changes as soon as the records do. | **ما يحدث تلقائياً:** كل رسم بياني يعدّ بالضبط السجلات الموجودة في الجدول بجانبه، ويتغير بمجرد تغيّرها. |
| 5 | **Where to get help:** Help in the sidebar explains each chart, and the ED answers questions about a number. | **أين تجد المساعدة:** في «المساعدة» بالقائمة الجانبية شرح كل رسم بياني، والمدير التنفيذي يجيب عن الأسئلة حول أي رقم. |

### 10.21 BD dashboard, Team tab (لوحة تطوير الأعمال، تبويب Team)

Widget **How this tab works** (كيف يعمل هذا التبويب), key `bdTeam`.

| | English | العربية |
| --- | --- | --- |
| 1 | **What it is:** Who carries what: open work per owner, what is overdue, blocked or waiting to be accepted or reviewed, and the work package board. | **ما هذا:** من يحمل ماذا: العمل المفتوح لكل مسؤول، والمتأخر والمتعطل وما ينتظر القبول أو المراجعة، ولوحة حزم العمل. |
| 2 | **Who owns it:** The whole team, who read it together at the Monday standup. | **من المسؤول:** الفريق كله، ويقرؤها معاً في الاجتماع القصير يوم الاثنين. |
| 3 | **What must be filled:** For every row with your name, a new date, a plan to clear the block, or an accept or decline. | **ما يجب ملؤه:** لكل صف يحمل اسمك: موعد جديد، أو خطة لرفع العائق، أو قبول أو رفض. |
| 4 | **What happens automatically:** The board and the charts move as statuses change, and dragging a card to another column changes its status. | **ما يحدث تلقائياً:** تتحرك اللوحة والرسوم البيانية مع تغيّر الحالات، وسحب البطاقة إلى عمود آخر يغيّر حالتها. |
| 5 | **Where to get help:** Stuck on a work package listed here? Open it and press Request help on its card; for anything else, Help in the sidebar or the ops coordinator. | **أين تجد المساعدة:** متوقف في حزمة عمل مدرجة هنا؟ افتحها واضغط «طلب مساعدة» في بطاقتها؛ ولأي أمر آخر استخدم «المساعدة» في القائمة الجانبية أو اسأل منسق العمليات. |

### 10.22 BD dashboard, Mine tab (لوحة تطوير الأعمال، تبويب Mine)

Widget **How this tab works** (كيف يعمل هذا التبويب), key `bdMine`.

| | English | العربية |
| --- | --- | --- |
| 1 | **What it is:** Your own numbers: open, overdue and submitted work packages, opportunities without a next action, this week's engagements and what closes this quarter. | **ما هذا:** أرقامك أنت: حزم العمل المفتوحة والمتأخرة والمُسلَّمة، والفرص التي بلا إجراء تالٍ، وتواصلات هذا الأسبوع، وما يُغلق هذا الربع. |
| 2 | **Who owns it:** You, because every list on this tab shows only your records. | **من المسؤول:** أنت، لأن كل قائمة في هذا التبويب تعرض سجلاتك فقط. |
| 3 | **What must be filled:** Clear your overdue work and give every opportunity a next action with a date. | **ما يجب ملؤه:** أنجز عملك المتأخر، وأعطِ كل فرصة إجراءً تالياً مع تاريخ. |
| 4 | **What happens automatically:** Every view behind this tab filters to you, so each person sees their own page. | **ما يحدث تلقائياً:** كل عرض في هذا التبويب مصفّى عليك، فيرى كل شخص صفحته هو. |
| 5 | **Where to get help:** Stuck on a work package listed here? Open it and press Request help on its card; for anything else, Help in the sidebar or the ops coordinator. | **أين تجد المساعدة:** متوقف في حزمة عمل مدرجة هنا؟ افتحها واضغط «طلب مساعدة» في بطاقتها؛ ولأي أمر آخر استخدم «المساعدة» في القائمة الجانبية أو اسأل منسق العمليات. |

### 10.23 uVENTURE: Technologies (uVENTURE: التقنيات)

Widget **How this tab works** (كيف يعمل هذا التبويب), key `uventureTechnologies`.

| | English | العربية |
| --- | --- | --- |
| 1 | **What it is:** The uVENTURE technology list, shown inside the CRM so you can look up a technology without leaving it. | **ما هذا:** قائمة التقنيات في uVENTURE معروضة داخل نظام إدارة العملاء لتبحث عن تقنية دون مغادرته. |
| 2 | **Who owns it:** The commercialization team keeps it current in uVENTURE; the CRM only shows it. | **من المسؤول:** يبقيها فريق التسويق التجاري محدَّثة في uVENTURE، والنظام يعرضها فقط. |
| 3 | **What must be filled:** Nothing here: link a technology to a case through the case's Capability field. | **ما يجب ملؤه:** لا شيء هنا: اربط التقنية بالحالة عبر حقل «القدرة» في الحالة. |
| 4 | **What happens automatically:** uVENTURE sends every new technology and disclosure to the CRM as a capability, so it can be picked on a case. | **ما يحدث تلقائياً:** يرسل uVENTURE كل تقنية وإفصاح جديد إلى نظام إدارة العملاء كقدرة، لتُختار في الحالة. |
| 5 | **Where to get help:** If the page asks you to sign in, sign in to uVENTURE in its own tab once, then come back; Help in the sidebar explains why. | **أين تجد المساعدة:** إذا طلبت الصفحة تسجيل الدخول فسجّل الدخول إلى uVENTURE في تبويبه مرة واحدة ثم عد؛ وفي «المساعدة» بالقائمة الجانبية شرح السبب. |

### 10.24 uVENTURE: Equipment and labs (uVENTURE: المعدات والمختبرات)

Widget **How this tab works** (كيف يعمل هذا التبويب), key `uventureEquipment`.

| | English | العربية |
| --- | --- | --- |
| 1 | **What it is:** The uVENTURE list of labs and equipment with their availability, shown inside the CRM. | **ما هذا:** قائمة المختبرات والمعدات في uVENTURE مع توفرها، معروضة داخل نظام إدارة العملاء. |
| 2 | **Who owns it:** The lab access team keeps the listings and their availability current in uVENTURE. | **من المسؤول:** يبقي فريق الوصول إلى المختبرات الإدراجات وتوفرها محدَّثة في uVENTURE. |
| 3 | **What must be filled:** Nothing here: before you promise a lab or a machine to a client, check its status on the capability. | **ما يجب ملؤه:** لا شيء هنا: قبل أن تعد عميلاً بمختبر أو جهاز، تحقق من حالته في القدرة. |
| 4 | **What happens automatically:** A change of availability in uVENTURE updates the capability's status, and owners of open cases hear when it stops being offered. | **ما يحدث تلقائياً:** تغيّر التوفر في uVENTURE يحدّث حالة القدرة، ويُبلَّغ مسؤولو الحالات المفتوحة عندما تتوقف عن العرض. |
| 5 | **Where to get help:** If the page asks you to sign in, sign in to uVENTURE in its own tab once, then come back; Help in the sidebar explains why. | **أين تجد المساعدة:** إذا طلبت الصفحة تسجيل الدخول فسجّل الدخول إلى uVENTURE في تبويبه مرة واحدة ثم عد؛ وفي «المساعدة» بالقائمة الجانبية شرح السبب. |

### 10.25 uVENTURE: Challenges (uVENTURE: التحديات)

Widget **How this tab works** (كيف يعمل هذا التبويب), key `uventureChallenges`.

| | English | العربية |
| --- | --- | --- |
| 1 | **What it is:** The industry challenges submitted through uVENTURE, such as Challenge Sprint and Technical committee entries, shown inside the CRM. | **ما هذا:** التحديات الصناعية المقدمة عبر uVENTURE، مثل مشاركات Challenge Sprint واللجنة الفنية، معروضة داخل نظام إدارة العملاء. |
| 2 | **Who owns it:** uVENTURE holds the challenge; the ops coordinator owns the lead it becomes in the CRM. | **من المسؤول:** يحتفظ uVENTURE بالتحدي، ويملك منسق العمليات العميل المحتمل الذي يصبحه في النظام. |
| 3 | **What must be filled:** Nothing here: work the challenge as a lead, from the Lead inbox. | **ما يجب ملؤه:** لا شيء هنا: اعمل على التحدي كعميل محتمل من صندوق العملاء المحتملين. |
| 4 | **What happens automatically:** Each submitted challenge arrives as a new lead with its source and its uVENTURE link, and is triaged like any lead. | **ما يحدث تلقائياً:** يصل كل تحدٍّ مقدَّم كعميل محتمل جديد بمصدره ورابطه في uVENTURE، ويُفرز مثل أي عميل محتمل. |
| 5 | **Where to get help:** If the page asks you to sign in, sign in to uVENTURE in its own tab once, then come back; Help in the sidebar explains why. | **أين تجد المساعدة:** إذا طلبت الصفحة تسجيل الدخول فسجّل الدخول إلى uVENTURE في تبويبه مرة واحدة ثم عد؛ وفي «المساعدة» بالقائمة الجانبية شرح السبب. |

### 10.26 BD > Pipeline pack (تطوير الأعمال > حزمة مسار المبيعات)

Widget **How this tab works** (كيف يعمل هذا التبويب), key `packPipeline`.

| | English | العربية |
| --- | --- | --- |
| 1 | **What it is:** The CRM pack: leads to opportunities with contact times, stage exit criteria, account tiers and referral credit, in one place. | **ما هذا:** حزمة إدارة العملاء: من العملاء المحتملين إلى الفرص مع مهل التواصل ومعايير الخروج من كل مرحلة وفئات الحسابات ورصيد الإحالة، في مكان واحد. |
| 2 | **Who owns it:** Each owner works their own rows; the ED and the ops coordinator read the whole team here. | **من المسؤول:** يعمل كل مسؤول على صفوفه، ويقرأ المدير التنفيذي ومنسق العمليات الفريق كله هنا. |
| 3 | **What must be filled:** Before moving a case on, fill the exit criteria of the stage it leaves, as the pipeline playbook lists them. | **ما يجب ملؤه:** قبل نقل الحالة، املأ معايير الخروج من المرحلة التي تغادرها كما يذكرها دليل مسار المبيعات. |
| 4 | **What happens automatically:** Leads past their contact time are nudged, quiet leads close after 30 days, referrers are credited on signature, and a move with exit criteria missing gives the owner a task. | **ما يحدث تلقائياً:** يُذكَّر من تجاوز مهلة التواصل، وتُغلق العملاء المحتملين الخاملين بعد 30 يوماً، ويُنسب الرصيد للمُحيل عند التوقيع، ونقل الحالة دون معايير الخروج يعطي المسؤول مهمة. |
| 5 | **Where to get help:** Help in the sidebar has the CRM pack playbook, and the ED decides whether the pack is on. | **أين تجد المساعدة:** في «المساعدة» بالقائمة الجانبية دليل حزمة إدارة العملاء، والمدير التنفيذي يقرر تشغيل الحزمة. |

### 10.27 BD > Project pack (تطوير الأعمال > حزمة المشاريع)

Widget **How this tab works** (كيف يعمل هذا التبويب), key `packProjects`.

| | English | العربية |
| --- | --- | --- |
| 1 | **What it is:** The PM pack: projects with their health, milestones and blocked work, and the screen for the weekly review. | **ما هذا:** حزمة إدارة المشاريع: المشاريع مع صحتها ومعالمها والعمل المعطّل، وشاشة المراجعة الأسبوعية. |
| 2 | **Who owns it:** Each project owner reviews their projects here every Monday; the ED reads the whole portfolio. | **من المسؤول:** يراجع كل مسؤول مشروع مشاريعه هنا كل يوم اثنين، ويقرأ المدير التنفيذي المحفظة كلها. |
| 3 | **What must be filled:** At the weekly review: health, milestone dates and the project's RAID log note. | **ما يجب ملؤه:** في المراجعة الأسبوعية: الصحة ومواعيد المعالم وملاحظة سجل RAID للمشروع. |
| 4 | **What happens automatically:** Every active project with an owner gets a RAID log note, health is recalculated daily, and each owner gets a weekly review task on Monday morning. | **ما يحدث تلقائياً:** يحصل كل مشروع نشط له مسؤول على ملاحظة سجل RAID، وتُعاد حساب الصحة يومياً، ويتلقى كل مسؤول مهمة المراجعة الأسبوعية صباح الاثنين. |
| 5 | **Where to get help:** Use Request help on a work package when you don't know what to do; Help in the sidebar has the PM pack playbook. | **أين تجد المساعدة:** استخدم «طلب مساعدة» على حزمة العمل عندما لا تعرف ما تفعل؛ وفي «المساعدة» بالقائمة الجانبية دليل حزمة إدارة المشاريع. |

### 10.28 BD > Campaign pack (تطوير الأعمال > حزمة الحملات)

Widget **How this tab works** (كيف يعمل هذا التبويب), key `packCampaigns`.

| | English | العربية |
| --- | --- | --- |
| 1 | **What it is:** The GTM pack: go-to-market campaigns with their target lists, channel plans and the leads they bring in. | **ما هذا:** حزمة التسويق: الحملات التسويقية مع قوائم استهدافها وخطط قنواتها والعملاء المحتملين الذين تجلبهم. |
| 2 | **Who owns it:** Each campaign's owner works its target list; the ED reads every campaign here. | **من المسؤول:** يعمل مسؤول كل حملة على قائمة استهدافها، ويقرأ المدير التنفيذي كل الحملات هنا. |
| 3 | **What must be filled:** On the campaign project: Type Go-to-market campaign, target sector, size class, offering promoted and channel plan. | **ما يجب ملؤه:** في مشروع الحملة: النوع «حملة تسويقية» والقطاع المستهدف وفئة الحجم وما تروّج له الحملة وخطة القنوات. |
| 4 | **What happens automatically:** The target list is built from the companies in the target sector and size class, and a target turns Lead created when a lead from it is attributed to the campaign. | **ما يحدث تلقائياً:** تُبنى قائمة الاستهداف من الشركات في القطاع وفئة الحجم المستهدفين، وتتحول الجهة المستهدفة إلى «أُنشئ عميل محتمل» عندما يُنسب منها عميل محتمل إلى الحملة. |
| 5 | **Where to get help:** Help in the sidebar has the GTM pack playbook; cost per qualified lead stays blank until finance provides campaign costs. | **أين تجد المساعدة:** في «المساعدة» بالقائمة الجانبية دليل حزمة التسويق؛ وتبقى تكلفة العميل المؤهل فارغة حتى توفر المالية تكاليف الحملات. |

## 11. Every option of the Twenty-only lists

20 lists and 100 options, from `kuec/app/src/i18n/options.json`. The KUEC-wide lists are in `18-taxonomy.md` section 8.

### 11.1 Work package status (حالة حزمة العمل)

Field `workPackage.status`.

| Value | Label | التسمية | What it means, when to pick it | المعنى ومتى تختاره |
| --- | --- | --- | --- | --- |
| `PLANNED` | Planned | مخطط | Planned but not started; it is offered to its owner when the step before it is done. | مخطط ولم يبدأ؛ ويُعرض على مسؤوله عندما تُنجز الخطوة السابقة. |
| `OFFERED` | Offered | معروض | Offered to its owner, who accepts or declines it within 2 working days. | معروض على مسؤوله، الذي يقبله أو يرفضه خلال يومي عمل. |
| `ACCEPTED` | Accepted | مقبول | The owner has taken it on and is doing it; the card shows it as In progress. | تولّاه المسؤول ويعمل عليه؛ وتعرضه البطاقة على أنه قيد التنفيذ. |
| `SUBMITTED` | Submitted | مُسلَّم | The owner says it meets its done criteria, and it waits for the reviewer. | يرى المسؤول أنه يحقق معايير الإنجاز، وهو بانتظار المراجِع. |
| `BLOCKED` | Blocked | متعطّل | Something outside the owner's control stops the work; set it with a Blocked reason and the ED is told at once. | شيء خارج سيطرة المسؤول يوقف العمل؛ اختره مع «سبب التعطّل» فيُبلَّغ المدير التنفيذي فوراً. |
| `DONE` | Done | منجَز | The reviewer checked it against the done criteria, and the next step goes to its owner. | راجعه المراجِع وفق معايير الإنجاز، وتنتقل الخطوة التالية إلى مسؤولها. |
| `DECLINED` | Declined | مرفوض | The owner could not take it and gave a reason, and the ED gives it to someone else. | لم يستطع المسؤول تولّيه وذكر السبب، ويسنده المدير التنفيذي إلى شخص آخر. |
| `CANCELLED` | Cancelled | ملغى | The work is no longer needed; the ED or the ops coordinator sets it instead of deleting the record. | لم يعد العمل مطلوباً؛ ويختاره المدير التنفيذي أو منسق العمليات بدلاً من حذف السجل. |

### 11.2 Lead status (حالة العميل المحتمل)

Field `lead.status`.

| Value | Label | التسمية | What it means, when to pick it | المعنى ومتى تختاره |
| --- | --- | --- | --- | --- |
| `NEW` | New | جديد | Logged, and nobody has spoken to them yet; every lead starts here. | مسجَّل ولم يتحدث إليه أحد بعد؛ وكل عميل محتمل يبدأ هنا. |
| `CONTACTED` | Contacted | تم التواصل | We reached out by email, call or message, but there is no conversation yet. | تواصلنا معهم بالبريد أو الهاتف أو رسالة، ولكن لم يبدأ حوار بعد. |
| `ENGAGED` | Engaged | في حوار | A real two-way conversation is going on. | هناك حوار حقيقي متبادل قائم. |
| `QUALIFIED` | Qualified | مؤهَّل | At least 4 of the 5 checks are true; the app sets it when the fourth is ticked. | تحقق 4 على الأقل من الشروط الخمسة؛ ويضبطه النظام عند وضع العلامة الرابعة. |
| `CONVERTED` | Converted | محوَّل | It became an opportunity; set it when the next step is real work, and the app creates the opportunity. | أصبح فرصة؛ اختره عندما تكون الخطوة التالية عملاً فعلياً، فينشئ النظام الفرصة. |
| `NURTURE` | Nurture | متابعة لاحقة | The need is real but not now, such as no budget this year, and it comes back on its review date. | الحاجة حقيقية ولكن ليس الآن، مثل عدم وجود ميزانية هذا العام، ويعود في تاريخ مراجعته. |
| `DEAD` | Dead | منتهٍ | It is going nowhere; pick a Dead reason when you set it. | لن يتقدم؛ اختر «سبب الإغلاق» عندما تختار هذه الحالة. |

### 11.3 Dead reason (سبب الإغلاق)

Field `lead.deadReason`.

| Value | Label | التسمية | What it means, when to pick it | المعنى ومتى تختاره |
| --- | --- | --- | --- | --- |
| `NO_RESPONSE` | No response | لا رد | They stopped answering, which the app also records after 30 quiet days. | توقفوا عن الرد، ويسجّله النظام أيضاً بعد 30 يوماً بلا تواصل. |
| `NO_FIT` | No fit | لا توافق | What they need is not something KUEC can offer. | ما يحتاجونه ليس مما تقدمه KUEC. |
| `NO_BUDGET` | No budget | لا ميزانية | They cannot pay for it and no funding path exists. | لا يستطيعون الدفع ولا يوجد مسار تمويل. |
| `DUPLICATE` | Duplicate | مكرر | Another lead or an opportunity already covers this contact, so link or merge rather than work both. | عميل محتمل آخر أو فرصة تغطي هذا التواصل، فاربط أو ادمج بدلاً من العمل على الاثنين. |
| `COMPETITOR` | Went to a competitor | ذهب إلى منافس | They chose another provider. | اختاروا جهة أخرى. |
| `TIMING` | Wrong timing | توقيت غير مناسب | It will not happen in any time frame worth tracking; pick Nurture instead if it may come back. | لن يحدث في أي إطار زمني يستحق المتابعة؛ واختر Nurture بدلاً منه إن كان قد يعود. |
| `NOT_DECISION_MAKER` | Not the decision maker | ليس صاحب القرار | Our contact cannot decide, and we could not reach the person who can. | من نتواصل معه لا يملك القرار، ولم نصل إلى من يملكه. |
| `OTHER` | Other | أخرى | None of the above; say what it was in Other details. | لا شيء مما سبق؛ اذكر السبب في «تفاصيل أخرى». |

### 11.4 Lead source system (النظام المصدر للعميل المحتمل)

Field `lead.sourceSystem`.

| Value | Label | التسمية | What it means, when to pick it | المعنى ومتى تختاره |
| --- | --- | --- | --- | --- |
| `WEBSITE_FORM` | Website form | نموذج الموقع | Sent by the form on the KUEC website. | أُرسل من النموذج على موقع KUEC. |
| `GALA_QR_FORM` | Gala QR code form | نموذج رمز QR في الحفل | Sent by the form behind the QR code at a gala. | أُرسل من النموذج المرتبط برمز QR في حفل. |
| `WORKSHOP_SIGNUP_FORM` | Workshop sign-up form | نموذج التسجيل في الورشة | Sent by a workshop sign-up form. | أُرسل من نموذج التسجيل في ورشة عمل. |
| `APOLLO` | Apollo | Apollo | Created from Apollo, the prospecting database. | أُنشئ من Apollo، قاعدة بيانات البحث عن العملاء. |
| `UVENTURE` | uVENTURE | uVENTURE | Created from uVENTURE, the system of record for technologies. | أُنشئ من uVENTURE، نظام السجل الخاص بالتقنيات. |
| `REGISTRY` | Industrial registry | السجل الصناعي | Created from the UAE industrial registry. | أُنشئ من السجل الصناعي في الإمارات. |

### 11.5 Contract status (حالة العقد)

Field `contract.status`.

| Value | Label | التسمية | What it means, when to pick it | المعنى ومتى تختاره |
| --- | --- | --- | --- | --- |
| `DRAFT` | Draft | مسودة | Being written and not yet sent to the other side. | قيد الكتابة ولم يُرسل إلى الطرف الآخر بعد. |
| `IN_NEGOTIATION` | In negotiation | قيد التفاوض | Sent to the other side, and the terms are being agreed. | أُرسل إلى الطرف الآخر، والشروط قيد الاتفاق. |
| `SIGNED` | Signed | موقَّع | Both sides have signed, so fill in Signed on and Expires on. | وقّع الطرفان، فاملأ «تاريخ التوقيع» و«تاريخ الانتهاء». |
| `EXPIRED` | Expired | منتهي الصلاحية | Its end date has passed and it was not renewed. | انقضى تاريخ انتهائه ولم يُجدَّد. |
| `TERMINATED` | Terminated | منهى | Ended early by either side. | أنهاه أحد الطرفين قبل موعده. |

### 11.6 Milestone status (حالة المرحلة الرئيسية)

Field `milestone.status`.

| Value | Label | التسمية | What it means, when to pick it | المعنى ومتى تختاره |
| --- | --- | --- | --- | --- |
| `OPEN` | Open | مفتوحة | Not reached yet. | لم تُبلغ بعد. |
| `DONE` | Done | منجَزة | The checkpoint was reached. | بُلغت نقطة المتابعة. |
| `MISSED` | Missed | فائتة | The due date passed without reaching it, which turns the project red. | مضى موعدها دون بلوغها، فيصبح المشروع أحمر. |

### 11.7 Playbook role (دور دليل العمل)

Field `playbookRoleAssignment.playbookRole`.

| Value | Label | التسمية | What it means, when to pick it | المعنى ومتى تختاره |
| --- | --- | --- | --- | --- |
| `BD_OFFICER` | Business development officer | مسؤول تطوير أعمال | Works leads and opportunities and owns most playbook steps. | يعمل على العملاء المحتملين والفرص ويتولى معظم خطوات دليل العمل. |
| `RESEARCHER` | Researcher | باحث | A Khalifa University researcher who confirms technical facts and delivers technical work. | باحث في جامعة خليفة يؤكد الحقائق التقنية وينجز الأعمال التقنية. |
| `DEVELOPER` | Developer | مطوّر | Builds the software or platform deliverables of a case. | يبني مخرجات البرمجيات أو المنصات في الملف. |
| `DATA_ANALYST` | Data analyst | محلل بيانات | Prepares the market data, shortlists and analysis of a case. | يُعدّ بيانات السوق والقوائم المختصرة والتحليلات في الملف. |
| `OPS_COORDINATOR` | Operations coordinator | منسق العمليات | Triages leads, answers help requests and takes over unaccepted work, with exactly one active at a time. | يفرز العملاء المحتملين ويجيب عن طلبات المساعدة ويتسلم العمل غير المقبول، ويكون نشطاً واحد فقط في كل وقت. |
| `ED` | Executive director | المدير التنفيذي | Approves, decides and receives every escalation, with exactly one active at a time. | يوافق ويقرر ويتلقى كل تصعيد، ويكون نشطاً واحد فقط في كل وقت. |
| `LEGAL` | Legal | الشؤون القانونية | Reviews contracts and legal terms. | يراجع العقود والشروط القانونية. |
| `FINANCE` | Finance | المالية | Reviews prices and answers invoicing questions. | يراجع الأسعار ويجيب عن أسئلة الفواتير. |

### 11.8 Project status (حالة المشروع)

Field `project.status`.

| Value | Label | التسمية | What it means, when to pick it | المعنى ومتى تختاره |
| --- | --- | --- | --- | --- |
| `ACTIVE` | Active | نشط | Work is under way. | العمل جارٍ. |
| `ON_HOLD` | On hold | معلَّق | Paused on purpose, with the reason and a restart date in a note. | متوقف عن قصد، مع ذكر السبب وتاريخ الاستئناف في ملاحظة. |
| `DONE` | Done | منجَز | Finished and closed by the owner. | انتهى وأغلقه المسؤول. |
| `CANCELLED` | Cancelled | ملغى | Stopped before it finished. | توقف قبل أن ينتهي. |

### 11.9 Project health (سلامة المشروع)

Field `project.health`.

| Value | Label | التسمية | What it means, when to pick it | المعنى ومتى تختاره |
| --- | --- | --- | --- | --- |
| `GREEN` | Green (on track) | أخضر (يسير وفق الخطة) | Set by the app while no milestone is missed or due within 7 days. | يضبطه النظام ما دامت لا توجد مرحلة فائتة أو مستحقة خلال 7 أيام. |
| `AMBER` | Amber (at risk) | كهرماني (معرّض للخطر) | Set by the app when an open milestone is due within 7 days. | يضبطه النظام عندما تُستحق مرحلة مفتوحة خلال 7 أيام. |
| `RED` | Red (off track) | أحمر (خارج المسار) | Set by the app when a milestone is missed. | يضبطه النظام عندما تفوت مرحلة. |

### 11.10 Account tier (فئة الحساب)

Field `company.accountTier`.

| Value | Label | التسمية | What it means, when to pick it | المعنى ومتى تختاره |
| --- | --- | --- | --- | --- |
| `TIER_1` | Tier 1 (strategic) | الفئة 1 (استراتيجية) | One of the few accounts that matter most to KUEC, engaged at least every 60 days. | من الحسابات القليلة الأهم لـ KUEC، ويُتواصل معه مرة كل 60 يوماً على الأقل. |
| `TIER_2` | Tier 2 (active) | الفئة 2 (نشطة) | An account with active or likely work, engaged at least every 60 days. | حساب فيه عمل قائم أو محتمل، ويُتواصل معه مرة كل 60 يوماً على الأقل. |
| `TIER_3` | Tier 3 (watch) | الفئة 3 (للمتابعة) | An account to keep an eye on, with no regular contact needed. | حساب يُتابَع من بعيد، دون حاجة إلى تواصل منتظم. |

### 11.11 Size class (فئة الحجم)

Field `company.sizeClass`.

| Value | Label | التسمية | What it means, when to pick it | المعنى ومتى تختاره |
| --- | --- | --- | --- | --- |
| `STARTUP` | Startup | شركة ناشئة | A young company still building its product or its market. | شركة حديثة ما زالت تبني منتجها أو سوقها. |
| `SME` | Small or medium business | شركة صغيرة أو متوسطة | An established business that is not a large enterprise. | شركة قائمة ليست مؤسسة كبيرة. |
| `LARGE_ENTERPRISE` | Large enterprise | مؤسسة كبيرة | A large company or group, often with its own research and development. | شركة أو مجموعة كبيرة، كثيراً ما يكون لديها بحث وتطوير خاص بها. |
| `GOVERNMENT` | Government or semi-government | جهة حكومية أو شبه حكومية | A ministry, an authority or a government-owned company. | وزارة أو هيئة أو شركة مملوكة للحكومة. |

### 11.12 Decision role (الدور في القرار)

Field `person.decisionRole`.

| Value | Label | التسمية | What it means, when to pick it | المعنى ومتى تختاره |
| --- | --- | --- | --- | --- |
| `DECISION_MAKER` | Decision maker | صاحب القرار | Can say yes and sign. | يملك الموافقة والتوقيع. |
| `BUDGET_HOLDER` | Budget holder | مالك الميزانية | Controls the money that would pay for it. | يتحكم في المال الذي سيُدفع منه. |
| `TECHNICAL_EVALUATOR` | Technical evaluator | المقيِّم التقني | Judges whether our technology or service works for them. | يحكم على مدى ملاءمة تقنيتنا أو خدمتنا لهم. |
| `INFLUENCER` | Influencer | المؤثِّر | Shapes the decision without making it. | يؤثر في القرار دون أن يتخذه. |
| `END_USER` | End user | المستخدم النهائي | Will use what we deliver day to day. | سيستخدم ما نقدمه في عمله اليومي. |
| `GATEKEEPER` | Gatekeeper | حارس البوابة | Controls access to the people who decide, such as an assistant or procurement. | يتحكم في الوصول إلى أصحاب القرار، مثل مساعد أو إدارة المشتريات. |

### 11.13 Lost reason category (فئة سبب الخسارة)

Field `opportunity.lostReasonCategory`.

| Value | Label | التسمية | What it means, when to pick it | المعنى ومتى تختاره |
| --- | --- | --- | --- | --- |
| `NO_RESPONSE` | No response | لا رد | They stopped answering before a decision was made. | توقفوا عن الرد قبل اتخاذ القرار. |
| `PRICE` | Price too high | السعر مرتفع | They found our price too high. | رأوا أن سعرنا مرتفع. |
| `NO_BUDGET` | No budget | لا ميزانية | They had no money for it. | لم يكن لديهم مال لذلك. |
| `TIMING` | Wrong timing | توقيت غير مناسب | They need it at a time we cannot meet, or not at all for now; pick the stage Parked instead if it may come back. | يحتاجونه في وقت لا نستطيع الالتزام به، أو لا يحتاجونه الآن؛ واختر المرحلة Parked بدلاً منه إن كان قد يعود. |
| `COMPETITOR` | Went to a competitor | ذهب إلى منافس | They chose another provider. | اختاروا جهة أخرى. |
| `TECHNICAL_FIT` | Not a technical fit | لا توافق تقني | What we can offer does not meet their technical need. | ما نقدمه لا يلبي حاجتهم التقنية. |
| `CAPACITY` | No capacity on our side | لا قدرة لدينا | KUEC could not staff or deliver it in time. | لم تستطع KUEC توفير الفريق أو التنفيذ في الوقت المطلوب. |
| `OTHER` | Other | أخرى | None of the above; write the reason in Lost reason. | لا شيء مما سبق؛ اكتب السبب في «سبب الخسارة». |

### 11.14 Probability (الاحتمال)

Field `opportunity.probability`.

| Value | Label | التسمية | What it means, when to pick it | المعنى ومتى تختاره |
| --- | --- | --- | --- | --- |
| `PCT_10` | 10% | 10% | An early conversation with no defined need or budget yet. | حديث مبكر بلا حاجة محددة أو ميزانية بعد. |
| `PCT_25` | 25% | 25% | A defined need and the right contact, but no proposal yet. | حاجة محددة وجهة الاتصال المناسبة، ولكن بلا مقترح بعد. |
| `PCT_50` | 50% | 50% | A proposal or quote is with them and they are engaged. | لديهم مقترح أو عرض سعر وهم متفاعلون. |
| `PCT_75` | 75% | 75% | Terms are being negotiated and the decision maker supports it. | الشروط قيد التفاوض وصاحب القرار يؤيد. |
| `PCT_90` | 90% | 90% | Agreed in principle and waiting for signature. | متفق عليه مبدئياً وبانتظار التوقيع. |

### 11.15 Document source system (النظام المصدر للوثيقة)

Field `document.sourceSystem`.

| Value | Label | التسمية | What it means, when to pick it | المعنى ومتى تختاره |
| --- | --- | --- | --- | --- |
| `UVENTURE` | uVENTURE | uVENTURE | Created from uVENTURE by an integration. | أنشأه الربط الآلي من uVENTURE. |
| `SHAREPOINT` | SharePoint | SharePoint | Created from SharePoint by an integration. | أنشأه الربط الآلي من SharePoint. |

### 11.16 Opportunity stage (مرحلة الفرصة)

Field `opportunity.stage`. A standard Twenty field: its options are set in Settings (config/dashboards/opportunity-stages.md), so the app only describes them.

| Value | Label | التسمية | What it means, when to pick it | المعنى ومتى تختاره |
| --- | --- | --- | --- | --- |
| `NEW` | New | جديد | A case just opened, such as a converted lead or a new request; decide whether KUEC can and should respond. | ملف فُتح للتو، مثل عميل محتمل محوَّل أو طلب جديد؛ قرّر هل تستطيع KUEC الاستجابة وهل ينبغي لها ذلك. |
| `SCREENING` | Screening | فرز | Checking the fit: the need, the capability, the decision maker and the budget. | التحقق من التوافق: الحاجة والقدرة وصاحب القرار والميزانية. |
| `MEETING` | Meeting | اجتماع | Meeting the client to scope the work and agree what a proposal must cover. | الاجتماع بالعميل لتحديد نطاق العمل والاتفاق على ما يجب أن يغطيه المقترح. |
| `PROPOSAL` | Proposal | مقترح | A proposal or quote is with the client and the terms are being agreed. | لدى العميل مقترح أو عرض سعر والشروط قيد الاتفاق. |
| `CUSTOMER` | Customer | عميل | Twenty's own stage, not used at KUEC; pick Signed instead. | مرحلة خاصة بالنظام لا تُستخدم في KUEC؛ اختر Signed بدلاً منها. |
| `SIGNED` | Signed | موقَّع | The client signed; the ED is told, and a signed licence creates its contract. | وقّع العميل؛ فيُبلَّغ المدير التنفيذي، وينشئ الترخيص الموقَّع عقده. |
| `LOST` | Lost | خسرناها | It will not happen; fill in Lost reason category and Lost reason. | لن تتم؛ املأ «فئة سبب الخسارة» و«سبب الخسارة». |
| `PARKED` | Parked | مؤجَّلة | Real but on hold, and it comes up for review after 90 days. | حقيقية ولكنها متوقفة، وتُعرض للمراجعة بعد 90 يوماً. |

### 11.17 Capability source system (النظام المصدر للقدرة)

Field `capability.sourceSystem`.

| Value | Label | التسمية | What it means, when to pick it | المعنى ومتى تختاره |
| --- | --- | --- | --- | --- |
| `UVENTURE` | uVENTURE | uVENTURE | Created and kept current by the uVENTURE feed. | أنشأها ربط uVENTURE الآلي ويبقيها محدَّثة. |

### 11.18 Contract source system (النظام المصدر للعقد)

Field `contract.sourceSystem`.

| Value | Label | التسمية | What it means, when to pick it | المعنى ومتى تختاره |
| --- | --- | --- | --- | --- |
| `UVENTURE` | uVENTURE | uVENTURE | Created or adopted by the uVENTURE feed when the agreement was signed there, so uVENTURE owns its key fields. | أنشأه ربط uVENTURE الآلي أو تبنّاه عند توقيع الاتفاقية هناك، لذا يملك uVENTURE حقوله الرئيسية. |

### 11.19 Target size class (فئة الحجم المستهدفة)

Field `project.targetSizeClass`.

| Value | Label | التسمية | What it means, when to pick it | المعنى ومتى تختاره |
| --- | --- | --- | --- | --- |
| `STARTUP` | Startup | شركة ناشئة | A young company still building its product or its market. | شركة حديثة ما زالت تبني منتجها أو سوقها. |
| `SME` | Small or medium business | شركة صغيرة أو متوسطة | An established business that is not a large enterprise. | شركة قائمة ليست مؤسسة كبيرة. |
| `LARGE_ENTERPRISE` | Large enterprise | مؤسسة كبيرة | A large company or group, often with its own research and development. | شركة أو مجموعة كبيرة، كثيراً ما يكون لديها بحث وتطوير خاص بها. |
| `GOVERNMENT` | Government or semi-government | جهة حكومية أو شبه حكومية | A ministry, an authority or a government-owned company. | وزارة أو هيئة أو شركة مملوكة للحكومة. |

### 11.20 Campaign target status (حالة الجهة المستهدفة في الحملة)

Field `campaignTarget.status`.

| Value | Label | التسمية | What it means, when to pick it | المعنى ومتى تختاره |
| --- | --- | --- | --- | --- |
| `TO_CONTACT` | To contact | للتواصل | On the target list and not yet contacted. | ضمن قائمة الاستهداف ولم يُتواصل معها بعد. |
| `CONTACTED` | Contacted | تم التواصل | Reached through at least one campaign channel, with no answer yet. | وصلتها الحملة عبر قناة واحدة على الأقل دون رد حتى الآن. |
| `RESPONDED` | Responded | استجابت | Answered or met the team, but no lead yet. | ردّت أو التقت الفريق، لكن دون عميل محتمل بعد. |
| `LEAD_CREATED` | Lead created | أُنشئ عميل محتمل | A lead from this company is attributed to the campaign; the app sets it. | يوجد عميل محتمل من هذه الشركة منسوب إلى الحملة؛ ويضبطه التطبيق. |
| `NOT_INTERESTED` | Not interested | غير مهتمة | Said no to this campaign; leave it for the next one. | رفضت هذه الحملة؛ اتركها للحملة القادمة. |
| `DO_NOT_CONTACT` | Do not contact | لا يُتواصل معها | Must not be contacted, for example at the account owner's request. | يجب عدم التواصل معها، مثلاً بطلب من مسؤول الحساب. |

## 12. Every field

234 fields the app adds, from `kuec/app/src/i18n/fields.json`. Twenty shows the description as the tooltip of the field, in the member's language.

### 12.1 `campaignTarget`

| Field | Label | التسمية | What to put, when | ماذا تكتب ومتى |
| --- | --- | --- | --- | --- |
| `campaign` | Campaign | الحملة | The go-to-market campaign project whose target list this company is on. | مشروع الحملة التسويقية الذي تقع هذه الشركة ضمن قائمة استهدافه. |
| `company` | Company | الشركة | The company to reach in this campaign. | الشركة المطلوب الوصول إليها في هذه الحملة. |
| `name` | Name | الاسم | The company's name, set by the app when it adds the company to the list. | اسم الشركة، يضبطه التطبيق عندما يضيف الشركة إلى القائمة. |
| `status` | Status | الحالة | Where the campaign stands with this company; move it on after each contact, and the app sets Lead created. | موقف الحملة من هذه الشركة؛ حدّثه بعد كل تواصل، ويضبط التطبيق «أُنشئ عميل محتمل». |

### 12.2 `capability`

| Field | Label | التسمية | What to put, when | ماذا تكتب ومتى |
| --- | --- | --- | --- | --- |
| `contracts` | Contracts | العقود | Every contract, such as a licence, that covers this capability. | كل العقود، مثل الترخيص، التي تغطي هذه القدرة. |
| `engagements` | Engagements | التواصلات | Every engagement where this capability was presented or discussed. | كل التواصلات التي عُرضت فيها هذه القدرة أو نوقشت. |
| `externalId` | External id | المعرّف الخارجي | Filled by the uVENTURE feed with the record's uVENTURE id, such as uventure:TECH-0042; people never type it. | يملؤه ربط uVENTURE الآلي بمعرّف السجل في uVENTURE، مثل uventure:TECH-0042؛ ولا يكتبه أحد بيده. |
| `kind` | Kind | النوع | What the capability is, such as a technology, a lab or an item of equipment, as uVENTURE classifies it. | نوع القدرة، مثل تقنية أو مختبر أو معدات، كما يصنفها uVENTURE. |
| `lastSeenInUventureAt` | Last seen in uVENTURE | آخر ظهور في uVENTURE | When the nightly uVENTURE snapshot last listed this record; more than 7 days ago means uVENTURE no longer lists it. | آخر مرة أدرجت فيها لقطة uVENTURE الليلية هذا السجل؛ ومرور أكثر من 7 أيام يعني أن uVENTURE لم يعد يدرجه. |
| `name` | Name | الاسم | The title the record has in uVENTURE, copied by the uVENTURE feed; change it in uVENTURE, never here. | العنوان الذي يحمله السجل في uVENTURE، ينسخه ربط uVENTURE الآلي؛ غيّره في uVENTURE لا هنا. |
| `opportunities` | Opportunities | الفرص | Every case that offers or licenses this capability. | كل الحالات التي تعرض هذه القدرة أو ترخّصها. |
| `otherDetails` | Other details | تفاصيل أخرى | What Other means for this record, sent by uVENTURE when Kind or Status is Other. | ما تعنيه «أخرى» لهذا السجل، يرسله uVENTURE عندما يكون النوع أو الحالة «أخرى». |
| `sourceSystem` | Source system | النظام المصدر | Always uVENTURE: the system that owns this record. | دائماً uVENTURE: النظام الذي يملك هذا السجل. |
| `staleFrom` | Stale from | راكدة منذ | Seven days after Last seen in uVENTURE, set by the app; once it is past, uVENTURE no longer lists the record and its cases need a check. | بعد سبعة أيام من «آخر ظهور في uVENTURE»، يضبطه التطبيق؛ وبعد مروره لم يعد uVENTURE يدرج السجل وتحتاج حالاته إلى مراجعة. |
| `status` | Status | الحالة | Whether BD can offer it today, from its uVENTURE listing; check it before you promise it to a client. | هل يمكن لفريق تطوير الأعمال عرضها اليوم، وفق إدراجها في uVENTURE؛ تحقق منها قبل أن تعد بها عميلاً. |
| `statusChangedAt` | Status changed at | تاريخ تغيّر الحالة | When the uVENTURE feed last changed the status; the app sets it. | آخر مرة غيّر فيها ربط uVENTURE الآلي الحالة؛ ويضبطه التطبيق. |
| `uventureRecord` | uVENTURE record | سجل uVENTURE | The record's page in uVENTURE, where its details, owners and documents are. | صفحة السجل في uVENTURE، حيث تفاصيله ومسؤولوه ووثائقه. |

### 12.3 `company`

| Field | Label | التسمية | What to put, when | ماذا تكتب ومتى |
| --- | --- | --- | --- | --- |
| `accountTier` | Account tier | فئة الحساب | Pick how much attention this account gets: Tier 1 for the few strategic accounts, Tier 2 for active ones, Tier 3 to watch. | اختر مقدار الاهتمام الذي يستحقه هذا الحساب: الفئة 1 للحسابات الاستراتيجية القليلة، والفئة 2 للحسابات النشطة، والفئة 3 للمتابعة. |
| `campaignTargets` | Campaign targets | الجهات المستهدفة | Every go-to-market campaign that has this company on its target list. | كل حملة تسويقية تضع هذه الشركة ضمن قائمة استهدافها. |
| `contracts` | Contracts | العقود | Every contract that names this company as its counterparty. | كل العقود التي تذكر هذه الشركة طرفاً مقابلاً. |
| `documents` | Documents | الوثائق | Links to files about this company on SharePoint or uVENTURE; add a document whenever a file about them is saved there. | روابط إلى ملفات عن هذه الشركة على SharePoint أو uVENTURE؛ أضف وثيقة كلما حُفظ هناك ملف يخصّها. |
| `engagementLapsesAt` | Engagement lapses at | ينتهي التواصل في | Set by the app to 60 days after the last engagement; once it passes, the dashboard lists the company as not engaged. | يضبطه النظام على 60 يوماً بعد آخر تواصل؛ وبعد مروره تظهر الشركة في لوحة المتابعة على أنها بلا تواصل. |
| `engagements` | Engagements | التواصلات | Every logged contact with this company; log a new engagement the same day you meet, call or email them. | كل تواصل مسجَّل مع هذه الشركة؛ سجّل تواصلاً جديداً في اليوم نفسه الذي تلتقيهم فيه أو تتصل بهم أو تراسلهم. |
| `isOffsetObligor` | Offset obligor | ملتزم بالأوفست | Tick it when the company holds an offset obligation in the UAE, so offset-funded work can be proposed to it. | ضع علامة إذا كانت على الشركة التزامات أوفست في الإمارات، حتى يمكن اقتراح أعمال ممولة من الأوفست عليها. |
| `keywords` | Search keywords | كلمات البحث | Other spellings, Arabic variants and short names people search for, added whenever you create an important company. | تهجئات أخرى وصيغ عربية وأسماء مختصرة يبحث بها الناس، تضيفها كلما أنشأت شركة مهمة. |
| `lastEngagementAt` | Last engagement | آخر تواصل | Set by the app from the latest engagement date; log every contact to keep it current. | يضبطه النظام من تاريخ آخر تواصل؛ سجّل كل تواصل حتى يبقى محدَّثاً. |
| `leads` | Leads | العملاء المحتملون | Every lead from this company; create one the same working day you meet someone there with a possible need. | كل العملاء المحتملين من هذه الشركة؛ أنشئ واحداً في يوم العمل نفسه الذي تلتقي فيه شخصاً منها لديه حاجة محتملة. |
| `nameArabic` | Name (Arabic) | الاسم (بالعربية) | The company's name in Arabic exactly as it writes it, so that Arabic search finds it. | اسم الشركة بالعربية كما تكتبه هي تماماً، حتى يجدها البحث بالعربية. |
| `otherDetails` | Other details | تفاصيل أخرى | When any list on this record is set to Other, write in a few words what it is. | عند اختيار Other في أي قائمة في هذا السجل، اكتب في كلمات قليلة ما هو. |
| `projects` | Projects | المشاريع | Every project run with or for this company, such as a workshop, a proposal or a delivery. | كل مشروع يُنفَّذ مع هذه الشركة أو لها، مثل ورشة عمل أو مقترح أو تنفيذ. |
| `relationshipType` | Relationship type | نوع العلاقة | Pick the main relationship KUEC has with this company today, and change it when that relationship changes. | اختر العلاقة الرئيسية بين KUEC وهذه الشركة اليوم، وغيّرها عندما تتغير العلاقة. |
| `sector` | Sector | القطاع | Pick the company's main industry; if none fits, pick Other and name the industry in Other details. | اختر القطاع الرئيسي للشركة؛ وإن لم يناسبها أي قطاع فاختر Other واذكر القطاع في «تفاصيل أخرى». |
| `sizeClass` | Size class | فئة الحجم | Pick the kind of organisation: a startup, a small or medium business, a large enterprise, or government. | اختر نوع الجهة: شركة ناشئة، أو شركة صغيرة أو متوسطة، أو مؤسسة كبيرة، أو جهة حكومية. |

### 12.4 `contract`

| Field | Label | التسمية | What to put, when | ماذا تكتب ومتى |
| --- | --- | --- | --- | --- |
| `capability` | Capability | القدرة | The technology or other capability the agreement covers, set by the uVENTURE feed for a licence. | التقنية أو القدرة الأخرى التي تغطيها الاتفاقية، ويضبطها ربط uVENTURE الآلي للترخيص. |
| `counterparty` | Counterparty | الطرف المقابل | The company that signs the contract with KUEC, picked when you create the contract. | الشركة التي توقّع العقد مع KUEC، وتختارها عند إنشاء العقد. |
| `department` | Department | الإدارة | Pick the KUEC department that leads this work, which is Business development unless another department runs it. | اختر إدارة KUEC التي تقود هذا العمل، وهي Business development ما لم تتولَّه إدارة أخرى. |
| `documents` | Documents | الوثائق | Links to this contract's files on SharePoint, such as the signed copy and any amendment. | روابط إلى ملفات هذا العقد على SharePoint، مثل النسخة الموقَّعة وأي تعديل عليها. |
| `expiresOn` | Expires on | تاريخ الانتهاء | The date the contract ends, taken from the signed copy; the dashboard lists it 90 days before. | تاريخ انتهاء العقد كما في النسخة الموقَّعة؛ وتعرضه لوحة المتابعة قبل 90 يوماً من حلوله. |
| `externalId` | External id | المعرّف الخارجي | Filled by the uVENTURE feed with the agreement's uVENTURE id, such as uventure:AGR-0042; people never type it. | يملؤه ربط uVENTURE الآلي بمعرّف الاتفاقية في uVENTURE، مثل uventure:AGR-0042؛ ولا يكتبه أحد بيده. |
| `kind` | Kind | النوع | Pick what sort of agreement it is; a non-disclosure agreement is the most common. | اختر نوع الاتفاقية؛ واتفاقية عدم الإفصاح هي الأكثر شيوعاً. |
| `name` | Name | الاسم | A short name people recognise, made of the company and the agreement, such as ADNOC non-disclosure agreement 2026. | اسم قصير يعرفه الناس، من اسم الشركة ونوع الاتفاقية، مثل: اتفاقية عدم إفصاح ADNOC 2026. |
| `opportunity` | Opportunity | الفرصة | The opportunity this contract came from, picked so the case and its contract stay linked. | الفرصة التي نتج عنها هذا العقد، وتختارها حتى يبقى الملف وعقده مرتبطين. |
| `otherDetails` | Other details | تفاصيل أخرى | When any list on this record is set to Other, write in a few words what it is. | عند اختيار Other في أي قائمة في هذا السجل، اكتب في كلمات قليلة ما هو. |
| `owner` | Owner | المسؤول | The colleague who looks after this contract and is told before it expires. | الزميل الذي يتابع هذا العقد ويُبلَّغ قبل انتهائه. |
| `sharepointFolder` | SharePoint folder | مجلد SharePoint | The link to the SharePoint folder that holds the contract files; never upload the file itself here. | رابط مجلد SharePoint الذي يحفظ ملفات العقد؛ لا ترفع الملف نفسه هنا أبداً. |
| `signedOn` | Signed on | تاريخ التوقيع | The date both sides signed, filled in when the status becomes Signed. | التاريخ الذي وقّع فيه الطرفان، ويُعبّأ عندما تصبح الحالة Signed. |
| `sourceSystem` | Source system | النظام المصدر | uVENTURE when the agreement came from uVENTURE, whose feed then owns its kind, status, dates and value; empty when a person or the app made it. | uVENTURE عندما جاءت الاتفاقية من uVENTURE، فيملك ربطه الآلي نوعها وحالتها وتواريخها وقيمتها؛ وفارغ عندما أنشأها شخص أو التطبيق. |
| `status` | Status | الحالة | Where the contract stands; set it to Signed, with the signed date, once both sides have signed. | أين وصل العقد؛ اجعلها Signed مع تاريخ التوقيع بعد أن يوقّع الطرفان. |
| `uventureRecord` | uVENTURE record | سجل uVENTURE | The agreement's page in uVENTURE when it was signed there, such as a licence; the uVENTURE feed fills it. | صفحة الاتفاقية في uVENTURE عندما وُقّعت هناك، مثل الترخيص؛ ويملؤه ربط uVENTURE الآلي. |
| `value` | Value | القيمة | The total value in AED as written in the contract, left empty for an agreement with no money in it. | القيمة الإجمالية بالدرهم كما في العقد، وتُترك فارغة إذا لم تتضمن الاتفاقية أي مبلغ. |

### 12.5 `document`

| Field | Label | التسمية | What to put, when | ماذا تكتب ومتى |
| --- | --- | --- | --- | --- |
| `company` | Company | الشركة | The company this document is about or was exchanged with; fill every link that applies. | الشركة التي تخصها هذه الوثيقة أو تبادلناها معها؛ املأ كل رابط ينطبق. |
| `confidentiality` | Confidentiality | السرية | Pick the label written on the file; SharePoint or uVENTURE permissions, not this label, decide who can open it. | اختر التصنيف المكتوب على الملف؛ صلاحيات SharePoint أو uVENTURE، لا هذا التصنيف، هي التي تحدد من يمكنه فتحه. |
| `contract` | Contract | العقد | The contract this document belongs to, such as its signed copy or an amendment. | العقد الذي تتبعه هذه الوثيقة، مثل نسخته الموقَّعة أو تعديل عليه. |
| `documentLink` | SharePoint or uVENTURE link | رابط SharePoint أو uVENTURE | The link to the file on SharePoint or in uVENTURE; the file itself is never uploaded to the CRM. | رابط الملف على SharePoint أو في uVENTURE؛ ولا يُرفع الملف نفسه إلى النظام أبداً. |
| `expiresAt` | Expires on | تاريخ الانتهاء | When the document stops applying, such as the end of a non-disclosure term or a quote's validity, left empty if it never expires. | متى تتوقف الوثيقة عن السريان، مثل نهاية مدة عدم الإفصاح أو صلاحية عرض السعر، وتُترك فارغة إن لم تكن لها نهاية. |
| `externalId` | External id | المعرّف الخارجي | Filled by an integration with the record's id in the system that created it, such as uventure:DOC-0042; people never type it. | يملؤه الربط الآلي بمعرّف السجل في النظام الذي أنشأه، مثل uventure:DOC-0042؛ ولا يكتبه أحد بيده. |
| `kind` | Type | النوع | Pick what the document is; if nothing fits, pick Other and say what it is in Other details. | اختر نوع الوثيقة؛ وإن لم يناسبها شيء فاختر Other واذكر نوعها في «تفاصيل أخرى». |
| `lead` | Lead | العميل المحتمل | The lead this document belongs to, such as a capability brief sent before the lead was converted. | العميل المحتمل الذي تتبعه هذه الوثيقة، مثل نبذة عن القدرات أُرسلت قبل تحويله. |
| `name` | Name | الاسم | What the document is, as people say it, such as ADNOC non-disclosure agreement 2026. | ما هي الوثيقة كما يسميها الناس، مثل: اتفاقية عدم إفصاح ADNOC 2026. |
| `opportunity` | Opportunity | الفرصة | The opportunity this document belongs to, such as a proposal or a quote. | الفرصة التي تتبعها هذه الوثيقة، مثل مقترح أو عرض سعر. |
| `otherDetails` | Other details | تفاصيل أخرى | When any list on this record is set to Other, write in a few words what it is. | عند اختيار Other في أي قائمة في هذا السجل، اكتب في كلمات قليلة ما هو. |
| `owner` | Owner | المسؤول | The colleague who keeps this document's status, version and expiry up to date. | الزميل الذي يُبقي حالة الوثيقة وإصدارها وتاريخ انتهائها محدَّثة. |
| `person` | Person | الشخص | The person this document is about or for, such as the faculty member in a profile. | الشخص الذي تخصه هذه الوثيقة أو أُعدّت له، مثل عضو هيئة التدريس في ملف تعريفي. |
| `project` | Project | المشروع | The project this document belongs to, such as a workshop report. | المشروع الذي تتبعه هذه الوثيقة، مثل تقرير ورشة عمل. |
| `sourceSystem` | Source system | النظام المصدر | Filled by an integration with the system that created the record; empty means a person typed it. | يملؤه الربط الآلي باسم النظام الذي أنشأ السجل؛ وإن كان فارغاً فقد أدخله شخص بيده. |
| `status` | Status | الحالة | Where the document stands; update it when you share it, get it signed or replace it with a new version. | أين وصلت الوثيقة؛ حدّثها عندما تشاركها أو توقَّع أو تُستبدل بإصدار جديد. |
| `versionLabel` | Version | الإصدار | The version as written on the file, such as v3 or Final, updated whenever a new version is saved. | الإصدار كما هو مكتوب على الملف، مثل v3 أو Final، ويُحدَّث كلما حُفظ إصدار جديد. |

### 12.6 `engagement`

| Field | Label | التسمية | What to put, when | ماذا تكتب ومتى |
| --- | --- | --- | --- | --- |
| `capability` | Capability | القدرة | The technology or other uVENTURE capability presented or discussed, if any; uVENTURE is told about engagements on a technology. | التقنية أو القدرة الأخرى من uVENTURE التي عُرضت أو نوقشت، إن وجدت؛ ويُبلَّغ uVENTURE بالتواصلات المتعلقة بتقنية. |
| `company` | Company | الشركة | The company you met, called or emailed, picked for every engagement. | الشركة التي التقيتها أو اتصلت بها أو راسلتها، وتُختار لكل تواصل. |
| `date` | Date | التاريخ | When the contact happened; its outcome is due 2 days later. | متى حدث التواصل؛ وتُستحق نتيجته بعد يومين. |
| `department` | Department | الإدارة | Pick the KUEC department that leads this work, which is Business development unless another department runs it. | اختر إدارة KUEC التي تقود هذا العمل، وهي Business development ما لم تتولَّه إدارة أخرى. |
| `kind` | Kind | النوع | Pick what kind of contact it was; the meeting types count whether you met in person or online. | اختر نوع التواصل؛ وأنواع الاجتماعات تنطبق سواء كان اللقاء حضورياً أو عبر الإنترنت. |
| `lead` | Lead | العميل المحتمل | The lead this contact was about, picked so the lead's last engagement and its 30-day clock move on. | العميل المحتمل الذي كان التواصل بشأنه، وتختاره حتى يتحدّث آخر تواصل معه وتبدأ مهلة الثلاثين يوماً من جديد. |
| `name` | Subject | الموضوع | A short subject people recognise, such as Intro meeting with the ADNOC research team. | موضوع قصير يعرفه الناس، مثل: اجتماع تعارف مع فريق البحث في ADNOC. |
| `nextStep` | Next step | الخطوة التالية | What happens next and who does it; it is copied to the linked opportunity as its next action. | ما الذي سيحدث بعد ذلك ومن سيقوم به؛ ويُنسخ إلى الفرصة المرتبطة بصفته إجراءها التالي. |
| `opportunity` | Opportunity | الفرصة | The opportunity this contact was about, if there is one; its next action takes the next step. | الفرصة التي كان التواصل بشأنها إن وُجدت؛ ويأخذ إجراؤها التالي الخطوة التالية. |
| `otherDetails` | Other details | تفاصيل أخرى | When any list on this record is set to Other, write in a few words what it is. | عند اختيار Other في أي قائمة في هذا السجل، اكتب في كلمات قليلة ما هو. |
| `outcome` | Outcome | النتيجة | What was agreed or learned, written within 2 days of the contact; empty means it is not written up yet. | ما اتُّفق عليه أو ما عرفناه، ويُكتب خلال يومين من التواصل؛ وإن كان فارغاً فلم يُكتب بعد. |
| `outcomeDueAt` | Outcome due at | موعد كتابة النتيجة | Set by the app to 2 days after the date; after that an empty outcome shows on the hygiene list. | يضبطه النظام على يومين بعد التاريخ؛ وبعدها تظهر النتيجة الفارغة في قائمة جودة البيانات. |
| `outcomeType` | Outcome type | نوع النتيجة | Pick what the contact led to, and write the details in Outcome. | اختر ما أسفر عنه التواصل، واكتب التفاصيل في «النتيجة». |
| `owner` | Owner | المسؤول | The colleague who held the contact and writes up its outcome. | الزميل الذي أجرى التواصل ويكتب نتيجته. |

### 12.7 `lead`

| Field | Label | التسمية | What to put, when | ماذا تكتب ومتى |
| --- | --- | --- | --- | --- |
| `autoClosedAt` | Closed for no response at | أُغلق لعدم الرد في | Set by the app when it marked the lead Dead after 30 quiet days; you never type it. | يضبطه النظام عندما جعل العميل المحتمل Dead بعد 30 يوماً بلا تواصل؛ ولا تكتبه بنفسك. |
| `campaign` | Campaign | الحملة | The go-to-market campaign or workshop project the lead came from, picked when it came from one. | حملة دخول السوق أو مشروع ورشة العمل الذي جاء منه العميل المحتمل، وتختاره إن جاء من أحدهما. |
| `capabilityMatched` | Capability matched | توجد قدرة مطابقة | Tick it only when you can name the Khalifa University technology, lab, service or team that can meet the need. | ضع علامة فقط عندما تستطيع تسمية التقنية أو المختبر أو الخدمة أو الفريق في جامعة خليفة القادر على تلبية الحاجة. |
| `company` | Company | الشركة | The company the contact works for; search before you create a new company. | الشركة التي يعمل فيها الشخص؛ ابحث قبل أن تنشئ شركة جديدة. |
| `contactEdNotifiedAt` | Contact ED notified at | تاريخ إبلاغ المدير التنفيذي بعدم التواصل | Set by the app when the ED was told the lead sat in New for 7 working days; you never type it. | يضبطه النظام عندما أُبلغ المدير التنفيذي بأن العميل المحتمل بقي New مدة 7 أيام عمل؛ ولا تكتبه بنفسك. |
| `contactNudgeSentAt` | Contact nudge sent at | تاريخ تذكير المسؤول بالتواصل | Set by the app when the owner was reminded after 3 working days in New; you never type it. | يضبطه النظام عندما ذُكّر المسؤول بعد 3 أيام عمل في New؛ ولا تكتبه بنفسك. |
| `convertedOpportunity` | Converted opportunity | الفرصة الناتجة عن التحويل | Set by the app to the latest opportunity created from this lead; open it to carry on the work. | يضبطه النظام على آخر فرصة أُنشئت من هذا العميل المحتمل؛ افتحها لتواصل العمل. |
| `deadReason` | Dead reason | سبب الإغلاق | Pick why the lead went nowhere whenever you set its status to Dead. | اختر سبب عدم تقدّم العميل المحتمل كلما جعلت حالته Dead. |
| `decisionMakerReached` | Decision maker reached | تم الوصول إلى صاحب القرار | Tick it once you have spoken to the person who can say yes and sign, or they have joined the conversation. | ضع علامة بعد أن تتحدث مع من يملك الموافقة والتوقيع، أو بعد أن ينضم إلى الحديث. |
| `department` | Department | الإدارة | Pick the KUEC department that leads this work, which is Business development unless another department runs it. | اختر إدارة KUEC التي تقود هذا العمل، وهي Business development ما لم تتولَّه إدارة أخرى. |
| `documents` | Documents | الوثائق | Links to files about this lead on SharePoint or uVENTURE; never attach the file itself. | روابط إلى ملفات عن هذا العميل المحتمل على SharePoint أو uVENTURE؛ لا ترفق الملف نفسه أبداً. |
| `engagements` | Engagements | التواصلات | Every contact logged against this lead; each new one restarts its 30-day quiet clock. | كل تواصل مسجَّل مع هذا العميل المحتمل؛ وكل تواصل جديد يعيد مهلة الثلاثين يوماً من البداية. |
| `estimatedValue` | Estimated value | القيمة التقديرية | Your first guess at the deal size in AED, filled when you have one; it becomes the opportunity amount. | تقديرك الأول لحجم الصفقة بالدرهم، تملؤه حين يتوفر لديك؛ ويصبح مبلغ الفرصة. |
| `externalId` | External id | المعرّف الخارجي | Filled by the form or system that created the lead, such as web:4711; people never type it. | يملؤه النموذج أو النظام الذي أنشأ العميل المحتمل، مثل web:4711؛ ولا يكتبه أحد بيده. |
| `fundingPathIdentified` | Funding path identified | مسار التمويل معروف | Tick it once you know who would pay: their budget, a grant, an offset obligation or a sponsor. | ضع علامة بعد أن تعرف من سيدفع: ميزانيتهم، أو منحة، أو التزام أوفست، أو راعٍ. |
| `lastConvertedAt` | Last converted at | تاريخ آخر تحويل | Set by the app when the latest opportunity was created from this lead; you never type it. | يضبطه النظام عند إنشاء آخر فرصة من هذا العميل المحتمل؛ ولا تكتبه بنفسك. |
| `lastEngagementAt` | Last engagement | آخر تواصل | Set by the app from the latest engagement linked to this lead; log every contact to keep it current. | يضبطه النظام من آخر تواصل مرتبط بهذا العميل المحتمل؛ سجّل كل تواصل حتى يبقى محدَّثاً. |
| `name` | Name | الاسم | The person and company as you would say them, such as Mariam Al Hosani, ADNOC. | الشخص والشركة كما تنطقهما، مثل: مريم الحوسني، ADNOC. |
| `need` | Need | الحاجة | What they want, in their own words, written as soon as you know it; it becomes the opportunity description. | ما يريدونه بكلماتهم، وتكتبه بمجرد أن تعرفه؛ ويصبح وصف الفرصة. |
| `needIdentified` | Need identified | الحاجة محددة | Tick it once they have named a concrete problem or request KUEC could answer. | ضع علامة بعد أن يذكروا مشكلة أو طلباً محدداً يمكن لـ KUEC تلبيته. |
| `nextAction` | Next action | الإجراء التالي | The one thing you will do next on this lead, starting with a verb, such as Call to book a site visit. | الشيء الوحيد الذي ستفعله بعد ذلك مع هذا العميل المحتمل، ويبدأ بفعل، مثل: اتصل لحجز زيارة ميدانية. |
| `nextActionDate` | Next action date | تاريخ الإجراء التالي | The day you will do the next action, kept today or later. | اليوم الذي ستنفذ فيه الإجراء التالي، ويبقى اليوم أو بعده. |
| `nurtureReviewDate` | Nurture review date | تاريخ مراجعة المتابعة | When to look at a Nurture lead again; the app sets it 90 days out if you leave it empty. | متى تعود إلى عميل محتمل في الحالة Nurture؛ ويضبطه النظام بعد 90 يوماً إن تركته فارغاً. |
| `offeringInterest` | Offering interest | ما يهتمون به من خدمات KUEC | Pick every KUEC offering they asked about; the first one in the list sets the opportunity type at conversion. | اختر كل ما سألوا عنه من خدمات KUEC؛ وأولها في القائمة يحدد نوع الفرصة عند التحويل. |
| `opportunities` | Opportunities | الفرص | Every opportunity converted from this lead, later cross-sells included. | كل فرصة حُوّلت من هذا العميل المحتمل، ومنها فرص البيع الإضافي اللاحقة. |
| `otherDetails` | Other details | تفاصيل أخرى | When any list on this record is set to Other, write in a few words what it is. | عند اختيار Other في أي قائمة في هذا السجل، اكتب في كلمات قليلة ما هو. |
| `owner` | Owner | المسؤول | The colleague who works this lead; the ops coordinator owns it until triage hands it on. | الزميل الذي يعمل على هذا العميل المحتمل؛ ويكون لدى منسق العمليات حتى يُسنده بعد الفرز. |
| `person` | Person | الشخص | The contact person at the company; search before you create a new person. | الشخص الذي نتواصل معه في الشركة؛ ابحث قبل أن تنشئ شخصاً جديداً. |
| `playbookApplied` | Triaged | تم الفرز | Set by the app once triage has run, so that it runs only once; you never tick it. | يضبطه النظام بعد إجراء الفرز حتى لا يتكرر؛ ولا تضع العلامة بنفسك. |
| `qualificationScore` | Qualification score | درجة التأهيل | Set by the app to the number of ticked checks; at 4 or more the lead becomes Qualified. | يضبطه النظام على عدد الشروط المحققة؛ وعند 4 أو أكثر يصبح العميل المحتمل Qualified. |
| `qualifiedAt` | Qualified at | تاريخ التأهيل | Set by the app when the score first reached 4 and the lead became Qualified; you never type it. | يضبطه النظام عندما بلغت الدرجة 4 أول مرة وأصبح العميل المحتمل Qualified؛ ولا تكتبه بنفسك. |
| `referralCreditedAt` | Referral credited at | تاريخ احتساب رصيد الإحالة | Set by the app when an opportunity from this lead was signed and the referrer got the credit; you never type it. | يضبطه النظام عند توقيع فرصة من هذا العميل المحتمل واحتساب الرصيد لصاحب الإحالة؛ ولا تكتبه بنفسك. |
| `referralNote` | Referral note | ملاحظة الإحالة | How the referral came about and what was promised to the referrer, written when the lead is referred. | كيف جاءت الإحالة وما الذي وُعد به صاحبها، وتُكتب عند إحالة العميل المحتمل. |
| `referredBy` | Referred by | أحاله | The person outside the team who introduced this contact, such as a faculty member, so that they keep the credit. | الشخص من خارج الفريق الذي عرّفنا بهذا التواصل، مثل عضو هيئة تدريس، حتى يحتفظ بالرصيد. |
| `referredByMember` | Referred by (colleague) | أحاله (زميل) | The colleague who referred or logged this contact and holds the referral credit, which is you when you type the lead yourself. | الزميل الذي أحال هذا التواصل أو سجّله ويحتفظ برصيد الإحالة، وهو أنت عندما تُدخل العميل المحتمل بنفسك. |
| `source` | Source | المصدر | Pick where the lead came from when you create it; it is copied to the opportunity at conversion. | اختر من أين جاء العميل المحتمل عند إنشائه؛ ويُنسخ إلى الفرصة عند التحويل. |
| `sourceSystem` | Source system | النظام المصدر | Filled by the form or system that created the lead; empty means a person typed it. | يملؤه النموذج أو النظام الذي أنشأ العميل المحتمل؛ وإن كان فارغاً فقد أدخله شخص بيده. |
| `status` | Status | الحالة | Where the lead stands; move it on as you contact, engage and qualify them, or set Nurture or Dead. | أين وصل العميل المحتمل؛ انقله إلى الحالة التالية كلما تواصلت معه أو تحاورت أو أهّلته، أو اجعله Nurture أو Dead. |
| `statusEnteredAt` | Status entered at | تاريخ دخول الحالة | Set by the app when the lead entered its current status; you never type it. | يضبطه النظام عند دخول العميل المحتمل حالته الحالية؛ ولا تكتبه بنفسك. |
| `timingKnown` | Timing known | التوقيت معروف | Tick it once they have given a date or a window by which they need it. | ضع علامة بعد أن يحددوا تاريخاً أو فترة يحتاجونه خلالها. |
| `uventureRecord` | uVENTURE record | سجل uVENTURE | The challenge's page in uVENTURE when the lead came from a uVENTURE challenge; the uVENTURE feed fills it. | صفحة التحدي في uVENTURE عندما يأتي العميل المحتمل من تحدٍّ في uVENTURE؛ ويملؤه ربط uVENTURE الآلي. |

### 12.8 `milestone`

| Field | Label | التسمية | What to put, when | ماذا تكتب ومتى |
| --- | --- | --- | --- | --- |
| `department` | Department | الإدارة | Pick the KUEC department that leads this work, which is Business development unless another department runs it. | اختر إدارة KUEC التي تقود هذا العمل، وهي Business development ما لم تتولَّه إدارة أخرى. |
| `dueAt` | Due | موعد التسليم | The date the milestone must be reached, moved only with the project owner's agreement. | التاريخ الذي يجب بلوغ المرحلة فيه، ولا يُغيَّر إلا بموافقة مسؤول المشروع. |
| `name` | Name | الاسم | A short name for the checkpoint, such as Invitations sent. | اسم قصير لنقطة المتابعة، مثل: أُرسلت الدعوات. |
| `otherDetails` | Other details | تفاصيل أخرى | When any list on this record is set to Other, write in a few words what it is. | عند اختيار Other في أي قائمة في هذا السجل، اكتب في كلمات قليلة ما هو. |
| `owner` | Owner | المسؤول | The colleague responsible for reaching this milestone on time. | الزميل المسؤول عن بلوغ هذه المرحلة في موعدها. |
| `playbookStep` | Playbook step | خطوة دليل العمل | Set by the app with the template step that created this milestone; you never type it. | يضبطه النظام بخطوة القالب التي أنشأت هذه المرحلة؛ ولا تكتبه بنفسك. |
| `project` | Project | المشروع | The project this milestone belongs to. | المشروع الذي تتبعه هذه المرحلة. |
| `status` | Status | الحالة | Set it to Done when the checkpoint is reached; Missed turns the project red. | اجعلها Done عند بلوغ نقطة المتابعة؛ و Missed يجعل المشروع أحمر. |
| `workPackages` | Work packages | حزم العمل | The work packages that must be done to reach this milestone. | حزم العمل التي يجب إنجازها لبلوغ هذه المرحلة. |

### 12.9 `opportunity`

| Field | Label | التسمية | What to put, when | ماذا تكتب ومتى |
| --- | --- | --- | --- | --- |
| `capability` | Capability | القدرة | The technology, lab, equipment or other uVENTURE capability this case offers; pick it from the list the uVENTURE feed keeps. | التقنية أو المختبر أو المعدات أو القدرة الأخرى من uVENTURE التي تعرضها هذه الحالة؛ اخترها من القائمة التي يبقيها ربط uVENTURE. |
| `clientDeadline` | Client deadline | الموعد النهائي للعميل | The client's deadline for our reply to a request for quotation, filled when you open the case; the steps finish 2 working days before it. | الموعد النهائي الذي حدده العميل لردّنا على طلب عرض السعر، ويُعبّأ عند فتح الملف؛ وتنتهي الخطوات قبله بيومي عمل. |
| `contracts` | Contracts | العقود | Every contract that came from this opportunity; the app creates the licence contract when a licence is signed. | كل العقود الناتجة عن هذه الفرصة؛ وينشئ النظام عقد الترخيص عند توقيع ترخيص. |
| `convertedFromLeads` | Latest conversion of | آخر تحويل من | Set by the app to the leads whose latest conversion is this opportunity. | يضبطه النظام على العملاء المحتملين الذين كانت هذه الفرصة آخر تحويل لهم. |
| `department` | Department | الإدارة | Pick the KUEC department that leads this work, which is Business development unless another department runs it. | اختر إدارة KUEC التي تقود هذا العمل، وهي Business development ما لم تتولَّه إدارة أخرى. |
| `description` | Description | الوصف | What the client needs, in plain words; a converted lead's Need is copied here. | ما يحتاجه العميل بكلمات بسيطة؛ وتُنسخ إليه «الحاجة» من العميل المحتمل المحوَّل. |
| `documents` | Documents | الوثائق | Links to this opportunity's files, such as proposals and quotes, on SharePoint or uVENTURE. | روابط إلى ملفات هذه الفرصة، مثل المقترحات وعروض الأسعار، على SharePoint أو uVENTURE. |
| `engagements` | Engagements | التواصلات | Every contact logged against this opportunity, each logged the same day it happens. | كل تواصل مسجَّل بشأن هذه الفرصة، ويُسجَّل كل تواصل في اليوم نفسه. |
| `fundingPath` | Funding path | مسار التمويل | Pick who pays for the work once you know; Unknown is fine early on. | اختر من سيدفع مقابل العمل عندما تعرف؛ ولا بأس بـ Unknown في البداية. |
| `lead` | Lead | العميل المحتمل | Set by the app to the lead this opportunity was converted from. | يضبطه النظام على العميل المحتمل الذي حُوّلت منه هذه الفرصة. |
| `lostReason` | Lost reason | سبب الخسارة | Why we lost, in one sentence, written when you set the stage to Lost. | لماذا خسرنا، في جملة واحدة، وتُكتب عندما تجعل المرحلة Lost. |
| `lostReasonCategory` | Lost reason category | فئة سبب الخسارة | Pick the closest reason when you set the stage to Lost, and write the detail in Lost reason. | اختر أقرب سبب عندما تجعل المرحلة Lost، واكتب التفاصيل في «سبب الخسارة». |
| `nextAction` | Next action | الإجراء التالي | The one thing the owner does next, starting with a verb, such as Send the quote; every open opportunity needs one. | الشيء الوحيد الذي سيفعله المسؤول بعد ذلك، ويبدأ بفعل، مثل: أرسل عرض السعر؛ ولكل فرصة مفتوحة إجراء تالٍ. |
| `nextActionDate` | Next action date | تاريخ الإجراء التالي | The day the next action happens, kept today or later, or the owner gets a task at 08:00. | اليوم الذي يُنفَّذ فيه الإجراء التالي، ويبقى اليوم أو بعده، وإلا وصلت المسؤول مهمة في الساعة 08:00. |
| `nextActionFlaggedOn` | Next action flagged on | تاريخ التنبيه على الإجراء التالي | Set by the app on the day it flagged a missing or past next action, so that it flags once a day; you never type it. | يضبطه النظام في اليوم الذي نبّه فيه إلى إجراء تالٍ ناقص أو فات موعده، حتى لا ينبّه أكثر من مرة في اليوم؛ ولا تكتبه بنفسك. |
| `offering` | Offering | ما تقدمه KUEC | Pick every KUEC offering in the deal. | اختر كل ما تقدمه KUEC في هذه الصفقة. |
| `otherDetails` | Other details | تفاصيل أخرى | When any list on this record is set to Other, write in a few words what it is. | عند اختيار Other في أي قائمة في هذا السجل، اكتب في كلمات قليلة ما هو. |
| `parkedLapsesAt` | Parked lapses at | تنتهي فترة التأجيل في | Set by the app to 90 days after the opportunity was parked; after that it shows on the hygiene list for review. | يضبطه النظام على 90 يوماً بعد تأجيل الفرصة؛ وبعدها تظهر في قائمة جودة البيانات للمراجعة. |
| `playbookApplied` | Playbook applied | طُبّق دليل العمل | Set by the app once the playbook created this case's work packages, so that it runs only once; you never tick it. | يضبطه النظام بعد أن ينشئ دليل العمل حزم العمل لهذا الملف حتى لا يتكرر؛ ولا تضع العلامة بنفسك. |
| `playbookType` | Type | النوع | Pick what KUEC is selling; Licence and Technical service start a playbook of work packages straight away. | اختر ما تبيعه KUEC؛ و Licence و Technical service يبدآن دليل عمل بحزم العمل فوراً. |
| `probability` | Probability | الاحتمال | Your honest estimate that it signs, updated whenever the stage changes. | تقديرك الصادق لاحتمال التوقيع، وتحدّثه كلما تغيرت المرحلة. |
| `projects` | Projects | المشاريع | The projects that deliver this opportunity, such as a proposal or a delivery project. | المشاريع التي تنفّذ هذه الفرصة، مثل مشروع مقترح أو مشروع تنفيذ. |
| `sharepointFolder` | SharePoint folder | مجلد SharePoint | The link to this case's SharePoint folder, pasted when you open the case; documents live there, never here. | رابط مجلد SharePoint لهذا الملف، تلصقه عند فتح الملف؛ فالوثائق تُحفظ هناك لا هنا. |
| `source` | Source | المصدر | Pick where the opportunity came from when you create it; a converted lead fills it for you. | اختر من أين جاءت الفرصة عند إنشائها؛ ويملؤه العميل المحتمل المحوَّل نيابة عنك. |
| `stageEnteredAt` | Stage entered at | تاريخ دخول المرحلة | Set by the app whenever the stage changes; you never type it. | يضبطه النظام كلما تغيرت المرحلة؛ ولا تكتبه بنفسك. |
| `staleFrom` | Stale from | راكدة منذ | Set by the app to 30 days after the stage last changed; after that the opportunity counts as stale. | يضبطه النظام على 30 يوماً بعد آخر تغيير للمرحلة؛ وبعدها تُعدّ الفرصة راكدة. |
| `uventureRecord` | uVENTURE record | سجل uVENTURE | Paste the link to the uVENTURE record this case is about, such as the technology or the challenge, when the case opens. | الصق رابط سجل uVENTURE الذي تخصه هذه الحالة، مثل التقنية أو التحدي، عند فتح الحالة. |
| `workPackages` | Work packages | حزم العمل | Every work package of this case, created by the playbook or added by the ED or the ops coordinator. | كل حزم العمل لهذا الملف، ينشئها دليل العمل أو يضيفها المدير التنفيذي أو منسق العمليات. |

### 12.10 `person`

| Field | Label | التسمية | What to put, when | ماذا تكتب ومتى |
| --- | --- | --- | --- | --- |
| `decisionRole` | Decision role | الدور في القرار | Pick the part this person plays in the buying decision once you know it. | اختر الدور الذي يؤديه هذا الشخص في قرار الشراء عندما تعرفه. |
| `documents` | Documents | الوثائق | Links to files about this person, such as a faculty profile, on SharePoint or uVENTURE. | روابط إلى ملفات عن هذا الشخص، مثل ملف تعريفي لعضو هيئة تدريس، على SharePoint أو uVENTURE. |
| `isChampion` | Champion | مناصر | Tick it when this person argues for KUEC inside their own organisation. | ضع علامة إذا كان هذا الشخص يدافع عن KUEC داخل جهته. |
| `leads` | Leads | العملاء المحتملون | Every lead where this person is the contact. | كل عميل محتمل يكون هذا الشخص جهة الاتصال فيه. |
| `nameArabic` | Name (Arabic) | الاسم (بالعربية) | The person's name in Arabic as they write it, so that Arabic search finds them. | اسم الشخص بالعربية كما يكتبه هو، حتى يجده البحث بالعربية. |
| `referredLeads` | Referred leads | العملاء المحتملون المُحالون | Every lead this person introduced to KUEC; they keep the referral credit. | كل عميل محتمل عرّف هذا الشخص KUEC به؛ ويحتفظ برصيد الإحالة. |

### 12.11 `playbookRoleAssignment`

| Field | Label | التسمية | What to put, when | ماذا تكتب ومتى |
| --- | --- | --- | --- | --- |
| `isActive` | Active | نشط | Untick it when the member stops filling this role, instead of deleting the record. | أزل العلامة عندما يتوقف العضو عن هذا الدور، بدلاً من حذف السجل. |
| `member` | Member | العضو | The colleague who fills this playbook role. | الزميل الذي يشغل دور دليل العمل هذا. |
| `name` | Name | الاسم | A label people recognise, such as Sara as business development officer. | تسمية يعرفها الناس، مثل: سارة مسؤولة تطوير أعمال. |
| `playbookRole` | Playbook role | دور دليل العمل | Pick the role this member fills; new work for that role goes to its least-loaded active member. | اختر الدور الذي يشغله هذا العضو؛ ويذهب العمل الجديد لهذا الدور إلى أقل أعضائه النشطين انشغالاً. |

### 12.12 `project`

| Field | Label | التسمية | What to put, when | ماذا تكتب ومتى |
| --- | --- | --- | --- | --- |
| `campaignLeads` | Leads | العملاء المحتملون | The leads that came from this campaign or workshop, which name this project as their campaign. | العملاء المحتملون الذين جاؤوا من هذه الحملة أو الورشة، ويذكرون هذا المشروع حملةً لهم. |
| `campaignTargets` | Campaign targets | الجهات المستهدفة | The companies on this campaign's target list, built by the app from the target sector and size class. | الشركات ضمن قائمة استهداف هذه الحملة، يبنيها التطبيق من القطاع وفئة الحجم المستهدفين. |
| `channelPlan` | Channel plan | خطة القنوات | For a go-to-market campaign, every channel it plans to use. | للحملة التسويقية، كل قناة تخطط لاستخدامها. |
| `closeTaskCreatedAt` | Close task created at | تاريخ إنشاء مهمة الإغلاق | Set by the app when it asked the owner to close the project after every milestone was done; you never type it. | يضبطه النظام عندما طلب من المسؤول إغلاق المشروع بعد إنجاز كل المراحل؛ ولا تكتبه بنفسك. |
| `company` | Company | الشركة | The company the project is run for or with, if there is one. | الشركة التي يُنفَّذ المشروع لها أو معها، إن وُجدت. |
| `department` | Department | الإدارة | Pick the KUEC department that leads this work, which is Business development unless another department runs it. | اختر إدارة KUEC التي تقود هذا العمل، وهي Business development ما لم تتولَّه إدارة أخرى. |
| `documents` | Documents | الوثائق | Links to this project's files, such as the workshop report, on SharePoint. | روابط إلى ملفات هذا المشروع، مثل تقرير ورشة العمل، على SharePoint. |
| `endDate` | End date | تاريخ الانتهاء المخطط | The planned finish date of the project, set when you create it. | التاريخ المخطط لانتهاء المشروع، ويُضبط عند إنشائه. |
| `eventDate` | Event date | تاريخ الفعالية | The workshop date, set before you pick the type, because the invitation, logistics and run steps are planned back from it. | تاريخ ورشة العمل، ويُضبط قبل اختيار النوع، لأن خطوات الدعوة والتجهيز والتنفيذ تُخطَّط رجوعاً منه. |
| `health` | Health | سلامة المشروع | Set by the app from the milestones: amber when one is due within 7 days, red when one is missed. | يضبطه النظام من المراحل: كهرماني إذا استُحقت مرحلة خلال 7 أيام، وأحمر إذا فاتت مرحلة. |
| `milestones` | Milestones | المراحل الرئيسية | The dated checkpoints of this project, created by the template or added by the owner. | نقاط المتابعة المؤرخة لهذا المشروع، ينشئها القالب أو يضيفها المسؤول. |
| `name` | Name | الاسم | A short name people recognise, such as Membrane workshop, March 2027. | اسم قصير يعرفه الناس، مثل: ورشة الأغشية، مارس 2027. |
| `opportunity` | Opportunity | الفرصة | The opportunity this project delivers, if there is one. | الفرصة التي ينفّذها هذا المشروع، إن وُجدت. |
| `otherDetails` | Other details | تفاصيل أخرى | When any list on this record is set to Other, write in a few words what it is. | عند اختيار Other في أي قائمة في هذا السجل، اكتب في كلمات قليلة ما هو. |
| `owner` | Owner | المسؤول | The colleague who runs the project and closes it when every milestone is done. | الزميل الذي يدير المشروع ويغلقه بعد إنجاز كل المراحل. |
| `percentComplete` | Percent complete | نسبة الإنجاز | Set by the app to the share of milestones that are done; you never type it. | يضبطه النظام على نسبة المراحل المنجزة؛ ولا تكتبه بنفسك. |
| `playbookApplied` | Playbook applied | طُبّق دليل العمل | Set by the app once the template created this project's milestones and work packages; you never tick it. | يضبطه النظام بعد أن ينشئ القالب مراحل هذا المشروع وحزم عمله؛ ولا تضع العلامة بنفسك. |
| `playbookType` | Type | النوع | Pick what sort of project it is; Workshop, Proposal and Delivery start a template of milestones and work packages. | اختر نوع المشروع؛ و Workshop و Proposal و Delivery تبدأ قالباً من المراحل وحزم العمل. |
| `status` | Status | الحالة | Where the project stands; set On hold when it pauses and Done when the owner closes it. | أين وصل المشروع؛ اجعلها On hold عند التوقف و Done عندما يغلقه المسؤول. |
| `targetOffering` | Offering promoted | ما تروّج له الحملة | For a go-to-market campaign, what KUEC offers the targets. | للحملة التسويقية، ما تعرضه KUEC على الجهات المستهدفة. |
| `targetSector` | Target sector | القطاع المستهدف | For a go-to-market campaign, the sector to target; the target list is built from companies in it. | للحملة التسويقية، القطاع المستهدف؛ وتُبنى قائمة الاستهداف من الشركات العاملة فيه. |
| `targetSizeClass` | Target size class | فئة الحجم المستهدفة | For a go-to-market campaign, the company size to target; empty means every size in the sector. | للحملة التسويقية، حجم الشركات المستهدفة؛ والفراغ يعني كل الأحجام في القطاع. |
| `workPackages` | Work packages | حزم العمل | Every work package of this project. | كل حزم العمل في هذا المشروع. |

### 12.13 `publicHoliday`

| Field | Label | التسمية | What to put, when | ماذا تكتب ومتى |
| --- | --- | --- | --- | --- |
| `date` | Date | التاريخ | The date of the holiday; the app skips it when it counts working days. | تاريخ العطلة؛ ويتخطاه النظام عند حساب أيام العمل. |
| `name` | Name | الاسم | The holiday's name, such as Eid al-Fitr, entered by the ops coordinator when the year's holidays are announced. | اسم العطلة، مثل عيد الفطر، ويُدخله منسق العمليات عند إعلان عطلات السنة. |

### 12.14 `task`

| Field | Label | التسمية | What to put, when | ماذا تكتب ومتى |
| --- | --- | --- | --- | --- |
| `otherDetails` | Other details | تفاصيل أخرى | When any list on this record is set to Other, write in a few words what it is. | عند اختيار Other في أي قائمة في هذا السجل، اكتب في كلمات قليلة ما هو. |
| `taskType` | Type | النوع | Pick what sort of task it is when you create it. | اختر نوع المهمة عند إنشائها. |

### 12.15 `workPackage`

| Field | Label | التسمية | What to put, when | ماذا تكتب ومتى |
| --- | --- | --- | --- | --- |
| `acceptReminderSentAt` | Acceptance reminder sent at | تاريخ تذكير القبول | Set by the app when the owner and the ED were reminded after 2 working days without acceptance; you never type it. | يضبطه النظام عندما ذُكّر المسؤول والمدير التنفيذي بعد يومي عمل دون قبول؛ ولا تكتبه بنفسك. |
| `acceptedAt` | Accepted at | تاريخ القبول | Set by the app when the owner accepted the work; you never type it. | يضبطه النظام عندما قبل المسؤول العمل؛ ولا تكتبه بنفسك. |
| `blockedAt` | Blocked at | تاريخ التعطّل | Set by the app when the work package was blocked; you never type it. | يضبطه النظام عندما تعطّلت حزمة العمل؛ ولا تكتبه بنفسك. |
| `blockedReason` | Blocked reason | سبب التعطّل | What is stopping you and who can clear it, typed in the same edit that sets the status to Blocked. | ما الذي يوقفك ومن يستطيع رفع العائق، وتكتبه في التعديل نفسه الذي تجعل فيه الحالة Blocked. |
| `completedAt` | Completed at | تاريخ الإنجاز | Set by the app when the reviewer marked the work Done; you never type it. | يضبطه النظام عندما جعل المراجِع العمل Done؛ ولا تكتبه بنفسك. |
| `declinedReason` | Declined reason | سبب الرفض | Why you cannot take this work, in one line, typed when you press Decline. | لماذا لا تستطيع تولّي هذا العمل، في سطر واحد، وتكتبه عندما تضغط «رفض» في البطاقة. |
| `department` | Department | الإدارة | Pick the KUEC department that leads this work, which is Business development unless another department runs it. | اختر إدارة KUEC التي تقود هذا العمل، وهي Business development ما لم تتولَّه إدارة أخرى. |
| `dependents` | Dependents | الحزم التالية | The work packages that start when this one is done. | حزم العمل التي تبدأ عندما تُنجز هذه الحزمة. |
| `dependsOn` | Depends on | يعتمد على | The work package that must be done before this one starts. | حزمة العمل التي يجب إنجازها قبل أن تبدأ هذه الحزمة. |
| `doneCriteria` | Done criteria | معايير الإنجاز | The checks that must all be true before you submit, written by whoever plans the work. | الشروط التي يجب أن تتحقق كلها قبل التسليم، ويكتبها من يخطط للعمل. |
| `dueAt` | Due | موعد التسليم | The date the work must be submitted; if it is late, the owner is told that day and the ED 2 working days later. | التاريخ الذي يجب تسليم العمل فيه؛ وإذا تأخر يُبلَّغ المسؤول في اليوم نفسه والمدير التنفيذي بعد يومي عمل. |
| `dueOffsetBusinessDays` | Due offset (business days) | مهلة التسليم (أيام عمل) | Set by the app from the playbook as the working days from release to due; you never type it. | يضبطه النظام من دليل العمل بعدد أيام العمل من بدء الحزمة إلى موعد تسليمها؛ ولا تكتبه بنفسك. |
| `expectedOutput` | Expected output | المُخرَج المتوقع | What you hand over at the end, such as a two-page note saved on SharePoint. | ما تسلّمه في النهاية، مثل مذكرة من صفحتين محفوظة على SharePoint. |
| `milestone` | Milestone | المرحلة الرئيسية | The project milestone this work package helps reach, if there is one. | مرحلة المشروع التي تساعد هذه الحزمة على بلوغها، إن وُجدت. |
| `name` | Title | العنوان | A short name for the work, starting with a verb, such as Draft the partner shortlist. | اسم قصير للعمل يبدأ بفعل، مثل: اكتب القائمة المختصرة للشركاء. |
| `objective` | Objective | الهدف | Why this work matters, in one sentence, written before the work is offered. | لماذا يهم هذا العمل، في جملة واحدة، ويُكتب قبل عرض العمل. |
| `offeredAt` | Offered at | تاريخ العرض | Set by the app when the work was offered to its owner, which starts the 2-day acceptance clock. | يضبطه النظام عند عرض العمل على مسؤوله، ومنه تبدأ مهلة القبول البالغة يومين. |
| `opportunity` | Opportunity | الفرصة | The opportunity this work package belongs to, when it is part of a case. | الفرصة التي تتبعها حزمة العمل هذه، عندما تكون جزءاً من ملف. |
| `otherDetails` | Other details | تفاصيل أخرى | When any list on this record is set to Other, write in a few words what it is. | عند اختيار Other في أي قائمة في هذا السجل، اكتب في كلمات قليلة ما هو. |
| `overdueEdNotifiedAt` | Overdue ED notified at | تاريخ إبلاغ المدير التنفيذي بالتأخير | Set by the app when the ED was told the work is 2 working days late; you never type it. | يضبطه النظام عندما أُبلغ المدير التنفيذي بتأخر العمل يومي عمل؛ ولا تكتبه بنفسك. |
| `overdueOwnerNotifiedAt` | Overdue owner notified at | تاريخ إبلاغ المسؤول بالتأخير | Set by the app when the owner was told the work was due and not done; you never type it. | يضبطه النظام عندما أُبلغ المسؤول بأن موعد العمل حلّ ولم يُنجز؛ ولا تكتبه بنفسك. |
| `owner` | Owner | المسؤول | The one colleague who delivers this work; only they see the buttons on the card. | الزميل الوحيد الذي ينجز هذا العمل؛ وهو وحده يرى الأزرار في البطاقة. |
| `playbookStep` | Playbook step | خطوة دليل العمل | Set by the app with the playbook and step that created this work package; you never type it. | يضبطه النظام بدليل العمل والخطوة التي أنشأت حزمة العمل هذه؛ ولا تكتبه بنفسك. |
| `project` | Project | المشروع | The project this work package belongs to, when it is part of a project. | المشروع الذي تتبعه حزمة العمل هذه، عندما تكون جزءاً من مشروع. |
| `reassignedAt` | Reassigned at | تاريخ إعادة الإسناد | Set by the app when it moved the work to the ops coordinator after 5 working days without acceptance; you never type it. | يضبطه النظام عندما نقل العمل إلى منسق العمليات بعد 5 أيام عمل دون قبول؛ ولا تكتبه بنفسك. |
| `reviewer` | Reviewer | المراجِع | The colleague who checks the work against its done criteria and marks it Done. | الزميل الذي يراجع العمل وفق معايير الإنجاز ويجعله Done. |
| `status` | Status | الحالة | Where the work stands; use the card's buttons, and set Blocked here with a reason when you cannot go on. | أين وصل العمل؛ استخدم أزرار البطاقة، واجعلها Blocked هنا مع السبب عندما لا تستطيع المتابعة. |
| `submittedAt` | Submitted at | تاريخ التسليم | Set by the app when the owner submitted the work for review; you never type it. | يضبطه النظام عندما سلّم المسؤول العمل للمراجعة؛ ولا تكتبه بنفسك. |

### 12.16 `workspaceMember`

| Field | Label | التسمية | What to put, when | ماذا تكتب ومتى |
| --- | --- | --- | --- | --- |
| `ownedContracts` | Owned contracts | العقود التي يتولاها | The contracts this colleague owns. | العقود التي يتولاها هذا الزميل. |
| `ownedDocuments` | Owned documents | الوثائق التي يتولاها | The documents this colleague keeps up to date. | الوثائق التي يُبقيها هذا الزميل محدَّثة. |
| `ownedEngagements` | Owned engagements | التواصلات التي أجراها | The engagements this colleague held. | التواصلات التي أجراها هذا الزميل. |
| `ownedLeads` | Owned leads | العملاء المحتملون لديه | The leads this colleague works. | العملاء المحتملون الذين يعمل عليهم هذا الزميل. |
| `ownedMilestones` | Owned milestones | المراحل الرئيسية التي يتولاها | The milestones this colleague is responsible for. | المراحل الرئيسية التي يتولى هذا الزميل مسؤوليتها. |
| `ownedProjects` | Owned projects | المشاريع التي يديرها | The projects this colleague runs. | المشاريع التي يديرها هذا الزميل. |
| `ownedWorkPackages` | Owned work packages | حزم العمل لديه | The work packages this colleague delivers; My work shows the open ones. | حزم العمل التي ينجزها هذا الزميل؛ وتعرض My work المفتوح منها. |
| `playbookRoleAssignments` | Playbook roles | أدوار دليل العمل | The playbook roles this colleague fills, set by the ED or the ops coordinator. | أدوار دليل العمل التي يشغلها هذا الزميل، ويحددها المدير التنفيذي أو منسق العمليات. |
| `referredLeads` | Referred leads | العملاء المحتملون المُحالون | The leads this colleague referred or logged, for which they hold the referral credit. | العملاء المحتملون الذين أحالهم هذا الزميل أو سجّلهم، ويحتفظ برصيد إحالتهم. |
| `reviewedWorkPackages` | Work packages to review | حزم العمل للمراجعة | The work packages this colleague reviews before they are marked Done. | حزم العمل التي يراجعها هذا الزميل قبل أن تصبح Done. |
