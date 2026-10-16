import { recordIdFromKey } from './ids.ts';
import { type CompanyRecord, type Report, type SourceReference } from './model.ts';

export type CompanyMention = {
  name: string | null;
  normalisedName: string | null;
  // From a website or domain column: a statement about the company itself.
  explicitDomain: string | null;
  // From a person's email address: weaker, a subsidiary often mails from its
  // parent's domain, so it never merges two differently named companies.
  emailDomain: string | null;
  sector: string | null;
  sizeClass: string | null;
  isOffsetObligor: boolean | null;
  rank: number;
  source: SourceReference;
};

export type CompanyResolution =
  | { status: 'resolved'; companyId: string }
  | { status: 'ambiguous'; detail: string }
  | { status: 'rejected'; detail: string };

type Cluster = {
  root: number;
  mentionIndexes: number[];
  explicitDomain: string | null;
  derivedDomain: string | null;
  normalisedNames: Set<string>;
};

const createUnionFind = (size: number) => {
  const parents = Array.from({ length: size }, (_, index) => index);

  const find = (index: number): number => {
    let root = index;

    while (parents[root] !== root) {
      root = parents[root];
    }

    parents[index] = root;

    return root;
  };

  const union = (left: number, right: number) => {
    const leftRoot = find(left);
    const rightRoot = find(right);

    if (leftRoot !== rightRoot) {
      parents[Math.max(leftRoot, rightRoot)] = Math.min(leftRoot, rightRoot);
    }
  };

  return { find, union };
};

// "Gulf Drilling" mailing from the domain of "Gulf Drilling Services LLC" is
// the same company written short; "Gulf Drilling Offshore" is not.
const haveCompatibleNames = (names: Set<string>, ownerNames: Set<string>): boolean =>
  [...names].some((name) =>
    [...ownerNames].some((ownerName) => {
      const [shorter, longer] = [name.split(' '), ownerName.split(' ')].sort(
        (left, right) => left.length - right.length,
      );

      return shorter.every((token, index) => token === longer[index]);
    }),
  );

const nameFromDomain = (domain: string): string => {
  const label = domain.split('.')[0];

  return label.charAt(0).toUpperCase() + label.slice(1);
};

const mostCommon = (values: string[]): string =>
  [...new Set(values)].sort(
    (left, right) =>
      values.filter((value) => value === right).length -
      values.filter((value) => value === left).length,
  )[0];

const firstByRank = <TValue>(
  mentions: CompanyMention[],
  pick: (mention: CompanyMention) => TValue | null,
): TValue | null => {
  const ranked = [...mentions].sort((left, right) => left.rank - right.rank);

  for (const mention of ranked) {
    const value = pick(mention);

    if (value !== null) {
      return value;
    }
  }

  return null;
};

export const resolveCompanies = (
  mentions: CompanyMention[],
  report: Report,
): { companies: CompanyRecord[]; resolutions: CompanyResolution[] } => {
  const { find, union } = createUnionFind(mentions.length);
  const resolutions: (CompanyResolution | null)[] = mentions.map(() => null);
  const explicitDomainByRoot = new Map<number, string>();

  const explicitDomainOf = (index: number) => explicitDomainByRoot.get(find(index)) ?? null;

  const unionKeepingDomain = (left: number, right: number) => {
    const domain = explicitDomainOf(left) ?? explicitDomainOf(right);

    union(left, right);

    if (domain !== null) {
      explicitDomainByRoot.set(find(left), domain);
    }
  };

  mentions.forEach((mention, index) => {
    if (mention.normalisedName === null && mention.explicitDomain === null && mention.emailDomain === null) {
      resolutions[index] = { status: 'rejected', detail: 'no company name and no domain' };
    }
  });

  const firstMentionByDomain = new Map<string, number>();

  mentions.forEach((mention, index) => {
    if (mention.explicitDomain === null) {
      return;
    }

    const first = firstMentionByDomain.get(mention.explicitDomain);

    if (first === undefined) {
      firstMentionByDomain.set(mention.explicitDomain, index);
      explicitDomainByRoot.set(find(index), mention.explicitDomain);
    } else {
      unionKeepingDomain(first, index);
    }
  });

  const mentionIndexesByName = new Map<string, number[]>();

  mentions.forEach((mention, index) => {
    if (mention.normalisedName !== null && mention.normalisedName !== '') {
      mentionIndexesByName.set(mention.normalisedName, [
        ...(mentionIndexesByName.get(mention.normalisedName) ?? []),
        index,
      ]);
    }
  });

  for (const [normalisedName, indexes] of mentionIndexesByName) {
    const domains = [
      ...new Set(indexes.map(explicitDomainOf).filter((domain) => domain !== null)),
    ];

    if (domains.length <= 1) {
      indexes.slice(1).forEach((index) => unionKeepingDomain(indexes[0], index));
      continue;
    }

    // Same name, different websites: two companies or one company with two
    // sites. Keep the ones with a domain apart; the ones without cannot be placed.
    const detail = `"${mentions[indexes[0]].name}" appears with domains ${domains.join(', ')}`;

    report.add({
      outcome: 'ambiguous',
      object: 'Company',
      record: mentions[indexes[0]].name ?? normalisedName,
      detail: `${detail}; kept as ${domains.length} companies, rows without a domain not linked`,
      sources: indexes.map((index) => mentions[index].source),
    });

    for (const index of indexes) {
      if (explicitDomainOf(index) === null) {
        resolutions[index] = { status: 'ambiguous', detail };
      }
    }
  }

  const clustersByRoot = new Map<number, Cluster>();

  mentions.forEach((mention, index) => {
    if (resolutions[index] !== null || mention.normalisedName === null) {
      return;
    }

    const root = find(index);
    const cluster = clustersByRoot.get(root) ?? {
      root,
      mentionIndexes: [],
      explicitDomain: explicitDomainOf(index),
      derivedDomain: null,
      normalisedNames: new Set<string>(),
    };

    cluster.mentionIndexes.push(index);
    cluster.normalisedNames.add(mention.normalisedName);
    clustersByRoot.set(root, cluster);
  });

  const clusterByExplicitDomain = new Map(
    [...clustersByRoot.values()]
      .filter((cluster) => cluster.explicitDomain !== null)
      .map((cluster) => [cluster.explicitDomain as string, cluster]),
  );

  const claimantsByEmailDomain = new Map<string, Set<Cluster>>();

  for (const cluster of clustersByRoot.values()) {
    for (const index of cluster.mentionIndexes) {
      const { emailDomain } = mentions[index];

      if (emailDomain !== null) {
        claimantsByEmailDomain.set(
          emailDomain,
          new Set([...(claimantsByEmailDomain.get(emailDomain) ?? []), cluster]),
        );
      }
    }
  }

  const absorbedInto = new Map<Cluster, Cluster>();
  // Compared with the owner's own names, so one absorbed short form does not
  // pull in every other name it happens to prefix.
  const ownNamesByCluster = new Map(
    [...clustersByRoot.values()].map((cluster) => [cluster, new Set(cluster.normalisedNames)]),
  );

  for (const cluster of clustersByRoot.values()) {
    if (cluster.explicitDomain !== null) {
      continue;
    }

    const emailDomains = [
      ...new Set(
        cluster.mentionIndexes
          .map((index) => mentions[index].emailDomain)
          .filter((domain) => domain !== null),
      ),
    ];

    if (emailDomains.length !== 1) {
      continue;
    }

    const [emailDomain] = emailDomains;
    const owner = clusterByExplicitDomain.get(emailDomain);
    const claimants = claimantsByEmailDomain.get(emailDomain) ?? new Set();
    const clusterName = mentions[cluster.mentionIndexes[0]].name;

    if (owner !== undefined && haveCompatibleNames(cluster.normalisedNames, ownNamesByCluster.get(owner) ?? new Set())) {
      owner.mentionIndexes.push(...cluster.mentionIndexes);
      cluster.normalisedNames.forEach((normalisedName) => owner.normalisedNames.add(normalisedName));
      absorbedInto.set(cluster, owner);
    } else if (owner !== undefined) {
      report.add({
        outcome: 'ambiguous',
        object: 'Company',
        record: clusterName ?? emailDomain,
        detail: `people at "${clusterName}" use ${emailDomain}, the domain of "${mentions[owner.mentionIndexes[0]].name}"; kept separate (subsidiary or same company?)`,
        sources: cluster.mentionIndexes.map((index) => mentions[index].source),
      });
    } else if (claimants.size > 1) {
      report.add({
        outcome: 'ambiguous',
        object: 'Company',
        record: clusterName ?? emailDomain,
        detail: `${emailDomain} is used by people at ${[...claimants].map((claimant) => `"${mentions[claimant.mentionIndexes[0]].name}"`).join(', ')}; no domain set on any of them`,
        sources: cluster.mentionIndexes.map((index) => mentions[index].source),
      });
    } else {
      cluster.derivedDomain = emailDomain;
    }
  }

  // Rows with a domain but no company name (a website column alone, or a
  // person's email address) join the company that owns or uses the domain,
  // or a new company named after it.
  const domainOnlyClusters = new Map<string, Cluster>();

  mentions.forEach((mention, index) => {
    if (resolutions[index] !== null || mention.normalisedName !== null) {
      return;
    }

    const domain = (mention.explicitDomain ?? mention.emailDomain) as string;
    const claimants = [
      ...new Set([...(claimantsByEmailDomain.get(domain) ?? [])].map((claimant) => absorbedInto.get(claimant) ?? claimant)),
    ];
    const owner =
      clusterByExplicitDomain.get(domain) ??
      (claimants.length === 1 ? claimants[0] : undefined);

    if (owner !== undefined) {
      owner.mentionIndexes.push(index);
    } else if (claimants.length > 1) {
      resolutions[index] = {
        status: 'ambiguous',
        detail: `${domain} is used by several companies`,
      };
    } else {
      const cluster = domainOnlyClusters.get(domain) ?? {
        root: index,
        mentionIndexes: [],
        explicitDomain: null,
        derivedDomain: domain,
        normalisedNames: new Set<string>(),
      };

      cluster.mentionIndexes.push(index);
      if (mention.explicitDomain !== null) {
        cluster.explicitDomain = mention.explicitDomain;
      }
      domainOnlyClusters.set(domain, cluster);
    }
  });

  const companies: CompanyRecord[] = [];

  const outputClusters = [...clustersByRoot.values(), ...domainOnlyClusters.values()].filter(
    (cluster) => !absorbedInto.has(cluster),
  );

  for (const cluster of outputClusters) {
    const clusterMentions = cluster.mentionIndexes.map((index) => mentions[index]);
    const bestRank = Math.min(...clusterMentions.map(({ rank }) => rank));
    const names = clusterMentions
      .filter(({ rank, name }) => rank === bestRank && name !== null)
      .map(({ name }) => name as string);
    const domain = cluster.explicitDomain ?? cluster.derivedDomain;
    const name =
      names.length > 0 ? mostCommon(names) : nameFromDomain(domain as string);
    const firstNormalisedName = [...cluster.normalisedNames][0];
    // An explicit domain is a stable fact; a name is next best; a domain read
    // from email addresses can change as contacts are added, so it comes last.
    const id = recordIdFromKey(
      `company:${cluster.explicitDomain ?? (firstNormalisedName === undefined ? `domain:${domain}` : `name:${firstNormalisedName}`)}`,
    );
    const sectors = [
      ...new Set(clusterMentions.map(({ sector }) => sector).filter((sector) => sector !== null)),
    ];
    const offsetFlags = new Set(
      clusterMentions.map(({ isOffsetObligor }) => isOffsetObligor).filter((flag) => flag !== null),
    );
    const sources = clusterMentions.map(({ source }) => source);
    const sector = firstByRank(clusterMentions, ({ sector }) => sector);

    if (sectors.length > 1) {
      report.add({
        outcome: 'warning',
        object: 'Company',
        record: name,
        detail: `sources disagree on sector (${sectors.join(', ')}); imported ${sector}`,
        sources,
      });
    }

    if (offsetFlags.size > 1) {
      report.add({
        outcome: 'warning',
        object: 'Company',
        record: name,
        detail: 'sources disagree on offset obligor; imported Yes',
        sources,
      });
    }

    if (clusterMentions.length > 1) {
      const reasons = [
        cluster.explicitDomain !== null ? `domain ${cluster.explicitDomain}` : null,
        cluster.normalisedNames.size > 0 ? `name "${[...cluster.normalisedNames].join('" / "')}"` : null,
        clusterMentions.some(({ normalisedName }) => normalisedName === null)
          ? `domain ${domain} of rows without a company name`
          : null,
      ].filter((reason) => reason !== null);

      report.add({
        outcome: 'merged',
        object: 'Company',
        record: name,
        detail: `${clusterMentions.length} rows merged on ${reasons.join(' and ')}`,
        sources,
      });
    }

    if (cluster.normalisedNames.size === 0) {
      report.add({
        outcome: 'warning',
        object: 'Company',
        record: name,
        detail: `created from domain ${domain}; no source names the company`,
        sources,
      });
    }

    companies.push({
      id,
      name,
      domain,
      sector,
      sizeClass: firstByRank(clusterMentions, ({ sizeClass }) => sizeClass),
      isOffsetObligor: offsetFlags.has(true) ? true : offsetFlags.has(false) ? false : null,
      sources,
    });

    for (const index of cluster.mentionIndexes) {
      resolutions[index] = { status: 'resolved', companyId: id };
    }
  }

  mentions.forEach((mention, index) => {
    const resolution = resolutions[index];

    if (resolution?.status === 'rejected') {
      report.add({
        outcome: 'rejected',
        object: 'Company',
        record: '(blank)',
        detail: resolution.detail,
        sources: [mention.source],
      });
    }
  });

  return {
    companies,
    resolutions: resolutions.map(
      (resolution) => resolution ?? { status: 'rejected', detail: 'domain not owned by any company' },
    ),
  };
};
