# Content glossary (English and Arabic)

Standard CRM terminology on screen (brief part 4), plain explanations in helper text only. Rules: no abbreviations except KUEC, AED, UAE, QR; "working days", never "business days"; "the ED", never "manager" or "admin"; one language per screen; Gregorian dates with Western digits in Gulf time (`Intl.DateTimeFormat('ar-AE', { calendar: 'gregory', numberingSystem: 'latn' })`); AED amounts through `Intl.NumberFormat` with `currency: 'AED'`.

Provenance: **Existing** = reviewed already in the repository's catalogs (`app/src/i18n/*.json`, `playbooks/lookups.json`); **Draft** = coined for this design and **approved by a native-speaking BD colleague before it reaches a pilot screen**. Nothing is machine-coined into production. API values are Twenty's and never change; only labels do.

## 1. Navigation

| English | Arabic | Provenance | Note |
| --- | --- | --- | --- |
| Home | الرئيسية | Existing (guidance) | |
| Leads | العملاء المحتملون | Existing (object label) | |
| Opportunities | الفرص | Existing (object label) | |
| Accounts | الحسابات | Draft | Twenty object Company; "الشركات" if the team prefers |
| Contacts | جهات الاتصال | Draft | Twenty object Person |
| Activities | الأنشطة | Draft | Twenty object Engagement |
| Tasks | المهام | Draft | Twenty object Work package; Twenty's own Task is relabelled Reminders |
| Projects | المشاريع | Existing | |
| Dashboards | لوحات المعلومات | Draft | |
| More | المزيد | Draft | |
| Contracts | العقود | Existing | |
| Documents | الوثائق | Existing | |
| Products & Services | المنتجات والخدمات | Draft | Twenty object Capability plus the offering list |
| Campaigns | الحملات | Existing | |
| Help | المساعدة | Existing | |
| New | جديد | Draft | the global create, defaults to New lead |
| Search | بحث | Draft | |
| Notifications | الإشعارات | Draft | |
| Reminders | التذكيرات | Draft | Twenty's own Task object, kept off employee screens |

## 2. Objects

| English | Arabic | Twenty object | Provenance |
| --- | --- | --- | --- |
| Lead | عميل محتمل | lead | Existing |
| Contact | جهة اتصال | person | Draft |
| Account | حساب | company | Draft |
| Opportunity | فرصة | opportunity | Existing |
| Activity (call, meeting, site visit, email, event) | نشاط (مكالمة، اجتماع، زيارة موقع، بريد إلكتروني، حدث) | engagement | Draft |
| Task | مهمة | workPackage | Draft |
| Project | مشروع | project | Existing |
| Milestone | مرحلة رئيسية | milestone | Existing |
| Contract | عقد | contract | Existing |
| Document | وثيقة | document | Existing |
| Product & Service | منتج وخدمة | capability | Draft |
| Campaign | حملة | campaign (project type) | Existing |
| Decision | قرار | (a blocked task plus its options; no object) | Existing root |

## 3. Opportunity fields and stages

| English | Arabic | Twenty field or value | Provenance |
| --- | --- | --- | --- |
| Amount | المبلغ | amount | Draft |
| Close Date | تاريخ الإغلاق | closeDate | Draft |
| Stage | المرحلة | stage | Existing |
| Probability | الاحتمال | probability | Existing |
| Owner | المسؤول | pointOfContact / owner | Existing |
| Next Step | الخطوة التالية | nextAction | Existing root |
| Next Step Date | تاريخ الخطوة التالية | nextActionDate | Draft |
| Lead Source | مصدر العميل المحتمل | source | Draft |
| Type | النوع | type | Existing |
| Forecast Category | فئة التوقعات | (derived from stage and probability; no field yet) | Draft |
| Qualification | التأهيل | `NEW` | Draft |
| Discovery | الاستكشاف | `SCREENING` | Draft |
| Proposal | العرض | `MEETING` | Draft |
| Negotiation | التفاوض | `PROPOSAL` | Existing root |
| Closed Won | مُغلقة ناجحة | `SIGNED` | Draft |
| Closed Lost | مُغلقة خاسرة | `LOST` | Draft |
| On Hold | معلّقة | `PARKED` | Draft |
| (hidden) | | `CUSTOMER` | deprecated, never shown |

The stage relabel is a Settings change on a standard field and needs a click-runbook beside `config/dashboards/opportunity-stages.md`; the ED confirms the mapping of Twenty's Meeting and Proposal (open question 3 in `journal.md`).

## 4. Lead status

| English | Arabic | Twenty value | Provenance |
| --- | --- | --- | --- |
| New | جديد | `NEW` | Existing |
| Working | قيد العمل | `CONTACTED`, `ENGAGED` | Draft; two values, one word on screen; the sub-state goes in helper text (open question 2) |
| Nurturing | قيد التنمية | `NURTURE` | Draft |
| Qualified | مؤهَّل | `QUALIFIED` | Existing |
| Unqualified (with reason) | غير مؤهَّل (مع السبب) | `DEAD` plus dead reason | Draft |
| Converted | محوَّل | `CONVERTED` | Existing |

## 5. Task status

| English | Arabic | Twenty value | Tone in the status map | Provenance |
| --- | --- | --- | --- | --- |
| Not Started | لم تبدأ | `PLANNED` | neutral | Draft |
| Assigned | مُسنَدة | `OFFERED` | attention | Draft |
| In Progress | قيد التنفيذ | `ACCEPTED` | ok (blocked when late, attention when due today) | Existing |
| Pending Review | بانتظار المراجعة | `SUBMITTED` | attention | Existing root |
| Completed | مكتملة | `DONE` | neutral | Draft |
| Declined | مرفوضة | `DECLINED` | neutral | Existing |
| Blocked | متوقفة | `BLOCKED` | blocked | Existing |
| Cancelled | ملغاة | `CANCELLED` | neutral | Draft |

## 6. Verbs

The one set of action verbs. A screen never invents another.

| English | Arabic | Where | Provenance |
| --- | --- | --- | --- |
| Accept | قبول | Task card, owner, Assigned | Existing |
| Decline | رفض | Task card, owner, Assigned | Existing |
| Request help | طلب مساعدة | Task card, owner, any open status | Existing |
| Submit for review | إرسال للمراجعة | Task card, owner, In Progress with a reviewer | Draft |
| Approve | اعتماد | Task card, reviewer, Pending Review | Existing |
| Send back | إعادة | Task card, reviewer, Pending Review | Draft (was "إعادة للتعديل") |
| Mark complete | تعليم كمكتمل | Task card, owner, In Progress without a reviewer | Draft |
| Set Next Step | تحديد الخطوة التالية | Opportunity record and card | Draft |
| Reassign | إعادة الإسناد | Task card, ED and operations coordinator | Draft |
| Decide | قرّر | Decision card | Draft |
| Decide later | قرّر لاحقاً | Decision card, with a date | Draft |
| Log a call | تسجيل مكالمة | Opportunity composer | Draft |
| New lead | عميل محتمل جديد | New; Home empty state | Draft |
| Convert | تحويل | Lead record (week 3) | Draft |
| Mark stage complete | إكمال المرحلة | Stage path | Draft (the brief names the control, not the verb list) |
| Report blocker | الإبلاغ عن عائق | Task card, owner, In Progress | **Added beyond the brief**; pending ED (open question 1) |
| Resume work | استئناف العمل | Task card, owner, Blocked | **Added beyond the brief**; pending ED (open question 1) |

## 7. Home

| English | Arabic | Provenance |
| --- | --- | --- |
| Needs your attention | يحتاج انتباهك | Draft |
| Next Steps due | خطوات تالية مستحقة | Draft |
| In progress | قيد التنفيذ | Existing |
| Decisions | القرارات | Existing root |
| Escalations | التصعيدات | Draft |
| Open list | افتح القائمة | Draft |
| Closed this quarter | أُغلق هذا الربع | Draft |
| Open pipeline | الفرص المفتوحة | Draft |
| Nothing needs you right now. | لا شيء يحتاجك الآن. | Draft |
| What do I do now? | ماذا أفعل الآن؟ | Existing |

## 8. Record template

| English | Arabic | Provenance |
| --- | --- | --- |
| Activity (tab) | النشاط | Draft |
| Details (tab) | التفاصيل | Draft |
| Related (tab) | المرتبطة | Draft |
| Key contacts | جهات الاتصال الرئيسية | Draft |
| Open in SharePoint | افتح في SharePoint | Draft |
| In this stage since {date} | في هذه المرحلة منذ {date} | Draft |
| Decision maker, Champion, Influencer, User, Gatekeeper | صاحب القرار، الداعم، مؤثّر، مستخدم، حارس البوابة | Existing (decision role list) |

## 9. Time and dates

| English | Arabic | Provenance |
| --- | --- | --- |
| Due today | مستحق اليوم | Existing root |
| Due tomorrow | مستحق غداً | Existing root |
| Due {date} | مستحق في {date} | Draft |
| Due in {n} days | مستحق خلال {n} أيام | Draft |
| Late since {date} | متأخر منذ {date} | Existing |
| No Next Step | بلا خطوة تالية | Draft |
| Not accepted after {n} working days | لم تُقبل بعد {n} أيام عمل | Draft |

Formats: `en-AE` "Thu 22 Oct 2026", `ar-AE` (gregory, latn) "الخميس، 22 أكتوبر 2026"; amounts "AED 450,000" and "450,000 د.إ."; compact "AED 1.2M" and "1.2 مليون د.إ.". Relative words within 7 days, the short date beyond. Never the Hijri calendar. Mixed-direction strings (an Arabic sentence with a Latin company name or email) are wrapped in `<bdi>`.

## 10. Errors, empty states, feedback

| English | Arabic | Provenance |
| --- | --- | --- |
| That didn't save. Nothing was changed. Try again. | لم يُحفظ. لم يتغيّر شيء. حاول مرة أخرى. | Existing |
| We couldn't load this. Your data is safe. | تعذّر التحميل. بياناتك بأمان. | Existing |
| You can't do this with your role. Ask {name}. | لا يمكنك فعل هذا بدورك. اسأل {name}. | Draft |
| Saved. | تم الحفظ. | Draft |
| Accepted. It's on your list. | تم القبول. أصبحت في قائمتك. | Existing |
| Nothing here yet. | لا شيء هنا بعد. | Draft |
