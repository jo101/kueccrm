import { defineApplication, FieldType } from 'twenty-sdk/define';

export const APPLICATION_UNIVERSAL_IDENTIFIER = 'aa97f60d-3af8-4242-bb46-5413d0813bfa';

export const TEAMS_WEBHOOK_URL_VARIABLE = 'TEAMS_WEBHOOK_URL';
export const SMTP_HOST_VARIABLE = 'SMTP_HOST';
export const SMTP_PORT_VARIABLE = 'SMTP_PORT';
export const SMTP_USERNAME_VARIABLE = 'SMTP_USERNAME';
export const SMTP_PASSWORD_VARIABLE = 'SMTP_PASSWORD';
export const SMTP_FROM_VARIABLE = 'SMTP_FROM';
export const CRM_BASE_URL_VARIABLE = 'CRM_BASE_URL';
export const LEAD_ED_VALUE_THRESHOLD_VARIABLE = 'LEAD_ED_VALUE_THRESHOLD';
export const FORMS_SIGNING_SECRET_VARIABLE = 'FORMS_SIGNING_SECRET';
export const FORMS_SIGNING_SECRET_PREVIOUS_VARIABLE = 'FORMS_SIGNING_SECRET_PREVIOUS';
export const UVENTURE_SIGNING_SECRET_VARIABLE = 'UVENTURE_SIGNING_SECRET';
export const UVENTURE_SIGNING_SECRET_PREVIOUS_VARIABLE = 'UVENTURE_SIGNING_SECRET_PREVIOUS';
export const UVENTURE_WEBHOOK_URL_VARIABLE = 'UVENTURE_WEBHOOK_URL';
export const UVENTURE_OUTBOUND_SIGNING_SECRET_VARIABLE = 'UVENTURE_OUTBOUND_SIGNING_SECRET';
export const CRM_PACK_ENABLED_VARIABLE = 'CRM_PACK_ENABLED';
export const PM_PACK_ENABLED_VARIABLE = 'PM_PACK_ENABLED';
export const GTM_PACK_ENABLED_VARIABLE = 'GTM_PACK_ENABLED';

export default defineApplication({
  universalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
  displayName: 'KUEC BD Ops',
  description:
    'Work management for the KUEC BD team: playbooks, work packages, escalations',
  applicationVariables: {
    [CRM_BASE_URL_VARIABLE]: {
      universalIdentifier: '62e4d839-fdf0-4933-a0e8-0793c633a8f1',
      label: 'CRM base URL',
      description:
        'Public URL of this Twenty instance, used to build record links in notifications, e.g. https://crm.uventure.kuec.example',
      type: FieldType.TEXT,
      isSecret: false,
      isRequired: true,
    },
    [TEAMS_WEBHOOK_URL_VARIABLE]: {
      universalIdentifier: 'ebfffa5c-d7dc-44dc-8862-179ff17262da',
      label: 'Teams incoming webhook URL',
      description:
        'Incoming webhook of the BD Teams channel. Anyone holding it can post to the channel.',
      type: FieldType.TEXT,
      isSecret: true,
      isRequired: false,
    },
    [SMTP_HOST_VARIABLE]: {
      universalIdentifier: '94cdb720-7608-43b1-908b-b2fa1863aedc',
      label: 'SMTP host',
      description: 'SMTP server of the bd-ops mailbox, e.g. smtp.office365.com',
      type: FieldType.TEXT,
      isSecret: false,
      isRequired: false,
    },
    [SMTP_PORT_VARIABLE]: {
      universalIdentifier: 'ca996981-5514-457f-98f8-43028d234012',
      label: 'SMTP port',
      description: '587 for STARTTLS, 465 for implicit TLS',
      type: FieldType.NUMBER,
      isSecret: false,
      value: 587,
    },
    [SMTP_USERNAME_VARIABLE]: {
      universalIdentifier: 'fd0fcb37-d987-45df-a25d-2e626a8e0196',
      label: 'SMTP username',
      description: 'Sign-in name of the shared bd-ops mailbox',
      type: FieldType.TEXT,
      isSecret: true,
      isRequired: false,
    },
    [SMTP_PASSWORD_VARIABLE]: {
      universalIdentifier: '1a293697-1a1e-43fb-b929-2a3105732f4b',
      label: 'SMTP password',
      description: 'Password or app password of the shared bd-ops mailbox',
      type: FieldType.TEXT,
      isSecret: true,
      isRequired: false,
    },
    [SMTP_FROM_VARIABLE]: {
      universalIdentifier: '8f93682d-1432-42cb-a10b-6cac6fb2b316',
      label: 'Sender address',
      description: 'From address of automation emails, e.g. bd-ops@kuec.example',
      type: FieldType.TEXT,
      isSecret: false,
      isRequired: false,
    },
    [LEAD_ED_VALUE_THRESHOLD_VARIABLE]: {
      universalIdentifier: '771a44aa-70b1-43d1-bc6a-d43a4f50c61f',
      label: 'Lead value that notifies the ED',
      description:
        'A qualified lead whose estimated value is above this amount (AED) notifies the ED (L4). Empty: only IP licence interest does.',
      type: FieldType.NUMBER,
      isSecret: false,
      isRequired: false,
    },
    [FORMS_SIGNING_SECRET_VARIABLE]: {
      universalIdentifier: '7b2adce0-14cc-494c-ba3b-ee4c534c9317',
      label: 'Forms signing secret',
      description:
        'Shared secret the website, gala QR and workshop sign-up forms sign each delivery to the lead intake route with (HMAC-SHA256)',
      type: FieldType.TEXT,
      isSecret: true,
      isRequired: false,
    },
    [FORMS_SIGNING_SECRET_PREVIOUS_VARIABLE]: {
      universalIdentifier: '8ccb0f9b-b3c1-4e85-8662-59866e633ecc',
      label: 'Forms signing secret (previous)',
      description:
        'The secret before the last rotation, still accepted for a week so the forms can switch over',
      type: FieldType.TEXT,
      isSecret: true,
      isRequired: false,
    },
    [UVENTURE_SIGNING_SECRET_VARIABLE]: {
      universalIdentifier: '53ad5d18-2913-4bb2-a05d-94ee88613cb4',
      label: 'uVENTURE signing secret',
      description:
        'Shared secret uVENTURE signs each delivery to the uVENTURE route with (HMAC-SHA256). Empty: the route answers 503 and nothing comes in.',
      type: FieldType.TEXT,
      isSecret: true,
      isRequired: false,
    },
    [UVENTURE_SIGNING_SECRET_PREVIOUS_VARIABLE]: {
      universalIdentifier: '1dff3502-7ca7-48cd-9867-48ef5f5162f4',
      label: 'uVENTURE signing secret (previous)',
      description:
        'The uVENTURE secret before the last rotation, still accepted for a week so uVENTURE can switch over',
      type: FieldType.TEXT,
      isSecret: true,
      isRequired: false,
    },
    [UVENTURE_WEBHOOK_URL_VARIABLE]: {
      universalIdentifier: 'b8b18a77-63a4-495a-86a6-8594fc1d43ac',
      label: 'uVENTURE webhook URL',
      description:
        'Where Twenty sends signed licence, conversion and engagement events, e.g. https://uventure.kuec.example/integrations/crm/events. Empty: nothing is sent and uVENTURE relies on its nightly read.',
      type: FieldType.TEXT,
      isSecret: false,
      isRequired: false,
    },
    [UVENTURE_OUTBOUND_SIGNING_SECRET_VARIABLE]: {
      universalIdentifier: 'c8be831f-dda1-4548-ae4f-0acfe073c072',
      label: 'uVENTURE outbound signing secret',
      description:
        'Secret Twenty signs each event it sends to uVENTURE with (HMAC-SHA256); a different secret from the inbound one',
      type: FieldType.TEXT,
      isSecret: true,
      isRequired: false,
    },
    [CRM_PACK_ENABLED_VARIABLE]: {
      universalIdentifier: '647f1768-8691-43d1-923e-b84ddd2c774e',
      label: 'CRM pack on',
      description:
        'Lead contact times, auto-closing quiet leads, referral credit and stage exit checks. Off: those automations stand down; views and tabs stay.',
      type: FieldType.BOOLEAN,
      isSecret: false,
      value: true,
    },
    [PM_PACK_ENABLED_VARIABLE]: {
      universalIdentifier: '24b0e64c-db47-4ba7-a0b5-8dd6e2d3e58c',
      label: 'PM pack on',
      description:
        'RAID log note on each new project and the Monday weekly review task. Off: those automations stand down; views and tabs stay.',
      type: FieldType.BOOLEAN,
      isSecret: false,
      value: true,
    },
    [GTM_PACK_ENABLED_VARIABLE]: {
      universalIdentifier: 'c057e6d5-e541-4f07-bad5-888f590b907e',
      label: 'GTM pack on',
      description:
        'Campaign target lists built from the registry and target status kept in step with campaign leads. Off: that automation stands down; views and tabs stay.',
      type: FieldType.BOOLEAN,
      isSecret: false,
      value: true,
    },
  },
});
