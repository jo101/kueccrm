// Field coverage per business object: descriptions, presence in views and on the record page, orphans.
import { readFileSync } from 'node:fs';

const model = JSON.parse(readFileSync(new URL('./evidence/model.json', import.meta.url)));
const arabic = JSON.parse(readFileSync(new URL('../../app/locales/ar-SA.json', import.meta.url), 'utf8'));
const BUSINESS = ['company', 'person', 'opportunity', 'note', 'task', 'lead', 'engagement', 'project', 'milestone', 'workPackage', 'contract', 'document', 'playbookRoleAssignment', 'publicHoliday', 'capability', 'campaignTarget'];
const SYSTEMISH = new Set(['id', 'createdAt', 'updatedAt', 'deletedAt', 'createdBy', 'updatedBy', 'position', 'searchVector', 'timelineActivities', 'favorites', 'attachments', 'noteTargets', 'taskTargets', 'messageParticipants', 'calendarEventParticipants', 'favoriteFolders']);

const visibleIn = {};
for (const view of model.views) {
  for (const viewField of view.viewFields) {
    if (!viewField.isVisible) continue;
    (visibleIn[viewField.fieldMetadataId] ??= []).push({ name: view.name, type: view.type, key: view.key });
  }
}
const arabicValues = new Set(Object.values(arabic));
const totals = [];
const orphans = [];
const expertOnly = [];
const noDescription = [];
for (const name of BUSINESS) {
  const object = model.objects.find((candidate) => candidate.nameSingular === name);
  const fields = object.fieldsList.filter((field) => field.isActive && !field.isSystem && !SYSTEMISH.has(field.name) && !field.label.includes('(deprecated)'));
  let described = 0;
  for (const field of fields) {
    if (field.description) described += 1; else noDescription.push(`${name}.${field.name} (${field.label})${field.applicationId ? '' : ' [Twenty]'}`);
    const homes = visibleIn[field.id] ?? [];
    const working = homes.filter((home) => home.key !== 'INDEX' && !/Everything \(expert\)/.test(home.name) && home.type !== 'FIELDS_WIDGET');
    const onRecordPage = homes.some((home) => home.type === 'FIELDS_WIDGET');
    if (!working.length && !onRecordPage) orphans.push(`${name}.${field.name} (${field.label})`);
    else if (!working.length) expertOnly.push(`${name}.${field.name} (${field.label})${onRecordPage ? '' : ' not on record page'}`);
  }
  totals.push(`${name}: ${fields.length} fields, ${described} described`);
}
console.log(totals.join('\n'));
console.log(`\nNO DESCRIPTION (${noDescription.length}):\n${noDescription.join('\n')}`);
console.log(`\nORPHANS, in no view and not on the record page (${orphans.length}):\n${orphans.join('\n')}`);
console.log(`\nON THE RECORD PAGE AND IN EXPERT VIEWS ONLY (${expertOnly.length}):\n${expertOnly.join('\n')}`);
