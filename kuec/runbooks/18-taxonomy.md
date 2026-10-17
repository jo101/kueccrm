# 18: Taxonomy

Written against Twenty 2.48.0 and `kuec-bd-ops` 0.9.0. Owners: the ops coordinator (proposes changes, section 6), the ED (approves them), the engineering lead (ships them, section 7). Readers: everyone who picks a value, engineers, the uVENTURE team.

KUEC uses one set of picklists across the company: how an engagement happened, where an opportunity came from, what is being sold, who pays, which department leads, what a document or contract is. The single source is `kuec/playbooks/lookups.json`. The `kuec-bd-ops` manifest mirrors it option for option, and uVENTURE reads the same file, so both systems share one taxonomy. Section 8 lists every option with what it means and when to pick it, in English and Arabic.

## 1. Where each list lives

| List (`lookups.json` key) | In Twenty | Type | In this release |
| --- | --- | --- | --- |
| Engagement type (`ENGAGEMENT_TYPE`) | Engagement > **Kind** (`kind`) | Select | Options replaced; Meeting and Event deprecated |
| Engagement outcome type (`ENGAGEMENT_OUTCOME_TYPE`) | Engagement > **Outcome type** (`outcomeType`) | Select | New field |
| Source (`SOURCE`), for leads and opportunities | Lead > **Source** (`source`), Opportunity > **Source** (`source`) | Select | Options replaced; Referral, Outreach and Event or workshop deprecated. On Lead since 0.9.0, the same options |
| Opportunity type (`OPPORTUNITY_TYPE`) | Opportunity > **Type** (`playbookType`) | Select | Options added |
| Offering (`OFFERING`) | Lead > **Offering interest** (`offeringInterest`), Opportunity > **Offering** (`offering`) | Multi-select | New field; on Lead since 0.9.0 |
| Funding path (`FUNDING_PATH`) | Opportunity > **Funding path** (`fundingPath`) | Select | New field |
| Contract type (`CONTRACT_TYPE`) | Contract > **Kind** (`kind`) | Select | Options added; Option and Service deprecated |
| Project type (`PROJECT_TYPE`) | Project > **Type** (`playbookType`) | Select | Options added |
| Task type (`TASK_TYPE`) | Task > **Type** (`taskType`) | Select | New field on the standard Task |
| Company sector (`COMPANY_SECTOR`) | Company > **Sector** (`sector`) | Select | Unchanged: waiting for the UAE industrial cluster list |
| Company relationship type (`COMPANY_RELATIONSHIP_TYPE`) | Company > **Relationship type** (`relationshipType`) | Select | New field |
| Department (`DEPARTMENT`) | Lead, Opportunity, Engagement, Project, Contract, Work package, Milestone > **Department** (`department`) | Select | New field on each; Lead and Opportunity since 0.9.0 |
| Document type, status, confidentiality (`DOCUMENT_*`) | Document > **Type** (`kind`), **Status** (`status`), **Confidentiality** (`confidentiality`) | Select | Since 0.9.0, on the link-only Document object |
| Capability type (`CAPABILITY_TYPE`) | none | | uVENTURE only |

`type` is a reserved field name in Twenty, so the API names are `kind`, `playbookType` and `taskType`; the labels people see say Kind or Type. Every object above with a Twenty list also has **Other details** (`otherDetails`, text), new in 0.8.0: Opportunity, Company, Task, Engagement, Contract, Project, Work package, Milestone.

What is deliberately not in Twenty:

- **Lead status and Dead reason** (0.9.0) are Twenty's own workflow lists, like Lost reason category on an opportunity: uVENTURE has no leads, so they are not in `lookups.json`. Dead reason ends with Other, which needs Other details like every list here. Their meaning: `19-leads.md` sections 1 and 4. When an engagement's outcome is **Lead created**, create a Lead (until 0.9.0 this meant an opportunity at Qualify); **Opportunity identified** means the need is already defined and an opportunity is opened directly.
- **The document file.** Since 0.9.0 a Document record carries the type, status, confidentiality, version, expiry and the SharePoint or uVENTURE link, never the file (`kuec/CLAUDE.md` rule 4). Every confidentiality class is link-only, and the label does not restrict who sees the record. A **PO or invoice** is linked for reference only, since finance is the system of record. Document takes its department from the records it is linked to.
- **Capability.** Capabilities, technologies and equipment live in uVENTURE (rule 5). Twenty has no Capability object and will not get one.
- **Department on configuration records.** Public holiday and Playbook role assignment are configuration, not business records, and carry no department.

## 2. The rules

1. **Every list ends with Other, and Other requires a note.** In Twenty the note is the record's **Other details**. Twenty 2.48 cannot make a field required only when another field has a value, so the Data quality page checks it instead (section 4). uVENTURE enforces it on its side from `requiresNote`.
2. **Never delete an option; deprecate it by relabelling.** A deprecated option keeps its value and its Twenty option id, gets the suffix ` (deprecated)` on its label, `"status": "deprecated"` with `deprecatedOn` and `replacedBy` in `lookups.json`, and a dated comment in its field file. It stays on existing records. It is hidden in the grouped views and left out of the import (`scripts/import/target-values.ts`), so nothing new lands in it. Deleting an option from the manifest would wipe the value from every record that has it (`kuec/CLAUDE.md` rule 2).
3. **Values never change; labels and descriptions may.** Both systems match on `value`. A relabel that changes the meaning is a deprecation plus a new option, not a relabel.
4. **Other is always last.** A new option goes just before Other; deprecated options sit just before Other too, after the live ones.
5. **Only the quarterly review adds, relabels or deprecates an option** (section 6). Nobody edits these options in Settings > Data model, in Twenty or in uVENTURE.

## 3. What people see

- The record page shows each list as a dropdown in the order of section 8. Field labels and field descriptions follow the member's language.
- **Arabic.** `kuec/app/locales/ar-SA.json` translates the label and description of every taxonomy field, Other details, the new views and the Data quality titles. Twenty 2.48 has no description on a select option and its app catalog does not translate option labels, so option labels show in English in the Arabic interface. The Arabic labels and the descriptions of every option are in section 8 and in `lookups.json`. The rest of `ar-SA.json` (the other views, the dashboards, the work package card) is still untranslated and falls back to English.
- **Grouped views.** Opportunities > **By source** and **By type** have a group per live option; deprecated groups are hidden.
- **Playbooks.** Only Licence and Technical service (research as a service) start an opportunity playbook, and only Workshop, Proposal and Delivery start a project template. Every other type is recorded and reported on but starts nothing (W1 and W9 skip it).
- **Who can set what.** BD officers set the lists on opportunities, companies, engagements and tasks. On work packages, Department and Other details are locked for BD officers like the other planning fields (`13-roles.md`), and contracts are read-only for them, so the ops coordinator or the ED sets those.

## 4. Checking Other details: the Data quality page

Each object has a view **Hygiene: Other without details** (position 19, before Everything (expert)): records with Other picked in any list and Other details empty. The ten (eight until 0.9.0) are the last rows of the **Data quality** page and of the Monday run (`14-hygiene.md` section 4, step 1.9):

| Object | Lists checked | Who fixes it |
| --- | --- | --- |
| Opportunities (open and Signed) | Source, Type, Offering, Funding path, Department (0.9.0) | The owner |
| Companies | Sector, Relationship type | The account owner |
| Engagements | Kind, Outcome type, Department | The owner |
| Contracts | Kind, Department | The ops coordinator, after asking the owner |
| Projects | Type, Department | The owner |
| Work packages | Department | The ops coordinator |
| Milestones | Department | The owner |
| Tasks | Type | The assignee |
| Leads (0.9.0) | Source, Offering interest, Department, Dead reason | The owner |
| Documents (0.9.0) | Type, Status, Confidentiality | The owner |

Fixing a row means writing what Other stands for in Other details, or picking the option that fits after all and leaving Other details empty. Lost and Parked opportunities are left out, like every opportunity view except the ones that list them.

## 5. One-time reclassification after 0.8.0

The ops coordinator, in the first two weeks after the release. Records keep the deprecated value until someone moves them; nothing moves them automatically, because the right replacement depends on the record.

| List | Deprecated option (value) | Pick instead |
| --- | --- | --- |
| Engagement type | Meeting (`MEETING`) | The meeting type that matches the purpose |
| Engagement type | Event (`EVENT`) | Workshop, Exhibition or conference, Gala or event, or Webinar |
| Source | Referral (`REFERRAL`) | The Referral option that names who referred them |
| Source | Outreach (`OUTREACH`) | Registry outreach, Outbound sequence or LinkedIn |
| Source | Event or workshop (`EVENT`) | Workshop, Exhibition or Gala QR |
| Contract type | Option (`OPTION`) | Licence |
| Contract type | Service (`SERVICE`) | TSA, Consulting or MSA |

Relabelled without a change of meaning (records need nothing): Email to **Email thread**, Inbound enquiry to **Inbound (web, email, phone)**, Faculty or researcher to **Referral: faculty**, Partner to **Referral: partner**, RFQ / technical service to **Technical service (research as a service)**.

Steps, per row of the table:

1. Open the object's **Everything (expert)** view and add the filter *<field> is <deprecated option>*. Do not save the view.
2. For each record, pick the replacement. When the record does not say which, ask the owner, one task per owner as in the Monday run.
3. Done when the filter returns nothing. Then the option is only history: it stays in the manifest, unused.

## 6. Quarterly review: who may add an option

The only way an option is added, relabelled or deprecated. **The ops coordinator proposes, the ED approves, an engineer ships.** Nobody else changes the taxonomy, in either system.

When: the first two weeks of January, April, July and October. Between reviews people use Other with Other details; that text is the evidence for the next review. A change that cannot wait for the quarter goes through the same three steps, only sooner, and only if the ED says it cannot wait.

1. **Collect (ops coordinator).** For each list: every Other details text of the quarter (the expert view filtered on Other), requests from staff, and options nobody picked for two quarters (the grouped views, or a filter per option).
2. **Propose (ops coordinator).** One row per change: list, add or relabel or deprecate, English and Arabic label, English and Arabic description of one sentence (what it means, when to pick it rather than its neighbours), the evidence (how many records, which requests) and, for a deprecation, the options that replace it. Add an option when the same Other details text keeps recurring or a new programme or product line starts; never add one that overlaps an existing option.
3. **Approve (ED).** Approve or reject each row in writing (email or Teams), within 5 business days. The written approval is attached to the change.
4. **Ship (engineer).** Section 7, in the next app release.
5. **Tidy up (ops coordinator).** Move records whose Other details now match a new option to it and clear their Other details. Reclassify the records of any option deprecated in this review, as in section 5.
6. **Tell uVENTURE (engineer).** Send the new `version` and the list of changes to the uVENTURE team.

## 7. Shipping a change (engineer)

1. **`kuec/playbooks/lookups.json`.** Add the option just before `OTHER`, with `"status": "active"`, `"requiresNote": false`, both labels and both descriptions. A new value is SCREAMING_SNAKE_CASE and is never reused. To deprecate: append ` (deprecated)` to `label.en` and `(متوقف)` to `label.ar`, set `"status": "deprecated"`, `deprecatedOn` and `replacedBy`. Set `version` to the release date.
2. **The field file** named in section 1. New option: an `id` from `uuidgen`, the value, `label` equal to `label.en`, positions renumbered so Other stays last, and the value added to the field's `as const` object. Department lives in five object files, each with its own option ids: change all five. A deprecation relabels the option in place, never touches its `id` or value, and gets a dated comment with the reason.
3. **Grouped views.** Opportunities > By source and By type: a group for a new option, `isVisible: false` for a deprecated one.
4. **Import.** `kuec/app/scripts/import/target-values.ts`: add a new value, remove a deprecated one, keep the synonyms pointing at live values.
5. **Render and test.** From the repository root `node kuec/playbooks/render-taxonomy.ts`; in `kuec/app` run `yarn playbooks:sync` and `yarn test:unit`. `src/playbooks/lookups.test.ts` fails when the manifest and `lookups.json` disagree on a value, label or order, when a list does not end with Other, or when a description is missing in either language.
6. **Translations.** If a field label or description changed, run `yarn twenty dev:translations-extract` in `kuec/app` and fill the Arabic in `locales/ar-SA.json`.
7. **Plan, then apply.** `twenty plan` shows option additions and label updates only. Any line that removes or recreates a field or an option blocks the deploy (`kuec/CLAUDE.md` rule 2).

A new list, or a new type that should start a playbook or a project template, is a change to the data model or to `templates.json`, not a taxonomy change: it goes through its own task.

## 8. Every list and option

<!-- Generated from kuec/playbooks/lookups.json by kuec/playbooks/render-taxonomy.ts. Edit the JSON and re-run the script; do not edit below this line. -->

lookups.json version 2026-10-17: 16 lists, 189 options, 7 of them deprecated.

### 8.1 Engagement type (نوع التواصل)

List key `ENGAGEMENT_TYPE`. Applies to `Engagement.type`. In Twenty: `engagement.kind` (select).

| Value | Label | التسمية | What it means, when to pick it | المعنى ومتى تختاره |
| --- | --- | --- | --- | --- |
| `INTRO_MEETING` | Intro meeting | اجتماع تعارف | A first meeting to introduce KUEC and learn who they are; pick it when there is no defined need yet. | اجتماع أول للتعريف بـ KUEC والتعرف على الجهة؛ اختره عندما لا توجد حاجة محددة بعد. |
| `DISCOVERY_MEETING` | Discovery meeting | اجتماع استكشافي | A meeting to explore one problem or need in depth; pick it once a need is on the table. | اجتماع لاستكشاف مشكلة أو حاجة محددة بعمق؛ اختره عندما تكون هناك حاجة مطروحة. |
| `SITE_VISIT` | Site visit (we go to them) | زيارة ميدانية (نذهب إليهم) | KUEC staff visit the counterpart's site, plant or office; pick it whenever we travel to them. | يزور فريق KUEC موقع الجهة أو مصنعها أو مكتبها؛ اختره كلما ذهبنا إليهم. |
| `LAB_OR_CAMPUS_VISIT` | Lab or campus visit (they come to us) | زيارة مختبر أو الحرم الجامعي (يأتون إلينا) | The counterpart visits a KU lab or campus; pick it whenever they come to us. | تزور الجهة مختبراً أو حرماً جامعياً لجامعة خليفة؛ اختره كلما جاؤوا إلينا. |
| `WORKSHOP` | Workshop | ورشة عمل | A working session on a topic with an agenda and outputs, run by KUEC or jointly; pick it when the counterpart attends or co-runs a workshop. | جلسة عمل حول موضوع محدد لها جدول أعمال ومخرجات، تديرها KUEC أو تُعقد بالشراكة؛ اختره عندما تحضر الجهة ورشة أو تشارك في إدارتها. |
| `EXHIBITION_OR_CONFERENCE` | Exhibition or conference | معرض أو مؤتمر | Contact made at a trade show, exhibition or conference, at a stand or in a session; pick it for people met at such events. | تواصل تم في معرض تجاري أو مؤتمر، في جناح أو جلسة؛ اختره للأشخاص الذين التقيتهم في هذه الفعاليات. |
| `GALA_OR_EVENT` | Gala or event | حفل أو فعالية | Contact made at a gala, reception or networking event; pick it when the setting was social rather than technical. | تواصل تم في حفل أو استقبال أو فعالية للتعارف؛ اختره عندما يكون الإطار اجتماعياً لا تقنياً. |
| `CHALLENGE_SPRINT_SESSION` | Challenge sprint session | جلسة Challenge Sprint | A session of a Challenge Sprint, where an industry challenge is worked on with KU teams; pick it for any sprint session. | جلسة ضمن برنامج Challenge Sprint يُعمل فيها على تحدٍّ صناعي مع فرق جامعة خليفة؛ اختره لأي جلسة من جلسات البرنامج. |
| `FELLOWSHIP_OR_BOOTCAMP_SESSION` | Fellowship or bootcamp session | جلسة زمالة أو معسكر تدريبي | A session of a fellowship, such as Technology Fellows, or of a bootcamp; pick it for any cohort session the counterpart joins. | جلسة ضمن برنامج زمالة مثل Technology Fellows أو ضمن معسكر تدريبي؛ اختره لأي جلسة لدفعة يشارك فيها الطرف الآخر. |
| `TECHNICAL_ASSESSMENT_SESSION` | Technical assessment session | جلسة تقييم تقني | A session where KU experts assess a technology, problem or requirement; pick it when the purpose is technical evaluation. | جلسة يقيّم فيها خبراء جامعة خليفة تقنية أو مشكلة أو متطلباً؛ اختره عندما يكون الهدف تقييماً تقنياً. |
| `PROPOSAL_PRESENTATION` | Proposal presentation | عرض مقترح | KUEC walks the counterpart through a proposal, quote or offer; pick it when a written offer is presented. | تعرض KUEC على الجهة مقترحاً أو عرض سعر أو عرضاً مكتوباً؛ اختره عند تقديم عرض مكتوب. |
| `NEGOTIATION_SESSION` | Negotiation session | جلسة تفاوض | A session to agree price, scope or terms; pick it once the discussion is about terms rather than fit. | جلسة للاتفاق على السعر أو النطاق أو الشروط؛ اختره عندما يدور النقاش حول الشروط لا حول الملاءمة. |
| `COMMITTEE_OR_STEERING_MEETING` | Committee or steering meeting | اجتماع لجنة أو لجنة توجيهية | A formal governance meeting, such as a steering or technical committee; pick it when decisions are minuted. | اجتماع حوكمة رسمي مثل لجنة توجيهية أو لجنة فنية؛ اختره عندما تُدوَّن القرارات في محضر. |
| `PILOT_REVIEW` | Pilot review | مراجعة مشروع تجريبي | A checkpoint on a running industry pilot; pick it to review pilot progress or results with the counterpart. | نقطة مراجعة لمشروع تجريبي صناعي قائم؛ اختره لمراجعة تقدّم المشروع التجريبي أو نتائجه مع الجهة. |
| `CALL` | Call | مكالمة | A phone or video call with no set agenda; pick a meeting type instead when the call had one of the purposes above. | مكالمة هاتفية أو مرئية بلا جدول أعمال محدد؛ اختر نوع اجتماع بدلاً منه إذا كان للمكالمة أحد الأغراض أعلاه. |
| `EMAIL` | Email thread | سلسلة رسائل بريد إلكتروني | An email exchange worth logging, logged once per thread; pick it when no meeting or call took place. | تبادل رسائل بالبريد الإلكتروني يستحق التسجيل، يُسجَّل مرة واحدة لكل سلسلة؛ اختره عندما لم يُعقد اجتماع أو مكالمة. |
| `WEBINAR` | Webinar | ندوة عبر الإنترنت | An online seminar KUEC runs or attends with the counterpart taking part; pick it for one-to-many online sessions. | ندوة عبر الإنترنت تديرها KUEC أو تحضرها بمشاركة الجهة؛ اختره للجلسات الإلكترونية الموجّهة إلى جمهور. |
| `MEETING` | Meeting (deprecated) | اجتماع (متوقف) | Deprecated on 17 October 2026 and kept for existing records; pick the meeting type that matches the purpose instead. Replaced by `INTRO_MEETING`, `DISCOVERY_MEETING`, `SITE_VISIT`, `LAB_OR_CAMPUS_VISIT`, `TECHNICAL_ASSESSMENT_SESSION`, `PROPOSAL_PRESENTATION`, `NEGOTIATION_SESSION`, `COMMITTEE_OR_STEERING_MEETING`, `PILOT_REVIEW`. | أُوقف في 17 أكتوبر 2026 ويبقى للسجلات القائمة؛ اختر بدلاً منه نوع الاجتماع المطابق للغرض. |
| `EVENT` | Event (deprecated) | فعالية (متوقف) | Deprecated on 17 October 2026 and kept for existing records; pick Workshop, Exhibition or conference, Gala or event, or Webinar instead. Replaced by `WORKSHOP`, `EXHIBITION_OR_CONFERENCE`, `GALA_OR_EVENT`, `WEBINAR`. | أُوقف في 17 أكتوبر 2026 ويبقى للسجلات القائمة؛ اختر بدلاً منه ورشة عمل أو معرض أو مؤتمر أو حفل أو فعالية أو ندوة عبر الإنترنت. |
| `OTHER` | Other | أخرى | Nothing above fits; say what it is in the required note (Other details in Twenty). | لا ينطبق أي خيار أعلاه؛ اذكر ما هو في الملاحظة الإلزامية (حقل «تفاصيل أخرى» في Twenty). |

### 8.2 Engagement outcome type (نوع نتيجة التواصل)

List key `ENGAGEMENT_OUTCOME_TYPE`. Applies to `Engagement.outcomeType`. In Twenty: `engagement.outcomeType` (select).

| Value | Label | التسمية | What it means, when to pick it | المعنى ومتى تختاره |
| --- | --- | --- | --- | --- |
| `OPPORTUNITY_IDENTIFIED` | Opportunity identified | تم تحديد فرصة | A concrete commercial opportunity came out of it; pick it when you create or update an opportunity. | نتجت عنه فرصة تجارية ملموسة؛ اختره عندما تنشئ فرصة أو تحدّث فرصة قائمة. |
| `LEAD_CREATED` | Lead created | تم إنشاء عميل محتمل | An interested person or company to qualify later, not yet a defined opportunity; pick it when the need is still vague. | شخص أو جهة مهتمة تحتاج إلى تأهيل لاحقاً وليست فرصة محددة بعد؛ اختره عندما تكون الحاجة غير واضحة. |
| `INFORMATION_ONLY` | Information only | معلومات فقط | Useful information was exchanged and nothing has to happen next; pick it when nobody owes a next step. | تم تبادل معلومات مفيدة ولا يلزم أي إجراء بعدها؛ اختره عندما لا تترتب على أحد خطوة تالية. |
| `FOLLOW_UP_AGREED` | Follow-up agreed | تم الاتفاق على متابعة | Both sides agreed a next step with a date; pick it and write the step in Next step. | اتفق الطرفان على خطوة تالية بموعد محدد؛ اختره واكتب الخطوة في حقل «الخطوة التالية». |
| `NO_FIT` | No fit | لا توافق | Their need does not match anything KUEC offers; pick it to close the thread, with the reason in Outcome. | لا تتوافق حاجتهم مع أي مما تقدمه KUEC؛ اختره لإغلاق الموضوع واذكر السبب في حقل «النتيجة». |
| `REFERRAL_RECEIVED` | Referral received | تم تلقي إحالة | They pointed us to another person or organisation; pick it and log the person or company they referred us to. | أحالونا إلى شخص أو جهة أخرى؛ اختره وسجّل الشخص أو الجهة المُحال إليها. |
| `OTHER` | Other | أخرى | Nothing above fits; say what it is in the required note (Other details in Twenty). | لا ينطبق أي خيار أعلاه؛ اذكر ما هو في الملاحظة الإلزامية (حقل «تفاصيل أخرى» في Twenty). |

### 8.3 Source (المصدر)

List key `SOURCE`. Applies to `Lead.source`, `Opportunity.source`. In Twenty: `lead.source` (select), `opportunity.source` (select).

Lead.source and Opportunity.source hold the same options; a conversion copies the value.

| Value | Label | التسمية | What it means, when to pick it | المعنى ومتى تختاره |
| --- | --- | --- | --- | --- |
| `INBOUND` | Inbound (web, email, phone) | وارد (الموقع، البريد، الهاتف) | They contacted KUEC first through the website, email or phone; pick it when no programme, event or person sent them. | تواصلوا مع KUEC أولاً عبر الموقع أو البريد الإلكتروني أو الهاتف؛ اختره عندما لم يوجّههم برنامج أو فعالية أو شخص. |
| `WORKSHOP` | Workshop | ورشة عمل | It came from a KUEC workshop the contact attended; pick it for needs raised during or after a workshop. | جاءت من ورشة عمل لـ KUEC حضرها الشخص؛ اختره للاحتياجات التي طُرحت خلال الورشة أو بعدها. |
| `EXHIBITION` | Exhibition | معرض | It came from a contact made at an exhibition or conference; pick it for conversations at a stand. | جاءت من تواصل تم في معرض أو مؤتمر؛ اختره للمحادثات التي جرت في الجناح. |
| `GALA_QR` | Gala QR | رمز QR في الحفل | They scanned the KUEC QR code at a gala or event; pick it for sign-ups captured by the QR form. | مسحوا رمز QR الخاص بـ KUEC في حفل أو فعالية؛ اختره للتسجيلات التي جُمعت عبر نموذج الرمز. |
| `CHALLENGE_SPRINT` | Challenge Sprint | Challenge Sprint | It came out of a Challenge Sprint; pick it when the need was surfaced or worked on in a sprint. | نتجت عن برنامج Challenge Sprint؛ اختره عندما ظهرت الحاجة أو عولجت خلال البرنامج. |
| `TRL_BRIDGING_PROGRAM` | TRL Bridging Program | برنامج TRL Bridging | It came from the TRL Bridging Program for technology readiness; pick it for opportunities that programme produced. | جاءت من برنامج TRL Bridging لرفع مستوى الجاهزية التقنية؛ اختره للفرص التي أنتجها البرنامج. |
| `TECHNOLOGY_FELLOWS` | Technology Fellows | Technology Fellows | It came through the Technology Fellows programme or one of its fellows; pick it when a fellow brought it in. | جاءت عبر برنامج Technology Fellows أو أحد زملائه؛ اختره عندما جلبها أحد الزملاء. |
| `TECHNICAL_COMMITTEE` | Technical committee | اللجنة الفنية | It was raised in a technical committee KUEC sits on; pick it for needs tabled in committee. | طُرحت في لجنة فنية تشارك فيها KUEC؛ اختره للاحتياجات التي عُرضت في اللجنة. |
| `FACULTY` | Referral: faculty | إحالة: عضو هيئة تدريس | A KU faculty member or researcher referred them; pick it when the introduction came from academic staff. | أحالهم عضو هيئة تدريس أو باحث في جامعة خليفة؛ اختره عندما جاء التعريف من الكادر الأكاديمي. |
| `REFERRAL_KU_LEADERSHIP` | Referral: KU leadership | إحالة: قيادة جامعة خليفة | KU senior leadership referred them; pick it for introductions from the university's top management. | أحالتهم القيادة العليا في جامعة خليفة؛ اختره للتعريفات الواردة من الإدارة العليا للجامعة. |
| `REFERRAL_CEO_OR_BOARD` | Referral: CEO or board | إحالة: الرئيس التنفيذي أو مجلس الإدارة | The KUEC CEO or a board member referred them; pick it for introductions from KUEC's own top level. | أحالهم الرئيس التنفيذي لـ KUEC أو أحد أعضاء مجلس الإدارة؛ اختره للتعريفات الواردة من أعلى مستوى في KUEC. |
| `PARTNER` | Referral: partner | إحالة: شريك | An existing partner organisation referred them; pick it when a partner made the introduction. | أحالتهم جهة شريكة قائمة؛ اختره عندما قام شريك بالتعريف. |
| `REFERRAL_COLLEAGUE` | Referral: colleague | إحالة: زميل | A KUEC or KU colleague outside the faculty and leadership referred them; pick it for introductions from staff. | أحالهم زميل في KUEC أو جامعة خليفة من خارج الكادر الأكاديمي والقيادة؛ اختره للتعريفات الواردة من الموظفين. |
| `GOVERNMENT_REQUEST` | Government request | طلب حكومي | A government entity asked KUEC for support directly; pick it when the request came from a ministry, authority or department. | طلبت جهة حكومية دعم KUEC مباشرة؛ اختره عندما جاء الطلب من وزارة أو هيئة أو دائرة. |
| `REGISTRY_OUTREACH` | Registry outreach | تواصل من سجل الشركات | KUEC contacted them from its company registry; pick it for one-to-one outreach to registry companies. | تواصلت KUEC معهم انطلاقاً من سجل الشركات لديها؛ اختره للتواصل الفردي مع شركات السجل. |
| `OUTBOUND_SEQUENCE` | Outbound sequence | حملة تواصل صادرة | They replied to a multi-step outbound email campaign; pick it for responses to a sequence. | ردّوا على حملة بريد إلكتروني صادرة متعددة المراحل؛ اختره للردود على الحملة. |
| `LINKEDIN` | LinkedIn | لينكدإن | The first contact was on LinkedIn, by message or post; pick it whichever side reached out. | كان التواصل الأول عبر لينكدإن برسالة أو منشور؛ اختره أياً كان الطرف الذي بادر. |
| `TENDER` | Tender or RFQ portal | منصة المناقصات أو طلبات عروض الأسعار | It came from a tender, RFQ or RFP published on a procurement portal; pick it for formal bids. | جاءت من مناقصة أو طلب عرض سعر أو طلب مقترح منشور على منصة مشتريات؛ اختره للعطاءات الرسمية. |
| `EXISTING_CUSTOMER` | Existing customer | عميل حالي | A current or past customer came back with new work; pick it for repeat business. | عاد عميل حالي أو سابق بعمل جديد؛ اختره للأعمال المتكررة. |
| `OFFSET_MANAGER` | Offset manager | مدير برنامج الأوفست | An offset programme manager or obligor brought it to meet offset or ICV commitments; pick it for offset-driven work. | جلبها مدير برنامج أوفست أو جهة ملتزمة بالأوفست للوفاء بالتزامات الأوفست أو القيمة المحلية المضافة؛ اختره للأعمال المدفوعة بالأوفست. |
| `STARTUP_PORTFOLIO` | Startup portfolio | محفظة الشركات الناشئة | It came from a startup in the KUEC portfolio; pick it when a portfolio company brought it in. | جاءت من شركة ناشئة في محفظة KUEC؛ اختره عندما جلبتها شركة من المحفظة. |
| `REFERRAL` | Referral (deprecated) | إحالة (متوقف) | Deprecated on 17 October 2026 and kept for existing records; pick the Referral option that names who referred them instead. Replaced by `FACULTY`, `REFERRAL_KU_LEADERSHIP`, `REFERRAL_CEO_OR_BOARD`, `PARTNER`, `REFERRAL_COLLEAGUE`. | أُوقف في 17 أكتوبر 2026 ويبقى للسجلات القائمة؛ اختر بدلاً منه خيار الإحالة الذي يحدد من قام بالإحالة. |
| `OUTREACH` | Outreach (deprecated) | تواصل صادر (متوقف) | Deprecated on 17 October 2026 and kept for existing records; pick Registry outreach, Outbound sequence or LinkedIn instead. Replaced by `REGISTRY_OUTREACH`, `OUTBOUND_SEQUENCE`, `LINKEDIN`. | أُوقف في 17 أكتوبر 2026 ويبقى للسجلات القائمة؛ اختر بدلاً منه التواصل من سجل الشركات أو حملة تواصل صادرة أو لينكدإن. |
| `EVENT` | Event or workshop (deprecated) | فعالية أو ورشة عمل (متوقف) | Deprecated on 17 October 2026 and kept for existing records; pick Workshop, Exhibition or Gala QR instead. Replaced by `WORKSHOP`, `EXHIBITION`, `GALA_QR`. | أُوقف في 17 أكتوبر 2026 ويبقى للسجلات القائمة؛ اختر بدلاً منه ورشة عمل أو معرض أو رمز QR في الحفل. |
| `OTHER` | Other | أخرى | Nothing above fits; say what it is in the required note (Other details in Twenty). | لا ينطبق أي خيار أعلاه؛ اذكر ما هو في الملاحظة الإلزامية (حقل «تفاصيل أخرى» في Twenty). |

### 8.4 Opportunity type (نوع الفرصة)

List key `OPPORTUNITY_TYPE`. Applies to `Opportunity.type`. In Twenty: `opportunity.playbookType` (select).

Licence and Technical service start a playbook (templates.json); every other type has none yet.

| Value | Label | التسمية | What it means, when to pick it | المعنى ومتى تختاره |
| --- | --- | --- | --- | --- |
| `TECHNOLOGY_LICENSING` | Licence | ترخيص | A licence or option to use KU intellectual property; pick it when the deal is the right to use a patent, software or know-how. | ترخيص أو خيار لاستخدام الملكية الفكرية لجامعة خليفة؛ اختره عندما تكون الصفقة حق استخدام براءة اختراع أو برمجية أو معرفة فنية. |
| `SPINOUT_OR_STARTUP` | Spinout or startup | شركة منبثقة أو ناشئة | Creating or supporting a company built on KU technology; pick it when the outcome is a new venture. | تأسيس شركة قائمة على تقنية من جامعة خليفة أو دعمها؛ اختره عندما تكون النتيجة مشروعاً جديداً. |
| `RFQ_TECHNICAL_SERVICE` | Technical service (research as a service) | خدمة تقنية (البحث كخدمة) | KU researchers do defined technical or research work for a fee; pick it for scoped paid work, including RFQ responses. | ينفّذ باحثو جامعة خليفة عملاً تقنياً أو بحثياً محدداً مقابل أجر؛ اختره للأعمال المدفوعة محددة النطاق، بما فيها الردود على طلبات عروض الأسعار. |
| `LAB_TESTING` | Lab testing | اختبارات مخبرية | Testing or analysis of samples in a KU lab to a set method; pick it when the deliverable is test results. | اختبار عينات أو تحليلها في مختبر بجامعة خليفة وفق طريقة محددة؛ اختره عندما يكون المُخرَج نتائج اختبار. |
| `EQUIPMENT_OR_FACILITY_ACCESS` | Equipment or facility access | الوصول إلى المعدات أو المرافق | The counterpart books time on KU equipment or facilities and uses them itself; pick it when they operate it, not us. | يحجز الطرف الآخر وقتاً على معدات أو مرافق جامعة خليفة ويستخدمها بنفسه؛ اختره عندما يشغّلها هو لا نحن. |
| `LEASING` | Leasing (space) | تأجير (مساحات) | Renting office, lab or industrial space to the counterpart; pick it for any space lease. | تأجير مساحات مكتبية أو مخبرية أو صناعية للطرف الآخر؛ اختره لأي عقد تأجير مساحة. |
| `RESEARCH_COLLABORATION` | Research collaboration or JDA | تعاون بحثي أو اتفاقية تطوير مشترك | Joint research or development where both sides contribute and share results; pick it for joint or co-funded development. | بحث أو تطوير مشترك يساهم فيه الطرفان ويتقاسمان نتائجه؛ اختره للتطوير المشترك أو الممول بالمشاركة. |
| `INDUSTRY_PILOT` | Industry pilot | مشروع تجريبي صناعي | Trialling a KU technology in the counterpart's real operations; pick it for a time-boxed pilot ahead of a larger deal. | تجربة تقنية من جامعة خليفة في العمليات الفعلية للطرف الآخر؛ اختره لمشروع تجريبي محدد المدة يسبق صفقة أكبر. |
| `CONSULTING_OR_ADVISORY` | Consulting or advisory | استشارات | Expert advice from KU faculty or KUEC without lab work; pick it when the deliverable is advice or a report. | مشورة خبراء من أعضاء هيئة التدريس في جامعة خليفة أو من KUEC دون عمل مخبري؛ اختره عندما يكون المُخرَج مشورة أو تقريراً. |
| `TRAINING_OR_BOOTCAMP` | Training or bootcamp | تدريب أو معسكر تدريبي | Paid training, a course or a bootcamp for the counterpart's staff; pick it when the deliverable is their people's skills. | تدريب أو دورة أو معسكر تدريبي مدفوع لموظفي الطرف الآخر؛ اختره عندما يكون المُخرَج تنمية مهارات موظفيهم. |
| `SPONSORED_CHAIR` | Sponsored chair | كرسي بحثي ممول | The counterpart funds a sponsored professorship or research chair at KU; pick it for chair agreements. | يموّل الطرف الآخر كرسياً بحثياً أو أستاذية برعاية في جامعة خليفة؛ اختره لاتفاقيات الكراسي البحثية. |
| `PROGRAMME_SPONSORSHIP` | Programme sponsorship (workshop, sprint, fellowship) | رعاية برنامج (ورشة، سبرنت، زمالة) | The counterpart sponsors a KUEC programme such as a workshop, Challenge Sprint or fellowship; pick it for money or in-kind support. | يرعى الطرف الآخر برنامجاً لـ KUEC مثل ورشة عمل أو Challenge Sprint أو زمالة؛ اختره للرعاية المالية أو العينية. |
| `GOVERNMENT_PROPOSAL_OR_GRANT` | Government proposal or grant | مقترح أو منحة حكومية | A proposal to, or a grant from, a government funder; pick it when a public body funds the work. | مقترح مقدَّم إلى جهة تمويل حكومية أو منحة منها؛ اختره عندما تموّل جهة حكومية العمل. |
| `OFFSET_OR_ICV_PROJECT` | Offset or ICV project | مشروع أوفست أو قيمة محلية مضافة | Work that earns the counterpart offset or in-country value credit; pick it when those obligations drive the deal. | عمل يكسب الطرف الآخر رصيد أوفست أو قيمة محلية مضافة؛ اختره عندما تكون هذه الالتزامات دافع الصفقة. |
| `PLATFORM_OR_PRODUCT_DELIVERY` | Platform or product delivery | تسليم منصة أو منتج | Delivering a finished platform, software or product built by KUEC or a subsidiary; pick it when a product, not a study, is delivered. | تسليم منصة أو برمجية أو منتج جاهز من تطوير KUEC أو إحدى شركاتها التابعة؛ اختره عندما يُسلَّم منتج لا دراسة. |
| `PARTNERSHIP_OR_MOU` | Partnership or MoU | شراكة أو مذكرة تفاهم | A framework partnership or MoU with no committed money yet; pick it when the aim is a relationship that leads to deals later. | شراكة إطارية أو مذكرة تفاهم دون التزام مالي بعد؛ اختره عندما يكون الهدف علاقة تثمر صفقات لاحقاً. |
| `INVESTMENT` | Investment (portfolio) | استثمار (المحفظة) | KUEC invests in, or raises investment for, a portfolio company; pick it for equity and funding rounds. | تستثمر KUEC في شركة من محفظتها أو تجمع لها استثماراً؛ اختره للحصص وجولات التمويل. |
| `OTHER` | Other | أخرى | Nothing above fits; say what it is in the required note (Other details in Twenty). | لا ينطبق أي خيار أعلاه؛ اذكر ما هو في الملاحظة الإلزامية (حقل «تفاصيل أخرى» في Twenty). |

### 8.5 Offering (ما تقدمه KUEC)

List key `OFFERING`. Applies to `Lead.offeringInterest`, `Opportunity.offering`. In Twenty: `lead.offeringInterest` (multi-select), `opportunity.offering` (multi-select).

Several can apply to one lead or opportunity, so Twenty holds it as a multi-select. A conversion copies the lead's interest into the opportunity's offering.

| Value | Label | التسمية | What it means, when to pick it | المعنى ومتى تختاره |
| --- | --- | --- | --- | --- |
| `IP_LICENCE` | IP licence | ترخيص ملكية فكرية | Rights to use KU patents, software or know-how; pick it when a licence is part of the deal. | حقوق استخدام براءات اختراع أو برمجيات أو معرفة فنية لجامعة خليفة؛ اختره عندما يكون الترخيص جزءاً من الصفقة. |
| `TECHNICAL_SERVICE` | Technical service | خدمة تقنية | Defined research or engineering work done by KU staff; pick it when KU people do part of the work. | عمل بحثي أو هندسي محدد ينفذه موظفو جامعة خليفة؛ اختره عندما ينفّذ موظفو الجامعة جزءاً من العمل. |
| `LAB_TESTING` | Lab testing | اختبارات مخبرية | Sample testing or analysis in a KU lab; pick it when test results are part of the deliverable. | اختبار العينات أو تحليلها في مختبر بجامعة خليفة؛ اختره عندما تكون نتائج الاختبار جزءاً من المُخرَج. |
| `EQUIPMENT_ACCESS` | Equipment access | الوصول إلى المعدات | Booked time on KU equipment or facilities; pick it when the counterpart uses our equipment. | وقت محجوز على معدات أو مرافق جامعة خليفة؛ اختره عندما يستخدم الطرف الآخر معداتنا. |
| `RESEARCH_COLLABORATION` | Research collaboration | تعاون بحثي | Joint research with shared input and results; pick it when both sides contribute to the research. | بحث مشترك بمدخلات ونتائج متقاسمة؛ اختره عندما يساهم الطرفان في البحث. |
| `STARTUP_PRODUCT` | Startup product | منتج شركة ناشئة | A product or service of a KUEC portfolio startup; pick it when a startup supplies part of the deal. | منتج أو خدمة لشركة ناشئة في محفظة KUEC؛ اختره عندما تورّد شركة ناشئة جزءاً من الصفقة. |
| `SUBSIDIARY_SERVICE` | Subsidiary service | خدمة شركة تابعة | A service delivered by a KUEC subsidiary; pick it when a subsidiary does part of the work. | خدمة تقدمها إحدى الشركات التابعة لـ KUEC؛ اختره عندما تنفّذ شركة تابعة جزءاً من العمل. |
| `SPONSORED_CHAIR` | Sponsored chair | كرسي بحثي ممول | A sponsored professorship or research chair; pick it when chair funding is part of the deal. | أستاذية أو كرسي بحثي برعاية؛ اختره عندما يكون تمويل الكرسي جزءاً من الصفقة. |
| `LEASING` | Leasing | تأجير | Office, lab or industrial space for rent; pick it when space is part of the deal. | مساحات مكتبية أو مخبرية أو صناعية للإيجار؛ اختره عندما تكون المساحة جزءاً من الصفقة. |
| `TRAINING` | Training | تدريب | Courses, bootcamps or training for the counterpart's staff; pick it when training is part of the deal. | دورات أو معسكرات أو تدريب لموظفي الطرف الآخر؛ اختره عندما يكون التدريب جزءاً من الصفقة. |
| `ADVISORY` | Advisory | استشارات | Expert advice without lab work; pick it when advice or a report is part of the deal. | مشورة خبراء دون عمل مخبري؛ اختره عندما تكون المشورة أو التقرير جزءاً من الصفقة. |
| `OTHER` | Other | أخرى | Nothing above fits; say what it is in the required note (Other details in Twenty). | لا ينطبق أي خيار أعلاه؛ اذكر ما هو في الملاحظة الإلزامية (حقل «تفاصيل أخرى» في Twenty). |

### 8.6 Funding path (مسار التمويل)

List key `FUNDING_PATH`. Applies to `Opportunity.fundingPath`. In Twenty: `opportunity.fundingPath` (select).

| Value | Label | التسمية | What it means, when to pick it | المعنى ومتى تختاره |
| --- | --- | --- | --- | --- |
| `CUSTOMER_BUDGET` | Customer budget | ميزانية العميل | The counterpart pays from its own budget; pick it for ordinary commercial deals. | يدفع الطرف الآخر من ميزانيته الخاصة؛ اختره للصفقات التجارية المعتادة. |
| `OFFSET_CREDIT` | Offset credit | رصيد الأوفست | An offset obligor pays to earn offset credit; pick it when the spend counts toward an offset programme. | تدفع جهة ملتزمة بالأوفست لكسب رصيد أوفست؛ اختره عندما يُحتسب الإنفاق ضمن برنامج أوفست. |
| `ICV` | ICV | القيمة المحلية المضافة | The spend raises the counterpart's in-country value score; pick it when ICV is why they fund the work. | يرفع الإنفاق درجة القيمة المحلية المضافة للطرف الآخر؛ اختره عندما تكون القيمة المحلية المضافة سبب تمويله للعمل. |
| `GOVERNMENT_GRANT` | Government grant | منحة حكومية | A government grant or funded programme pays; pick it when a public funder covers the cost. | تدفع منحة حكومية أو برنامج ممول حكومياً؛ اختره عندما تغطي جهة تمويل حكومية التكلفة. |
| `CO_FUNDING_PROGRAMME` | Co-funding programme | برنامج تمويل مشترك | The cost is split between the counterpart and a co-funding programme or KU; pick it when more than one party pays. | تُقسَّم التكلفة بين الطرف الآخر وبرنامج تمويل مشترك أو جامعة خليفة؛ اختره عندما يدفع أكثر من طرف. |
| `SPONSOR` | Sponsor | راعٍ | A third-party sponsor pays, not the beneficiary; pick it for sponsored programmes and chairs. | يدفع راعٍ من طرف ثالث لا المستفيد؛ اختره للبرامج والكراسي البحثية المرعية. |
| `UNKNOWN` | Unknown | غير معروف | Who pays is not known yet; pick it early on and replace it before the proposal goes out. | لم يُعرف بعد من سيدفع؛ اختره في البداية واستبدله قبل إرسال المقترح. |
| `OTHER` | Other | أخرى | Nothing above fits; say what it is in the required note (Other details in Twenty). | لا ينطبق أي خيار أعلاه؛ اذكر ما هو في الملاحظة الإلزامية (حقل «تفاصيل أخرى» في Twenty). |

### 8.7 Document type (نوع الوثيقة)

List key `DOCUMENT_TYPE`. Applies to `Document.type`. In Twenty: `document.kind` (select).

Twenty holds the link and these metadata only; the file stays on SharePoint or in uVENTURE and is never uploaded (kuec/CLAUDE.md rule 4).

| Value | Label | التسمية | What it means, when to pick it | المعنى ومتى تختاره |
| --- | --- | --- | --- | --- |
| `NDA` | NDA | اتفاقية عدم إفصاح | A non-disclosure agreement protecting confidential information; pick it for the agreement signed before a confidential exchange. | اتفاقية عدم إفصاح تحمي المعلومات السرية؛ اخترها للاتفاقية الموقعة قبل أي تبادل سري. |
| `MOU` | MoU | مذكرة تفاهم | A memorandum of understanding setting out intent, usually not binding; pick it for framework agreements. | مذكرة تفاهم تحدد النوايا ولا تكون ملزمة عادة؛ اخترها للاتفاقيات الإطارية. |
| `MSA` | MSA | اتفاقية خدمات رئيسية | A master services agreement holding the terms for later work orders; pick it for umbrella contracts. | اتفاقية خدمات رئيسية تتضمن شروط أوامر العمل اللاحقة؛ اخترها للعقود الإطارية الشاملة. |
| `PROPOSAL_OR_SOW` | Proposal or SOW | مقترح أو بيان عمل | KUEC's proposal or statement of work with scope, plan and price; pick it for what we send to win the work. | مقترح KUEC أو بيان العمل بالنطاق والخطة والسعر؛ اختره لما نرسله للفوز بالعمل. |
| `QUOTE` | Quote | عرض سعر | A priced quotation for a defined service or test; pick it when the document is mainly a price. | عرض سعر لخدمة أو اختبار محدد؛ اختره عندما تكون الوثيقة سعراً في الأساس. |
| `RFQ_OR_RFP_RECEIVED` | RFQ or RFP received | طلب عرض سعر أو مقترح وارد | A request for quotation or proposal sent to KUEC; pick it for the counterpart's request, not our reply. | طلب عرض سعر أو مقترح مُرسَل إلى KUEC؛ اختره لطلب الطرف الآخر لا لردّنا. |
| `TECHNICAL_ASSESSMENT_REPORT` | Technical assessment report | تقرير تقييم تقني | KU experts' written assessment of a technology, problem or requirement; pick it for technical evaluations. | تقييم مكتوب يعدّه خبراء جامعة خليفة لتقنية أو مشكلة أو متطلب؛ اختره للتقييمات التقنية. |
| `TERM_SHEET` | Term sheet | ورقة الشروط | A summary of the key commercial terms ahead of the full agreement; pick it during negotiation. | ملخص للشروط التجارية الرئيسية قبل الاتفاقية الكاملة؛ اخترها أثناء التفاوض. |
| `LICENCE_AGREEMENT` | Licence agreement | اتفاقية ترخيص | The agreement granting rights to KU intellectual property; pick it for licence and option contracts. | الاتفاقية التي تمنح حقوقاً في الملكية الفكرية لجامعة خليفة؛ اخترها لعقود الترخيص والخيار. |
| `TSA` | TSA | اتفاقية خدمات تقنية | A technical services agreement for paid technical, research or testing work; pick it for service contracts. | اتفاقية خدمات تقنية لأعمال تقنية أو بحثية أو اختبارات مدفوعة؛ اخترها لعقود الخدمات. |
| `JDA` | JDA | اتفاقية تطوير مشترك | A joint development agreement for shared research or development; pick it for collaboration contracts. | اتفاقية تطوير مشترك لبحث أو تطوير متقاسم؛ اخترها لعقود التعاون. |
| `SPONSORSHIP_AGREEMENT` | Sponsorship agreement | اتفاقية رعاية | The agreement for a sponsored programme or chair; pick it for sponsorship contracts. | اتفاقية برنامج أو كرسي بحثي برعاية؛ اخترها لعقود الرعاية. |
| `PITCH_DECK` | Pitch deck | عرض تقديمي | Slides presenting KUEC, a technology or a startup; pick it for presentation material. | شرائح تعرض KUEC أو تقنية أو شركة ناشئة؛ اختره لمواد العروض التقديمية. |
| `ONE_PAGER` | One-pager | ملخص من صفحة واحدة | A one-page summary of an offer or technology; pick it for leave-behinds. | ملخص من صفحة واحدة لعرض أو تقنية؛ اختره للمواد التي تُترك مع الجهة بعد اللقاء. |
| `WORKSHOP_REPORT` | Workshop report | تقرير ورشة عمل | The write-up of a workshop's attendees, discussion and outcomes; pick it after a workshop. | تقرير عن حضور ورشة العمل ونقاشاتها ونتائجها؛ اختره بعد انتهاء الورشة. |
| `SITE_VISIT_REPORT` | Site-visit report | تقرير زيارة ميدانية | The write-up of a visit to the counterpart's site; pick it after a site visit. | تقرير عن زيارة موقع الطرف الآخر؛ اختره بعد الزيارة الميدانية. |
| `MEETING_MINUTES` | Meeting minutes | محضر اجتماع | The record of decisions and actions from a meeting; pick it for committee and steering meetings too. | سجل القرارات والإجراءات الصادرة عن اجتماع؛ اختره لاجتماعات اللجان واللجان التوجيهية أيضاً. |
| `PO_OR_INVOICE` | PO or invoice (finance is the system of record) | أمر شراء أو فاتورة (الإدارة المالية هي نظام السجل) | A purchase order or invoice linked for reference only, since finance holds the original; pick it only to point to finance's copy. | أمر شراء أو فاتورة يُربط للرجوع إليه فقط لأن الإدارة المالية تحتفظ بالأصل؛ اختره فقط للإشارة إلى نسخة الإدارة المالية. |
| `OFFSET_DOCUMENTATION` | Offset documentation | وثائق الأوفست | Evidence and filings for offset or ICV credit; pick it for documents an offset programme asks for. | أدلة ومستندات لرصيد الأوفست أو القيمة المحلية المضافة؛ اختره للوثائق التي يطلبها برنامج الأوفست. |
| `VENDOR_REGISTRATION_OR_KYC` | Vendor registration or KYC | تسجيل مورّد أو اعرف عميلك | Forms that register KUEC as a supplier or verify a counterparty; pick it for onboarding paperwork. | نماذج تسجّل KUEC مورّداً أو تتحقق من هوية الطرف الآخر؛ اختره لمستندات التسجيل والانضمام. |
| `FACULTY_PROFILE_OR_CV` | Faculty profile or CV | ملف عضو هيئة تدريس أو سيرة ذاتية | A KU faculty member's profile or CV shared with a counterpart; pick it when introducing an expert. | ملف أو سيرة ذاتية لعضو هيئة تدريس في جامعة خليفة تُشارك مع الطرف الآخر؛ اختره عند تقديم خبير. |
| `OTHER` | Other | أخرى | Nothing above fits; say what it is in the required note (Other details in Twenty). | لا ينطبق أي خيار أعلاه؛ اذكر ما هو في الملاحظة الإلزامية (حقل «تفاصيل أخرى» في Twenty). |

### 8.8 Document status (حالة الوثيقة)

List key `DOCUMENT_STATUS`. Applies to `Document.status`. In Twenty: `document.status` (select).

Twenty holds the link and these metadata only; the file stays on SharePoint or in uVENTURE and is never uploaded (kuec/CLAUDE.md rule 4).

| Value | Label | التسمية | What it means, when to pick it | المعنى ومتى تختاره |
| --- | --- | --- | --- | --- |
| `DRAFT` | Draft | مسودة | Being written and not yet sent; pick it until the document leaves KUEC. | قيد الكتابة ولم تُرسل بعد؛ اختره إلى أن تخرج الوثيقة من KUEC. |
| `SHARED` | Shared | تمت مشاركتها | Sent to the counterpart for information or comment; pick it once it has left KUEC. | أُرسلت إلى الطرف الآخر للاطلاع أو التعليق؛ اختره بمجرد خروجها من KUEC. |
| `UNDER_REVIEW` | Under review | قيد المراجعة | Being reviewed or negotiated by either side; pick it while comments or redlines are open. | قيد المراجعة أو التفاوض من أحد الطرفين؛ اختره ما دامت التعليقات أو التعديلات مفتوحة. |
| `SIGNED` | Signed | موقّعة | Signed by every party; pick it once the last signature is on. | وقّعها جميع الأطراف؛ اختره بمجرد إضافة آخر توقيع. |
| `EXPIRED` | Expired | منتهية | Past its end date and no longer in force; pick it when the term has run out. | تجاوزت تاريخ انتهائها ولم تعد سارية؛ اختره عند انقضاء مدتها. |
| `SUPERSEDED` | Superseded | مُستبدَلة | Replaced by a newer version or agreement; pick it and link the document that replaces it. | استُبدلت بنسخة أو اتفاقية أحدث؛ اختره واربط الوثيقة التي حلّت محلها. |
| `OTHER` | Other | أخرى | Nothing above fits; say what it is in the required note (Other details in Twenty). | لا ينطبق أي خيار أعلاه؛ اذكر ما هو في الملاحظة الإلزامية (حقل «تفاصيل أخرى» في Twenty). |

### 8.9 Document confidentiality (سرية الوثيقة)

List key `DOCUMENT_CONFIDENTIALITY`. Applies to `Document.confidentiality`. In Twenty: `document.confidentiality` (select).

Twenty holds the link and these metadata only; the file stays on SharePoint or in uVENTURE and is never uploaded (kuec/CLAUDE.md rule 4). Every class is link-only, and the label does not restrict who sees the record: SharePoint and uVENTURE permissions protect the file.

| Value | Label | التسمية | What it means, when to pick it | المعنى ومتى تختاره |
| --- | --- | --- | --- | --- |
| `INTERNAL` | Internal | داخلية | For KUEC and KU staff, with no harm if seen inside KU; pick it for working material. | لموظفي KUEC وجامعة خليفة ولا ضرر من الاطلاع عليها داخل الجامعة؛ اختره لمواد العمل. |
| `CONFIDENTIAL` | Confidential | سرية | Commercially sensitive or received under NDA; pick it for pricing and anything a counterpart gave us in confidence. | حساسة تجارياً أو مُستلمة بموجب اتفاقية عدم إفصاح؛ اختره للأسعار ولكل ما سلّمنا إياه الطرف الآخر بسرية. |
| `RESTRICTED` | Restricted | مقيّدة | For named people only, such as unfiled IP, legal or board material; pick it when access must be limited to a list. | لأشخاص محددين بالاسم فقط، مثل ملكية فكرية لم تُسجَّل أو مواد قانونية أو مواد مجلس الإدارة؛ اختره عندما يجب حصر الاطلاع في قائمة. |
| `OTHER` | Other | أخرى | Nothing above fits; say what it is in the required note (Other details in Twenty). | لا ينطبق أي خيار أعلاه؛ اذكر ما هو في الملاحظة الإلزامية (حقل «تفاصيل أخرى» في Twenty). |

### 8.10 Contract type (نوع العقد)

List key `CONTRACT_TYPE`. Applies to `Contract.type`. In Twenty: `contract.kind` (select).

| Value | Label | التسمية | What it means, when to pick it | المعنى ومتى تختاره |
| --- | --- | --- | --- | --- |
| `NDA` | NDA | اتفاقية عدم إفصاح | A non-disclosure agreement; pick it for contracts that only cover confidentiality. | اتفاقية عدم إفصاح؛ اخترها للعقود التي تقتصر على السرية. |
| `MOU` | MoU | مذكرة تفاهم | A memorandum of understanding, usually not binding; pick it for a framework of intent. | مذكرة تفاهم لا تكون ملزمة عادة؛ اخترها لإطار من النوايا. |
| `MSA` | MSA | اتفاقية خدمات رئيسية | A master services agreement for later work orders; pick it for umbrella contracts. | اتفاقية خدمات رئيسية لأوامر العمل اللاحقة؛ اخترها للعقود الإطارية الشاملة. |
| `LICENCE` | Licence | ترخيص | A licence of, or option on, KU intellectual property; pick it for any IP rights contract. | ترخيص للملكية الفكرية لجامعة خليفة أو خيار عليها؛ اختره لأي عقد حقوق ملكية فكرية. |
| `TSA` | TSA | اتفاقية خدمات تقنية | A technical services agreement for paid technical, research or testing work; pick it for service contracts. | اتفاقية خدمات تقنية لأعمال تقنية أو بحثية أو اختبارات مدفوعة؛ اخترها لعقود الخدمات. |
| `JDA` | JDA | اتفاقية تطوير مشترك | A joint development agreement for shared research; pick it for collaborations. | اتفاقية تطوير مشترك لبحث متقاسم؛ اخترها لعقود التعاون. |
| `SPONSORSHIP` | Sponsorship | رعاية | An agreement for a sponsored programme or chair; pick it when a sponsor funds KUEC activity. | اتفاقية لبرنامج أو كرسي بحثي برعاية؛ اخترها عندما يموّل راعٍ نشاطاً لـ KUEC. |
| `LEASING` | Leasing | تأجير | A lease of office, lab or industrial space; pick it for space rental. | عقد تأجير مساحة مكتبية أو مخبرية أو صناعية؛ اختره لتأجير المساحات. |
| `CONSULTING` | Consulting | استشارات | An agreement for expert advice without lab work; pick it for advisory work. | اتفاقية لتقديم مشورة خبراء دون عمل مخبري؛ اخترها للأعمال الاستشارية. |
| `OPTION` | Option (deprecated) | خيار (متوقف) | Deprecated on 17 October 2026 and kept for existing records; options on KU IP are Licence contracts now. Replaced by `LICENCE`. | أُوقف في 17 أكتوبر 2026 ويبقى للسجلات القائمة؛ تُصنَّف عقود الخيار على الملكية الفكرية للجامعة الآن ضمن «ترخيص». |
| `SERVICE` | Service (deprecated) | خدمة (متوقف) | Deprecated on 17 October 2026 and kept for existing records; pick TSA, Consulting or MSA instead. Replaced by `TSA`, `CONSULTING`, `MSA`. | أُوقف في 17 أكتوبر 2026 ويبقى للسجلات القائمة؛ اختر بدلاً منه اتفاقية خدمات تقنية أو استشارات أو اتفاقية خدمات رئيسية. |
| `OTHER` | Other | أخرى | Nothing above fits; say what it is in the required note (Other details in Twenty). | لا ينطبق أي خيار أعلاه؛ اذكر ما هو في الملاحظة الإلزامية (حقل «تفاصيل أخرى» في Twenty). |

### 8.11 Project type (نوع المشروع)

List key `PROJECT_TYPE`. Applies to `Project.type`. In Twenty: `project.playbookType` (select).

Workshop, Proposal and Delivery start a project template (project-templates.json); every other type has none yet.

| Value | Label | التسمية | What it means, when to pick it | المعنى ومتى تختاره |
| --- | --- | --- | --- | --- |
| `DELIVERY` | Delivery | تنفيذ | Delivering work a counterpart has signed for; pick it after the contract is signed. | تنفيذ عمل وقّع عليه الطرف الآخر؛ اختره بعد توقيع العقد. |
| `INITIATIVE` | Initiative | مبادرة | A KUEC-led effort toward a strategic goal with no single client; pick it for new programmes or service lines. | جهد تقوده KUEC نحو هدف استراتيجي دون عميل واحد؛ اختره للبرامج أو خطوط الخدمة الجديدة. |
| `WORKSHOP` | Workshop | ورشة عمل | Planning and running an industry workshop; pick it to get the workshop template. | التخطيط لورشة عمل صناعية وتنظيمها؛ اختره لتطبيق قالب ورشة العمل. |
| `PROPOSAL` | Proposal | مقترح | Preparing and submitting a proposal or bid with several contributors; pick it to get the proposal template. | إعداد مقترح أو عطاء وتقديمه بمشاركة عدة أشخاص؛ اختره لتطبيق قالب المقترح. |
| `GTM_CAMPAIGN` | GTM campaign | حملة دخول السوق | A go-to-market campaign taking KUEC capabilities to one sector or market; pick it for targeted outreach campaigns. | حملة دخول السوق تقدّم قدرات KUEC إلى قطاع أو سوق محدد؛ اختره لحملات التواصل الموجّهة. |
| `ACCOUNT_PLAN` | Account plan | خطة حساب | A plan to grow one key account over a set period; pick it for named strategic accounts. | خطة لتنمية حساب رئيسي واحد خلال مدة محددة؛ اختره للحسابات الاستراتيجية المسماة. |
| `PROGRAMME_COHORT` | Programme cohort | دفعة برنامج | One cohort or round of a KUEC programme, such as a sprint or fellowship; pick it to run that cohort. | دفعة أو دورة واحدة من برنامج لـ KUEC مثل سبرنت أو زمالة؛ اختره لإدارة تلك الدفعة. |
| `INTERNAL` | Internal | داخلي | KUEC work with no counterpart, such as process or tooling; pick it when no outside party is involved. | عمل داخل KUEC دون طرف خارجي مثل الإجراءات أو الأدوات؛ اختره عندما لا تشارك أي جهة خارجية. |
| `OTHER` | Other | أخرى | Nothing above fits; say what it is in the required note (Other details in Twenty). | لا ينطبق أي خيار أعلاه؛ اذكر ما هو في الملاحظة الإلزامية (حقل «تفاصيل أخرى» في Twenty). |

### 8.12 Task type (نوع المهمة)

List key `TASK_TYPE`. Applies to `Task.type`. In Twenty: `task.taskType` (select).

| Value | Label | التسمية | What it means, when to pick it | المعنى ومتى تختاره |
| --- | --- | --- | --- | --- |
| `FOLLOW_UP` | Follow-up | متابعة | Chase a reply or a promised action from someone; pick it when you are waiting on them. | متابعة رد أو إجراء وعد به شخص ما؛ اختره عندما تكون بانتظاره. |
| `CALL` | Call | مكالمة | Make a phone or video call; pick it when the task is the call itself. | إجراء مكالمة هاتفية أو مرئية؛ اختره عندما تكون المهمة هي المكالمة نفسها. |
| `EMAIL` | Email | بريد إلكتروني | Write and send an email; pick it when the task is a message to send. | كتابة رسالة بريد إلكتروني وإرسالها؛ اختره عندما تكون المهمة رسالة يجب إرسالها. |
| `PREPARE_DOCUMENT` | Prepare document | إعداد وثيقة | Draft or update a document, deck or proposal; pick it for writing work and link the file rather than uploading it. | صياغة وثيقة أو عرض تقديمي أو مقترح أو تحديثه؛ اختره لأعمال الكتابة واربط الملف بدلاً من رفعه. |
| `REVIEW` | Review | مراجعة | Check someone's work or a document and give comments; pick it when you are the reviewer. | مراجعة عمل شخص أو وثيقة وإبداء الملاحظات؛ اختره عندما تكون أنت المراجع. |
| `APPROVAL` | Approval | اعتماد | Decide yes or no on something put to you; pick it for sign-offs. | البت بالموافقة أو الرفض في أمر معروض عليك؛ اختره لعمليات الاعتماد. |
| `INTERNAL` | Internal | داخلي | Coordination inside KUEC with no counterpart; pick it for internal meetings and handoffs. | تنسيق داخل KUEC دون طرف خارجي؛ اختره للاجتماعات الداخلية وتسليم العمل. |
| `ADMIN` | Admin | إداري | Record-keeping or system housekeeping, such as fixing data; pick it for admin chores. | حفظ السجلات أو تنظيم النظام مثل تصحيح البيانات؛ اختره للمهام الإدارية. |
| `OTHER` | Other | أخرى | Nothing above fits; say what it is in the required note (Other details in Twenty). | لا ينطبق أي خيار أعلاه؛ اذكر ما هو في الملاحظة الإلزامية (حقل «تفاصيل أخرى» في Twenty). |

### 8.13 Company sector (قطاع الشركة)

List key `COMPANY_SECTOR`. Applies to `Company.sector`. In Twenty: `company.sector` (select).

Pending: to be replaced by the UAE industrial cluster list. These options are then deprecated, never deleted.

| Value | Label | التسمية | What it means, when to pick it | المعنى ومتى تختاره |
| --- | --- | --- | --- | --- |
| `OIL_AND_GAS` | Oil and gas | النفط والغاز | Upstream, midstream or downstream oil and gas; pick it for operators, refiners and their service companies. | النفط والغاز في مراحل الاستكشاف والنقل والتكرير؛ اختره للمشغلين والمصافي وشركات الخدمات التابعة لها. |
| `ENERGY_AND_UTILITIES` | Energy and utilities | الطاقة والمرافق | Power, water, renewables and utilities; pick it for generation, grid and water companies. | الكهرباء والمياه والطاقة المتجددة والمرافق؛ اختره لشركات التوليد والشبكات والمياه. |
| `DEFENCE_AND_SECURITY` | Defence and security | الدفاع والأمن | Defence manufacturers, integrators and security bodies; pick it for companies selling to defence. | مصنّعو المعدات الدفاعية ومكاملو الأنظمة والجهات الأمنية؛ اختره للشركات التي تبيع لقطاع الدفاع. |
| `AEROSPACE` | Aerospace | الطيران والفضاء | Aircraft, space and aviation services; pick it for airlines, maintenance and space companies. | الطائرات والفضاء وخدمات الطيران؛ اختره لشركات الطيران والصيانة والفضاء. |
| `HEALTHCARE` | Healthcare and life sciences | الرعاية الصحية وعلوم الحياة | Hospitals, pharma, medical devices and biotech; pick it for health and life-science organisations. | المستشفيات والأدوية والأجهزة الطبية والتقنية الحيوية؛ اختره لجهات الصحة وعلوم الحياة. |
| `ICT` | ICT and digital | الاتصالات وتقنية المعلومات والخدمات الرقمية | Telecoms, software, data and digital services; pick it for technology and telecom companies. | الاتصالات والبرمجيات والبيانات والخدمات الرقمية؛ اختره لشركات التقنية والاتصالات. |
| `MANUFACTURING` | Advanced manufacturing | التصنيع المتقدم | Industrial manufacturing, materials and chemicals; pick it for factories and materials producers. | التصنيع الصناعي والمواد والكيماويات؛ اختره للمصانع ومنتجي المواد. |
| `TRANSPORT_AND_LOGISTICS` | Transport and logistics | النقل والخدمات اللوجستية | Ports, shipping, rail, road and logistics; pick it for companies that move goods or people. | الموانئ والشحن والسكك الحديدية والنقل البري والخدمات اللوجستية؛ اختره للشركات التي تنقل البضائع أو الأشخاص. |
| `GOVERNMENT` | Government | الحكومة | Federal or emirate government entities; pick it for ministries, authorities and departments. | الجهات الحكومية الاتحادية أو المحلية؛ اختره للوزارات والهيئات والدوائر. |
| `OTHER` | Other | أخرى | Nothing above fits; say what it is in the required note (Other details in Twenty). | لا ينطبق أي خيار أعلاه؛ اذكر ما هو في الملاحظة الإلزامية (حقل «تفاصيل أخرى» في Twenty). |

### 8.14 Company relationship type (نوع العلاقة مع الشركة)

List key `COMPANY_RELATIONSHIP_TYPE`. Applies to `Company.relationshipType`. In Twenty: `company.relationshipType` (select).

One value per company: pick the main relationship.

| Value | Label | التسمية | What it means, when to pick it | المعنى ومتى تختاره |
| --- | --- | --- | --- | --- |
| `PROSPECT` | Prospect | عميل محتمل | A company we are pursuing that has not bought from KUEC yet; pick it for targets and new contacts. | شركة نسعى إليها ولم تشترِ من KUEC بعد؛ اخترها للجهات المستهدفة والجهات الجديدة. |
| `CUSTOMER` | Customer | عميل | A company that has paid KUEC for work; pick it after the first signed deal. | شركة دفعت لـ KUEC مقابل عمل؛ اخترها بعد أول صفقة موقعة. |
| `PARTNER` | Partner | شريك | A company we work with to reach or serve others, such as a channel or co-developer; pick it when neither side buys from the other. | شركة نعمل معها للوصول إلى آخرين أو خدمتهم، مثل قناة بيع أو شريك تطوير؛ اخترها عندما لا يشتري أي طرف من الآخر. |
| `SPONSOR` | Sponsor | راعٍ | A company that funds KUEC programmes, events or chairs; pick it when sponsorship is its main role. | شركة تموّل برامج KUEC أو فعالياتها أو كراسيها البحثية؛ اخترها عندما تكون الرعاية دورها الرئيسي. |
| `GOVERNMENT` | Government | جهة حكومية | A government entity acting as funder, regulator or client; pick it for public bodies. | جهة حكومية بصفتها ممولاً أو جهة تنظيمية أو عميلاً؛ اخترها للجهات العامة. |
| `INVESTOR` | Investor | مستثمر | A fund or company that invests in KUEC ventures; pick it for venture funds, corporate venture arms and co-investors. | صندوق أو شركة تستثمر في مشاريع KUEC؛ اختره لصناديق رأس المال الجريء وأذرع الاستثمار المؤسسي والمستثمرين المشاركين. |
| `PORTFOLIO_COMPANY` | Portfolio company | شركة في المحفظة | A startup in the KUEC portfolio; pick it for companies KUEC holds equity in or incubates. | شركة ناشئة في محفظة KUEC؛ اخترها للشركات التي تملك فيها KUEC حصة أو تحتضنها. |
| `SUPPLIER` | Supplier | مورّد | A company that sells to KUEC; pick it for vendors and contractors. | شركة تبيع لـ KUEC؛ اخترها للموردين والمقاولين. |
| `UNIVERSITY_UNIT` | University unit | وحدة جامعية | A KU college, centre or office recorded as a company; pick it for counterparts inside KU. | كلية أو مركز أو مكتب في جامعة خليفة مسجّل كشركة؛ اختره للأطراف من داخل الجامعة. |
| `OTHER` | Other | أخرى | Nothing above fits; say what it is in the required note (Other details in Twenty). | لا ينطبق أي خيار أعلاه؛ اذكر ما هو في الملاحظة الإلزامية (حقل «تفاصيل أخرى» في Twenty). |

### 8.15 Capability type (نوع القدرة)

List key `CAPABILITY_TYPE`. Applies to `Capability.type`. In Twenty: none.

Capabilities live in uVENTURE (kuec/CLAUDE.md rule 5); Twenty has no Capability object and never will.

| Value | Label | التسمية | What it means, when to pick it | المعنى ومتى تختاره |
| --- | --- | --- | --- | --- |
| `LAB` | Lab | مختبر | A KU laboratory and what it can do; pick it when a whole lab is the capability. | مختبر في جامعة خليفة وما يمكنه تقديمه؛ اختره عندما يكون المختبر بأكمله هو القدرة. |
| `EQUIPMENT` | Equipment | معدات | A specific instrument or machine that can be booked or used for testing; pick it for a single item of equipment. | جهاز أو آلة محددة يمكن حجزها أو استخدامها للاختبار؛ اختره لقطعة معدات واحدة. |
| `TECHNICAL_SERVICE` | Technical service | خدمة تقنية | A repeatable service KU staff deliver, such as a test method or analysis; pick it for packaged services. | خدمة متكررة يقدمها موظفو جامعة خليفة مثل طريقة اختبار أو تحليل؛ اختره للخدمات المعرّفة مسبقاً. |
| `EXPERTISE` | Expertise | خبرة | Know-how held by KU faculty or researchers; pick it when the capability is people's knowledge. | معرفة يمتلكها أعضاء هيئة التدريس أو الباحثون في جامعة خليفة؛ اختره عندما تكون القدرة معرفة الأشخاص. |
| `STARTUP` | Startup | شركة ناشئة | A KUEC portfolio startup and its product; pick it when a startup is the capability. | شركة ناشئة في محفظة KUEC ومنتجها؛ اختره عندما تكون الشركة الناشئة هي القدرة. |
| `SUBSIDIARY` | Subsidiary | شركة تابعة | A KUEC subsidiary and its services; pick it when a subsidiary delivers the capability. | شركة تابعة لـ KUEC وخدماتها؛ اختره عندما تقدم شركة تابعة القدرة. |
| `TECHNOLOGY` | Technology | تقنية | A KU invention or technology available to license or develop; pick it for capabilities based on IP. | اختراع أو تقنية من جامعة خليفة متاحة للترخيص أو التطوير؛ اختره للقدرات القائمة على الملكية الفكرية. |
| `SPACE` | Space | مساحة | Office, lab or industrial space available to lease; pick it for leasable space. | مساحة مكتبية أو مخبرية أو صناعية متاحة للتأجير؛ اختره للمساحات القابلة للتأجير. |
| `OTHER` | Other | أخرى | Nothing above fits; say what it is in the required note (Other details in Twenty). | لا ينطبق أي خيار أعلاه؛ اذكر ما هو في الملاحظة الإلزامية (حقل «تفاصيل أخرى» في Twenty). |

### 8.16 Department (الإدارة)

List key `DEPARTMENT`. Applies to `Lead.department`, `Opportunity.department`, `Engagement.department`, `Project.department`, `Contract.department`, `WorkPackage.department`, `Milestone.department`. In Twenty: `lead.department` (select), `opportunity.department` (select), `engagement.department` (select), `project.department` (select), `contract.department` (select), `workPackage.department` (select), `milestone.department` (select).

On every case-carrying business object. Document takes its department from the record it is linked to; Public holiday and Playbook role assignment are configuration records and carry no department.

| Value | Label | التسمية | What it means, when to pick it | المعنى ومتى تختاره |
| --- | --- | --- | --- | --- |
| `BD` | BD | تطوير الأعمال | The business development team; pick it when BD leads the work. | فريق تطوير الأعمال؛ اختره عندما يقود فريق تطوير الأعمال العمل. |
| `COMMERCIALIZATION` | Commercialization | التسويق التجاري | The team that takes KU technologies to market; pick it when commercialization leads the work. | الفريق الذي ينقل تقنيات جامعة خليفة إلى السوق؛ اختره عندما يقود فريق التسويق التجاري العمل. |
| `IP_OFFICE` | IP office | مكتب الملكية الفكرية | The office that handles disclosures, patents and licences; pick it when IP work leads. | المكتب الذي يتولى الإفصاحات وبراءات الاختراع والتراخيص؛ اختره عندما يقود عمل الملكية الفكرية. |
| `LEASING` | Leasing | التأجير | The team that leases office, lab and industrial space; pick it for space deals. | الفريق الذي يؤجّر المساحات المكتبية والمخبرية والصناعية؛ اختره لصفقات المساحات. |
| `LAB_ACCESS` | Lab access | الوصول إلى المختبرات | The team that books KU labs and equipment for outside users; pick it for lab and equipment access. | الفريق الذي يحجز مختبرات جامعة خليفة ومعداتها للمستخدمين من الخارج؛ اختره للوصول إلى المختبرات والمعدات. |
| `STARTUPS_AND_INVESTMENT` | Startups and investment | الشركات الناشئة والاستثمار | The team that supports and invests in startups; pick it for portfolio and spinout work. | الفريق الذي يدعم الشركات الناشئة ويستثمر فيها؛ اختره لأعمال المحفظة والشركات المنبثقة. |
| `OTHER` | Other | أخرى | Nothing above fits; say what it is in the required note (Other details in Twenty). | لا ينطبق أي خيار أعلاه؛ اذكر ما هو في الملاحظة الإلزامية (حقل «تفاصيل أخرى» في Twenty). |
