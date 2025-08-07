import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { Edit3 } from 'lucide-react';
import { useState, useEffect, type FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTag } from '../../actions/tags';
import { TAG_COLORS } from '../../utils/colors';
import { tagKeys } from '../../lib/query-keys';

type TagWithCount = {
  id: string;
  title: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  repositoryCount: number;
};

type EditTagModalProps = {
  tag: TagWithCount | null;
  onClose: () => void;
};

export function EditTagModal({ tag, onClose }: EditTagModalProps) {
  const [title, setTitle] = useState(tag?.title || '');
  const [color, setColor] = useState(tag?.color || '');
  const queryClient = useQueryClient();

  const updateTagMutation = useMutation({
    mutationFn: (variables: {
      tagId: string;
      title?: string;
      color?: string;
    }) => updateTag({ data: variables }),
    onMutate: async (variables) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: tagKeys.all });
      await queryClient.cancelQueries({ queryKey: tagKeys.withCount() });

      // Snapshot the previous values
      const previousTags = queryClient.getQueryData(tagKeys.all);
      const previousTagsWithCount = queryClient.getQueryData(tagKeys.withCount());

      // Optimistically update the tag in all tag lists
      const updateTagInArray = (old: any) => {
        if (!old) return old;
        return old.map((tag: any) => 
          tag.id === variables.tagId 
            ? { ...tag, ...variables, updatedAt: new Date() }
            : tag
        );
      };

      queryClient.setQueryData(tagKeys.all, updateTagInArray);
      queryClient.setQueryData(tagKeys.withCount(), updateTagInArray);

      // Return a context object with the snapshotted values
      return { previousTags, previousTagsWithCount };
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
      onClose();
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.all });
    },
  });

  // Update local state when tag changes
  useEffect(() => {
    if (tag) {
      setTitle(tag.title);
      setColor(tag.color);
    }
  }, [tag]);

  if (!tag) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const updates: { tagId: string; title?: string; color?: string } = {
      tagId: tag.id,
    };

    if (title.trim() !== tag.title) {
      updates.title = title.trim();
    }

    if (color !== tag.color) {
      updates.color = color;
    }

    if (updates.title || updates.color) {
      updateTagMutation.mutate(updates);
    } else {
      onClose();
    }
  };

  const handleClose = () => {
    setTitle(tag.title);
    setColor(tag.color);
    onClose();
  };

  return (
    <Dialog open={!!tag} onClose={handleClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-leave:duration-200 data-enter:ease-out data-leave:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-leave:duration-200 data-enter:ease-out data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            <form onSubmit={handleSubmit}>
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:size-10">
                  <Edit3 className="size-6 text-indigo-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                  <DialogTitle
                    as="h3"
                    className="font-semibold text-base text-gray-900"
                  >
                    Edit Tag
                  </DialogTitle>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label
                        htmlFor="edit-title"
                        className="block font-medium text-gray-900 text-sm/6"
                      >
                        Title
                      </label>
                      <input
                        type="text"
                        id="edit-title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="mt-2 -outline-offset-1 focus:-outline-offset-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-gray-900 text-sm/6 mb-2">
                        Color
                      </label>
                      <div className="grid grid-cols-6 gap-2">
                        {TAG_COLORS.map(tagColor => (
                          <button
                            key={tagColor}
                            type="button"
                            onClick={() => setColor(tagColor)}
                            className={`w-8 h-8 rounded-full border-2 ${
                              color === tagColor
                                ? 'border-gray-900'
                                : 'border-gray-300'
                            }`}
                            style={{ backgroundColor: tagColor }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  disabled={updateTagMutation.isPending}
                  className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 font-semibold text-sm text-white shadow-xs hover:bg-indigo-500 sm:ml-3 sm:w-auto disabled:opacity-50"
                >
                  {updateTagMutation.isPending ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  data-autofocus
                  onClick={handleClose}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 font-semibold text-gray-900 text-sm shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
