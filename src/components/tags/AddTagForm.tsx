import { Tag } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTag } from '../../actions/tags';
import { tagKeys } from '../../lib/query-keys';

type AddTagFormProps = {
  isVisible: boolean;
  onClose: () => void;
};

export function AddTagForm({ isVisible, onClose }: AddTagFormProps) {
  const [newTagTitle, setNewTagTitle] = useState('');
  const queryClient = useQueryClient();

  const createTagMutation = useMutation({
    mutationFn: (variables: { title: string }) =>
      createTag({ data: variables }),
    onMutate: async (variables) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: tagKeys.all });
      await queryClient.cancelQueries({ queryKey: tagKeys.withCount() });

      // Snapshot the previous values
      const previousTags = queryClient.getQueryData(tagKeys.all);
      const previousTagsWithCount = queryClient.getQueryData(tagKeys.withCount());

      // Create a temporary optimistic tag
      const optimisticTag = {
        id: `temp-${Date.now()}`, // Temporary ID
        title: variables.title,
        color: '#6366f1', // Default indigo color
        createdAt: new Date(),
        updatedAt: new Date(),
        repositoryCount: 0, // For withCount queries
      };

      // Optimistically add the new tag to all tag lists
      queryClient.setQueryData(tagKeys.all, (old: any) => 
        old ? [...old, optimisticTag] : [optimisticTag]
      );
      
      queryClient.setQueryData(tagKeys.withCount(), (old: any) => 
        old ? [...old, optimisticTag] : [optimisticTag]
      );

      // Return a context object with the snapshotted values
      return { previousTags, previousTagsWithCount, optimisticTag };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousTags) {
        queryClient.setQueryData(tagKeys.all, context.previousTags);
      }
      if (context?.previousTagsWithCount) {
        queryClient.setQueryData(tagKeys.withCount(), context.previousTagsWithCount);
      }
    },
    onSuccess: () => {
      setNewTagTitle('');
      onClose();
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.all });
    },
  });

  if (!isVisible) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedTitle = newTagTitle.trim();
    if (trimmedTitle) {
      createTagMutation.mutate({ title: trimmedTitle });
    }
  };

  const handleCancel = () => {
    setNewTagTitle('');
    onClose();
  };

  return (
    <div className="mt-6 bg-gray-50 rounded-lg p-4">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1">
          <label htmlFor="tag-title" className="sr-only">
            Tag title
          </label>
          <div className="grid grid-cols-1">
            <input
              id="tag-title"
              name="tag-title"
              type="text"
              placeholder="Enter tag name..."
              value={newTagTitle}
              onChange={e => setNewTagTitle(e.target.value)}
              className="col-start-1 row-start-1 block w-full rounded-md bg-white py-1.5 pl-10 pr-3 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              required
            />
            <Tag
              aria-hidden="true"
              className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400 sm:size-4"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={createTagMutation.isPending}
          className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
        >
          {createTagMutation.isPending ? 'Adding...' : 'Add'}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Cancel
        </button>
      </form>
      {createTagMutation.error && (
        <p className="mt-2 text-sm text-red-600">
          {createTagMutation.error instanceof Error
            ? createTagMutation.error.message
            : 'Failed to add tag'}
        </p>
      )}
    </div>
  );
}
