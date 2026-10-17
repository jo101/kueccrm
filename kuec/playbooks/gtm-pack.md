# GTM pack: go-to-market campaigns

**Pack version:** the version of `kuec-bd-ops` installed, first shipped in 0.11.0. The pack lives in the app and changes only with an app release.
**Switch:** application variable `GTM_PACK_ENABLED` (Settings > Apps > KUEC BD Ops > Variables), on by default.
**Dashboard tab:** BD > **Campaign pack**.
**Owner of the practice:** the ED. **Runs it day to day:** each campaign's owner.

This pack is how KUEC takes one offering to one market: a campaign with a clear target, a target list built from the industrial registry, a channel plan, and every lead it brings in attributed to it, so the team can see what each campaign produced.

## 1. Set up a campaign

Create a **Project** with:

| Field | Put |
| --- | --- |
| Type | Go-to-market campaign |
| Owner | The person who runs it |
| Status | Active when it starts |
| Target sector | The one sector it goes after |
| Target size class | The company size, or empty for every size in the sector |
| Offering promoted | What KUEC offers them |
| Channel plan | Every channel it will use (email sequence, LinkedIn, event, workshop, website, direct visit, partner referral) |
| End date | When it stops |

Write the message, the plan per channel and the dates in a note on the project; documents stay on SharePoint (`kuec/CLAUDE.md` section 4).

## 2. The target list

As soon as the campaign is active with a target sector, G1 (`g01-campaign-targets`) builds its target list: one **Campaign target** per company whose Sector and Size class match, at most 500, sorted by name. Sector and size class come from the industrial registry import (`runbooks/16-integration-map.md` section 5), so the list is the registry's view of the market. If more than 500 match, the owner is told how many were left out: narrow the size class. The list never shrinks by itself, and a status a person set is never undone.

| Status | Set by | Means |
| --- | --- | --- |
| To contact | The app, when it adds the company | Not reached yet |
| Contacted | The campaign owner | Reached through a channel, no answer yet |
| Responded | The campaign owner | Answered or met, no lead yet |
| Lead created | The app | A lead from this company is attributed to the campaign |
| Not interested | The campaign owner | Said no to this campaign |
| Do not contact | The campaign owner | Must not be contacted, for example at the account owner's request |

Before contacting a company that has an account owner, tell the account owner.

## 3. Leads attributed to the campaign

Every lead the campaign brings in carries it in **Campaign**: forms send the campaign's id (`runbooks/19-leads.md` section 6), and a lead logged by hand gets it from whoever logs it. Each day `packs-sweep` marks the matching target Lead created, and adds the company to the list if it was not on it. Leads then follow the CRM pack.

## 4. The campaign dashboard

BD > **Campaign pack** shows targets per campaign by status, leads per campaign by status, and every active campaign with its target and channel plan.

**Cost per qualified lead** is left blank on purpose: Twenty holds no campaign cost. It is added when finance provides the cost of each campaign, as a field on the campaign project and a change to this pack.

## 5. What is in the pack

| Kind | Items |
| --- | --- |
| Views | Campaign targets > To work, Everything (expert); Leads > By campaign |
| Dashboard | BD > **Campaign pack** |
| Guidance | The Campaign pack tab's five lines (`app/src/i18n/guidance.json`, key `packCampaigns`) and the Campaign target record page |
| Taxonomy | Campaign channel, in `kuec/playbooks/lookups.json` like every list |
| Automations it switches | G1 target list, and the campaign part of `packs-sweep` |

## 6. Turning it off

Set `GTM_PACK_ENABLED` to off. G1 and the sweep's campaign sync stand down; target lists, statuses, views, the tab and the guidance stay. Turning it on again brings every active campaign's list up to date at the next daily sweep.
