import { normaliseText } from './normalise.ts';
import {
  type SelectField,
  TARGET_SELECT_VALUES,
  VALUE_SYNONYMS,
} from './target-values.ts';

export type ValueOverride = { field: string; sourceValue: string; targetValue: string };

export type ValueMappingMethod =
  | 'exact'
  | 'synonym'
  | 'value-map.csv'
  | 'title rule'
  | 'unmapped';

export type ValueMappingUsage = {
  field: SelectField;
  sourceValue: string;
  targetValue: string | null;
  method: ValueMappingMethod;
  rows: number;
};

export type ValueMapper = {
  map: (field: SelectField, sourceValue: string) => string | null;
  mapDecisionRole: (jobTitle: string) => string | null;
  usage: () => ValueMappingUsage[];
};

export const createValueMapper = (overrides: ValueOverride[]): ValueMapper => {
  const usageByKey = new Map<string, ValueMappingUsage>();
  const overrideByKey = new Map(
    overrides.map((override) => [
      `${override.field}|${normaliseText(override.sourceValue)}`,
      override.targetValue.trim(),
    ]),
  );

  const resolve = (
    field: SelectField,
    key: string,
  ): { targetValue: string | null; method: ValueMappingMethod } => {
    const allowedValues: readonly string[] = TARGET_SELECT_VALUES[field];
    const override = overrideByKey.get(`${field}|${key}`);

    if (override !== undefined) {
      return allowedValues.includes(override)
        ? { targetValue: override, method: 'value-map.csv' }
        : { targetValue: null, method: 'unmapped' };
    }

    const exact = allowedValues.find((value) => normaliseText(value) === key);

    if (exact !== undefined) {
      return { targetValue: exact, method: 'exact' };
    }

    const synonym = VALUE_SYNONYMS[field][key];

    return synonym === undefined
      ? { targetValue: null, method: 'unmapped' }
      : { targetValue: synonym, method: 'synonym' };
  };

  const track = (
    field: SelectField,
    sourceValue: string,
    resolveKey: (key: string) => { targetValue: string | null; method: ValueMappingMethod },
  ): string | null => {
    const key = normaliseText(sourceValue);

    if (key === '') {
      return null;
    }

    const usageKey = `${field}|${key}`;
    const existingUsage = usageByKey.get(usageKey);

    if (existingUsage !== undefined) {
      existingUsage.rows++;

      return existingUsage.targetValue;
    }

    const { targetValue, method } = resolveKey(key);

    usageByKey.set(usageKey, { field, sourceValue, targetValue, method, rows: 1 });

    return targetValue;
  };

  return {
    map: (field, sourceValue) => track(field, sourceValue, (key) => resolve(field, key)),
    mapDecisionRole: (jobTitle) =>
      track('decisionRole', jobTitle, () => {
        const decisionRole = decisionRoleFromTitle(jobTitle);

        return { targetValue: decisionRole, method: decisionRole === null ? 'unmapped' : 'title rule' };
      }),
    usage: () => [...usageByKey.values()],
  };
};

// Ordered: the first rule whose pattern matches the title wins, so "Executive
// Assistant to the CEO" is a gatekeeper and "CFO" a budget holder before the
// generic "chief" rule makes either a decision maker.
const DECISION_ROLE_RULES: { pattern: RegExp; decisionRole: string }[] = [
  {
    pattern: /\b(executive assistant|personal assistant|administrative assistant|admin assistant|assistant to|pa to|secretary|receptionist|office manager|coordinator|buyer|purchasing|procurement officer|procurement specialist)\b/,
    decisionRole: 'GATEKEEPER',
  },
  {
    pattern: /\b(cfo|chief financial|finance director|director of finance|head of finance|head of procurement|procurement director|treasurer|budget)\b/,
    decisionRole: 'BUDGET_HOLDER',
  },
  {
    pattern: /\b(cto|chief technology|chief technical|chief scientist|engineer|engineering|r and d|research|researcher|scientist|professor|lecturer|technical|technology manager|innovation)\b/,
    decisionRole: 'TECHNICAL_EVALUATOR',
  },
  {
    pattern: /\b(ceo|chief|president|chairman|chairwoman|founder|owner|managing director|md|general manager|gm|executive director|director general|vice president|vp|svp|evp|head|director|partner|undersecretary)\b/,
    decisionRole: 'DECISION_MAKER',
  },
  {
    pattern: /\b(manager|advisor|adviser|consultant|lead|specialist|expert|counsel)\b/,
    decisionRole: 'INFLUENCER',
  },
  {
    pattern: /\b(operator|technician|analyst|officer|supervisor|planner|user|inspector)\b/,
    decisionRole: 'END_USER',
  },
];

export const decisionRoleFromTitle = (jobTitle: string): string | null => {
  const title = normaliseText(jobTitle);

  if (title === '') {
    return null;
  }

  return DECISION_ROLE_RULES.find(({ pattern }) => pattern.test(title))?.decisionRole ?? null;
};
