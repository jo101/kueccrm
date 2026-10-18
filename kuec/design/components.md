# KUEC patterns and the Mantine primitives they compose

Rule: no bespoke Button, Input, Select or Modal. Every KUEC pattern composes Mantine 8.3.18 primitives and, in uVENTURE, the shared components in `src/components/common`. Every pattern has a story in `prototype/src/components/kuec/*.stories.tsx`; `npm run design-rules` fails when one does not. The Storybook toolbar switches locale (English LTR, Arabic RTL) and scheme (light, dark); the viewport addon has the 390 and 1440 px checkpoints, so each story covers the eight variants.

| Pattern | Composes | Where it is used | Props (essential) | Built |
| --- | --- | --- | --- | --- |
| `KuecPageHeader` | `Title` (24 px), `Text`, `HowThisWorks` (`Popover` + `ActionIcon`), one action slot | top of every destination | `title`, `description`, `howThisWorks` (five message keys), `action` | yes |
| `KuecRecordHeader` | `Title`, eyebrow `Text`, a `<dl>` of five facts, `HowThisWorks`, one action slot | top of every record | `eyebrow`, `title`, `facts`, `howThisWorks`, `action` | yes |
| `KuecStagePath` | an `<ol>` of CSS chevrons (clip-path, mirrored in RTL), `IconCheck`, one `Button` "Mark stage complete" | Opportunity record; "Part of" on the Task card | `stage`, `onMarkComplete`, `markCompletePrimary` | yes |
| `KuecSectionHeader` | `Title` (20 px), count `Text`, `Anchor` "Open list" | section breaks on Home, Related tab | `title`, `count`, `listLabel`, `listHref` | yes |
| `KuecActionCard` | `Card` (1 px border, no shadow, 12 px radius, 16 px padding), `Text` title and context, meta row with `KuecStatus`, one `Button` | Home (tasks, escalations, lead triage) | `title`, `context`, `owner?`, `due`, `statusTone`, `statusLabel`, `actionLabel`, `actionHref`, `primary` | yes |
| `KuecOpportunityCard` | same card with name · account, amount, Next Step as the context line, stage · due | Home "Next Steps due"; board and list (week 3) | `name`, `account`, `amount`, `stageLabel`, `nextStep`, `nextStepDue`, `nextStepTone`, `owner?`, `actionLabel`, `actionHref`, `primary` | yes |
| `KuecTaskCard` | `Card`, `Title`, `KuecStatus`, `InfoLabel`, `Alert` (blocked reason, notification banner), `List` (done criteria), `Button` group (sticky on phones), `Modal` for the one-line forms, `KuecPersonPicker` for Reassign | `/crm/tasks/:id`; the first element on every width | `task`, `fromNotification` | yes |
| `KuecDecisionCard` | `Card` with a tone edge, `KuecStatus` (routine or commercial), `Radio.Group` options with "Recommended", `Popover` + `DateInput` for Decide later, `Button` Decide | Home (ED, operations coordinator); `/crm/decisions/:id` (week 4) | `decision`, `primary` | yes |
| `KuecStatus` | a 6 px dot (`Box`) and `Text` in the tone colour | everywhere status shows | `tone: ok \| attention \| blocked \| neutral`, `label`, `size` | yes |
| `KuecNextStep` | `IconArrowRight` (mirrored), `Text`, `KuecStatus` due, `Button` "Set Next Step", `Modal` with `TextInput` + `DateInput`, toast with Undo | right rail of the Opportunity record; cards | `opportunity`, `canEdit`, `primary`, `labelled` | yes |
| `KuecMetricStrip` | `Card`, two to three `Stack`s with 20 px numbers, `Progress` (4 px) | Home | `metrics[] {label, value, detail, ratio?, href?}`, `scopeLabel` | yes |
| `KuecEmptyState` | dashed `Stack`, `Text` title, one-sentence next step, one `Button` | every list and section | `title`, `nextStep`, `actionLabel?`, `actionHref?` | yes |
| `KuecPersonPicker` | `Select` searchable with the role in `renderOption` | Reassign, New task | `label`, `people`, `value`, `onChange`, `excludeIds` | yes |
| `KuecCompanyPicker` | `Autocomplete` with debounced search and "Create {name}" last, `<bdi>` | New lead | | week 3 |
| `KuecGuidedForm` | `Stack` of inputs with `FieldLabelWithInfo`, one Save; `Stepper` only when steps exist | New lead, Convert | | week 3 |
| `KuecContextPanel` | `Stack` of quiet `Card`s with a 14 px title, count, info icon and link | right rail of every record | `sections[] {title, info?, count?, linkLabel?, linkHref?, content}` | yes |
| `KuecListView` | `mantine-datatable` `DataTable` with 36 px rows, sticky header, no borders | Related tab; every list screen | `records`, `columns`, `onRowClick`, `ariaLabel`, `maxHeight` | yes (sorting, column chooser, saved views, inline edit, virtualised rows: week 3) |
| `KuecDrawer` | `Drawer` from the end side (mirrors in RTL), 250 ms | New task; longer forms on desktop | `opened`, `onClose`, `title` | yes |
| `KuecTimeline` | `Timeline` with a Tabler icon per activity kind | Activity tab | `activities` | yes (added: the record template's timeline) |
| `KuecComposer` | `Button` group (Log a call, New event, Email, New task), `Textarea`, `MultiSelect` "With" | Activity tab | `opportunityId`, `contacts`, `onNewTask` | yes (added: the record template's composer) |

Library decisions:

- **Lists:** `mantine-datatable` 8.3.13, uVENTURE's table library. The brief names mantine-react-table; its latest release (1.3.4) peer-depends on Mantine 6 and no Mantine 8 release exists (`journal.md`).
- **Dates:** `@mantine/dates` 8.3.18 with dayjs 1.11.23 and a derived `ar-ae` locale (Gregorian, Western digits).
- **Search:** `@mantine/spotlight` 8.3.18 on Ctrl or Cmd+K.
- **Confirmations:** `@mantine/modals` 8.3.18 (`openConfirmModal`) for Mark stage complete.
- **Feedback:** `@mantine/notifications` 8.3.18, 4 s success, 8 s error, Undo where reversible.
- **Board:** dnd-kit arrives with the Opportunities board (week 3). **Charts:** `@mantine/charts` arrives with Dashboards (week 5). Neither is installed yet.

Shared behaviours:

- One primary action per screen: exactly one `variant="filled"` Button in the viewport; everything else `default` or `subtle`. Asserted by the visual test.
- Loading: `Skeleton` with the real headings; never a spinner alone (to build with the data layer).
- Error: `Alert` with what happened and what to do; a refused write rolls back and says "That didn't save. Nothing was changed. Try again."
- Every control has an info icon that is one focusable element beside the control, never inside it.
- No third-party avatar or logo service; initials only; client domains never leave the tenant.
