import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { type FormEvent } from 'react';
import { Search, Plus, Code } from 'lucide-react';
import { getRepositories, createRepository } from '../../actions/repos';
import { RepositoryListItem } from '../../components/RepositoryListItem';

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

      {/* Repositories List */}
      <div className="mt-8">
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
          <ul className="divide-y divide-gray-100">
            {filteredRepositories.map(item => (
              <RepositoryListItem
                key={item.repositoryInstance.id}
                repository={item}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
