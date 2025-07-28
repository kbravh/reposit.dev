import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { type FormEvent } from 'react';
import {
  Search,
  Plus,
  ExternalLink,
  RotateCcw,
  Trash2,
  Code,
} from 'lucide-react';
import {
  getRepositories,
  createRepository,
  deleteRepository,
  syncRepository,
} from '../../actions/repos';

export const Route = createFileRoute('/_authenticated/repositories')({
  component: Repositories,
});

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

  const syncRepoMutation = useMutation({
    mutationFn: (variables: { repositoryInstanceId: string }) =>
      syncRepository({ data: variables }),
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

  const getLanguageColor = (language: string | null) => {
    const colors: Record<string, string> = {
      JavaScript: 'bg-yellow-100 text-yellow-800',
      TypeScript: 'bg-blue-100 text-blue-800',
      Python: 'bg-green-100 text-green-800',
      Java: 'bg-red-100 text-red-800',
      Go: 'bg-cyan-100 text-cyan-800',
      Rust: 'bg-orange-100 text-orange-800',
      'C++': 'bg-purple-100 text-purple-800',
      'C#': 'bg-indigo-100 text-indigo-800',
      PHP: 'bg-violet-100 text-violet-800',
      Ruby: 'bg-red-100 text-red-800',
    };
    return colors[language || ''] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
                      className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                    >
                      Language
                    </th>
                    <th
                      scope="col"
                      className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 md:table-cell"
                    >
                      Added
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
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {item.repository.primaryLanguage ? (
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getLanguageColor(
                              item.repository.primaryLanguage
                            )}`}
                          >
                            {item.repository.primaryLanguage}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {formatDate(item.repositoryInstance.createdAt)}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() =>
                              syncRepoMutation.mutate({
                                repositoryInstanceId:
                                  item.repositoryInstance.id,
                              })
                            }
                            disabled={syncRepoMutation.isPending}
                            className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                            title="Sync repository"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() =>
                              deleteRepoMutation.mutate({
                                repositoryInstanceId:
                                  item.repositoryInstance.id,
                              })
                            }
                            disabled={deleteRepoMutation.isPending}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            title="Remove repository"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
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
