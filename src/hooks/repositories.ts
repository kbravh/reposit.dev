import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createRepository,
  deleteRepository,
  searchGitHubRepositories,
} from '../actions/repos';
import { repositoryKeys } from '../lib/query-keys';
import type { Repository } from '../components/repository/types';

export type CreatedRepositoryInstance = {
  id: string;
  repositoryId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export function useCreateRepositoryMutation(options?: {
  onSuccess?: (data: CreatedRepositoryInstance) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { url: string }) =>
      createRepository({ data: variables }),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: repositoryKeys.all });
      options?.onSuccess?.(data as CreatedRepositoryInstance);
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
