# KUEC patterns and the Mantine primitives they compose

Rule: no bespoke Button, Input, Select or Modal. Every KUEC pattern is a composition of Mantine 8.3.18 components plus uVENTURE's shared components (`src/components/common`). "Prototype" marks what `kuec/design/prototype` implements today; everything else is specified only.

| Pattern | Composes | Where it is used | Props (essential) | Prototype |
| --- | --- | --- | --- | --- |
| `KuecPageHeader` | uVENTURE `PageHeader` (Title, Text, Button, Breadcrumbs) + `ActionIcon` info + `HelpTooltip` | top of every destination | `title`, `description`, `primaryAction`, `howThisWorks` (five lines) | yes |
| `KuecSectionHeader` | `Group`, `Title order={4}`, `Text c="dimmed"`, optional `Anchor` "Open as list" | section breaks on Today, opportunity detail, company page | `title`, `count`, `listHref` | yes |
| `KuecActionCard` | `Card` (uVENTURE defaults: md radius, sm shadow, border) + `Stack` + `Group` + `Text` + `KuecStatusIndicator` + one `Button variant="filled"` | Today | `title`, `caseName`, `context`, `owner`, `deadline`, `status`, `primaryAction`, `href` | yes |
| `KuecOpportunityCard` | `Card` + `Group` + `Text` + `NumberFormatter` (AED) + `KuecNextAction` + `Badge` only for the blocker flag | Pipeline kanban and list | `company`, `owner`, `value`, `nextAction`, `nextActionDate`, `blocked` | no |
| `KuecStatusIndicator` | `Badge variant="light"` with the `--kuec-status-*` colour + `ThemeIcon` dot; text is the plain word from the glossary | everywhere a status shows | `status: 'onTrack' \| 'waiting' \| 'late' \| 'blocked' \| 'done'`, `label` | yes |
| `KuecNextAction` | `Group` + `IconArrowRight` (mirrored) + `Text fw={500}` + `Text c="dimmed"` date + inline `Button variant="subtle"` "Set" | opportunity detail, cards | `text`, `date`, `onSet` | yes (static) |
| `KuecProgressSteps` | `Stepper size="xs"` with the agreed stages, `allowNextStepsSelect={false}` | opportunity detail, work package "part of" | `stages`, `active` | yes |
| `KuecMetricCard` | uVENTURE `StatCard` (+ `@mantine/charts` `Sparkline`) + `Anchor` to the list behind it | Insights | `question`, `value`, `trend`, `listHref` | no |
| `KuecEmptyState` | uVENTURE `EmptyState` (icon, title, description, one action) | every list and section | `title`, `nextStep`, `action` | yes |
| `KuecPersonPicker` | `Select` with `searchable`, `nothingFoundMessage`, `renderOption` showing role; data from workspace members | guided forms, reassign | `value`, `onChange`, `roleFilter` | no |
| `KuecCompanyPicker` | `Autocomplete` with debounced search (300 ms, as in wireframes), "Create {name}" as the last option, `<bdi>` around names | Log a lead, accounts | `value`, `onChange`, `onCreate` | no |
| `KuecGuidedForm` | `Stepper` or single `Stack` of `TextInput`, `Textarea`, `Select`, `DateInput`; `FieldLabelWithInfo` on every control; one `Button` "Save" | Log a lead, decline reason, request help | `steps`, `onSave` | partial (decline and help forms on the card) |
| `KuecWorkPackageCard` | `Card` + `Stack` + `Group` + `Title order={3}` + `KuecStatusIndicator` + `List` (done criteria) + `Button.Group` of allowed actions (44 px on phones) + `Modal` for reasons + `Notification` via `@mantine/notifications` | `/crm/work/:id`, Delivery, Today detail, mobile | `workPackage`, `viewerRole`, `onAction` | yes |
| `KuecDecisionCard` | `Card` + `Alert color="error" variant="light"` (what is blocked) + `Text` consequence + `Radio.Group` options with the recommended one first and marked + `Button` "Decide" + `Menu` "Decide later" with `DateInput` | Today (ED, ops coordinator), `/crm/decisions/:id` | `decision`, `onDecide`, `onDefer` | yes (one card on the ED's Today) |
| `KuecContextPanel` | `Drawer position="end"` (mirrors in RTL) + `Tabs` (Details, Communications, Audit) + `ScrollArea` | opportunity detail "details (system metadata)" and audit trail | `recordId`, `sections` | no |

Shared behaviours:

- One primary action per screen: exactly one `variant="filled"` Button in the viewport; everything else `default` or `subtle`.
- Loading: `Skeleton` with the real headings after 300 ms (wireframes line 142); never a spinner alone.
- Error: Mantine `Alert` with "what happened" and "what to do"; writes that fail roll the optimistic state back and say so (principle 15).
- Toasts: `@mantine/notifications` through uVENTURE's `NotificationManager`, 4 s success, 8 s error.
- Every control has an info icon via `FieldLabelWithInfo` or `HelpTooltip`; the icon is focusable once and is not a tab stop inside the control (fixes audit U12).
- No third-party avatar or logo service: initials in `Avatar` only; client domains never leave the tenant.

Compatibility matrix with Twenty's front component runtime: see `spike-mantine-in-twenty.md` (0 of 7 pass). None of the patterns above is built as a Twenty front component.
