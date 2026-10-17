// The RAID log the PM pack puts on every active project as a Note: one table
// per heading, kept current at the weekly review (kuec/playbooks/pm-pack.md).
// A note body is one document for every reader, so the headings carry both
// languages, like the guidance widgets.
export const RAID_LOG_NOTE_TITLE = 'RAID log';

const table = (heading: string, columns: string[]) =>
  [
    `## ${heading}`,
    '',
    `| ${columns.join(' | ')} |`,
    `| ${columns.map(() => '---').join(' | ')} |`,
    `| ${columns.map(() => ' ').join(' | ')} |`,
  ].join('\n');

export const RAID_LOG_NOTE_BODY = [
  'Keep this note current at the weekly review. Anything that blocks a work package is also raised with Request help on the work package. / حدّث هذه الملاحظة في المراجعة الأسبوعية. وأي أمر يعيق حزمة عمل يُرفع أيضاً عبر «طلب مساعدة» على حزمة العمل.',
  table('Risks / المخاطر', ['Risk', 'Likelihood', 'Impact', 'Mitigation', 'Owner', 'Review by']),
  table('Assumptions / الافتراضات', ['Assumption', 'Why we believe it', 'How we check it', 'Owner']),
  table('Issues / المشكلات', ['Issue', 'Impact', 'Action', 'Owner', 'Due']),
  table('Dependencies / الاعتماديات', ['Dependency', 'On whom', 'Needed by', 'Status', 'Owner']),
].join('\n\n');
