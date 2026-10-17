import { defineLogicFunction } from 'twenty-sdk/define';
import { isDefined } from 'twenty-sdk/utils';

import {
  CRM_BASE_URL_VARIABLE,
  UVENTURE_SIGNING_SECRET_VARIABLE,
} from 'src/application.config';
import { loadAutomationContext } from 'src/automation/api/load-automation-context';
import { createTwentyApi, listRecords } from 'src/automation/api/twenty-api';
import { toDubaiDateString } from 'src/automation/dates/business-days';
import { NOTIFICATION_MESSAGES } from 'src/automation/notifications/notification-messages';
import { notifyMemberAboutSystem } from 'src/automation/notifications/notify';
import { OBJECT_NAMES } from 'src/automation/records/object-names';
import {
  type EngagementRecord,
  type LeadRecord,
  type OpportunityRecord,
} from 'src/automation/records/record-types';
import { enqueueOutbound } from 'src/automation/uventure/outbound/enqueue-outbound';
import {
  outboundDeliveryId,
  type OutboundSubject,
  UVENTURE_OUTBOUND_EVENT_TYPE,
} from 'src/automation/uventure/outbound/plan-outbound-event';
import {
  isOutboundConfigured,
  readOutboundResult,
} from 'src/automation/uventure/outbound/send-to-uventure';
import {
  isFeedSilent,
  readLastCompleteRun,
} from 'src/automation/uventure/uventure-run-ledger';
import { OPPORTUNITY_STAGE } from 'src/constants/opportunity-stage';
import { OPPORTUNITY_OFFERING } from 'src/fields/offering-on-opportunity.field';
import { OPPORTUNITY_PLAYBOOK_TYPE } from 'src/fields/playbook-type-on-opportunity.field';
import { LEAD_STATUS } from 'src/objects/lead.object';
import { UVENTURE_OUTBOUND_JOB_UNIVERSAL_IDENTIFIER } from 'src/logic-functions/uventure-outbound-job';

export const UVENTURE_SWEEP_UNIVERSAL_IDENTIFIER = 'd8b03114-4c81-46a1-a54f-a3d23d54bca0';

// Older records are left to uVENTURE's nightly read (runbooks/21-uventure-readiness.md section 4.4).
const OUTBOUND_REPAIR_WINDOW_DAYS = 30;

type SubjectWithDelivery = OutboundSubject & { deliveryId: string };

const withDeliveryId = (subject: OutboundSubject, deliveryRecordId = subject.recordId): SubjectWithDelivery => ({
  ...subject,
  deliveryId: outboundDeliveryId({ ...subject, recordId: deliveryRecordId }),
});

// The guarantee behind the fast paths: the nightly snapshot watchdog, and a
// resend of every Twenty to uVENTURE event of the last 30 days that uVENTURE
// has not acknowledged, derived from record state alone.
const handler = async () => {
  const api = createTwentyApi();
  const now = new Date();
  let watchdog = 'feed not configured';

  if (isDefined(process.env[UVENTURE_SIGNING_SECRET_VARIABLE]) && process.env[UVENTURE_SIGNING_SECRET_VARIABLE] !== '') {
    const lastComplete = await readLastCompleteRun();

    watchdog = lastComplete?.completedAt ?? 'never';

    if (isFeedSilent(lastComplete, now)) {
      const context = await loadAutomationContext(api);

      await notifyMemberAboutSystem({
        api,
        memberId: context.opsCoordinatorMemberId ?? context.edMemberId,
        message: NOTIFICATION_MESSAGES.uventureFeedSilent({
          subject: lastComplete?.completedAt ?? 'never',
          link: `${(process.env[CRM_BASE_URL_VARIABLE] ?? '').replace(/\/+$/, '')}/objects/capabilities`,
        }),
        taskTitle: 'uVENTURE feed silent',
        dedupeKey: `uventure-watchdog:${toDubaiDateString(now)}`,
        now,
      });
    }
  }

  if (!isOutboundConfigured()) {
    console.log(`uventure sweep: last complete snapshot ${watchdog}; outbound not configured`);

    return { watchdog, resent: 0 };
  }

  const since = new Date(now.getTime() - OUTBOUND_REPAIR_WINDOW_DAYS * 86_400_000).toISOString();
  const [licences, leads, engagements] = await Promise.all([
    listRecords<OpportunityRecord>(
      api.asApplication,
      OBJECT_NAMES.opportunity,
      `and(stage[eq]:${OPPORTUNITY_STAGE.SIGNED},playbookType[eq]:${OPPORTUNITY_PLAYBOOK_TYPE.TECHNOLOGY_LICENSING},updatedAt[gte]:"${since}")`,
    ),
    listRecords<LeadRecord>(
      api.asApplication,
      OBJECT_NAMES.lead,
      `and(status[eq]:${LEAD_STATUS.CONVERTED},updatedAt[gte]:"${since}")`,
    ),
    listRecords<EngagementRecord & { capabilityId: string | null }>(
      api.asApplication,
      OBJECT_NAMES.engagement,
      `and(capabilityId[is]:NOT_NULL,updatedAt[gte]:"${since}")`,
    ),
  ]);
  const candidates: SubjectWithDelivery[] = [
    ...licences.map(({ id }) =>
      withDeliveryId({ type: UVENTURE_OUTBOUND_EVENT_TYPE.LICENCE_OPPORTUNITY_SIGNED, recordId: id }),
    ),
    ...leads
      .filter(({ offeringInterest }) => (offeringInterest ?? []).includes(OPPORTUNITY_OFFERING.IP_LICENCE))
      .map(({ id }) =>
        withDeliveryId({ type: UVENTURE_OUTBOUND_EVENT_TYPE.LEAD_CONVERTED_IP_LICENCE, recordId: id }),
      ),
    ...engagements.map(({ id, capabilityId }) =>
      withDeliveryId(
        { type: UVENTURE_OUTBOUND_EVENT_TYPE.ENGAGEMENT_ON_TECHNOLOGY, recordId: id },
        `${id}-${capabilityId}`,
      ),
    ),
  ];
  const unsent: SubjectWithDelivery[] = [];

  for (const candidate of candidates) {
    if ((await readOutboundResult(candidate.deliveryId)) !== 'SENT') {
      unsent.push(candidate);
    }
  }

  const resent = await enqueueOutbound({
    jobUniversalIdentifier: UVENTURE_OUTBOUND_JOB_UNIVERSAL_IDENTIFIER,
    subjects: unsent,
    jobIdSuffix: `sweep-${toDubaiDateString(now)}`,
  });

  console.log(
    `uventure sweep: last complete snapshot ${watchdog}; ${candidates.length} outbound candidates, ${resent} queued again`,
  );

  return { watchdog, resent };
};

export default defineLogicFunction({
  universalIdentifier: UVENTURE_SWEEP_UNIVERSAL_IDENTIFIER,
  name: 'uventure-sweep',
  description:
    'Daily: a Task for the ops coordinator when no complete uVENTURE snapshot arrived in 26 hours, and a resend of every unacknowledged Twenty to uVENTURE event of the last 30 days',
  timeoutSeconds: 300,
  handler,
  cronTriggerSettings: {
    // 07:40 Asia/Dubai, after the 01:00 snapshot and before the working day
    pattern: '40 3 * * *',
  },
});
