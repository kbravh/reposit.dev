import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createRepository,
  deleteRepository,
  searchGitHubRepositories,
} from '../actions/repos';
import { repositoryKeys } from '../lib/query-keys';
import type { Repository } from '../components/repository/types';

export function useCreateRepositoryMutation(options?: {
  onSuccess?: () => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { url: string }) =>
      createRepository({ data: variables }),
    onMutate: async variables => {
      await queryClient.cancelQueries({ queryKey: repositoryKeys.all });

      const previousRepositories = queryClient.getQueryData<
        Repository[] | undefined
      >(repositoryKeys.all);

      // Parse the URL to create an optimistic repository
      const urlParts = variables.url
        .replace(/^https?:\/\/github\.com\//, '')
        .split('/');
      const [org, name] = urlParts;

      if (org && name) {
        const optimisticRepository: Repository = {
          repositoryInstance: {
            id: `temp-${Date.now()}`,
            userId: 'current-user',
            repositoryId: `temp-repo-${Date.now()}`,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          repository: {
            id: `temp-repo-${Date.now()}`,
            htmlUrl: variables.url,
            org,
            name,
            description: null,
            private: false,
            provider: 'github',
            providerId: `temp-${Date.now()}`,
            lastSyncedAt: null,
            deletedAt: null,
            createdAt: new Date(),
            primaryLanguage: null,
            updatedAt: new Date(),
          },
        };

        queryClient.setQueryData<Repository[] | undefined>(
          repositoryKeys.all,
          previous =>
            previous
              ? [optimisticRepository, ...previous]
              : [optimisticRepository]
        );
      }

      return { previousRepositories };
    },
    onError: (err, variables, context) => {
      if (context?.previousRepositories) {
        queryClient.setQueryData(
          repositoryKeys.all,
          context.previousRepositories
        );
      }
    },
    onSuccess: () => {
      options?.onSuccess?.();
    },
    onSettled: () => {
      return queryClient.invalidateQueries({ queryKey: repositoryKeys.all });
    },
  });
}

export function useDeleteRepositoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { repositoryInstanceId: string }) =>
      deleteRepository({ data: variables }),
    onMutate: async variables => {
      await queryClient.cancelQueries({ queryKey: repositoryKeys.all });

      const previousRepositories = queryClient.getQueryData<
        Repository[] | undefined
      >(repositoryKeys.all);

      queryClient.setQueryData<Repository[] | undefined>(
        repositoryKeys.all,
        previous =>
          previous
            ? previous.filter(
                repo =>
                  repo.repositoryInstance.id !== variables.repositoryInstanceId
              )
            : previous
      );

      return { previousRepositories };
    },
    onError: (err, variables, context) => {
      if (context?.previousRepositories) {
        queryClient.setQueryData(
          repositoryKeys.all,
          context.previousRepositories
        );
      }
    },
    onSettled: () => {
      return queryClient.invalidateQueries({ queryKey: repositoryKeys.all });
    },
  });
}

export function useSearchRepositoriesMutation<T = unknown>(options?: {
  onSuccess?: (data: T) => void;
}) {
  return useMutation({
    mutationFn: (variables: { query: string }) =>
      searchGitHubRepositories({ data: variables }),
    onSuccess: data => {
      options?.onSuccess?.(data as T);
    },
  });
}
