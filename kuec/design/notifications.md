# Notification matrix

Principle 12 of the brief: every notification is designed (channel, timing, one message per event, deep link) and is never a task. Today every notification is a Twenty Task plus a plain-text email and a Teams line (`runbooks/12-global-features.md` lines 225 to 245); tasks never close (journeys F4) and one offer produced four tasks (audit U3). Quiet hours and digests exist nowhere in the repository today.

## 1. Channels

| Channel | What it is | Rule |
| --- | --- | --- |
| In-app inbox | `/crm/inbox` and the bell; one entry per event with the record link; read state per person; stored in the uVENTURE side of `/crm` (Twenty 2.48 has no notification centre) | Always |
| Email | One message per event, under 20 words plus the deep link, from the bd-ops mailbox | Offered work, overdue work, weekly digest |
| Teams | One line plus link to the BD channel | Blocked, escalated (5-day reassignment, overdue to ED), signed |
| Twenty Task | Retired as a notification channel; a task is created only when the event is itself a piece of work for a person (triage a lead, record a lost reason) | Never for "you have been told" events |

## 2. Matrix per event

Event ids are the logic functions that raise them (`kuec/app/src/logic-functions`). "Deep link" is the `/crm` route; the Twenty record stays reachable through "Open the expert CRM".

| Event | Recipient | In-app | Email | Teams | Timing | Deep link | Message (English; Arabic in `glossary.md`) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| W2 work package offered | owner | yes | yes | no | immediate | `/crm/work/:id` | "{Title} is offered to you, due {date}. Accept or decline." |
| W2 not accepted after 2 working days | owner, ED | yes | owner only | no | 08:00 Gulf | `/crm/work/:id` | "{Title} has waited 2 working days. Accept, decline, or ask for help." |
| W2 not accepted after 5 working days (reassigned) | previous owner, new owner (ops coordinator), ED | yes | new owner | yes | immediate | `/crm/work/:id` | "{Title} moved to {new owner} after 5 working days." |
| W3 overdue, day 0 | owner | yes | yes | no | 08:00 Gulf on the due day | `/crm/work/:id` | "{Title} is due today." |
| W3 overdue, +2 working days | ED | yes | no | yes | 08:00 Gulf | `/crm/decisions/:id` | "{Title} is 2 working days late with {owner}." |
| W5 blocked | ED | yes | no | yes | immediate (escalation: ignores quiet hours) | `/crm/decisions/:id` | "{Owner} blocked {title}: {reason}." |
| Request help (card) | ops coordinator | yes | no | no | immediate | `/crm/work/:id` | "{Owner} asks for help on {title}: {question}." (this one stays a task too, because it is work for her) |
| W6 submitted for review | reviewer | yes | no | no | immediate | `/crm/work/:id` | "{Owner} submitted {title}. Approve or send back." |
| W6 approved, next step released | next owner | yes | yes | no | immediate | `/crm/work/:id` | as W2 offered |
| W6 sent back | owner | yes | no | no | immediate | `/crm/work/:id` | "{Reviewer} sent {title} back: {note}." |
| W1 licence case opened, confirm plan | ED | yes | no | no | immediate | `/crm/decisions/:id` | "Confirm the plan for {case}." |
| W4 no next action (08:00 daily) | owner, or ED if no owner | yes | no | no | 08:00 Gulf, grouped into one entry per person per day | `/crm?filter=no-next-action` | "{n} of your cases have no next step." |
| W7 opportunity signed | ED, owner | yes | no | yes | immediate | `/crm/opportunities/:id` | "{Case} signed with {company}, {value} AED." |
| W8 lost without reason | owner | task (it is work) + in-app | no | no | immediate | `/crm/opportunities/:id` | "Record why {case} was lost." |
| L1 lead to triage | ops coordinator | task + in-app | no | no | next working day 17:00 | `/crm/pipeline/leads` | "Triage {lead}." |
| L2 lead not contacted in 3 / 7 working days | owner / ED | yes | no | no | 08:00 Gulf | `/crm/pipeline/leads/:id` | "{Lead} has not been contacted for {n} working days." |
| L3 lead auto-closed, confirm or revive | owner | yes | no | no | 08:10 Gulf | lead | "{Lead} closed after 30 quiet days. Confirm or revive." |
| L4 qualified, convert or park | owner (ED for licence-grade) | yes | no | no | immediate | lead | "{Lead} is qualified. Convert or park." |
| L6 referral thanks | referrer | yes | yes | no | immediate | lead | "Thank you: {lead} came from your referral." |
| U4 capability unavailable | owners of open cases using it | yes | yes | no | immediate | opportunity | "{Capability} is no longer available; {case} uses it." |
| Thursday digest | ED | yes | yes | no | Thursday 08:00 Gulf | `/crm/insights?week` | What closed, what is blocked, decisions pending, overdue count |

## 3. Timing rules

- Gulf time (Asia/Dubai, UTC+4, no DST) for every schedule; crons stay UTC with the local time in a comment (`kuec/CLAUDE.md` section 8).
- Quiet hours 20:00 to 07:00 Gulf: in-app entries are written immediately but email and Teams are deferred to 07:00; Friday and Saturday deferral to Sunday 07:00. Exception: escalations (blocked, 5-day reassignment, overdue to ED) go out at once.
- One message per event per recipient per channel, keyed on the transition (`work package id + status + offeredAt`), never on a retry (fixes audit U3); the key lives in the app's key-value store as today (`automation/notifications/notify.ts`).
- Daily guards (W4, L2) group into one entry per person per day.

## 4. Where it runs

The event source stays the logic functions; the fan-out stays in `notify.ts`. The in-app channel is a new sink: the function writes one row per recipient to a uVENTURE-side `crm_notifications` store through the signed server-to-server route already used for uVENTURE events (the reverse direction of `runbooks/21-uventure-readiness.md` section 5), and `/crm` polls it (poll, do not push). No field is added to Twenty for notifications; read state is uVENTURE's. The retirement of task-as-notification is a change to `notify.ts` and is listed in `redesign-backlog.md` as N1 with its tests (fixed clock, idempotency).

## 5. First run

Role-based welcome on first login (one screen, the person's name and role in plain words), a three-step tour (Today, Log, the Work Package card), the day-one checklist from `runbooks/10-onboarding.md` shown in-app with live ticks, empty states that teach the next step. Twenty's own onboarding ("Create profile", "Invite your team") is cleared by the admin before the person's first sign-in: the admin signs in first, completes "Create profile" and presses "Skip anyway" on "Invite your team" (verified on the rehearsal stack 2026-10-18; the step is per workspace, so once cleared no later member sees it). This becomes a numbered step in `runbooks/01-deploy.md` section 4 (listed in `redesign-backlog.md` as F4).
