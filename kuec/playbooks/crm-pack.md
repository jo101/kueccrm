# CRM pack: lead to opportunity

**Pack version:** the version of `kuec-bd-ops` installed, first shipped in 0.11.0. The pack lives in the app and changes only with an app release.
**Switch:** application variable `CRM_PACK_ENABLED` (Settings > Apps > KUEC BD Ops > Variables), on by default.
**Dashboard tab:** BD > **Pipeline pack**.
**Owner of the practice:** the ED. **Runs it day to day:** the ops coordinator and every BD officer.

This pack is how a contact becomes a signed case: a lead is logged the same day, contacted within its contact time, qualified on five checks, converted, and moved through the stages only when each stage's exit criteria are met. Accounts are tiered so effort goes where it pays, and whoever brought a lead in gets the credit when it signs.

## 1. Lead to opportunity, with contact times

| Step | Who | By when | What the CRM does |
| --- | --- | --- | --- |
| Log the lead | Whoever met them | The same working day | Nothing to set but a name and a company. L1 gives an ownerless lead to the ops coordinator with a Triage task |
| Triage | Ops coordinator | Next working day | Fill Source, Department and Offering interest; give it to the person who should work it |
| First contact | Lead owner | 3 working days in New | L2 nudges the owner on day 3 and tells the ED on day 7 |
| Keep it moving | Lead owner | 30 days without a status change or an engagement | L3 asks the owner to confirm or revive, then closes it as Dead, No response |
| Qualify | Lead owner | When 4 of the 5 checks are true | L4 sets Qualified and gives the owner a task to convert or park |
| Convert | Lead owner | Target: within 5 working days of Qualified | L5 creates the opportunity at Qualify (stage New) with the lead's source and offering |

The five checks and the lead statuses: `runbooks/19-leads.md` sections 1 and 3.

## 2. Stage exit criteria

A case leaves a stage only when that stage's exit criteria are filled. Twenty cannot refuse a stage move, so C1 (`c01-stage-exit-check`) gives the owner a task naming what is missing whenever a case moves forward without them, counting every stage it skipped. The table **Proposal or later, exit criteria missing** on the Pipeline pack tab lists the late-stage gaps.

| To leave | Fill | Why |
| --- | --- | --- |
| Qualify (New) | Company, Owner, Source, Type | Nobody can work, count or route a case without them; Type starts the playbook |
| Screening | Point of contact, Offering | We know who we speak to and what we sell |
| Meeting | Amount, Close date, Funding path | The case can be forecast and someone is known to pay |
| Proposal | Probability | The pipeline can be weighted |
| Customer | SharePoint folder; for a Licence also Capability (the technology) and uVENTURE record | The signed papers have a home, and uVENTURE can record the licence against the technology |

Stage labels: New is Qualify until the stage relabel (`14-hygiene.md`). Lost and Parked need a reason, not exit criteria.

## 3. Account tiers

| Tier | Means | Effort |
| --- | --- | --- |
| Tier 1 | The few strategic accounts | An engagement at least every 60 days, an account plan project, search keywords filled |
| Tier 2 | Active accounts | An engagement at least every 60 days |
| Tier 3 | Accounts to watch | No rule; log what happens |

The account owner sets the tier on the company; the ED reviews tiers each quarter. A Tier 1 or Tier 2 account with no engagement for 60 days shows on BD > Executive. The Pipeline pack tab lists tiered accounts, least recently engaged first.

## 4. Referral credit

Whoever logs a lead is its referrer unless they name another colleague; an outside referrer goes in Referred by. When a referred lead qualifies or converts, L6 asks the owner to thank the referrer; when its opportunity is signed, L6 stamps Referral credited and leaves a note on the referrer. The Pipeline pack tab lists every credit.

## 5. What is in the pack

| Kind | Items |
| --- | --- |
| Views | Leads > Lead inbox, Qualified not converted; Opportunities > Pipeline, Hygiene: missing key fields; Companies > By tier |
| Dashboard | BD > **Pipeline pack**: open leads by status, leads past their contact time, open opportunities by stage, exit criteria missing, accounts by tier, referral credits |
| Guidance | The Pipeline pack tab's five lines (`app/src/i18n/guidance.json`, key `packPipeline`) and the lead and opportunity record pages |
| Automations it switches | L2 contact time, L3 auto-close, L6 referral thanks and credit (with the lead sweep's credit repair), C1 stage exit check |

**Never switched by the pack:** the operating rules of `kuec/CLAUDE.md` section 7 (owner, next action and date on every open opportunity; work package acceptance, overdue and blocked escalations), lead triage (L1), qualification (L4) and conversion (L5).

## 6. Turning it off

Set `CRM_PACK_ENABLED` to off. From the next run the switched automations return "CRM pack is off" and do nothing; views, the tab and the guidance stay, because removing them from the manifest would drop data (`kuec/CLAUDE.md` section 2). Turning it on again resumes from record state: the lead clocks are timestamps, so nothing is lost.
