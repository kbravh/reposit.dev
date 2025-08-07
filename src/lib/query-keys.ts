// Query key factories following the "most generic to most specific" pattern

export const repositoryKeys = {
  all: ['repositories'] as const,
  lists: () => [...repositoryKeys.all, 'list'] as const,
  list: (filters?: { search?: string }) =>
    [...repositoryKeys.lists(), filters] as const,
  details: () => [...repositoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...repositoryKeys.details(), id] as const,
} as const;

export const tagKeys = {
  all: ['tags'] as const,
  lists: () => [...tagKeys.all, 'list'] as const,
  list: (filters?: { search?: string }) =>
    [...tagKeys.lists(), filters] as const,
  details: () => [...tagKeys.all, 'detail'] as const,
  detail: (id: string) => [...tagKeys.details(), id] as const,
  withCount: () => [...tagKeys.all, 'with-count'] as const,
  forRepository: (repositoryInstanceId: string) =>
    [...tagKeys.all, 'repository', repositoryInstanceId] as const,
  repositoriesForTag: (tagId: string) =>
    [...tagKeys.all, 'repositories-for-tag', tagId] as const,
} as const;

export const sessionKeys = {
  all: ['session'] as const,
  current: () => [...sessionKeys.all, 'current'] as const,
} as const;
