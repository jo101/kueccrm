// Select options on the business objects: near-duplicates within a list, abbreviations, Other last, colours.
import { readFileSync } from 'node:fs';

const model = JSON.parse(readFileSync(new URL('./evidence/model.json', import.meta.url)));
const BUSINESS = ['company', 'person', 'opportunity', 'note', 'task', 'lead', 'engagement', 'project', 'milestone', 'workPackage', 'contract', 'document', 'playbookRoleAssignment', 'publicHoliday', 'capability', 'campaignTarget'];
const ALLOWED_CAPS = new Set(['KUEC', 'QR', 'AED', 'UAE', 'TODO']);
const normalize = (label) => label.toLowerCase().replace(/\(.*?\)/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\b(or|and|the|a|an|of|to|for|with)\b/g, ' ').replace(/\s+/g, ' ').trim();
const tokens = (label) => new Set(normalize(label).split(' ').filter(Boolean));
const jaccard = (left, right) => {
  const a = tokens(left);
  const b = tokens(right);
  const shared = [...a].filter((token) => b.has(token)).length;
  return shared / (a.size + b.size - shared || 1);
};

let lists = 0;
let optionCount = 0;
for (const name of BUSINESS) {
  const object = model.objects.find((candidate) => candidate.nameSingular === name);
  for (const field of object.fieldsList) {
    if (!['SELECT', 'MULTI_SELECT'].includes(field.type) || !field.isActive || !field.options) continue;
    lists += 1;
    const options = [...field.options].sort((a, b) => a.position - b.position);
    optionCount += options.length;
    const labels = options.map((option) => option.label);
    const notes = [];
    for (let left = 0; left < options.length; left += 1) {
      for (let right = left + 1; right < options.length; right += 1) {
        const score = jaccard(labels[left], labels[right]);
        if (score >= 0.5 || normalize(labels[left]) === normalize(labels[right])) notes.push(`near-duplicate "${labels[left]}" ~ "${labels[right]}" (${score.toFixed(2)})`);
      }
    }
    for (const label of labels) {
      const caps = (label.match(/\b[A-Z]{2,}\b/g) ?? []).filter((word) => !ALLOWED_CAPS.has(word));
      if (caps.length) notes.push(`capitals "${label}"`);
      if (/\b(e\.g|etc|approx|dept|mgmt|info)\b/i.test(label)) notes.push(`abbreviation "${label}"`);
    }
    const otherIndex = labels.findIndex((label) => /^Other\b/.test(label));
    if (otherIndex !== -1 && otherIndex !== labels.length - 1) notes.push(`Other not last (position ${otherIndex + 1} of ${labels.length})`);
    console.log(`${name}.${field.name} [${field.label}] ${field.applicationId ? '' : '(Twenty) '}${labels.length}: ${options.map((option) => `${option.label}=${option.color}`).join(' | ')}`);
    for (const note of notes) console.log(`   ! ${note}`);
  }
}
console.log(`\n${lists} lists, ${optionCount} options`);
