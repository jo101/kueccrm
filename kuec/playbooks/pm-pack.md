# PM pack: projects, milestones, work packages

**Pack version:** the version of `kuec-bd-ops` installed, first shipped in 0.11.0. The pack lives in the app and changes only with an app release.
**Switch:** application variable `PM_PACK_ENABLED` (Settings > Apps > KUEC BD Ops > Variables), on by default.
**Dashboard tab:** BD > **Project pack**.
**Owner of the practice:** the ED. **Runs it day to day:** every project owner.

This pack is how delivery work is run once a case is won or an initiative starts: a project with an owner, milestones with dates, work packages with an owner, a due date and done criteria, a health that tells the truth, a RAID log kept current, and a weekly review that looks at all of it.

## 1. The structure

| Level | Holds | Must have | Who sets it |
| --- | --- | --- | --- |
| Project | One piece of delivery or one initiative | Owner, Type, Status, End date | The person who opens it; Workshop, Proposal and Delivery start their template (W9) |
| Milestone | A dated checkpoint the client or the ED would recognise | Owner, Due date | The project owner, or the template |
| Work package | One person's piece of work | Owner, Due date, Done criteria | The project owner, or the template; the owner accepts it within 2 business days |

Work package rules (acceptance, overdue, blocked) are the operating rules of `kuec/CLAUDE.md` section 7 and run whether or not the pack is on.

## 2. Health

W10 recalculates health and percent complete every morning: **Amber** when an open milestone is due within 7 days, **Red** when a milestone is missed. Red stays until the project owner clears it at the weekly review, with a note on what changed. Percent complete is the share of milestones done.

## 3. The RAID log

Every active project with an owner gets one note titled **RAID log** (P1, `p01-raid-log`), with four tables:

| Table | Write down |
| --- | --- |
| Risks | What could go wrong, how likely, how bad, what we do about it, who watches it, when we look again |
| Assumptions | What we are taking as true, why, and how we will check it |
| Issues | What has gone wrong, its impact, the action, who and by when |
| Dependencies | What we wait for, from whom, by when, and its status |

Edit the note in place; never start a second one. Anything that blocks a work package is also raised with **Request help** on the work package, so the ED hears about it with the reason.

## 4. The weekly review

Every Monday at 08:00 each project owner gets one task, **Weekly review, week of {date}** (P2, `p02-weekly-review`), listing their active projects with the worst health first. Before the Monday standup, for each project:

1. Open BD > **Project pack** and the project.
2. Health: agree with it, or clear Red with a note on what changed.
3. Milestones: dates still right; a missed one marked Missed with the reason in Other details or a note.
4. Work packages: nothing Offered for more than 2 business days, nothing overdue without a new date, every Blocked one has its reason.
5. RAID log: add what is new, close what is done.
6. Close the task.

## 5. What is in the pack

| Kind | Items |
| --- | --- |
| Views | Projects > Portfolio, By health, At risk; Milestones > Open; Work packages > Blocked |
| Dashboard | BD > **Project pack**: active projects by health, open and missed milestones, blocked work packages on projects |
| Guidance | The Project pack tab's five lines (`app/src/i18n/guidance.json`, key `packProjects`) and the project, milestone and work package record pages |
| Note template | The RAID log (`app/src/packs/raid-log-template.ts`) |
| Automations it switches | P1 RAID log, P2 weekly review, and the RAID part of `packs-sweep` |

**Never switched by the pack:** W9 templates, W10 health, and every work package escalation.

## 6. Turning it off

Set `PM_PACK_ENABLED` to off. P1, P2 and the sweep's RAID repair stand down; existing RAID log notes, the views, the tab and the guidance stay. Turning it on again gives a RAID log to every active project that has none, at the next daily sweep.
