import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Search, Plus, Code } from 'lucide-react';
import { getRepositories } from '../../actions/repos';
import { RepositoryListItem } from '../../components/repository/RepositoryListItem';
import { AddRepositoryForm } from '../../components/repository/AddRepositoryForm';
import { repositoryKeys } from '../../lib/query-keys';

export const Route = createFileRoute('/_authenticated/repositories')({
  component: Repositories,
});

function Repositories() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingRepo, setIsAddingRepo] = useState(false);

  const { data: repositories = [], isLoading } = useQuery({
    queryKey: repositoryKeys.all,
    queryFn: () => getRepositories(),
  });

  const filteredRepositories = repositories.filter(
    repo =>
      repo.repository.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.repository.org.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.repository.description
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Repositories</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your connected repositories and track their changes.
          </p>
        </div>
        <AddRepositoryForm
          isOpen={isAddingRepo}
          onOpenChange={setIsAddingRepo}
        />
      </div>

      {/* Search */}
      <div className="mt-6">
        <div className="grid grid-cols-1">
          <input
            type="text"
            placeholder="Search repositories..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="col-start-1 row-start-1 block w-full max-w-md rounded-md bg-white py-1.5 pl-10 pr-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
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
                  className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
