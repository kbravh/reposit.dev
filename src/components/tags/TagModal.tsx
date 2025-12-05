import { useRef, useState, useEffect } from 'react';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
} from '@headlessui/react';
import { getTagsForRepository, getTags } from '../../actions/tags';
import { X } from 'lucide-react';
import { tagKeys } from '../../lib/query-keys';
import { useQuery } from '@tanstack/react-query';
import {
  useRemoveTagFromRepositoryMutation,
  useCreateManyTagsForRepositoryMutation,
} from '../../hooks/tags';
import type { BaseTag } from './types';

export function TagModal({
  isOpen,
  onClose,
  repositoryInstanceId,
}: {
  isOpen: boolean;
  onClose: () => void;
  repositoryInstanceId: string;
}) {
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<BaseTag | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens with proper timing
  useEffect(() => {
    if (isOpen) {
      // Wait for the modal transition to complete
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 350); // Slightly longer than the transition duration

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const { data: availableTags = [] } = useQuery<BaseTag[]>({
    queryKey: tagKeys.all,
    queryFn: () => getTags(),
  });

  const { data: repositoryTags = [] } = useQuery<BaseTag[]>({
    queryKey: tagKeys.forRepository(repositoryInstanceId),
    queryFn: () => getTagsForRepository({ data: { repositoryInstanceId } }),
  });

  const removeTagMutation = useRemoveTagFromRepositoryMutation();

  const createTagsMutation = useCreateManyTagsForRepositoryMutation({
    onSuccess: () => {
      setQuery('');
      setSelectedTag(null);
    },
  });

  // Filter suggestions based on query and exclude already assigned tags
  const filteredTags = availableTags.filter(tag => {
    const isNotAssigned = !repositoryTags.some(
      repoTag => repoTag.id === tag.id
    );
    const matchesQuery = tag.title
      .toLowerCase()
      .includes(query.toLowerCase().trim());
    return isNotAssigned && matchesQuery;
  });

  // Check if the current query exactly matches an existing tag
  const exactMatch = filteredTags.find(
    tag => tag.title.toLowerCase() === query.toLowerCase().trim()
  );

  // Option to create a new tag if query doesn't exactly match any existing tag
  const createNewTagOption =
    query.trim() && !exactMatch
      ? ({
          id: 'create-new',
          title: query.toLowerCase().trim(),
          color: '#6b7280', // Default gray color
        } as BaseTag)
      : null;

  const handleTagSelection = (tag: BaseTag | null) => {
    if (!tag) return;

    if (tag.id === 'create-new') {
      // Create new tag
      createTagsMutation.mutate({
        titles: [tag.title],
        repositoryInstanceId,
      });
    } else {
      // Add existing tag
      createTagsMutation.mutate({
        titles: [tag.title],
        repositoryInstanceId,
      });
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/80 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-leave:duration-200 data-enter:ease-out data-leave:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-visible rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-leave:duration-200 data-enter:ease-out data-leave:ease-in sm:my-8 sm:w-full sm:max-w-2xl sm:min-h-96 data-closed:sm:translate-y-0 data-closed:sm:scale-95 flex flex-col"
          >
            <div className="flex-1 px-4 pt-5 pb-4 sm:p-6">
              <div className="mt-3 sm:mt-0">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100 mb-4"
                >
                  Manage Tags
                </DialogTitle>

                {/* Current tags */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {repositoryTags.map(tag => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center gap-x-2 rounded-md px-3 py-1.5 text-sm font-medium text-gray-900 dark:text-gray-100 ring-1 ring-gray-300 dark:ring-gray-600 ring-inset"
                      >
                        <span
                          className="inline-block size-2 shrink-0 rounded-full"
                          style={{ backgroundColor: tag.color }}
                          aria-hidden="true"
                        />
                        <span className="truncate">{tag.title}</span>
                        <button
                          onClick={() =>
                            removeTagMutation.mutate({
                              tagId: tag.id,
                              repositoryInstanceId,
                            })
                          }
                          disabled={removeTagMutation.isPending}
                          className="ml-0.5 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 rounded-sm disabled:cursor-not-allowed cursor-pointer"
                          type="button"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tag input with combobox */}
                <Combobox
                  as="div"
                  value={selectedTag}
                  onChange={handleTagSelection}
                  onClose={() => setQuery('')}
                >
                  <div className="relative">
                    <ComboboxInput
                      ref={inputRef}
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      onChange={event => setQuery(event.target.value)}
                      onBlur={() => setQuery('')}
                      displayValue={() => ''}
                      placeholder="Add new tag..."
                    />

                    {(filteredTags.length > 0 || createNewTagOption) && (
                      <ComboboxOptions className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 shadow-lg">
                        {filteredTags.map(tag => (
                          <ComboboxOption
                            key={tag.id}
                            value={tag}
                            className="group relative cursor-default select-none py-2 px-3 text-gray-900 dark:text-gray-100 data-focus:bg-teal-600 data-focus:text-white"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className="inline-block size-2 shrink-0 rounded-full"
                                style={{ backgroundColor: tag.color }}
                                aria-hidden="true"
                              />
                              <span className="truncate">{tag.title}</span>
                            </div>
                          </ComboboxOption>
                        ))}

                        {createNewTagOption && (
                          <ComboboxOption
                            value={createNewTagOption}
                            className="group relative cursor-default select-none py-2 px-3 text-gray-900 dark:text-gray-100 data-focus:bg-teal-600 data-focus:text-white border-t border-gray-200 dark:border-gray-600"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className="inline-block size-2 shrink-0 rounded-full bg-gray-400"
                                aria-hidden="true"
                              />
                              <span className="truncate">
                                Create &ldquo;{createNewTagOption.title}&rdquo;
                              </span>
                            </div>
                          </ComboboxOption>
                        )}
                      </ComboboxOptions>
                    )}
                  </div>
                </Combobox>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex w-full justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 cursor-pointer sm:w-auto sm:text-sm"
              >
                Done
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
