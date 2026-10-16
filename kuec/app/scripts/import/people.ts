import { type CompanyResolution } from './companies.ts';
import { recordIdFromKey } from './ids.ts';
import { type PersonRecord, type Report, type SourceReference } from './model.ts';
import { type Phone } from './normalise.ts';
import { type ValueMapper } from './value-mapper.ts';

export type PersonMention = {
  firstName: string;
  lastName: string;
  normalisedName: string;
  email: string | null;
  jobTitle: string;
  phone: Phone | null;
  companyMentionIndex: number | null;
  rank: number;
  source: SourceReference;
};

export type PersonResolution =
  | { status: 'resolved'; personId: string }
  | { status: 'unresolved'; detail: string };

const displayName = ({ firstName, lastName, email }: Pick<PersonMention, 'firstName' | 'lastName' | 'email'>) =>
  `${firstName} ${lastName}`.trim() || (email ?? '(blank)');

export const resolvePeople = (
  mentions: PersonMention[],
  companyResolutions: CompanyResolution[],
  valueMapper: ValueMapper,
  report: Report,
): { people: PersonRecord[]; resolutions: PersonResolution[] } => {
  const companyIdOf = (mention: PersonMention): string | null => {
    if (mention.companyMentionIndex === null) {
      return null;
    }

    const resolution = companyResolutions[mention.companyMentionIndex];

    return resolution.status === 'resolved' ? resolution.companyId : null;
  };

  const clusterOfMention: (number | null)[] = mentions.map(() => null);
  const resolutions: PersonResolution[] = mentions.map(() => ({
    status: 'unresolved',
    detail: 'not resolved',
  }));
  const clusters: number[][] = [];

  const addToCluster = (clusterIndex: number | null, mentionIndex: number): number => {
    if (clusterIndex === null) {
      clusters.push([mentionIndex]);
      clusterOfMention[mentionIndex] = clusters.length - 1;

      return clusters.length - 1;
    }

    clusters[clusterIndex].push(mentionIndex);
    clusterOfMention[mentionIndex] = clusterIndex;

    return clusterIndex;
  };

  const clusterByEmail = new Map<string, number>();
  const clustersByNameAndCompany = new Map<string, number[]>();
  const unplacedByNameAndCompany = new Map<string, number[]>();

  mentions.forEach((mention, index) => {
    const companyId = companyIdOf(mention);

    if (mention.email !== null) {
      clusterByEmail.set(mention.email, addToCluster(clusterByEmail.get(mention.email) ?? null, index));

      return;
    }

    if (mention.normalisedName === '') {
      resolutions[index] = { status: 'unresolved', detail: 'no name and no email' };
      report.add({
        outcome: 'rejected',
        object: 'Person',
        record: '(blank)',
        detail: 'no name and no email',
        sources: [mention.source],
      });

      return;
    }

    if (companyId === null) {
      const companyResolution =
        mention.companyMentionIndex === null ? null : companyResolutions[mention.companyMentionIndex];
      const detail =
        companyResolution?.status === 'ambiguous'
          ? `no email, and the company is ambiguous (${companyResolution.detail})`
          : 'no email and no company, so it cannot be deduplicated or linked';

      resolutions[index] = { status: 'unresolved', detail };
      report.add({
        outcome: 'rejected',
        object: 'Person',
        record: displayName(mention),
        detail,
        sources: [mention.source],
      });

      return;
    }

    const key = `${mention.normalisedName}|${companyId}`;

    unplacedByNameAndCompany.set(key, [...(unplacedByNameAndCompany.get(key) ?? []), index]);
  });

  clusters.forEach((cluster, clusterIndex) => {
    for (const mentionIndex of cluster) {
      const mention = mentions[mentionIndex];
      const companyId = companyIdOf(mention);

      if (mention.normalisedName !== '' && companyId !== null) {
        const key = `${mention.normalisedName}|${companyId}`;
        const existing = clustersByNameAndCompany.get(key) ?? [];

        if (!existing.includes(clusterIndex)) {
          clustersByNameAndCompany.set(key, [...existing, clusterIndex]);
        }
      }
    }
  });

  // Rows without an email join the one emailed person with the same name at
  // the same company. Two emailed people with that name and company could be
  // one person with two addresses or two people: reported, not merged.
  for (const [key, indexes] of unplacedByNameAndCompany) {
    const emailedClusters = clustersByNameAndCompany.get(key) ?? [];

    if (emailedClusters.length > 1) {
      const emails = emailedClusters.map((clusterIndex) => mentions[clusters[clusterIndex][0]].email);
      const detail = `same name and company as ${emails.length} people with different emails (${emails.join(', ')}); not linked to either`;

      report.add({
        outcome: 'ambiguous',
        object: 'Person',
        record: displayName(mentions[indexes[0]]),
        detail,
        sources: indexes.map((index) => mentions[index].source),
      });
      indexes.forEach((index) => {
        resolutions[index] = { status: 'unresolved', detail };
      });

      continue;
    }

    const clusterIndex = emailedClusters[0] ?? null;

    indexes.reduce<number | null>((target, index) => addToCluster(target, index), clusterIndex);
  }

  for (const emailedClusters of clustersByNameAndCompany.values()) {
    if (emailedClusters.length > 1) {
      const emails = emailedClusters.map((clusterIndex) => mentions[clusters[clusterIndex][0]].email);

      report.add({
        outcome: 'ambiguous',
        object: 'Person',
        record: displayName(mentions[clusters[emailedClusters[0]][0]]),
        detail: `same name and company with different emails (${emails.join(', ')}); kept as ${emails.length} people (one person with two addresses?)`,
        sources: emailedClusters.flatMap((clusterIndex) =>
          clusters[clusterIndex].map((index) => mentions[index].source),
        ),
      });
    }
  }

  const people: PersonRecord[] = clusters.map((cluster) => {
    const clusterMentions = cluster
      .map((index) => mentions[index])
      .sort((left, right) => left.rank - right.rank);
    const named = clusterMentions.find(({ normalisedName }) => normalisedName !== '');
    const email = clusterMentions.find(({ email }) => email !== null)?.email ?? null;
    const companyIds = [
      ...new Set(clusterMentions.map(companyIdOf).filter((companyId) => companyId !== null)),
    ];
    const companyId = companyIds[0] ?? null;
    const jobTitle = clusterMentions.find(({ jobTitle }) => jobTitle !== '')?.jobTitle ?? '';
    const sources = clusterMentions.map(({ source }) => source);
    const name = displayName({
      firstName: named?.firstName ?? '',
      lastName: named?.lastName ?? '',
      email,
    });
    const distinctNames = new Set(
      clusterMentions.map(({ normalisedName }) => normalisedName).filter((normalisedName) => normalisedName !== ''),
    );

    if (clusterMentions.length > 1) {
      report.add({
        outcome: 'merged',
        object: 'Person',
        record: name,
        detail: `${clusterMentions.length} rows merged on ${email !== null && clusterMentions.filter((mention) => mention.email !== null).length > 1 ? `email ${email}` : 'name and company'}${clusterMentions.some((mention) => mention.email === null) && email !== null ? ' (rows without email joined on name and company)' : ''}`,
        sources,
      });
    }

    if (distinctNames.size > 1) {
      report.add({
        outcome: 'ambiguous',
        object: 'Person',
        record: name,
        detail: `one email, different names (${[...distinctNames].join(' / ')}): a shared mailbox or a spelling difference; imported as one person named "${name}"`,
        sources,
      });
    }

    const ambiguousCompany = clusterMentions
      .map(({ companyMentionIndex }) => (companyMentionIndex === null ? null : companyResolutions[companyMentionIndex]))
      .find((resolution) => resolution?.status === 'ambiguous');

    if (companyId === null && ambiguousCompany?.status === 'ambiguous') {
      report.add({
        outcome: 'warning',
        object: 'Person',
        record: name,
        detail: `imported without a company: ${ambiguousCompany.detail}`,
        sources,
      });
    }

    if (companyIds.length > 1) {
      report.add({
        outcome: 'warning',
        object: 'Person',
        record: name,
        detail: `sources disagree on company; linked to the one from ${sources[0].fileName}`,
        sources,
      });
    }

    const personId = recordIdFromKey(
      email !== null ? `person:${email}` : `person:${named?.normalisedName}|${companyId}`,
    );

    cluster.forEach((index) => {
      resolutions[index] = { status: 'resolved', personId };
    });

    return {
      id: personId,
      firstName: named?.firstName ?? '',
      lastName: named?.lastName ?? '',
      email,
      jobTitle,
      phone: clusterMentions.find(({ phone }) => phone !== null)?.phone ?? null,
      companyId,
      decisionRole: valueMapper.mapDecisionRole(jobTitle),
      sources,
    };
  });

  return { people, resolutions };
};
