import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createManyTags,
  createTag,
  deleteTag,
  getAiTagSuggestions,
  removeTagFromRepository,
  suggestTagsForRepository,
  updateTag,
} from '../actions/tags';
import { tagKeys } from '../lib/query-keys';
import type { BaseTag, TagWithCount } from '../components/tags/types';
import { insertAlphabetically } from '../utils/array';

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
    mutationFn: (variables: { title: string; color?: string }) => {
      return createTag({ data: variables });
    },
    onMutate: async variables => {
      // Check for duplicate in cache before applying optimistic update
      const normalizedTitle = variables.title.toLowerCase().trim();

      const existingTags = queryClient.getQueryData<BaseTag[] | undefined>(
        tagKeys.all
      );
      const existingTagsWithCount = queryClient.getQueryData<
        TagWithCount[] | undefined
      >(tagKeys.withCount());

      // Check both tag caches for duplicates, excluding temporary tags
      const isDuplicateInAllTags = existingTags?.some(
        tag =>
          !tag.id.startsWith('temp-') &&
          tag.title.toLowerCase() === normalizedTitle
      );
      const isDuplicateInWithCount = existingTagsWithCount?.some(
        tag =>
          !tag.id.startsWith('temp-') &&
          tag.title.toLowerCase() === normalizedTitle
      );

      if (isDuplicateInAllTags || isDuplicateInWithCount) {
        throw new Error('A tag with this title already exists');
      }
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
        color: variables.color || '#14b8a6',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const optimisticWithCount: TagWithCount = {
        ...optimisticBaseTag,
        repositoryCount: 0,
      };

      queryClient.setQueryData<BaseTag[] | undefined>(tagKeys.all, previous =>
        previous
          ? insertAlphabetically(previous, optimisticBaseTag, tag => tag.title)
          : [optimisticBaseTag]
      );
      queryClient.setQueryData<TagWithCount[] | undefined>(
        tagKeys.withCount(),
        previous =>
          previous
            ? insertAlphabetically(
                previous,
                optimisticWithCount,
                tag => tag.title
              )
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
          color: '#14b8a6',
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
            result = insertAlphabetically(result, newTag, tag => tag.title);
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

export type TagSuggestions = {
  existingTags: BaseTag[];
  suggestedNewTags: string[];
  githubTopics: string[];
};

export function useSuggestTagsForRepositoryMutation(options?: {
  onSuccess?: (data: TagSuggestions) => void;
}) {
  return useMutation({
    mutationFn: (variables: { repositoryInstanceId: string }) =>
      suggestTagsForRepository({ data: variables }),
    onSuccess: data => {
      options?.onSuccess?.(data as TagSuggestions);
    },
  });
}

export type AiTagSuggestions = {
  existingTags: BaseTag[];
  suggestedNewTags: string[];
  aiGenerated: boolean;
};

export function useAiTagSuggestionsMutation(options?: {
  onSuccess?: (data: AiTagSuggestions) => void;
}) {
  return useMutation({
    mutationFn: (variables: { repositoryInstanceId: string }) =>
      getAiTagSuggestions({ data: variables }),
    onSuccess: data => {
      options?.onSuccess?.(data as AiTagSuggestions);
    },
  });
}
