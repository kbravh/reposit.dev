import { useQuery } from '@tanstack/react-query';
import {
  useRef,
  useState,
  useEffect,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { getTags, getTagsForRepository } from '../../actions/tags';
import { X } from 'lucide-react';
import { tagKeys } from '../../lib/query-keys';
import type { BaseTag } from './types';
import {
  useCreateManyTagsForRepositoryMutation,
  useRemoveTagFromRepositoryMutation,
} from '../../hooks/tags';

export function TagModal({
  isOpen,
  onClose,
  repositoryInstanceId,
}: {
  isOpen: boolean;
  onClose: () => void;
  repositoryInstanceId: string;
}) {
  const [inputValue, setInputValue] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
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
    onSuccess: () => setInputValue(''),
  });

  // Filter suggestions based on input and exclude already assigned tags
  const suggestions = availableTags.filter(tag => {
    const isNotAssigned = !repositoryTags.some(
      repoTag => repoTag.id === tag.id
    );
    const matchesInput = tag.title
      .toLowerCase()
      .includes(inputValue.toLowerCase().trim());
    return isNotAssigned && matchesInput && inputValue.trim().length > 0;
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setSelectedSuggestionIndex(-1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleAddTags();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestionIndex(prev =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Tab' && selectedSuggestionIndex >= 0) {
      e.preventDefault();
      const selectedTag = suggestions[selectedSuggestionIndex];
      if (selectedTag) {
        createTagsMutation.mutate({
          titles: [selectedTag.title],
          repositoryInstanceId,
        });
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleAddTags = () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return;

    createTagsMutation.mutate({
      titles: [trimmedInput.toLowerCase()],
      repositoryInstanceId,
    });
  };

  const handleSuggestionClick = (tag: {
    id: string;
    title: string;
    color: string;
  }) => {
    createTagsMutation.mutate({
      titles: [tag.title],
      repositoryInstanceId,
    });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-leave:duration-200 data-enter:ease-out data-leave:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-visible rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-leave:duration-200 data-enter:ease-out data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:min-h-96 data-closed:sm:translate-y-0 data-closed:sm:scale-95 flex flex-col"
          >
            <div className="flex-1 px-4 pt-5 pb-4 sm:p-6">
              <div className="mt-3 sm:mt-0">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 mb-4"
                >
                  Manage Tags
                </DialogTitle>

                {/* Current tags */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {repositoryTags.map(tag => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center gap-x-2 rounded-md px-3 py-1.5 text-sm font-medium text-gray-900 ring-1 ring-gray-300 ring-inset"
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
                          className="ml-0.5 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 rounded-sm"
                          type="button"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tag input */}
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    name="tag"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() =>
                      setTimeout(() => setIsInputFocused(false), 200)
                    }
                    placeholder="Add new tag..."
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />

                  {/* Suggestions dropdown */}
                  {isInputFocused &&
                    inputValue.trim() &&
                    suggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
                        {suggestions.map((tag, index) => (
                          <button
                            key={tag.id}
                            type="button"
                            className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 focus:outline-none focus:bg-gray-100 ${
                              index === selectedSuggestionIndex
                                ? 'bg-gray-100'
                                : ''
                            }`}
                            onClick={() => handleSuggestionClick(tag)}
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className="inline-block size-2 shrink-0 rounded-full"
                                style={{ backgroundColor: tag.color }}
                                aria-hidden="true"
                              />
                              <span className="truncate">{tag.title}</span>
                            </div>
                          </button>
                        ))}

                        {/* Show "Create new tag" option */}
                        {inputValue.trim() &&
                          !suggestions.some(
                            tag => tag.title === inputValue.toLowerCase().trim()
                          ) && (
                            <button
                              type="button"
                              className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 focus:outline-none focus:bg-gray-100 border-t border-gray-200 ${
                                selectedSuggestionIndex === suggestions.length
                                  ? 'bg-gray-100'
                                  : ''
                              }`}
                              onClick={handleAddTags}
                            >
                              <div className="flex items-center gap-2">
                                <span
                                  className="inline-block size-2 shrink-0 rounded-full bg-gray-400"
                                  aria-hidden="true"
                                />
                                <span className="truncate">
                                  Create &ldquo;
                                  {inputValue.toLowerCase().trim()}
                                  &rdquo;
                                </span>
                              </div>
                            </button>
                          )}
                      </div>
                    )}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer sm:w-auto sm:text-sm"
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
