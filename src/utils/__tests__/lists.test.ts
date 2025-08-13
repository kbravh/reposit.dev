import { describe, it, expect } from 'vitest';
import { computeListMembership } from '../lists';

describe('computeListMembership', () => {
  const tagA = 'A';
  const tagB = 'B';
  const tagC = 'C';

  it('includes when explicitly included, regardless of tags', () => {
    const result = computeListMembership({
      repoTagIds: [],
      includeTagIds: [tagA],
      excludeTagIds: [tagB],
      includeMatch: 'all',
      excludeMatch: 'any',
      explicitlyIncluded: true,
      explicitlyExcluded: false,
    });
    expect(result).toBe(true);
  });

  it('excludes when explicitly excluded (overrides include)', () => {
    const result = computeListMembership({
      repoTagIds: [tagA, tagB],
      includeTagIds: [tagA],
      excludeTagIds: [],
      includeMatch: 'any',
      excludeMatch: 'any',
      explicitlyIncluded: true,
      explicitlyExcluded: true,
    });
    expect(result).toBe(false);
  });

  it('include any mode works', () => {
    const result = computeListMembership({
      repoTagIds: [tagA],
      includeTagIds: [tagB, tagA],
      excludeTagIds: [],
      includeMatch: 'any',
      excludeMatch: 'any',
      explicitlyIncluded: false,
      explicitlyExcluded: false,
    });
    expect(result).toBe(true);
  });

  it('include all mode works', () => {
    const result = computeListMembership({
      repoTagIds: [tagA, tagB],
      includeTagIds: [tagB, tagA],
      excludeTagIds: [],
      includeMatch: 'all',
      excludeMatch: 'any',
      explicitlyIncluded: false,
      explicitlyExcluded: false,
    });
    expect(result).toBe(true);
  });

  it('exclude any mode excludes', () => {
    const result = computeListMembership({
      repoTagIds: [tagA, tagB],
      includeTagIds: [],
      excludeTagIds: [tagC, tagB],
      includeMatch: 'any',
      excludeMatch: 'any',
      explicitlyIncluded: false,
      explicitlyExcluded: false,
    });
    expect(result).toBe(false);
  });

  it('exclude all mode excludes only when all are present', () => {
    const result1 = computeListMembership({
      repoTagIds: [tagA],
      includeTagIds: [],
      excludeTagIds: [tagA, tagB],
      includeMatch: 'any',
      excludeMatch: 'all',
      explicitlyIncluded: false,
      explicitlyExcluded: false,
    });
    expect(result1).toBe(true);

    const result2 = computeListMembership({
      repoTagIds: [tagA, tagB],
      includeTagIds: [],
      excludeTagIds: [tagA, tagB],
      includeMatch: 'any',
      excludeMatch: 'all',
      explicitlyIncluded: false,
      explicitlyExcluded: false,
    });
    expect(result2).toBe(false);
  });

  it('no include tags means includePass by default', () => {
    const result = computeListMembership({
      repoTagIds: [],
      includeTagIds: [],
      excludeTagIds: [],
      includeMatch: 'any',
      excludeMatch: 'any',
      explicitlyIncluded: false,
      explicitlyExcluded: false,
    });
    expect(result).toBe(true);
  });
});