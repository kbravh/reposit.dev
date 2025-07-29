import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useRef } from 'react';
import { type FormEvent, type ChangeEvent, type KeyboardEvent } from 'react';
import {
  Search,
  Plus,
  ExternalLink,
  MoreHorizontal,
  Trash2,
  Code,
  X,
} from 'lucide-react';
import {
  getRepositories,
  createRepository,
  deleteRepository,
} from '../../actions/repos';
import {
  getTags,
  getTagsForRepository,
  removeTagFromRepository,
  createManyTags,
} from '../../actions/tags';

export const Route = createFileRoute('/_authenticated/repositories')({
  component: Repositories,
});

function TagModal({
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
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: availableTags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: () => getTags(),
  });

  const { data: repositoryTags = [] } = useQuery({
    queryKey: ['repository-tags', repositoryInstanceId],
    queryFn: () => getTagsForRepository({ data: { repositoryInstanceId } }),
  });

  const removeTagMutation = useMutation({
    mutationFn: (variables: { tagId: string; repositoryInstanceId: string }) =>
      removeTagFromRepository({ data: variables }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['repository-tags', repositoryInstanceId],
      });
    },
  });

  const createTagsMutation = useMutation({
    mutationFn: (variables: {
      titles: string[];
      repositoryInstanceId: string;
    }) => createManyTags({ data: variables }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['repository-tags', repositoryInstanceId],
      });
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      setInputValue('');
    },
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500/75 transition-opacity"
          onClick={onClose}
        />
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          <div>
            <div className="mt-3 sm:mt-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                Manage Tags
              </h3>

              {/* Current tags */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {repositoryTags.map(tag => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium"
                      style={{
                        backgroundColor: tag.color + '20',
                        color: tag.color,
                      }}
                    >
                      {tag.title}
                      <button
                        onClick={() =>
                          removeTagMutation.mutate({
                            tagId: tag.id,
                            repositoryInstanceId,
                          })
                        }
                        disabled={removeTagMutation.isPending}
                        className="hover:text-red-600 focus:outline-none"
                        type="button"
                      >
                        <X className="h-4 w-4" />
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
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setTimeout(() => setIsInputFocused(false), 200)}
                  placeholder="Add new tag..."
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />

                {/* Suggestions dropdown */}
                {isInputFocused &&
                  inputValue.trim() &&
                  suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
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
                          <span
                            className="inline-block w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: tag.color }}
                          />
                          {tag.title}
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
                            <span className="inline-block w-3 h-3 rounded-full mr-2 bg-gray-400" />
                            Create &ldquo;{inputValue.toLowerCase().trim()}
                            &rdquo;
                          </button>
                        )}
                    </div>
                  )}
              </div>
            </div>
          </div>

          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RepositoryTags({
  repositoryInstanceId,
}: {
  repositoryInstanceId: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: repositoryTags = [] } = useQuery({
    queryKey: ['repository-tags', repositoryInstanceId],
    queryFn: () => getTagsForRepository({ data: { repositoryInstanceId } }),
  });

  return (
    <>
      <div className="flex flex-wrap gap-1">
        {repositoryTags.slice(0, 3).map(tag => (
          <span
            key={tag.id}
            className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium"
            style={{ backgroundColor: tag.color + '20', color: tag.color }}
          >
            {tag.title}
          </span>
        ))}
        {repositoryTags.length > 3 && (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
            +{repositoryTags.length - 3}
          </span>
        )}
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1 rounded-full border border-dashed border-gray-300 px-2 py-1 text-xs text-gray-500 hover:border-gray-400 hover:text-gray-600"
        >
          <Plus className="h-3 w-3" />
          {repositoryTags.length === 0 ? 'Add tags' : 'Edit'}
        </button>
      </div>

      <TagModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        repositoryInstanceId={repositoryInstanceId}
      />
    </>
  );
}

function Repositories() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingRepo, setIsAddingRepo] = useState(false);
  const [newRepoUrl, setNewRepoUrl] = useState('');

  const queryClient = useQueryClient();

  const { data: repositories = [], isLoading } = useQuery({
    queryKey: ['repositories'],
    queryFn: () => getRepositories(),
  });

  const createRepoMutation = useMutation({
    mutationFn: (variables: { url: string }) =>
      createRepository({ data: variables }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repositories'] });
      setIsAddingRepo(false);
      setNewRepoUrl('');
    },
  });

  const deleteRepoMutation = useMutation({
    mutationFn: (variables: { repositoryInstanceId: string }) =>
      deleteRepository({ data: variables }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repositories'] });
    },
  });

  const filteredRepositories = repositories.filter(
    repo =>
      repo.repository.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.repository.org.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.repository.description
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const handleCreateRepository = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedUrl = newRepoUrl.trim();
    if (trimmedUrl) {
      createRepoMutation.mutate({ url: trimmedUrl });
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Repositories</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your connected repositories and track their changes.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsAddingRepo(!isAddingRepo)}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <Plus className="inline-block w-4 h-4 mr-1" />
            Add repository
          </button>
        </div>
      </div>

      {/* Add Repository Form */}
      {isAddingRepo && (
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <form onSubmit={handleCreateRepository} className="flex gap-3">
            <div className="flex-1">
              <label htmlFor="repo-url" className="sr-only">
                Repository URL or org/name
              </label>
              <div className="grid grid-cols-1">
                <input
                  id="repo-url"
                  name="repo-url"
                  type="text"
                  placeholder="microsoft/TypeScript or https://github.com/microsoft/TypeScript"
                  value={newRepoUrl}
                  onChange={e => setNewRepoUrl(e.target.value)}
                  className="col-start-1 row-start-1 block w-full rounded-md bg-white py-1.5 pl-10 pr-3 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  required
                />
                <Code
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400 sm:size-4"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={createRepoMutation.isPending}
              className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
            >
              {createRepoMutation.isPending ? 'Adding...' : 'Add'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAddingRepo(false);
                setNewRepoUrl('');
              }}
              className="rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Cancel
            </button>
          </form>
          {createRepoMutation.error && (
            <p className="mt-2 text-sm text-red-600">
              {createRepoMutation.error instanceof Error
                ? createRepoMutation.error.message
                : 'Failed to add repository'}
            </p>
          )}
        </div>
      )}

      {/* Search */}
      <div className="mt-6">
        <div className="grid grid-cols-1">
          <input
            type="text"
            placeholder="Search repositories..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="col-start-1 row-start-1 block w-full max-w-md rounded-md bg-white py-1.5 pl-10 pr-3 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          />
          <Search
            aria-hidden="true"
            className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400 sm:size-4"
          />
        </div>
      </div>

      {/* Repositories Table */}
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-gray-400"></div>
                <p className="mt-2 text-sm text-gray-500">
                  Loading repositories...
                </p>
              </div>
            ) : filteredRepositories.length === 0 ? (
              <div className="text-center py-12">
                <Code className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">
                  No repositories
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchQuery
                    ? 'No repositories match your search.'
                    : 'Get started by adding a repository.'}
                </p>
                {!searchQuery && (
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => setIsAddingRepo(true)}
                      className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      <Plus className="-ml-0.5 mr-1.5 h-5 w-5" />
                      Add repository
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                    >
                      Repository
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Tags
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                    >
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredRepositories.map(item => (
                    <tr key={item.repositoryInstance.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-0">
                        <div className="flex items-center">
                          <div>
                            <div className="flex items-center">
                              <div className="text-sm font-medium text-gray-900">
                                {item.repository.org}/{item.repository.name}
                              </div>
                              <a
                                href={item.repository.htmlUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-2 text-gray-400 hover:text-gray-600"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </div>
                            {item.repository.description && (
                              <div className="text-sm text-gray-500 max-w-md truncate">
                                {item.repository.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm">
                        <RepositoryTags
                          repositoryInstanceId={item.repositoryInstance.id}
                        />
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <div className="relative">
                          <details className="group">
                            <summary className="flex cursor-pointer items-center justify-center rounded-md p-2 text-gray-400 hover:text-gray-600 focus:outline-none group-open:text-gray-600">
                              <MoreHorizontal className="h-4 w-4" />
                            </summary>
                            <div className="absolute right-0 z-10 mt-1 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              <button
                                onClick={() => {
                                  deleteRepoMutation.mutate({
                                    repositoryInstanceId:
                                      item.repositoryInstance.id,
                                  });
                                  // Close the menu by removing focus
                                  (
                                    document.activeElement as HTMLElement
                                  )?.blur();
                                }}
                                disabled={deleteRepoMutation.isPending}
                                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 disabled:opacity-50"
                              >
                                <Trash2 className="mr-3 h-4 w-4" />
                                Remove repository
                              </button>
                            </div>
                          </details>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
