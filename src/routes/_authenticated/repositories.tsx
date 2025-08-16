import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useState, lazy, Suspense } from 'react';
import { Plus, Code } from 'lucide-react';
import { getRepositories } from '../../actions/repos';
import { RepositoryListItem } from '../../components/repository/RepositoryListItem';
import { repositoryKeys } from '../../lib/query-keys';

const AddRepositoryForm = lazy(() =>
  import('../../components/repository/AddRepositoryForm').then(m => ({
    default: m.AddRepositoryForm,
  }))
);

export const Route = createFileRoute('/_authenticated/repositories')({
  component: Repositories,
});

function Repositories() {
  const [isAddingRepo, setIsAddingRepo] = useState(false);

  const { data: repositories = [], isLoading } = useQuery({
    queryKey: repositoryKeys.all,
    queryFn: () => getRepositories(),
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Repositories
          </h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Manage your connected repositories and track their changes.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsAddingRepo(true)}
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <Plus className="-ml-0.5 mr-1.5 h-5 w-5" />
            Add repository
          </button>
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
        ) : repositories.length === 0 ? (
          <div className="text-center py-12">
            <Code className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              No repositories
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding a repository.
            </p>
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
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {repositories.map(item => (
              <RepositoryListItem
                key={item.repositoryInstance.id}
                repository={item}
              />
            ))}
          </ul>
        )}
      </div>

      {isAddingRepo && (
        <Suspense fallback={null}>
          <AddRepositoryForm
            isOpen={isAddingRepo}
            onOpenChange={setIsAddingRepo}
          />
        </Suspense>
      )}
    </div>
  );
}
