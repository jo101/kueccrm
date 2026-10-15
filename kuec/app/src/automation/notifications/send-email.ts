import { createTransport } from 'nodemailer';
import { RetryableLogicFunctionError } from 'twenty-sdk/logic-function';
import { isDefined } from 'twenty-sdk/utils';

import {
  SMTP_FROM_VARIABLE,
  SMTP_HOST_VARIABLE,
  SMTP_PASSWORD_VARIABLE,
  SMTP_PORT_VARIABLE,
  SMTP_USERNAME_VARIABLE,
} from 'src/application.config';

export type ChannelResult = 'SENT' | 'SKIPPED' | 'FAILED';

const DEFAULT_SMTP_PORT = 587;
const IMPLICIT_TLS_PORT = 465;

type SmtpError = Error & { responseCode?: number; code?: string };

export const sendEmail = async ({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}): Promise<ChannelResult> => {
  const host = process.env[SMTP_HOST_VARIABLE];
  const from = process.env[SMTP_FROM_VARIABLE];

  if (!isDefined(host) || host === '' || !isDefined(from) || from === '') {
    console.log('email skipped: SMTP host or sender address not configured');

    return 'SKIPPED';
  }

  const port = Number(process.env[SMTP_PORT_VARIABLE] || DEFAULT_SMTP_PORT);
  const transport = createTransport({
    host,
    port,
    secure: port === IMPLICIT_TLS_PORT,
    requireTLS: port !== IMPLICIT_TLS_PORT,
    auth: {
      user: process.env[SMTP_USERNAME_VARIABLE],
      pass: process.env[SMTP_PASSWORD_VARIABLE],
    },
  });

  try {
    await transport.sendMail({ from, to, subject, text });

    return 'SENT';
  } catch (error) {
    const smtpError = error as SmtpError;

    // A 5xx reply (bad address, auth refused) will not succeed on retry; a lost
    // connection or a 4xx reply might.
    if (isDefined(smtpError.responseCode) && smtpError.responseCode >= 500) {
      console.error(
        `email to ${to} failed permanently: ${smtpError.responseCode} ${smtpError.message}`,
      );

      return 'FAILED';
    }

    throw new RetryableLogicFunctionError(
      `email to ${to} failed transiently: ${smtpError.code ?? ''} ${smtpError.message}`,
    );
  } finally {
    transport.close();
  }
};
