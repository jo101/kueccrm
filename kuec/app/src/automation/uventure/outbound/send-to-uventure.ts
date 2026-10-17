import { kv, RetryableLogicFunctionError } from 'twenty-sdk/logic-function';
import { isDefined } from 'twenty-sdk/utils';

import {
  UVENTURE_OUTBOUND_SIGNING_SECRET_VARIABLE,
  UVENTURE_WEBHOOK_URL_VARIABLE,
} from 'src/application.config';
import {
  DELIVERY_HEADER,
  SIGNATURE_HEADER,
  signDelivery,
  TIMESTAMP_HEADER,
} from 'src/automation/intake/verify-signature';
import { type OutboundEvent } from 'src/automation/uventure/outbound/plan-outbound-event';

export type OutboundResult = 'SENT' | 'FAILED' | 'NOT_CONFIGURED';

const outboundKey = (deliveryId: string): string => `uventure:outbound:${deliveryId}`;

export const readOutboundResult = (deliveryId: string): Promise<OutboundResult | null> =>
  kv.get<OutboundResult>(outboundKey(deliveryId));

export const isOutboundConfigured = (): boolean =>
  isDefined(process.env[UVENTURE_WEBHOOK_URL_VARIABLE]) &&
  process.env[UVENTURE_WEBHOOK_URL_VARIABLE] !== '' &&
  isDefined(process.env[UVENTURE_OUTBOUND_SIGNING_SECRET_VARIABLE]) &&
  process.env[UVENTURE_OUTBOUND_SIGNING_SECRET_VARIABLE] !== '';

// Same signature scheme as the routes uVENTURE calls, in the other direction.
// 429, 5xx and network errors retry through the queue; any other answer is
// final and recorded, so the daily repair does not resend it.
export const sendToUventure = async (event: OutboundEvent): Promise<OutboundResult> => {
  if (!isOutboundConfigured()) {
    return 'NOT_CONFIGURED';
  }

  const rawBody = JSON.stringify(event.body);
  const timestamp = String(Math.floor(Date.now() / 1000));
  let response: Response;

  try {
    response = await fetch(process.env[UVENTURE_WEBHOOK_URL_VARIABLE] as string, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        [TIMESTAMP_HEADER]: timestamp,
        [SIGNATURE_HEADER]: signDelivery({
          secret: process.env[UVENTURE_OUTBOUND_SIGNING_SECRET_VARIABLE] as string,
          timestamp,
          rawBody,
        }),
        [DELIVERY_HEADER]: event.deliveryId,
      },
      body: rawBody,
    });
  } catch (error) {
    throw new RetryableLogicFunctionError(
      `uventure send ${event.deliveryId} failed transiently: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  if (response.status === 429 || response.status >= 500) {
    throw new RetryableLogicFunctionError(
      `uventure send ${event.deliveryId} failed transiently: ${response.status}`,
    );
  }

  // 409 means uVENTURE already holds this delivery.
  const result: OutboundResult = response.ok || response.status === 409 ? 'SENT' : 'FAILED';

  if (result === 'FAILED') {
    console.error(`uventure send ${event.deliveryId} failed permanently: ${response.status}`);
  }

  await kv.set(outboundKey(event.deliveryId), result);

  return result;
};
