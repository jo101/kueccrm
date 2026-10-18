'use client';

import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react';

import type { Account, Activity, ActivityKind, Bilingual, Contact, Decision, Document, Opportunity, OpportunityStage, Persona, Task } from '@/data/model';
import { STAGE_PROBABILITY } from '@/data/model';
import { ACCOUNTS, ACTIVITIES, CONTACTS, DECISIONS, DOCUMENTS, LEAD_INBOX_COUNT, OPPORTUNITIES, PERSONAS, TARGETS, TASKS, WORKBENCH_NOW_ISO } from '@/data/seed';
import { getNextStage } from '@/store/rules';

export type DecisionOutcome = { kind: 'decided'; optionId: string } | { kind: 'deferred'; untilIso: string };

export type TaskWrite =
  | { type: 'accept' }
  | { type: 'decline'; reason: string }
  | { type: 'requestHelp'; question: string }
  | { type: 'submit'; outputLink: string }
  | { type: 'complete'; outputLink: string }
  | { type: 'approve' }
  | { type: 'sendBack'; note: string }
  | { type: 'block'; reason: Bilingual }
  | { type: 'resume' }
  | { type: 'reassign'; ownerId: string };

export type OpportunityWrite =
  | { type: 'setNextStep'; nextStep: Bilingual; nextStepDate: string }
  | { type: 'markStageComplete' }
  | { type: 'logActivity'; kind: ActivityKind; summary: Bilingual; contactIds: string[] };

export type NewTaskInput = {
  opportunityId: string;
  title: string;
  ownerId: string;
  dueAt: string;
  doneCriteria: string;
};

export class BackendWriteFailed extends Error {
  constructor() {
    super('Simulated backend failure: the write was refused and nothing changed.');
    this.name = 'BackendWriteFailed';
  }
}

type WorkbenchStoreValue = {
  nowIso: string;
  viewer: Persona;
  personas: Persona[];
  accounts: Account[];
  contacts: Contact[];
  tasks: Task[];
  opportunities: Opportunity[];
  activities: Activity[];
  documents: Document[];
  decisions: Decision[];
  decisionOutcomes: Record<string, DecisionOutcome>;
  leadInboxCount: number;
  quarterTargetAed: number;
  simulateFailure: boolean;
  setSimulateFailure: (value: boolean) => void;
  getPersona: (id: string | null) => Persona | null;
  getAccount: (id: string) => Account | null;
  getContact: (id: string) => Contact | null;
  getOpportunity: (id: string) => Opportunity | null;
  getTask: (id: string) => Task | null;
  writeTask: (id: string, write: TaskWrite) => Promise<Task>;
  createTask: (input: NewTaskInput) => Promise<Task>;
  writeOpportunity: (id: string, write: OpportunityWrite) => Promise<Opportunity>;
  writeDecision: (id: string, outcome: DecisionOutcome) => Promise<void>;
};

const WorkbenchStoreContext = createContext<WorkbenchStoreValue | null>(null);

const WRITE_LATENCY_MS = 600;

export const OPS_COORDINATOR_PERSONA_ID = 'ops';

const applyTaskWrite = (task: Task, write: TaskWrite, nowIso: string): Task => {
  switch (write.type) {
    case 'accept':
      return { ...task, status: 'ACCEPTED' };
    case 'decline':
      return { ...task, status: 'DECLINED' };
    case 'requestHelp':
      return task;
    case 'submit':
      return { ...task, status: 'SUBMITTED', outputLink: write.outputLink };
    case 'complete':
      return { ...task, status: 'DONE', outputLink: write.outputLink };
    case 'approve':
      return { ...task, status: 'DONE' };
    case 'sendBack':
      return { ...task, status: 'ACCEPTED' };
    case 'block':
      return { ...task, status: 'BLOCKED', blockedReason: write.reason };
    case 'resume':
      return { ...task, status: 'ACCEPTED', blockedReason: null };
    case 'reassign':
      return { ...task, status: 'OFFERED', ownerId: write.ownerId, offeredAt: nowIso };
  }
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type WorkbenchStoreProviderProps = {
  viewerId: string;
  children: ReactNode;
  initialTasks?: Task[];
  initialOpportunities?: Opportunity[];
};

// In-memory stand-in for Twenty. Every write goes through writeTask or
// writeOpportunity so the UI can only show success after the "backend"
// answered: a backend failure is never shown as success.
export const WorkbenchStoreProvider = ({ viewerId, children, initialTasks = TASKS, initialOpportunities = OPPORTUNITIES }: WorkbenchStoreProviderProps) => {
  const viewer = PERSONAS.find((persona) => persona.id === viewerId) ?? PERSONAS[0];
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(initialOpportunities);
  const [activities, setActivities] = useState<Activity[]>(ACTIVITIES);
  const [decisionOutcomes, setDecisionOutcomes] = useState<Record<string, DecisionOutcome>>({});
  const [simulateFailure, setSimulateFailure] = useState(false);

  const failIfRequested = useCallback(async () => {
    await wait(WRITE_LATENCY_MS);
    if (simulateFailure) {
      setSimulateFailure(false);
      throw new BackendWriteFailed();
    }
  }, [simulateFailure]);

  const writeTask = useCallback(
    async (id: string, write: TaskWrite): Promise<Task> => {
      await failIfRequested();
      const current = tasks.find((task) => task.id === id);
      if (current === undefined) {
        throw new Error(`Unknown task ${id}`);
      }
      const updated = applyTaskWrite(current, write, WORKBENCH_NOW_ISO);
      setTasks((list) => list.map((task) => (task.id === id ? updated : task)));

      return updated;
    },
    [failIfRequested, tasks],
  );

  const createTask = useCallback(
    async (input: NewTaskInput): Promise<Task> => {
      await failIfRequested();
      const siblings = tasks.filter((task) => task.opportunityId === input.opportunityId);
      const created: Task = {
        id: `task-${Date.now()}`,
        title: { en: input.title, ar: input.title },
        opportunityId: input.opportunityId,
        ownerId: input.ownerId,
        reviewerId: viewer.id === input.ownerId ? null : viewer.id,
        status: 'OFFERED',
        dueAt: input.dueAt,
        offeredAt: WORKBENCH_NOW_ISO,
        stepNumber: siblings.length + 1,
        stepTotal: siblings.length + 1,
        objective: { en: input.title, ar: input.title },
        context: { en: '', ar: '' },
        expectedOutput: { en: '', ar: '' },
        doneCriteria: [{ en: input.doneCriteria, ar: input.doneCriteria }],
        blockedReason: null,
        outputLink: null,
      };
      setTasks((list) => [...list, created]);
      setActivities((list) => [
        { id: `act-${Date.now()}`, kind: 'SYSTEM', opportunityId: input.opportunityId, at: WORKBENCH_NOW_ISO, byId: null, summary: { en: `Task "${input.title}" assigned.`, ar: `أُسندت مهمة "${input.title}".` }, contactIds: [] },
        ...list,
      ]);

      return created;
    },
    [failIfRequested, tasks, viewer.id],
  );

  const writeOpportunity = useCallback(
    async (id: string, write: OpportunityWrite): Promise<Opportunity> => {
      await failIfRequested();
      const current = opportunities.find((opportunity) => opportunity.id === id);
      if (current === undefined) {
        throw new Error(`Unknown opportunity ${id}`);
      }
      let updated = current;
      if (write.type === 'setNextStep') {
        updated = { ...current, nextStep: write.nextStep, nextStepDate: write.nextStepDate };
      }
      if (write.type === 'markStageComplete') {
        const next: OpportunityStage | null = getNextStage(current.stage);
        if (next !== null) {
          updated = { ...current, stage: next, stageEnteredAt: WORKBENCH_NOW_ISO, probability: STAGE_PROBABILITY[next], forecastCategory: next === 'SIGNED' ? 'CLOSED' : current.forecastCategory };
        }
      }
      if (write.type === 'logActivity') {
        setActivities((list) => [
          { id: `act-${Date.now()}`, kind: write.kind, opportunityId: id, at: WORKBENCH_NOW_ISO, byId: viewer.id, summary: write.summary, contactIds: write.contactIds },
          ...list,
        ]);
      }
      setOpportunities((list) => list.map((opportunity) => (opportunity.id === id ? updated : opportunity)));

      return updated;
    },
    [failIfRequested, opportunities, viewer.id],
  );

  const writeDecision = useCallback(
    async (id: string, outcome: DecisionOutcome): Promise<void> => {
      await failIfRequested();
      setDecisionOutcomes((current) => ({ ...current, [id]: outcome }));
      if (outcome.kind === 'decided') {
        const decision = DECISIONS.find((item) => item.id === id);
        if (decision?.taskId && decision.id === 'dec-falcon-lead' && outcome.optionId === 'rohan') {
          setTasks((current) =>
            current.map((task) => (task.id === decision.taskId ? { ...task, status: 'OFFERED', ownerId: 'eng1', offeredAt: WORKBENCH_NOW_ISO, blockedReason: null } : task)),
          );
        }
      }
    },
    [failIfRequested],
  );

  const value = useMemo<WorkbenchStoreValue>(
    () => ({
      nowIso: WORKBENCH_NOW_ISO,
      viewer,
      personas: PERSONAS,
      accounts: ACCOUNTS,
      contacts: CONTACTS,
      tasks,
      opportunities,
      activities,
      documents: DOCUMENTS,
      decisions: DECISIONS,
      decisionOutcomes,
      leadInboxCount: LEAD_INBOX_COUNT,
      quarterTargetAed: TARGETS.quarterTargetAed,
      simulateFailure,
      setSimulateFailure,
      getPersona: (id) => PERSONAS.find((persona) => persona.id === id) ?? null,
      getAccount: (id) => ACCOUNTS.find((account) => account.id === id) ?? null,
      getContact: (id) => CONTACTS.find((contact) => contact.id === id) ?? null,
      getOpportunity: (id) => opportunities.find((opportunity) => opportunity.id === id) ?? null,
      getTask: (id) => tasks.find((task) => task.id === id) ?? null,
      writeTask,
      createTask,
      writeOpportunity,
      writeDecision,
    }),
    [activities, createTask, decisionOutcomes, opportunities, simulateFailure, tasks, viewer, writeDecision, writeOpportunity, writeTask],
  );

  return <WorkbenchStoreContext.Provider value={value}>{children}</WorkbenchStoreContext.Provider>;
};

export const useWorkbenchStore = (): WorkbenchStoreValue => {
  const value = useContext(WorkbenchStoreContext);
  if (value === null) {
    throw new Error('useWorkbenchStore must be used inside WorkbenchStoreProvider');
  }

  return value;
};
