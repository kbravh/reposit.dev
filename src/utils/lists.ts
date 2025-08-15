export type MatchMode = 'any' | 'all';

export function computeListMembership(params: {
  repoTagIds: string[];
  includeTagIds: string[];
  excludeTagIds: string[];
  includeMatch: MatchMode;
  excludeMatch: MatchMode;
  explicitlyIncluded: boolean;
  explicitlyExcluded: boolean;
}): boolean {
  const repoTags = new Set(params.repoTagIds);

  if (params.explicitlyExcluded) return false;
  if (params.explicitlyIncluded) return true;

  let includePass = true;
  if (params.includeTagIds.length > 0) {
    if (params.includeMatch === 'any') {
      includePass = params.includeTagIds.some(t => repoTags.has(t));
    } else {
      includePass = params.includeTagIds.every(t => repoTags.has(t));
    }
  }

  let shouldExclude = false;
  if (params.excludeTagIds.length > 0) {
    if (params.excludeMatch === 'any') {
      shouldExclude = params.excludeTagIds.some(t => repoTags.has(t));
    } else {
      shouldExclude = params.excludeTagIds.every(t => repoTags.has(t));
    }
  }

  return includePass && !shouldExclude;
}