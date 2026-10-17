import { kv } from 'twenty-sdk/logic-function';
import { isDefined } from 'twenty-sdk/utils';

import { CRM_BASE_URL_VARIABLE } from 'src/application.config';
import {
  dueAtOnDate,
  toDubaiDateString,
} from 'src/automation/dates/business-days';
import {
  createRecord,
  listRecords,
  quoteFilterValues,
  type TwentyApi,
} from 'src/automation/api/twenty-api';
import { buildRecordLink } from 'src/automation/notifications/compose-notification-message';
import { postToTeams } from 'src/automation/notifications/post-to-teams';
import {
  sendEmail,
  type ChannelResult,
} from 'src/automation/notifications/send-email';
import { OBJECT_NAMES } from 'src/automation/records/object-names';
import {
  type NoteRecord,
  type TaskRecord,
  type WorkspaceMemberRecord,
} from 'src/automation/records/record-types';

export type NotificationTarget = {
  objectNameSingular: string;
  recordId: string;
};

export const recordLinkFor = ({
  objectNameSingular,
  recordId,
}: NotificationTarget): string =>
  buildRecordLink(
    process.env[CRM_BASE_URL_VARIABLE] ?? '',
    objectNameSingular,
    recordId,
  );

const capitalize = (value: string): string =>
  `${value.charAt(0).toUpperCase()}${value.slice(1)}`;

// Each channel records that it went out under the escalation's key, so a
// retried run resumes where it stopped instead of sending twice.
const runOnce = async (
  key: string,
  send: () => Promise<ChannelResult | void>,
): Promise<void> => {
  if (isDefined(await kv.get<string>(key))) {
    return;
  }

  const result = await send();

  await kv.set(key, result ?? 'SENT');
};

const targetFieldName = ({ objectNameSingular }: NotificationTarget): string =>
  `target${capitalize(objectNameSingular)}Id`;

// Due today at 17:00 Asia/Dubai unless the rule gives its own due date.
const createTargetedTask = async ({
  api,
  assigneeId,
  title,
  body,
  target,
  now,
  dueAt,
}: {
  api: TwentyApi;
  assigneeId: string | null;
  title: string;
  body: string;
  target: NotificationTarget;
  now: Date;
  dueAt?: string;
}): Promise<void> => {
  const task = await createRecord<TaskRecord>(api.asPerson, OBJECT_NAMES.task, {
    title,
    assigneeId,
    status: 'TODO',
    dueAt: dueAt ?? dueAtOnDate(toDubaiDateString(now)).toISOString(),
    bodyV2: { markdown: body },
  });

  await createRecord(api.asPerson, OBJECT_NAMES.taskTarget, {
    taskId: task.id,
    [targetFieldName(target)]: target.recordId,
  });
};

export const notifyMembers = async ({
  api,
  memberIds,
  message,
  taskTitle,
  target,
  dedupeKey,
  now,
}: {
  api: TwentyApi;
  memberIds: (string | null | undefined)[];
  message: string;
  taskTitle: string;
  target: NotificationTarget;
  dedupeKey: string;
  now: Date;
}): Promise<string[]> => {
  const recipientIds = [...new Set(memberIds.filter(isDefined))];

  if (recipientIds.length === 0) {
    console.warn(`notification ${dedupeKey} has no recipient: ${message}`);

    return [];
  }

  const members = await listRecords<WorkspaceMemberRecord>(
    api.asApplication,
    OBJECT_NAMES.workspaceMember,
    `id[in]:${quoteFilterValues(recipientIds)}`,
  );

  for (const recipientId of recipientIds) {
    await runOnce(`notify:${dedupeKey}:${recipientId}:task`, () =>
      createTargetedTask({
        api,
        assigneeId: recipientId,
        title: taskTitle,
        body: message,
        target,
        now,
      }),
    );

    const email = members.find(({ id }) => id === recipientId)?.userEmail;

    await runOnce(`notify:${dedupeKey}:${recipientId}:email`, async () =>
      isDefined(email) && email !== ''
        ? sendEmail({ to: email, subject: taskTitle, text: message })
        : 'SKIPPED',
    );
  }

  console.log(`notified ${recipientIds.join(', ')}: ${message}`);

  return recipientIds;
};

// For a notice about the system rather than a record, such as a feed that has
// gone quiet: a Task with no record attached, and the email.
export const notifyMemberAboutSystem = async ({
  api,
  memberId,
  message,
  details,
  taskTitle,
  dedupeKey,
  now,
}: {
  api: TwentyApi;
  memberId: string | null;
  message: string;
  details?: string;
  taskTitle: string;
  dedupeKey: string;
  now: Date;
}): Promise<void> => {
  const body = isDefined(details) ? `${message}\n\n${details}` : message;

  if (!isDefined(memberId)) {
    console.warn(`notification ${dedupeKey} has no recipient: ${message}`);

    return;
  }

  await runOnce(`notify:${dedupeKey}:${memberId}:task`, async () => {
    await createRecord<TaskRecord>(api.asApplication, OBJECT_NAMES.task, {
      title: taskTitle,
      assigneeId: memberId,
      status: 'TODO',
      dueAt: dueAtOnDate(toDubaiDateString(now)).toISOString(),
      bodyV2: { markdown: body },
    });
  });

  const [member] = await listRecords<WorkspaceMemberRecord>(
    api.asApplication,
    OBJECT_NAMES.workspaceMember,
    `id[eq]:"${memberId}"`,
  );

  await runOnce(`notify:${dedupeKey}:${memberId}:email`, async () =>
    isDefined(member?.userEmail) && member.userEmail !== ''
      ? sendEmail({ to: member.userEmail, subject: taskTitle, text: body })
      : 'SKIPPED',
  );
};

export const postToTeamsOnce = async ({
  dedupeKey,
  line,
}: {
  dedupeKey: string;
  line: string;
}): Promise<void> =>
  runOnce(`teams:${dedupeKey}`, () => postToTeams(line));

export const createTaskOnce = async ({
  dedupeKey,
  ...task
}: Parameters<typeof createTargetedTask>[0] & {
  dedupeKey: string;
}): Promise<void> => runOnce(`task:${dedupeKey}`, () => createTargetedTask(task));

// Written as the app: a note is the app's record of what happened, and not
// every role that can trigger one writes notes on every target.
export const createNoteOnce = async ({
  api,
  title,
  body,
  targets,
  dedupeKey,
}: {
  api: TwentyApi;
  title: string;
  body: string;
  targets: NotificationTarget[];
  dedupeKey: string;
}): Promise<void> =>
  runOnce(`note:${dedupeKey}`, async () => {
    const note = await createRecord<NoteRecord>(api.asApplication, OBJECT_NAMES.note, {
      title,
      bodyV2: { markdown: body },
    });

    for (const target of targets) {
      await createRecord(api.asApplication, OBJECT_NAMES.noteTarget, {
        noteId: note.id,
        [targetFieldName(target)]: target.recordId,
      });
    }
  });
