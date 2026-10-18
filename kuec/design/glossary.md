# Content glossary (English and Arabic)

Rules: plain words, verbs first, no abbreviations except KUEC, AED, UAE, QR; "working days", never "business days"; "the ED", never "manager" or "admin"; one language on screen at a time; Gregorian dates with Western digits in Gulf time (`Intl.DateTimeFormat('ar-AE', { calendar: 'gregory', numberingSystem: 'latn' })`); AED amounts formatted with `Intl.NumberFormat(locale, { style: 'currency', currency: 'AED' })`.

Provenance: **Existing** = already in the repository's reviewed catalogs (`app/src/i18n/interface.json`, `design/wireframes.md`, `playbooks/lookups.json`, `app/src/i18n/guidance.json`); **Draft** = coined for this design and **must be approved by a native-speaking BD colleague before it reaches a screen**. Every Draft row is a usability-test item in Arabic; the team's words win.

## 1. Destinations and shell

| English | Arabic | Provenance | Note |
| --- | --- | --- | --- |
| Today | اليوم | Draft | wireframes used "Home / صفحتك الرئيسية"; "Today" is a hypothesis for the tree test |
| Pipeline | خط الفرص | Draft | avoid "أنبوب"; alternative "الفرص" to be tested |
| Lead inbox | الواردات الجديدة | Draft | existing sidebar name "Leads" |
| Accounts | الجهات | Draft | "الشركات" if the team prefers "companies" |
| Delivery | التنفيذ | Existing (PROJECT_TYPE "Delivery / تنفيذ") | |
| Insights | المؤشرات | Draft | |
| Log | سجّل | Draft | verb, the global capture button |
| Inbox (notifications) | الإشعارات | Draft | |
| Help | المساعدة | Existing (guidance line label "أين تجد المساعدة") | |
| More | المزيد | Draft | |
| Open the expert CRM | افتح النظام الكامل | Draft | links to Twenty for roles that have it |
| How this works | كيف يعمل هذا | Existing (guidance titles) | per screen, user's language only |
| What do I do now? | ماذا أفعل الآن؟ | Existing (card rule, runbook 20) | |
| Search | بحث | Draft | |
| Feedback | ملاحظاتك | Draft | |

## 2. Work package

| English | Arabic | Provenance |
| --- | --- | --- |
| Work package | حزمة عمل | Existing (wireframes) |
| Owner | المسؤول | Existing |
| Reviewer | المراجِع | Existing |
| Objective | الهدف | Existing |
| Context | السياق | Existing |
| Expected output | المُخرَج المتوقَّع | Existing |
| Done criteria | معايير الإنجاز | Existing |
| Not started (PLANNED) | لم تبدأ بعد | Existing |
| Waiting to be accepted (OFFERED) | بانتظار القبول | Existing |
| In progress (ACCEPTED) | قيد التنفيذ | Existing |
| Waiting for review (SUBMITTED) | بانتظار المراجعة | Existing |
| Blocked (BLOCKED) | متوقفة | Existing (wireframes; interface.json also has متعطّل, to be unified by the native reviewer) |
| Done (DONE) | منجزة | Existing |
| Declined (DECLINED) | مرفوضة | Existing |
| Stopped (CANCELLED) | أُوقفت | Existing |
| Accept | قبول | Existing |
| Decline | رفض | Existing |
| Request help | طلب مساعدة | Existing |
| Submit | تسليم | Existing |
| Approve | اعتماد | Existing |
| Send back | إعادة للتعديل | Existing |
| Resolve blocker | حلّ العائق | Draft |
| Reassign | إسناد إلى شخص آخر | Existing ("Give to someone else") |
| Back to work | استئناف العمل | Existing |
| Due today | مطلوب اليوم | Existing |
| Due tomorrow | مطلوب غداً | Existing |
| Late since {date} | متأخر منذ {date} | Existing |
| Due {date} | مطلوب في {date} | Draft (pattern) |
| Accepted. It's on your list. | تم القبول. أصبح في قائمتك. | Existing |
| Part of {case} | ضمن {case} | Draft |

The status badge shows the plain word above and never the system value (fixes audit U10); the Twenty field keeps its value.

## 3. Pipeline and opportunity

| English | Arabic | Provenance |
| --- | --- | --- |
| Case (an opportunity or project, the user word) | ملف | Draft; wireframes use "Case" in English |
| Qualify | تأهيل | Draft (no Arabic stage labels exist today; options.json has "قيد التفاوض" for negotiation) |
| Scope | تحديد النطاق | Draft |
| Propose | تقديم العرض | Draft |
| Negotiate | تفاوض | Existing root (قيد التفاوض) |
| Signed | موقَّع | Draft |
| Lost | خاسر | Draft |
| Parked | مؤجَّل | Draft |
| Next action | الخطوة التالية | Existing ("خطواتك التالية") |
| Next action date | موعد الخطوة التالية | Draft |
| Value (AED) | القيمة (درهم) | Draft |
| Blocked by | متوقف بسبب | Draft |
| Who owns it | المسؤول | Existing |
| Where it stands | أين وصل | Draft |
| What must happen next | ما الذي يجب أن يحدث الآن | Draft |
| What is holding it back | ما الذي يعيقه | Draft |
| Lead | عميل محتمل | Existing (COMPANY_RELATIONSHIP_TYPE "Prospect / عميل محتمل" reused as root) |
| Referred by | بإحالة من | Draft |
| Source | المصدر | Existing (list name) |
| Need | الحاجة | Draft |

## 4. Today, decisions, exceptions

| English | Arabic | Provenance |
| --- | --- | --- |
| Needs your decision | بانتظار قرارك | Existing |
| Your next actions | خطواتك التالية | Existing |
| Other work is progressing | أعمال أخرى قيد التنفيذ | Existing |
| Decision | قرار | Existing root |
| Decide by {date} | قرّر قبل {date} | Draft |
| Decide later | قرّر لاحقاً | Draft |
| If nobody decides | إن لم يقرّر أحد | Draft |
| Recommended | موصى به | Draft |
| Who else is affected | من يتأثر أيضاً | Draft |
| Routine | روتيني | Draft |
| Material (commercial) decision | قرار تجاري مهم | Draft |
| Blocked | متوقفة | Existing |
| Late | متأخر | Existing root |
| No next step | بلا خطوة تالية | Draft |
| Not accepted yet | لم تُقبل بعد | Draft |
| Nothing needs you right now | لا شيء يحتاجك الآن | Draft |

## 5. Roles and people

| English | Arabic | Provenance |
| --- | --- | --- |
| the ED (Executive director) | المدير التنفيذي | Existing |
| Operations coordinator | منسق العمليات | Existing |
| BD officer | موظف تطوير الأعمال | Existing root (DEPARTMENT "تطوير الأعمال") |
| Technical contributor | مساهم تقني | Draft |
| Leadership viewer | قارئ القيادة | Draft |
| Me / mine | أنا / لي | Draft |

## 6. Errors, empty states, feedback (patterns)

| English | Arabic | Provenance |
| --- | --- | --- |
| That didn't save. Nothing was changed. Try again. | لم يُحفظ. لم يتغيّر شيء. حاول مرة أخرى. | Existing pattern (card) |
| We couldn't load this. Your data is safe. | تعذّر التحميل. بياناتك بأمان. | Existing pattern |
| You can't do this with your role. Ask {name}. | لا يمكنك فعل هذا بدورك. اسأل {name}. | Draft (fixes audit U2: never show an action the role cannot complete; if shown by mistake, say why) |
| Saved. | تم الحفظ. | Draft |
| Nothing here yet. {Next step}. | لا شيء هنا بعد. {Next step}. | Draft (empty states teach the next step) |
| Working offline is not supported. Reconnect to continue. | العمل دون اتصال غير مدعوم. أعد الاتصال للمتابعة. | Draft |

## 7. Date and number formats

| Locale | Example date | Example time | Example amount |
| --- | --- | --- | --- |
| en-AE | Thu 22 Oct 2026 | 17:00 | AED 450,000 |
| ar-AE (gregory, latn) | الخميس، 22 أكتوبر 2026 | 17:00 | 450,000 د.إ. |

Relative words (Today, Tomorrow, Late since) are used within 7 days; beyond that the short date. Never the Hijri calendar (fixes audit U6). Mixed-direction strings (an Arabic sentence with a Latin company name or email) are wrapped in bidi isolation (`<bdi>` or `unicode-bidi: isolate`).
