# Usability test protocol

Status: **no round has been run.** This document is the protocol, the task scripts and the empty result sheets. Results are filled in per round and never reported before the session happened.

## 1. Setup

- Prototype: `kuec/design/prototype` running locally (`npm run dev`, port 3100) with the anonymised data set in `src/data`. Never real client names on a shared screen.
- Rounds: two per screen before build; five participants per round, one of them working in Arabic; a round mixes roles according to the screen (Today: 3 BD officers, the ED, the ops coordinator; Work Package card: 2 BD officers, 2 technical contributors, the ops coordinator).
- Devices: the participant's own laptop for tasks 1, 3, 4, 5, 6; their own phone for task 2 (the prototype is reachable on the office network).
- Method: think-aloud, moderator silent except the script; a note-taker records time, hesitations (pause of 5 s or more, back navigation, wrong click, opening Help), questions verbatim, and whether the task was finished without help.
- After each task: Single Ease Question, "Overall, how difficult or easy was this task?", 1 very difficult to 7 very easy.
- After the session: System Usability Scale (10 items, 0 to 100).

## 2. Tasks

| # | Task (read aloud) | Start screen | Success | Target |
| --- | --- | --- | --- | --- |
| 1 | "You have just met this person (business card). Record them so the team can follow up." | Today | Lead saved with person, company and need; participant did not have to explain the relationship between lead, person, company | under 90 s, no help |
| 2 | "You received this notification on your phone. Accept the work." | Notification (phone) | Status shows In progress; participant saw no raw field | under 30 s, no help |
| 3 | "Find out what is blocked right now and who is responsible." | Today | Names the blocked item and its owner | under 45 s |
| 4 | "Set what should happen next on the Al Marzouqi Engineering case, by next Thursday." | Pipeline | Next action text and date saved | under 60 s |
| 5 | "Who do we know at Gulf Precision Industries, and what is their role?" | Today | Names at least one person and their decision role | under 45 s |
| 6 | "What closed this month, and for how much?" | Today | Finds the signed cases and the total | under 60 s |

Pass per round: at least 80 percent of task attempts completed without help and SEQ mean at least 5.5. A screen with a failing round is revised and re-run before build.

## 3. Script

Welcome (2 min): purpose is to test the design, not the person; think aloud; there are no wrong answers; stop any time. Warm-up (3 min): "show me how you kept track of follow-ups last week." Tasks (25 min). SUS (3 min). Debrief (5 min): "what would you change first?", "which words were wrong?" (feeds `glossary.md`).

## 4. Result sheet (one per participant)

| Field | Value |
| --- | --- |
| Participant code (P1 to P5), role, language, device | |
| Task 1: time, finished without help (Y/N), hesitations, questions verbatim, SEQ | |
| Task 2 ... Task 6 | |
| SUS score | |
| Words the participant used for: Today, Pipeline, Accounts, Delivery, Insights, work package, case, blocked | |
| First thing they would change | |

## 5. Round results

| Round | Screen | Date | Participants | Completion without help | SEQ mean | SUS mean | Pass |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Today + Work Package card | not run | | | | | |
| 2 | Today + Work Package card | not run | | | | | |

## 6. Change log between rounds

Every change is logged against the quote that caused it.

| Date | Screen | Change | Caused by (participant, quote) |
| --- | --- | --- | --- |
| | | | |

## 7. Accessibility checks run with each round

Keyboard-only pass of all six tasks; screen reader pass of the Work Package card (NVDA or VoiceOver): reading order, button names, status announced; contrast of every status colour at 4.5:1; focus visible on every control; reduced-motion respected; 44 px targets at 390 px measured.
