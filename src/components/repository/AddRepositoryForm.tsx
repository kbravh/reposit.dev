import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import {
  ArrowLeft,
  Code,
  GitFork,
  Loader2,
  Plus,
  Search,
  Sparkles,
  Star,
  Tag as TagIcon,
} from 'lucide-react';
import { type FormEvent, useState } from 'react';
import type { GitHubRepository } from '../../utils/github';
import { isValidRepositoryUrl } from '../../utils/github';
import {
  useCreateRepositoryMutation,
  useSearchRepositoriesMutation,
} from '../../hooks/repositories';
import {
  useSuggestTagsForRepositoryMutation,
  useCreateManyTagsForRepositoryMutation,
  useAiTagSuggestionsMutation,
  type TagSuggestions,
} from '../../hooks/tags';
import { getPredefinedColor, getHashedTagColor } from '../../utils/colors';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { Tag } from '../tags/Tag';

interface AddRepositoryFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

type FormMode = 'input' | 'search-results' | 'tag-suggestions';

export function AddRepositoryForm({
  isOpen,
  onOpenChange,
}: AddRepositoryFormProps) {
  const [mode, setMode] = useState<FormMode>('input');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GitHubRepository[]>([]);
  const [createdRepoInstanceId, setCreatedRepoInstanceId] = useState<
    string | null
  >(null);
  const [autoTagSuggestions, setAutoTagSuggestions] =
    useState<TagSuggestions | null>(null);
  const [aiTagSuggestions, setAiTagSuggestions] =
    useState<TagSuggestions | null>(null);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  // Feature flags - LaunchDarkly SDK converts kebab-case to camelCase automatically
  const {
    autoTagSuggestions: autoTagSuggestionsEnabled = false,
    aiTagSuggestions: aiTagSuggestionsEnabled = false,
  } = useFlags();

  const suggestTagsMutation = useSuggestTagsForRepositoryMutation({
    onSuccess: data => {
      setAutoTagSuggestions(data);
      // Pre-select all automatic suggestions by default
      const allTags = new Set([
        ...data.existingTags.map(t => t.title),
        ...data.suggestedNewTags,
      ]);
      setSelectedTags(allTags);
    },
  });

  const aiSuggestionsMutation = useAiTagSuggestionsMutation({
    onSuccess: data => {
      // Filter out duplicates that exist in automatic suggestions (case-insensitive)
      const autoTitles = new Set([
        ...(autoTagSuggestions?.existingTags.map(t => t.title.toLowerCase()) ||
          []),
        ...(autoTagSuggestions?.suggestedNewTags.map(t => t.toLowerCase()) ||
          []),
      ]);

      const filteredExistingTags = data.existingTags.filter(
        tag => !autoTitles.has(tag.title.toLowerCase())
      );
      const filteredNewTags = data.suggestedNewTags.filter(
        tag => !autoTitles.has(tag.toLowerCase())
      );

      setAiTagSuggestions({
        existingTags: filteredExistingTags,
        suggestedNewTags: filteredNewTags,
        githubTopics: [], // AI suggestions don't include GitHub topics
      });
      // DO NOT pre-select AI suggestions - user chooses manually
    },
  });

  const createTagsMutation = useCreateManyTagsForRepositoryMutation({
    onSuccess: () => {
      handleReset();
      onOpenChange(false);
    },
  });

  const createRepoMutation = useCreateRepositoryMutation({
    onSuccess: data => {
      if (autoTagSuggestionsEnabled) {
        setCreatedRepoInstanceId(data.id);
        setMode('tag-suggestions');

        // Always fire automatic suggestions
        suggestTagsMutation.mutate({ repositoryInstanceId: data.id });

        // Fire AI suggestions in parallel if flag is enabled
        if (aiTagSuggestionsEnabled) {
          aiSuggestionsMutation.mutate({ repositoryInstanceId: data.id });
        }
      } else {
        // Skip tag suggestions if feature flag is disabled
        handleReset();
        onOpenChange(false);
      }
    },
  });

  const searchMutation = useSearchRepositoriesMutation<{
    items: GitHubRepository[];
  }>({
    onSuccess: data => {
      setSearchResults(data.items);
      setMode('search-results');
    },
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const input = formData.get('repo-input') as string;
    const trimmedInput = input?.trim();

    if (!trimmedInput) return;

    setSearchQuery(trimmedInput);

    // Check if input is a valid repository URL/format
    if (isValidRepositoryUrl(trimmedInput)) {
      // Direct repository creation
      createRepoMutation.mutate({ url: trimmedInput });
    } else {
      // Search for repositories
      searchMutation.mutate({ query: trimmedInput });
    }
  };

  const handleSelectRepository = (repo: GitHubRepository) => {
    // Create repository using the HTML URL from the selected search result
    createRepoMutation.mutate({ url: repo.html_url });
  };

  const handleBackToSearch = () => {
    setMode('input');
    setSearchResults([]);
    searchMutation.reset();
  };

  const handleReset = () => {
    setMode('input');
    setSearchQuery('');
    setSearchResults([]);
    setCreatedRepoInstanceId(null);
    setAutoTagSuggestions(null);
    setAiTagSuggestions(null);
    setSelectedTags(new Set());
    createRepoMutation.reset();
    searchMutation.reset();
    suggestTagsMutation.reset();
    createTagsMutation.reset();
    aiSuggestionsMutation.reset();
  };

  const toggleTag = (tagTitle: string) => {
    setSelectedTags(prev => {
      const next = new Set(prev);
      if (next.has(tagTitle)) {
        next.delete(tagTitle);
      } else {
        next.add(tagTitle);
      }
      return next;
    });
  };

  const handleApplyTags = () => {
    if (!createdRepoInstanceId || selectedTags.size === 0) {
      handleReset();
      onOpenChange(false);
      return;
    }

    createTagsMutation.mutate({
      titles: Array.from(selectedTags),
      repositoryInstanceId: createdRepoInstanceId,
    });
  };

  const handleSkipTags = () => {
    handleReset();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
    handleReset();
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return (
    <>
      {/* Add Repository Button */}
      <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button
          type="button"
          onClick={() => onOpenChange(true)}
          className="block rounded-md bg-teal-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-teal-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 cursor-pointer"
        >
          <Plus className="inline-block w-4 h-4 mr-1" />
          Add repository
        </button>
      </div>

      {/* Add Repository Dialog */}
      <Dialog open={isOpen} onClose={handleCancel} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/80 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-leave:duration-200 data-enter:ease-out data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-leave:duration-200 data-enter:ease-out data-leave:ease-in sm:my-8 sm:w-full sm:max-w-2xl sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              {mode === 'input' && (
                <>
                  <div>
                    <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/30">
                      <Code
                        aria-hidden="true"
                        className="size-6 text-teal-600 dark:text-teal-400"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <DialogTitle
                        as="h3"
                        className="font-semibold text-base text-gray-900 dark:text-gray-100"
                      >
                        Add Repository
                      </DialogTitle>
                      <div className="mt-2">
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          Enter a repository URL (like
                          github.com/microsoft/TypeScript) or search for
                          repositories by name.
                        </p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="mt-5 sm:mt-6">
                    <div>
                      <label
                        htmlFor="repo-input"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Repository URL or search term
                      </label>
                      <div className="mt-1 grid grid-cols-1">
                        <input
                          id="repo-input"
                          name="repo-input"
                          type="text"
                          placeholder="microsoft/TypeScript or react framework"
                          className="col-start-1 row-start-1 block w-full rounded-md bg-white dark:bg-gray-700 py-1.5 pl-10 pr-3 text-base text-gray-900 dark:text-gray-100 outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-600 sm:text-sm/6"
                          required
                        />
                        <Search
                          aria-hidden="true"
                          className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400 dark:text-gray-500 sm:size-4"
                        />
                      </div>
                    </div>

                    {(createRepoMutation.error || searchMutation.error) && (
                      <div className="mt-3">
                        <p className="text-sm text-red-600 dark:text-red-400">
                          {createRepoMutation.error instanceof Error
                            ? createRepoMutation.error.message
                            : searchMutation.error instanceof Error
                              ? searchMutation.error.message
                              : 'An error occurred'}
                        </p>
                      </div>
                    )}

                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                      <button
                        type="submit"
                        disabled={
                          createRepoMutation.isPending ||
                          searchMutation.isPending
                        }
                        className="inline-flex w-full justify-center rounded-md bg-teal-600 px-3 py-2 font-semibold text-sm text-white shadow-xs hover:bg-teal-500 focus-visible:outline-2 focus-visible:outline-teal-600 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer sm:col-start-2"
                      >
                        {createRepoMutation.isPending
                          ? 'Adding...'
                          : searchMutation.isPending
                            ? 'Searching...'
                            : 'Add or Search'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-700 px-3 py-2 font-semibold text-gray-900 dark:text-gray-100 text-sm shadow-xs ring-1 ring-gray-300 dark:ring-gray-600 ring-inset hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer sm:col-start-1 sm:mt-0"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </>
              )}

              {mode === 'search-results' && (
                <>
                  <div>
                    <div className="flex items-center gap-x-3">
                      <button
                        type="button"
                        onClick={handleBackToSearch}
                        className="rounded-full bg-teal-100 dark:bg-teal-900/30 p-2 text-teal-600 dark:text-teal-400 hover:bg-teal-200 dark:hover:bg-teal-800/50 cursor-pointer"
                      >
                        <ArrowLeft className="size-4" />
                      </button>
                      <div>
                        <DialogTitle
                          as="h3"
                          className="font-semibold text-base text-gray-900 dark:text-gray-100"
                        >
                          Search Results
                        </DialogTitle>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          Found {searchResults.length} repositories for &ldquo;
                          {searchQuery}&rdquo;
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 sm:mt-6">
                    {searchResults.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          No repositories found. Try a different search term.
                        </p>
                      </div>
                    ) : (
                      <div className="max-h-96 overflow-y-auto">
                        <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                          {searchResults.map(repo => (
                            <li
                              key={repo.id}
                              className="flex items-center justify-between gap-x-6 py-4"
                            >
                              <div className="flex min-w-0 gap-x-4">
                                <div className="flex-shrink-0">
                                  <div className="size-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                    <Code className="size-5 text-gray-600 dark:text-gray-400" />
                                  </div>
                                </div>
                                <div className="min-w-0 flex-auto">
                                  <a
                                    href={repo.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                                  >
                                    {repo.owner.login}/{repo.name}
                                  </a>
                                  <p className="mt-1 text-gray-500 dark:text-gray-400 text-xs truncate">
                                    {repo.description ||
                                      'No description available'}
                                  </p>
                                  <div className="mt-1 flex items-center gap-x-4 text-xs text-gray-500 dark:text-gray-400">
                                    {repo.language && (
                                      <span className="flex items-center gap-x-1">
                                        <div className="size-2 rounded-full bg-blue-500" />
                                        {repo.language}
                                      </span>
                                    )}
                                    <span className="flex items-center gap-x-1">
                                      <Star className="size-3" />
                                      {formatNumber(repo.stargazers_count || 0)}
                                    </span>
                                    <span className="flex items-center gap-x-1">
                                      <GitFork className="size-3" />
                                      {formatNumber(repo.forks_count || 0)}
                                    </span>
                                    {repo.private && (
                                      <span className="inline-flex items-center rounded-md bg-yellow-50 dark:bg-yellow-900/30 px-2 py-1 text-xs font-medium text-yellow-800 dark:text-yellow-400 ring-1 ring-inset ring-yellow-600/20 dark:ring-yellow-400/30">
                                        Private
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleSelectRepository(repo)}
                                disabled={createRepoMutation.isPending}
                                className="rounded-md bg-teal-600 px-3 py-1.5 font-semibold text-white text-xs shadow-xs hover:bg-teal-500 focus-visible:outline-2 focus-visible:outline-teal-600 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                              >
                                {createRepoMutation.isPending
                                  ? 'Adding...'
                                  : 'Add'}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {createRepoMutation.error && (
                      <div className="mt-3">
                        <p className="text-sm text-red-600 dark:text-red-400">
                          {createRepoMutation.error instanceof Error
                            ? createRepoMutation.error.message
                            : 'Failed to add repository'}
                        </p>
                      </div>
                    )}

                    <div className="mt-5 sm:mt-6">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-700 px-3 py-2 font-semibold text-gray-900 dark:text-gray-100 text-sm shadow-xs ring-1 ring-gray-300 dark:ring-gray-600 ring-inset hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </>
              )}

              {mode === 'tag-suggestions' && (
                <>
                  <div>
                    <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                      <TagIcon
                        aria-hidden="true"
                        className="size-6 text-emerald-600 dark:text-emerald-400"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <DialogTitle
                        as="h3"
                        className="font-semibold text-base text-gray-900 dark:text-gray-100"
                      >
                        Add Tags to Repository
                      </DialogTitle>
                      <div className="mt-2">
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          We found some tags that might be relevant. Select the
                          ones you want to add.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 sm:mt-6">
                    {/* Automatic Suggestions Section */}
                    {suggestTagsMutation.isPending ? (
                      <div className="flex flex-col items-center justify-center py-8">
                        <Loader2 className="size-8 text-indigo-600 dark:text-indigo-400 animate-spin" />
                        <p className="mt-3 text-gray-500 dark:text-gray-400 text-sm">
                          Analyzing repository...
                        </p>
                      </div>
                    ) : autoTagSuggestions &&
                      (autoTagSuggestions.existingTags.length > 0 ||
                        autoTagSuggestions.suggestedNewTags.length > 0) ? (
                      <div className="space-y-4">
                        {autoTagSuggestions.existingTags.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Your existing tags
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {autoTagSuggestions.existingTags.map(tag => (
                                <Tag
                                  key={tag.id}
                                  title={tag.title}
                                  color={tag.color}
                                  variant="selectable"
                                  selected={selectedTags.has(tag.title)}
                                  onClick={() => toggleTag(tag.title)}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {autoTagSuggestions.suggestedNewTags.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Suggested new tags
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {autoTagSuggestions.suggestedNewTags.map(
                                tagTitle => {
                                  const color =
                                    getPredefinedColor(tagTitle) ||
                                    getHashedTagColor(tagTitle);
                                  return (
                                    <Tag
                                      key={tagTitle}
                                      title={tagTitle}
                                      color={color}
                                      variant="selectable"
                                      selected={selectedTags.has(tagTitle)}
                                      isNew
                                      onClick={() => toggleTag(tagTitle)}
                                    />
                                  );
                                }
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      !suggestTagsMutation.isPending && (
                        <div className="text-center py-8">
                          <TagIcon className="mx-auto size-8 text-gray-400 dark:text-gray-500" />
                          <p className="mt-3 text-gray-500 dark:text-gray-400 text-sm">
                            No tag suggestions found for this repository.
                          </p>
                        </div>
                      )
                    )}

                    {suggestTagsMutation.error && (
                      <div className="mt-3">
                        <p className="text-sm text-red-600 dark:text-red-400">
                          {suggestTagsMutation.error instanceof Error
                            ? suggestTagsMutation.error.message
                            : 'Failed to get tag suggestions'}
                        </p>
                      </div>
                    )}

                    {/* AI Suggestions Section - Only shown when flag is enabled */}
                    {aiTagSuggestionsEnabled && (
                      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="size-4 text-purple-600 dark:text-purple-400" />
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            AI-powered suggestions
                          </h4>
                        </div>

                        {aiSuggestionsMutation.isPending ? (
                          <div className="flex flex-col items-center justify-center py-6">
                            <Loader2 className="size-6 text-purple-600 dark:text-purple-400 animate-spin" />
                            <p className="mt-2 text-gray-500 dark:text-gray-400 text-xs">
                              Analyzing repository with AI...
                            </p>
                          </div>
                        ) : aiTagSuggestions &&
                          (aiTagSuggestions.existingTags.length > 0 ||
                            aiTagSuggestions.suggestedNewTags.length > 0) ? (
                          <div className="space-y-3">
                            {aiTagSuggestions.existingTags.length > 0 && (
                              <div>
                                <h5 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                                  From your existing tags
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                  {aiTagSuggestions.existingTags.map(tag => (
                                    <Tag
                                      key={tag.id}
                                      title={tag.title}
                                      color={tag.color}
                                      variant="selectable"
                                      selected={selectedTags.has(tag.title)}
                                      onClick={() => toggleTag(tag.title)}
                                    />
                                  ))}
                                </div>
                              </div>
                            )}

                            {aiTagSuggestions.suggestedNewTags.length > 0 && (
                              <div>
                                <h5 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                                  New tags
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                  {aiTagSuggestions.suggestedNewTags.map(
                                    tagTitle => {
                                      const color =
                                        getPredefinedColor(tagTitle) ||
                                        getHashedTagColor(tagTitle);
                                      return (
                                        <Tag
                                          key={tagTitle}
                                          title={tagTitle}
                                          color={color}
                                          variant="selectable"
                                          selected={selectedTags.has(tagTitle)}
                                          isNew
                                          onClick={() => toggleTag(tagTitle)}
                                        />
                                      );
                                    }
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : null}
                      </div>
                    )}

                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                      <button
                        type="button"
                        onClick={handleApplyTags}
                        disabled={
                          createTagsMutation.isPending ||
                          suggestTagsMutation.isPending
                        }
                        className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 font-semibold text-sm text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2 disabled:opacity-50 sm:col-start-2"
                      >
                        {createTagsMutation.isPending ? (
                          <>
                            <Loader2 className="size-4 mr-2 animate-spin" />
                            Applying...
                          </>
                        ) : selectedTags.size > 0 ? (
                          `Apply ${selectedTags.size} tag${selectedTags.size !== 1 ? 's' : ''}`
                        ) : (
                          'Done'
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleSkipTags}
                        disabled={createTagsMutation.isPending}
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-700 px-3 py-2 font-semibold text-gray-900 dark:text-gray-100 text-sm shadow-xs ring-1 ring-gray-300 dark:ring-gray-600 ring-inset hover:bg-gray-50 dark:hover:bg-gray-600 sm:col-start-1 sm:mt-0"
                      >
                        Skip
                      </button>
                    </div>
                  </div>
                </>
              )}
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
