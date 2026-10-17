// Notification sinks for the rehearsal: SMTP on 2525 and an HTTP stub on 8787 (Teams webhook and uVENTURE endpoint).
// Every message is appended as one JSON line to sinks.log.
import { SMTPServer } from 'smtp-server';
import { simpleParser } from 'mailparser';
import { createServer } from 'node:http';
import { appendFileSync } from 'node:fs';
const LOG = new URL('./sinks.log', import.meta.url).pathname;
const log = (entry) => appendFileSync(LOG, JSON.stringify({ at: new Date().toISOString(), ...entry }) + '\n');
let teamsStatus = 200;
new SMTPServer({
  authOptional: true, secure: false, disabledCommands: ['STARTTLS'],
  onAuth: (auth, session, cb) => cb(null, { user: auth.username }),
  onData: (stream, session, cb) => {
    simpleParser(stream).then((mail) => {
      log({ channel: 'email', to: mail.to?.text, from: mail.from?.text, subject: mail.subject, text: mail.text?.slice(0, 400) });
      cb();
    }).catch(cb);
  },
}).listen(2525, '0.0.0.0');
createServer((req, res) => {
  let body = '';
  req.on('data', (chunk) => { body += chunk; });
  req.on('end', () => {
    if (req.url === '/control/teams-status') { teamsStatus = Number(body); res.end('ok'); return; }
    const channel = req.url.startsWith('/teams') ? 'teams' : req.url.startsWith('/integrations/crm/events') ? 'uventure' : 'http';
    log({ channel, path: req.url, headers: { 'x-kuec-delivery': req.headers['x-kuec-delivery'], 'x-kuec-signature': req.headers['x-kuec-signature'] ? 'present' : undefined }, body: body.slice(0, 1500) });
    res.writeHead(channel === 'teams' ? teamsStatus : 202, { 'content-type': 'application/json' });
    res.end('{}');
  });
}).listen(8787, '0.0.0.0');
console.log('sinks up');
