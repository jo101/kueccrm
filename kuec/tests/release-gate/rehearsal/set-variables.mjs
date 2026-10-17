import { gql } from './lib.mjs';
import { writeFileSync } from 'node:fs';
const apps = await gql('metadata', '{ findOneApplication(universalIdentifier: "aa97f60d-3af8-4242-bb46-5413d0813bfa") { id name universalIdentifier applicationVariables { key value isSecret } } }');
if (apps.errors) { console.log(JSON.stringify(apps.errors).slice(0, 400)); process.exit(1); }
const app = apps.data.findOneApplication;
console.log('variables declared:', app.applicationVariables.map((v) => `${v.key}${v.isSecret ? '(secret)' : ''}`).join(', '));
const secret = (n) => Array.from(crypto.getRandomValues(new Uint8Array(n)), (b) => b.toString(16).padStart(2, '0')).join('');
const values = {
  CRM_BASE_URL: 'http://localhost:3000',
  TEAMS_WEBHOOK_URL: 'http://172.18.0.1:8787/teams/bd-channel',
  SMTP_HOST: '172.18.0.1', SMTP_PORT: '2525', SMTP_USERNAME: 'bd-ops@kuec.test', SMTP_PASSWORD: 'sink', SMTP_FROM: 'bd-ops@kuec.test',
  FORMS_SIGNING_SECRET: secret(32), UVENTURE_SIGNING_SECRET: secret(32), UVENTURE_OUTBOUND_SIGNING_SECRET: secret(32),
  UVENTURE_WEBHOOK_URL: 'http://172.18.0.1:8787/integrations/crm/events',
};
for (const [key, value] of Object.entries(values)) {
  const result = await gql('metadata', 'mutation($k: String!, $v: String!, $a: UUID) { updateOneApplicationVariable(key:$k, value:$v, applicationId:$a) }', { k: key, v: value, a: app.id });
  console.log(key, result.errors ? 'ERROR ' + JSON.stringify(result.errors).slice(0, 200) : 'set');
}
writeFileSync(new URL('../rehearsal/secrets.json', import.meta.url), JSON.stringify({ FORMS_SIGNING_SECRET: values.FORMS_SIGNING_SECRET, UVENTURE_SIGNING_SECRET: values.UVENTURE_SIGNING_SECRET, UVENTURE_OUTBOUND_SIGNING_SECRET: values.UVENTURE_OUTBOUND_SIGNING_SECRET, applicationId: app.id }));
const after = await gql('metadata', '{ findOneApplication(universalIdentifier: "aa97f60d-3af8-4242-bb46-5413d0813bfa") { applicationVariables { key value isSecret } } }');
console.log(JSON.stringify(after.data.findOneApplication.applicationVariables.map((v) => [v.key, v.isSecret ? (v.value ? 'set (masked)' : 'EMPTY') : v.value])));
