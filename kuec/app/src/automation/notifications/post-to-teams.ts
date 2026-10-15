import { RetryableLogicFunctionError } from 'twenty-sdk/logic-function';
import { isDefined } from 'twenty-sdk/utils';

import { TEAMS_WEBHOOK_URL_VARIABLE } from 'src/application.config';
import { type ChannelResult } from 'src/automation/notifications/send-email';

// Carries both a plain `text` (classic connectors) and an Adaptive Card
// (Teams workflow webhooks), so either kind of incoming webhook accepts it.
const buildTeamsMessage = (line: string) => ({
  type: 'message',
  text: line,
  attachments: [
    {
      contentType: 'application/vnd.microsoft.card.adaptive',
      content: {
        $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
        type: 'AdaptiveCard',
        version: '1.4',
        body: [{ type: 'TextBlock', text: line, wrap: true }],
      },
    },
  ],
});

export const postToTeams = async (line: string): Promise<ChannelResult> => {
  const webhookUrl = process.env[TEAMS_WEBHOOK_URL_VARIABLE];

  if (!isDefined(webhookUrl) || webhookUrl === '') {
    console.log('teams post skipped: webhook URL not configured');

    return 'SKIPPED';
  }

  let response: Response;

  try {
    response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildTeamsMessage(line)),
    });
  } catch (error) {
    throw new RetryableLogicFunctionError(
      `teams post failed transiently: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  if (response.status === 429 || response.status >= 500) {
    throw new RetryableLogicFunctionError(
      `teams post failed transiently: ${response.status}`,
    );
  }

  if (!response.ok) {
    console.error(`teams post failed permanently: ${response.status}`);

    return 'FAILED';
  }

  return 'SENT';
};
