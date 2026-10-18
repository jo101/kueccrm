# Research: discovery for the KUEC BD Ops employee experience

Written 2026-10-18. **Status: no session has taken place. Every persona statement, job, top task and pain point below is derived from artefacts in this repository (journeys, wireframes, the UX audit, runbooks, the roadmap) and is marked UNVALIDATED until a named participant confirms it.** Section 1 is the request to the ED; sections 2 to 7 are the working hypotheses the sessions will correct; section 8 is the research plan itself.

## 1. Request to the ED (to send this week)

Eight contextual sessions, 30 to 45 minutes each, on the participant's own desk or phone, in the week of 2026-10-26:

| # | Who | Task to shadow | Artefacts to collect |
| --- | --- | --- | --- |
| 1 to 4 | Four BD staff (the four BD officers) | One real task each: returning from a site visit; chasing a proposal; preparing Thursday's update; logging a lead from a business card | Their spreadsheet or notebook, the Teams or WhatsApp thread they used last, Outlook flags or folders |
| 5 | The ops coordinator | Triage of this morning's leads and one reassignment | The lead list she keeps, any tracker outside Twenty |
| 6 to 7 | Two Commercialization colleagues | Accepting and delivering a piece of work handed over by BD | How the hand-over reaches them today (email, Teams, verbal) |
| 8 | The ED | The hour before and after a Thursday review; one escalation she handled this month | The Thursday notes, the last three chasing messages she sent |

Plus, with six people (mix of the above): a 20-minute top-tasks exercise and a 20-minute card sort and tree test on destination names (section 8.3).

Consent and confidentiality: notes only, no recording unless the participant agrees; client names are replaced in all write-ups; raw notes stay with the researcher. Nothing is shown to management by name.

If the sessions cannot happen by 2026-11-06, design proceeds on this document and every assumption keeps its UNVALIDATED mark through usability round one.

## 2. Personas (hypotheses)

Derived from `journeys.md` section 2 (roles and "must never have to"), `runbooks/13-roles.md`, `runbooks/19-leads.md` and `tests/23-ux-audit.md` personas Bader, Bushra, Imran.

| Persona | Who, today | Goal in one line | Devices and language | UNVALIDATED assumptions |
| --- | --- | --- | --- | --- |
| BD officer | Four people, new to business development, each with 8 to 12 open cases | Keep every case moving without being chased | Laptop at the desk, phone between meetings; two prefer English, at least one works in Arabic | Phone use between meetings; number of open cases; language split |
| Executive director (ED) | One person; decides stage gates, licence terms, partnerships; currently chases follow-ups | Stop firefighting; see decisions, not records | Laptop and phone; English; reads on the phone during travel | Phone reading; appetite for a digest versus live notifications |
| Ops coordinator | One person; triages leads next working day, reassigns work after 5 days, owns the Help page | Keep the queue clean and know who is stuck | Laptop; Arabic and English | That she, not the ED, wants the exceptions view first |
| Technical contributor | 2 to 4 engineers and department colleagues (Commercialization, IP office, Lab access, Leasing, Startups and investment); occasional faculty with no CRM account | Finish an assigned piece of work without learning the CRM | Mostly laptop; email is the entry point | That they will accept email as the channel; faculty participation at all (no role exists today, `13-roles.md` line 175) |
| Leadership viewer | Nobody yet; a future dean or board reader | Read performance without touching data | Laptop; English | Everything |

## 3. Jobs to be done (outcome form, hypotheses)

| Persona | When I... | I want to... | So that... | Source |
| --- | --- | --- | --- | --- |
| BD officer | come out of a meeting | log what happened and the next step in under two minutes from my phone | nothing is lost before the next meeting | journeys J4 6.3, F6 |
| BD officer | start the day | see which of my cases need me today and what the next move is | I do not open ten records to find out | wireframes Home block 2 |
| BD officer | receive a business card | create the lead without deciding how companies, people and leads relate | the ops coordinator can triage it tomorrow | audit U16, runbook 19 |
| BD officer | get stuck | ask for help without declaring the work blocked | I keep ownership and the ED is not alarmed | runbook 20 section 6 |
| ED | open the CRM | see the decisions waiting for me, separated from routine noise | I decide in minutes and stop chasing | wireframes Home ED variant; journeys "must never have to" |
| ED | prepare Thursday | read what closed, what is blocked and what is next, already drafted | the review fixes records instead of reconstructing them | runbook 06 |
| Ops coordinator | triage leads in the morning | work one queue with duplicates flagged and assignment in one step | the lead reaches an owner within a day | runbook 19 lines 50 to 52 |
| Ops coordinator | reassign stuck work | move it in one action that also tells both people and restarts the timer | nobody edits three fields (journeys F15) | journeys F15 |
| Technical contributor | get an email that work is offered | accept or decline from that email in under 30 seconds and see what done means | I do not have to find anything in the CRM | audit U5, wireframes card |
| Technical contributor | finish the work | submit the output link and know who reviews it | the hand-back is explicit | audit U25 |

## 4. Top tasks and dreaded tasks (hypotheses, to be ranked by the team)

Frequent (from `backlog.md` volumes, lines 33 to 44): log a contact or lead; set a next action and date; accept a work package; submit work; check what is due this week. Dreaded (from the friction log F1 to F24): finding the right view among about 70; moving work by editing a raw Status select; closing the notification tasks that never close; recording a client decision made by phone; preparing the Thursday update.

The top-tasks exercise (section 8.2) replaces this list.

## 5. Moments that matter

| Moment | What must be true | Today | Evidence |
| --- | --- | --- | --- |
| First login | Lands on Today in their language, with a three-step tour and the day-one checklist; never sees "Invite your team" | Blocked on Twenty onboarding; Help link dead | audit U1; gate M6 |
| First lead | Captured in under 90 seconds; search before create; automation assigns the ops coordinator | 38-field panel, Company and Person after about 30 fields, lead ownerless | audit U16 |
| First offered work package | Accepted from the notification in under 30 seconds without a raw field | Card below a 29-field list; four duplicate tasks; department roles get an error | audit U3, U5, U2 |
| First blocked item | Reason captured, ED told once, owner knows the way out | Blocking needs the full record; "blocked" and "need help" confused by new staff | cadence line 81; journeys F21 |
| Thursday review | What closed, what is blocked, decisions pending, drafted before the meeting | Rich-text widget cleared by hand; charts without numbers | runbook 06; gate M5 |
| Hour after a site visit | One debrief creates several follow-ups across opportunities | One engagement links to one opportunity; the rest typed into outcome text | journeys J4 line 520 |

## 6. Pain points with the words we have

No verbatim user quotes exist in the repository; the statements below are the authored observations from `journeys.md` and `tests/23-ux-audit.md`, kept word for word so the sessions can confirm or replace them.

- "Know a status value, a field name, or which of the 70 views to open" (journeys line 56, BD officer "must never have to").
- "Edit three fields to move one piece of work" (journeys line 56, ops coordinator).
- "Chase anyone, open a record to find out why something is late" (journeys line 56, ED).
- "Moving work forward means editing a raw Status select whose values are system words" (F3, line 1131).
- "Notification Tasks never close" (F4, line 1132).
- "new staff do not know 'blocked' from 'need help'" (F21, line 1149).
- "The client decides by phone and nobody records it" (J2 line 400).
- "Double entry: the Outlook meeting syncs into Twenty's calendar, not into Engagements" (J4 line 532).

## 7. Baselines

| Measure | Value today | Source | Status |
| --- | --- | --- | --- |
| Time to log a lead | Not measured; the audit predicts the 90-second target is missed; the create panel takes 3.2 s to appear and has 38 fields | audit U16, `lead-create.json` | To measure in session 4 |
| How follow-ups are tracked | Twenty Tasks (about 60 notification tasks a week) plus Outlook flags and Teams threads | backlog line 42; journeys F4 | To observe in sessions 1 to 4 |
| Manager interventions per week | Not measured; roadmap metric 1.1 "not received" | roadmap 2027-q1 line 26 | ED keeps a tally for two weeks |
| Median time to accept a work package | Not measured; rule is 2 working days; no median aggregate in Twenty 2.48 | roadmap metric 1.4 | Derive from `acceptedAt - offeredAt` by export |
| Friction cost | About 1,400 minutes a week, authored estimate | backlog lines 33 to 44 | Replace with session timings |
| Daily active users | Zero; production not live | gate 22 | Baseline is the pilot's first week |

## 8. Research plan

### 8.1 Contextual sessions (eight)

Guide, 35 minutes: 5 minutes on their week and the tools open on their screen; 20 minutes shadowing the one task above, thinking aloud, researcher silent except "what are you looking for now?"; 10 minutes on the three most recent moments work was lost or chased. Record: time per step, every switch between tools, every question asked of a colleague, every workaround, verbatim phrases for the glossary (English and Arabic as spoken). Output per session: one page, anonymised.

### 8.2 Top-tasks exercise (six people)

Each person gets the 22 candidate tasks on cards (from section 4 plus the audit's day-one checklist) and marks the five they do most often and the three they dread most. Count the votes; the top five frequent tasks become the Today page's card types and the Log action's defaults; the top three dreaded tasks become usability round one's tasks 2, 3 and 4.

### 8.3 Card sort and tree test (six people, Arabic names tested separately)

Open card sort of 30 items (every screen and list a BD officer can reach today, named in plain words) into groups the participant names. Then a tree test on the hypothesis tree Today, Pipeline, Accounts, Delivery, Insights, with eight tasks ("where would you find who we know at ADNOC?", "where would you set what happens next on a case?", "where would you see what is blocked?"). Pass: at least 80 percent first-click success per task. Arabic participants run the same test with the Arabic names from `glossary.md` and may rename any destination; the team's words win over the hypothesis names.

### 8.4 Synthesis

Themes by frequency and impact; one job statement per theme; every change to the IA or a screen logged against the session note that caused it; UNVALIDATED marks removed only where a session supports the statement.
