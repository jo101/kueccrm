// Renders the playbook pages from templates.json, the single source.
// node kuec/playbooks/render-playbooks.ts          rewrite the .md files
// node kuec/playbooks/render-playbooks.ts --check  exit 1 if any .md is stale
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

type EscalationRule = {
  trigger: string;
  afterBusinessDays: number;
  action: string;
  notify: string[];
  description?: string;
};

type DueBoundary = {
  anchor: string;
  businessDaysBefore?: number;
  businessDaysAfter?: number;
};

type WorkPackageTemplate = {
  key: string;
  title: string;
  objective: string;
  expectedOutput: string;
  doneCriteria: string;
  ownerRole: string;
  contributorRoles: string[];
  reviewerRole: string | null;
  dueOffsetDays: number | null;
  dueAnchor?: DueBoundary;
  dueCap?: DueBoundary;
  escalation: { standard: boolean; additional: EscalationRule[] };
};

type GateTemplate = {
  key: string;
  afterWorkPackage?: string;
  duringWorkPackage?: string;
  when?: string;
  deciderRoles: string[];
  evidence: string;
  onNo: string[];
};

type ExitTemplate = {
  status: string;
  label: string;
  meaning: string;
  records: string[];
};

type UventureHandoff = {
  atWorkPackage: string;
  record: string;
  byRole: string;
  action: string;
  condition: string | null;
};

type PlaybookTemplate = {
  key: string;
  file: string;
  name: string;
  caseType: keyof typeof EXIT_STATUSES_BY_CASE_TYPE;
  trigger: string;
  caseOwnerRole: string;
  anchors: { key: string; label: string; source: string }[];
  workPackages: WorkPackageTemplate[];
  gates: GateTemplate[];
  exits: ExitTemplate[];
  uventureHandoffs: UventureHandoff[];
};

type Templates = {
  roles: Record<string, string>;
  externalRoles: string[];
  standardEscalation: EscalationRule[];
  playbooks: PlaybookTemplate[];
};

const PLAYBOOKS_DIRECTORY = dirname(fileURLToPath(import.meta.url));

const EXIT_STATUSES_BY_CASE_TYPE = {
  OPPORTUNITY: ['SIGNED', 'LOST', 'PARKED'],
  PROJECT: ['DONE', 'CANCELLED', 'ON_HOLD'],
} as const;

const REWORK = 'REWORK';

const RECORD_TEXT: Record<string, string> = {
  LEAD_COUNT: 'leads',
  OPPORTUNITY_COUNT: 'opportunities',
};

const RECIPIENT_TEXT: Record<string, string> = {
  OWNER: 'owner',
  PREVIOUS_OWNER: 'previous owner',
  ED: 'ED',
};

const joinWithAnd = (items: string[]) =>
  items.length <= 1
    ? items.join('')
    : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;

const lowerFirst = (text: string) => text.charAt(0).toLowerCase() + text.slice(1);

const businessDays = (count: number) => `${count} business ${count === 1 ? 'day' : 'days'}`;

const validate = (templates: Templates) => {
  const errors: string[] = [];
  const checkRole = (role: string, where: string) => {
    if (!(role in templates.roles)) errors.push(`${where}: unknown role ${role}`);
  };

  for (const playbook of templates.playbooks) {
    const workPackageKeys = new Set(playbook.workPackages.map((workPackage) => workPackage.key));
    const anchorKeys = new Set(playbook.anchors.map((anchor) => anchor.key));
    checkRole(playbook.caseOwnerRole, `${playbook.key}.caseOwnerRole`);

    const allowedExits: readonly string[] = EXIT_STATUSES_BY_CASE_TYPE[playbook.caseType] ?? [];
    const exitStatuses = playbook.exits.map((exit) => exit.status);
    if (allowedExits.length === 0) errors.push(`${playbook.key}: unknown caseType ${playbook.caseType}`);
    if (exitStatuses.join() !== allowedExits.join()) {
      errors.push(`${playbook.key}: exits must be ${allowedExits.join(', ')} in that order`);
    }
    for (const exit of playbook.exits) {
      exit.records
        .filter((record) => !(record in RECORD_TEXT))
        .forEach((record) => errors.push(`${playbook.key}.${exit.status}: unknown record ${record}`));
    }

    for (const workPackage of playbook.workPackages) {
      const where = `${playbook.key}.${workPackage.key}`;
      checkRole(workPackage.ownerRole, where);
      if (templates.externalRoles.includes(workPackage.ownerRole)) {
        errors.push(`${where}: external role ${workPackage.ownerRole} cannot own a work package`);
      }
      workPackage.contributorRoles.forEach((role) => checkRole(role, where));
      if (workPackage.reviewerRole !== null) checkRole(workPackage.reviewerRole, where);
      if (workPackage.dueOffsetDays === null && workPackage.dueAnchor === undefined) {
        errors.push(`${where}: needs dueOffsetDays or dueAnchor`);
      }
      for (const boundary of [workPackage.dueAnchor, workPackage.dueCap]) {
        if (boundary !== undefined && !anchorKeys.has(boundary.anchor)) {
          errors.push(`${where}: unknown anchor ${boundary.anchor}`);
        }
      }
    }

    for (const gate of playbook.gates) {
      const target = gate.afterWorkPackage ?? gate.duringWorkPackage;
      if (target === undefined || !workPackageKeys.has(target)) {
        errors.push(`${playbook.key}.${gate.key}: unknown work package ${target}`);
      }
      if (gate.duringWorkPackage !== undefined && gate.when === undefined) {
        errors.push(`${playbook.key}.${gate.key}: duringWorkPackage needs when`);
      }
      gate.deciderRoles.forEach((role) => checkRole(role, `${playbook.key}.${gate.key}`));
      gate.onNo
        .filter((outcome) => outcome !== REWORK && !exitStatuses.includes(outcome))
        .forEach((outcome) => errors.push(`${playbook.key}.${gate.key}: onNo ${outcome} is not an exit of this playbook`));
    }

    for (const handoff of playbook.uventureHandoffs) {
      if (!workPackageKeys.has(handoff.atWorkPackage)) {
        errors.push(`${playbook.key}: hand-off at unknown work package ${handoff.atWorkPackage}`);
      }
      checkRole(handoff.byRole, `${playbook.key} hand-off`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`templates.json is invalid:\n${errors.join('\n')}`);
  }
};

const renderStandardEscalation = (templates: Templates) => {
  const parts: string[] = [];
  for (const rule of templates.standardEscalation) {
    const recipients = joinWithAnd(rule.notify.map((recipient) => RECIPIENT_TEXT[recipient] ?? recipient));
    switch (rule.trigger) {
      case 'NOT_ACCEPTED':
        parts.push(
          rule.action === 'REASSIGN_TO_OPS_COORDINATOR'
            ? `not accepted in ${businessDays(rule.afterBusinessDays)}, reassign to the ops coordinator and notify ${recipients}`
            : `not accepted in ${businessDays(rule.afterBusinessDays)}, notify ${recipients}`,
        );
        break;
      case 'OVERDUE':
        if (rule.afterBusinessDays === 0) {
          parts.push(`overdue, notify ${recipients} on the due date`);
        } else {
          parts[parts.length - 1] += ` and ${recipients} ${businessDays(rule.afterBusinessDays)} later`;
        }
        break;
      case 'BLOCKED':
        parts.push(`blocked, notify ${recipients} with the reason`);
        break;
      default:
        parts.push(`${rule.trigger}, ${rule.action}`);
    }
  }
  return parts.join('; ');
};

const renderRole = (templates: Templates, role: string) =>
  templates.externalRoles.includes(role)
    ? `${templates.roles[role]} (external)`
    : templates.roles[role];

const renderDue = (playbook: PlaybookTemplate, workPackage: WorkPackageTemplate, index: number) => {
  const anchorLabel = (key: string) =>
    playbook.anchors.find((anchor) => anchor.key === key)?.label ?? key;

  let due: string;
  if (workPackage.dueOffsetDays !== null) {
    const base = index === 0 ? 'case opening' : 'the previous step is done';
    due = `${businessDays(workPackage.dueOffsetDays)} after ${base}`;
  } else {
    const anchor = workPackage.dueAnchor as DueBoundary;
    const daysAfter = anchor.businessDaysAfter ?? 0;
    due =
      daysAfter === 0
        ? `on the ${anchorLabel(anchor.anchor)} date`
        : `${businessDays(daysAfter)} after the ${anchorLabel(anchor.anchor)}`;
  }

  if (workPackage.dueCap !== undefined) {
    due += `, and no later than ${businessDays(workPackage.dueCap.businessDaysBefore ?? 0)} before the ${anchorLabel(workPackage.dueCap.anchor)}`;
  }

  return due;
};

const renderPlaybook = (templates: Templates, playbook: PlaybookTemplate) => {
  const stepNumber = (key: string) =>
    playbook.workPackages.findIndex((workPackage) => workPackage.key === key) + 1;
  const stepLabel = (key: string) =>
    `step ${stepNumber(key)} (${playbook.workPackages[stepNumber(key) - 1].title})`;

  const lines: string[] = [
    '<!-- Generated from templates.json by render-playbooks.ts. Edit the JSON and re-run the script; do not edit this file. -->',
    '',
    `# ${playbook.name}`,
    '',
    `**Trigger:** ${playbook.trigger}`,
    '',
    `**Case owner:** ${renderRole(templates, playbook.caseOwnerRole)}`,
    '',
    '## Steps',
    '',
  ];

  playbook.workPackages.forEach((workPackage, index) => {
    const contributors = workPackage.contributorRoles.map((role) => renderRole(templates, role));
    const owner =
      contributors.length > 0
        ? `${renderRole(templates, workPackage.ownerRole)}, with input from ${joinWithAnd(contributors)}`
        : renderRole(templates, workPackage.ownerRole);
    const reviewer =
      workPackage.reviewerRole === null
        ? 'None; the owner is the approver'
        : renderRole(templates, workPackage.reviewerRole);
    const standard = workPackage.escalation.standard
      ? index === 0
        ? `Standard: ${renderStandardEscalation(templates)}.`
        : 'Standard, as step 1.'
      : '';
    const escalation = [standard, ...workPackage.escalation.additional.map((rule) => rule.description ?? '')]
      .filter((part) => part.length > 0)
      .join(' ');

    lines.push(
      `${index + 1}. **${workPackage.title}**`,
      `   - Objective: ${workPackage.objective}`,
      `   - Expected output: ${workPackage.expectedOutput}`,
      `   - Done criteria: ${workPackage.doneCriteria}`,
      `   - Owner: ${owner}`,
      `   - Due: ${renderDue(playbook, workPackage, index)}`,
      `   - Reviewer: ${reviewer}`,
      `   - Escalation: ${escalation}`,
    );
  });

  lines.push('', '## Decision gates', '');
  for (const gate of playbook.gates) {
    const position =
      gate.afterWorkPackage !== undefined
        ? `After ${stepLabel(gate.afterWorkPackage)}`
        : `In ${stepLabel(gate.duringWorkPackage as string)}, ${gate.when}`;
    const deciders = joinWithAnd(gate.deciderRoles.map((role) => renderRole(templates, role)));
    const onNo = gate.onNo.includes(REWORK)
      ? 'If no, the work goes back to the step owner for rework.'
      : `If no, the case exits as ${gate.onNo
          .map((status) => playbook.exits.find((exit) => exit.status === status)?.label ?? status)
          .join(' or ')}.`;
    lines.push(`- **${position}.** Decides: ${deciders}. Evidence: ${gate.evidence} ${onNo}`);
  }

  lines.push(
    '',
    '## Exit conditions',
    '',
    ...playbook.exits.map((exit) => {
      const records =
        exit.records.length === 0
          ? ''
          : ` Records the number of ${joinWithAnd(exit.records.map((record) => RECORD_TEXT[record]))} produced, including zero.`;
      return `- **${exit.label}:** ${exit.meaning}${records}`;
    }),
    '',
    '## Hand-off to uVENTURE',
    '',
  );

  if (playbook.uventureHandoffs.length === 0) {
    lines.push('None. This playbook does not create or update uVENTURE records.');
  }
  for (const handoff of playbook.uventureHandoffs) {
    const record = `${handoff.record.charAt(0)}${handoff.record.slice(1).toLowerCase().replaceAll('_', ' ')} record`;
    const condition = handoff.condition === null ? '' : ` Only when ${lowerFirst(handoff.condition)}`;
    lines.push(
      `- **${record}**, by ${renderRole(templates, handoff.byRole)}, at ${stepLabel(handoff.atWorkPackage)}: ${handoff.action}${condition}`,
    );
  }

  return `${lines.join('\n')}\n`;
};

const templates = JSON.parse(
  readFileSync(join(PLAYBOOKS_DIRECTORY, 'templates.json'), 'utf8'),
) as Templates;
validate(templates);

const isCheck = process.argv.includes('--check');
const staleFiles: string[] = [];

for (const playbook of templates.playbooks) {
  const path = join(PLAYBOOKS_DIRECTORY, playbook.file);
  const rendered = renderPlaybook(templates, playbook);
  if (isCheck) {
    let current = '';
    try {
      current = readFileSync(path, 'utf8');
    } catch {
      current = '';
    }
    if (current !== rendered) staleFiles.push(playbook.file);
  } else {
    writeFileSync(path, rendered);
  }
}

if (staleFiles.length > 0) {
  console.error(`Out of sync with templates.json: ${staleFiles.join(', ')}`);
  process.exit(1);
}
