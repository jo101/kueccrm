'use client';

import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import type { Decision, Opportunity, Persona, WorkPackage } from '@/data/model';
import { DECISIONS, LEAD_INBOX_COUNT, OPPORTUNITIES, PERSONAS, PROTOTYPE_NOW_ISO, WORK_PACKAGES } from '@/data/seed';

type DecisionOutcome = { kind: 'decided'; optionId: string } | { kind: 'deferred'; untilIso: string };

type WorkPackageWrite =
  | { type: 'accept' }
  | { type: 'decline'; reason: string }
  | { type: 'requestHelp'; question: string }
  | { type: 'submit'; outputLink: string }
  | { type: 'approve' }
  | { type: 'sendBack'; note: string }
  | { type: 'resolveBlocker' }
  | { type: 'reassign'; ownerId: string };

export class BackendWriteFailed extends Error {
  constructor() {
    super('Simulated backend failure: the write was refused and nothing changed.');
    this.name = 'BackendWriteFailed';
  }
}

type PrototypeStoreValue = {
  nowIso: string;
  viewer: Persona;
  personas: Persona[];
  workPackages: WorkPackage[];
  opportunities: Opportunity[];
  decisions: Decision[];
  decisionOutcomes: Record<string, DecisionOutcome>;
  leadInboxCount: number;
  simulateFailure: boolean;
  setSimulateFailure: (value: boolean) => void;
  getPersona: (id: string | null) => Persona | null;
  getOpportunity: (id: string) => Opportunity | null;
  writeWorkPackage: (id: string, write: WorkPackageWrite) => Promise<WorkPackage>;
  writeDecision: (id: string, outcome: DecisionOutcome) => Promise<void>;
};

const PrototypeStoreContext = createContext<PrototypeStoreValue | null>(null);

const WRITE_LATENCY_MS = 700;

const OPS_COORDINATOR_ID = 'ops';

const applyWrite = (workPackage: WorkPackage, write: WorkPackageWrite, nowIso: string): WorkPackage => {
  switch (write.type) {
    case 'accept':
      return { ...workPackage, status: 'ACCEPTED' };
    case 'decline':
      return { ...workPackage, status: 'DECLINED' };
    case 'requestHelp':
      return workPackage;
    case 'submit':
      return { ...workPackage, status: 'SUBMITTED', outputLink: write.outputLink };
    case 'approve':
      return { ...workPackage, status: 'DONE' };
    case 'sendBack':
      return { ...workPackage, status: 'ACCEPTED' };
    case 'resolveBlocker':
      return { ...workPackage, status: 'ACCEPTED', blockedReason: null };
    case 'reassign':
      return { ...workPackage, status: 'OFFERED', ownerId: write.ownerId, offeredAt: nowIso };
  }
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type PrototypeStoreProviderProps = { children: ReactNode };

// In-memory stand-in for Twenty. Every write goes through writeWorkPackage so
// the UI can only show success after the "backend" answered (principle 15).
export const PrototypeStoreProvider = ({ children }: PrototypeStoreProviderProps) => {
  const searchParams = useSearchParams();
  const requestedViewer = searchParams.get('as');
  const viewer = PERSONAS.find((persona) => persona.id === requestedViewer) ?? PERSONAS[0];
  const [workPackages, setWorkPackages] = useState<WorkPackage[]>(WORK_PACKAGES);
  const [decisionOutcomes, setDecisionOutcomes] = useState<Record<string, DecisionOutcome>>({});
  const [simulateFailure, setSimulateFailure] = useState(false);

  const failIfRequested = useCallback(async () => {
    await wait(WRITE_LATENCY_MS);
    if (simulateFailure) {
      setSimulateFailure(false);
      throw new BackendWriteFailed();
    }
  }, [simulateFailure]);

  const writeWorkPackage = useCallback(
    async (id: string, write: WorkPackageWrite): Promise<WorkPackage> => {
      await failIfRequested();
      let updated: WorkPackage | null = null;
      setWorkPackages((current) =>
        current.map((workPackage) => {
          if (workPackage.id !== id) {
            return workPackage;
          }
          updated = applyWrite(workPackage, write, PROTOTYPE_NOW_ISO);

          return updated;
        }),
      );
      const found = workPackages.find((workPackage) => workPackage.id === id);
      if (found === undefined) {
        throw new Error(`Unknown work package ${id}`);
      }

      return updated ?? applyWrite(found, write, PROTOTYPE_NOW_ISO);
    },
    [failIfRequested, workPackages],
  );

  const writeDecision = useCallback(
    async (id: string, outcome: DecisionOutcome): Promise<void> => {
      await failIfRequested();
      setDecisionOutcomes((current) => ({ ...current, [id]: outcome }));
      if (outcome.kind === 'decided') {
        const decision = DECISIONS.find((item) => item.id === id);
        if (decision?.workPackageId && decision.id === 'dec-falcon-lead' && outcome.optionId === 'rohan') {
          setWorkPackages((current) =>
            current.map((workPackage) =>
              workPackage.id === decision.workPackageId
                ? { ...workPackage, status: 'OFFERED', ownerId: 'eng1', offeredAt: PROTOTYPE_NOW_ISO, blockedReason: null }
                : workPackage,
            ),
          );
        }
      }
    },
    [failIfRequested],
  );

  const value = useMemo<PrototypeStoreValue>(
    () => ({
      nowIso: PROTOTYPE_NOW_ISO,
      viewer,
      personas: PERSONAS,
      workPackages,
      opportunities: OPPORTUNITIES,
      decisions: DECISIONS,
      decisionOutcomes,
      leadInboxCount: LEAD_INBOX_COUNT,
      simulateFailure,
      setSimulateFailure,
      getPersona: (id) => PERSONAS.find((persona) => persona.id === id) ?? null,
      getOpportunity: (id) => OPPORTUNITIES.find((opportunity) => opportunity.id === id) ?? null,
      writeWorkPackage,
      writeDecision,
    }),
    [decisionOutcomes, simulateFailure, viewer, workPackages, writeDecision, writeWorkPackage],
  );

  return <PrototypeStoreContext.Provider value={value}>{children}</PrototypeStoreContext.Provider>;
};

export const usePrototypeStore = (): PrototypeStoreValue => {
  const value = useContext(PrototypeStoreContext);
  if (value === null) {
    throw new Error('usePrototypeStore must be used inside PrototypeStoreProvider');
  }

  return value;
};

export const OPS_COORDINATOR_PERSONA_ID = OPS_COORDINATOR_ID;
