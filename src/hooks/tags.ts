import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createManyTags,
  createTag,
  deleteTag,
  removeTagFromRepository,
  updateTag,
} from '../actions/tags';
import { tagKeys } from '../lib/query-keys';
import type { BaseTag, TagWithCount } from '../components/tags/types';

// Helper function to insert tags in alphabetical order
function insertTagAlphabetically<T extends { title: string }>(
  tags: T[] | undefined,
  newTag: T
): T[] {
  if (!tags) return [newTag];

  const insertIndex = tags.findIndex(
    tag => tag.title.toLowerCase() > newTag.title.toLowerCase()
  );

  if (insertIndex === -1) {
    // If no tag is alphabetically after the new tag, append it
    return [...tags, newTag];
  }

  // Insert at the correct alphabetical position
  return [...tags.slice(0, insertIndex), newTag, ...tags.slice(insertIndex)];
}

export function useDeleteTagMutation(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { tagId: string }) =>
      deleteTag({ data: variables }),
    onMutate: async variables => {
      await queryClient.cancelQueries({ queryKey: tagKeys.all });
      await queryClient.cancelQueries({
        queryKey: tagKeys.repositoriesForTag(variables.tagId),
      });

      const previousTags = queryClient.getQueryData<BaseTag[] | undefined>(
        tagKeys.all
      );
      const previousTagsWithCount = queryClient.getQueryData<
        TagWithCount[] | undefined
      >(tagKeys.withCount());
      const previousRepositories = queryClient.getQueryData<
        { id: string; title: string; color: string }[] | undefined
      >(tagKeys.repositoriesForTag(variables.tagId));

      queryClient.setQueryData<BaseTag[] | undefined>(tagKeys.all, old =>
        old?.filter(tag => tag.id !== variables.tagId)
      );
      queryClient.setQueryData<TagWithCount[] | undefined>(
        tagKeys.withCount(),
        old => old?.filter(tag => tag.id !== variables.tagId)
      );

      return { previousTags, previousTagsWithCount, previousRepositories };
    },
    onError: (err, variables, context) => {
      if (context?.previousTags) {
        queryClient.setQueryData(tagKeys.all, context.previousTags);
      }
      if (context?.previousTagsWithCount) {
        queryClient.setQueryData(
          tagKeys.withCount(),
          context.previousTagsWithCount
        );
      }
      if (context?.previousRepositories) {
        queryClient.setQueryData(
          tagKeys.repositoriesForTag(variables.tagId),
          context.previousRepositories
        );
      }
    },
    onSuccess: () => {
      options?.onSuccess?.();
    },
    onSettled: () => {
      return queryClient.invalidateQueries({ queryKey: tagKeys.all });
    },
  });
}

export function useUpdateTagMutation(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: {
      tagId: string;
      title?: string;
      color?: string;
    }) => updateTag({ data: variables }),
    onMutate: async variables => {
      await queryClient.cancelQueries({ queryKey: tagKeys.all });
      await queryClient.cancelQueries({ queryKey: tagKeys.withCount() });

      const previousTags = queryClient.getQueryData<BaseTag[] | undefined>(
        tagKeys.all
      );
      const previousTagsWithCount = queryClient.getQueryData<
        TagWithCount[] | undefined
      >(tagKeys.withCount());

      const updateTagInArray = <T extends { id: string }>(
        existing: T[] | undefined
      ): T[] | undefined => {
        if (!existing) return existing;
        return existing.map(tag =>
          tag.id === variables.tagId
            ? {
                ...tag,
                ...(variables.title ? { title: variables.title } : {}),
                ...(variables.color ? { color: variables.color } : {}),
                updatedAt: new Date(),
              }
            : tag
        );
      };

      queryClient.setQueryData<BaseTag[] | undefined>(
        tagKeys.all,
        updateTagInArray
      );
      queryClient.setQueryData<TagWithCount[] | undefined>(
        tagKeys.withCount(),
        updateTagInArray
      );

      return { previousTags, previousTagsWithCount };
    },
    onError: (err, variables, context) => {
      if (context?.previousTags) {
        queryClient.setQueryData(tagKeys.all, context.previousTags);
      }
      if (context?.previousTagsWithCount) {
        queryClient.setQueryData(
          tagKeys.withCount(),
          context.previousTagsWithCount
        );
      }
    },
    onSuccess: () => {
      options?.onSuccess?.();
    },
    onSettled: () => {
      return queryClient.invalidateQueries({ queryKey: tagKeys.all });
    },
  });
}

export function useCreateTagMutation(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { title: string }) =>
      createTag({ data: variables }),
    onMutate: async variables => {
      await queryClient.cancelQueries({ queryKey: tagKeys.all });
      await queryClient.cancelQueries({ queryKey: tagKeys.withCount() });

      const previousTags = queryClient.getQueryData<BaseTag[] | undefined>(
        tagKeys.all
      );
      const previousTagsWithCount = queryClient.getQueryData<
        TagWithCount[] | undefined
      >(tagKeys.withCount());

      const optimisticBaseTag: BaseTag = {
        id: `temp-${Date.now()}`,
        title: variables.title,
        color: '#6366f1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const optimisticWithCount: TagWithCount = {
        ...optimisticBaseTag,
        repositoryCount: 0,
      };

      queryClient.setQueryData<BaseTag[] | undefined>(tagKeys.all, previous =>
        previous
          ? insertTagAlphabetically(previous, optimisticBaseTag)
          : [optimisticBaseTag]
      );
      queryClient.setQueryData<TagWithCount[] | undefined>(
        tagKeys.withCount(),
        previous =>
          previous
            ? insertTagAlphabetically(previous, optimisticWithCount)
            : [optimisticWithCount]
      );

      return { previousTags, previousTagsWithCount };
    },
    onError: (err, variables, context) => {
      if (context?.previousTags) {
        queryClient.setQueryData(tagKeys.all, context.previousTags);
      }
      if (context?.previousTagsWithCount) {
        queryClient.setQueryData(
          tagKeys.withCount(),
          context.previousTagsWithCount
        );
      }
    },
    onSuccess: () => {
      options?.onSuccess?.();
    },
    onSettled: () => {
      return queryClient.invalidateQueries({ queryKey: tagKeys.all });
    },
  });
}

export function useRemoveTagFromRepositoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { tagId: string; repositoryInstanceId: string }) =>
      removeTagFromRepository({ data: variables }),
    onMutate: async variables => {
      await queryClient.cancelQueries({
        queryKey: tagKeys.forRepository(variables.repositoryInstanceId),
      });

      const previousRepositoryTags = queryClient.getQueryData<
        BaseTag[] | undefined
      >(tagKeys.forRepository(variables.repositoryInstanceId));

      queryClient.setQueryData<BaseTag[] | undefined>(
        tagKeys.forRepository(variables.repositoryInstanceId),
        old => old?.filter(tag => tag.id !== variables.tagId)
      );

      return { previousRepositoryTags };
    },
    onError: (err, variables, context) => {
      if (context?.previousRepositoryTags) {
        queryClient.setQueryData(
          tagKeys.forRepository(variables.repositoryInstanceId),
          context.previousRepositoryTags
        );
      }
    },
    onSettled: (data, error, variables) => {
      return queryClient.invalidateQueries({
        queryKey: tagKeys.forRepository(variables.repositoryInstanceId),
      });
    },
  });
}

export function useCreateManyTagsForRepositoryMutation(options?: {
  onSuccess?: () => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: {
      titles: string[];
      repositoryInstanceId: string;
    }) => createManyTags({ data: variables }),
    onMutate: async variables => {
      await queryClient.cancelQueries({
        queryKey: tagKeys.forRepository(variables.repositoryInstanceId),
      });
      await queryClient.cancelQueries({ queryKey: tagKeys.all });

      const previousRepositoryTags = queryClient.getQueryData<
        BaseTag[] | undefined
      >(tagKeys.forRepository(variables.repositoryInstanceId));
      const previousAllTags = queryClient.getQueryData<BaseTag[] | undefined>(
        tagKeys.all
      );

      const optimisticTags: BaseTag[] = variables.titles.map(
        (title, index) => ({
          id: `temp-${Date.now()}-${index}`,
          title,
          color: '#6366f1',
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      );

      queryClient.setQueryData<BaseTag[] | undefined>(
        tagKeys.forRepository(variables.repositoryInstanceId),
        old => (old ? [...old, ...optimisticTags] : optimisticTags)
      );

      const existingTitles = new Set(
        (previousAllTags ?? []).map(tag => tag.title)
      );
      const newTags = optimisticTags.filter(
        tag => !existingTitles.has(tag.title)
      );

      if (newTags.length > 0) {
        queryClient.setQueryData<BaseTag[] | undefined>(tagKeys.all, old => {
          if (!old) return newTags;
          let result = [...old];
          newTags.forEach(newTag => {
            result = insertTagAlphabetically(result, newTag);
          });
          return result;
        });
      }

      return { previousRepositoryTags, previousAllTags };
    },
    onError: (err, variables, context) => {
      if (context?.previousRepositoryTags) {
        queryClient.setQueryData(
          tagKeys.forRepository(variables.repositoryInstanceId),
          context.previousRepositoryTags
        );
      }
      if (context?.previousAllTags) {
        queryClient.setQueryData(tagKeys.all, context.previousAllTags);
      }
    },
    onSuccess: () => {
      options?.onSuccess?.();
    },
    onSettled: (data, error, variables) => {
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: tagKeys.all }),
        queryClient.invalidateQueries({
          queryKey: tagKeys.forRepository(variables.repositoryInstanceId),
        }),
      ]);
    },
  });
}
