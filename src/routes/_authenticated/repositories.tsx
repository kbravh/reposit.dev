import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useState, lazy, Suspense } from 'react';
import { Plus, Code } from 'lucide-react';
import { getRepositories } from '../../actions/repos';
import { RepositoryListItem } from '../../components/repository/RepositoryListItem';
import { repositoryKeys } from '../../lib/query-keys';
import type { Repository } from '../../components/repository/types';

const AddRepositoryForm = lazy(() =>
  import('../../components/repository/AddRepositoryForm').then(m => ({
    default: m.AddRepositoryForm,
  }))
);

export const Route = createFileRoute('/_authenticated/repositories')({
  component: Repositories,
  loader: async () => {
    // Load repositories data on the server side
    const repositories = await getRepositories();
    return { repositories };
  },
  pendingComponent: () => <RepositoriesSkeleton />,
});

function Repositories() {
  const [isAddingRepo, setIsAddingRepo] = useState(false);

  // Get server-loaded data
  const { repositories: initialRepositories } = useLoaderData({
    from: '/_authenticated/repositories',
  }) as {
    repositories: Repository[];
  };

  // Use server-loaded data with React Query for cache management
  const { data: repositories = [] } = useQuery({
    queryKey: repositoryKeys.all,
    queryFn: () => getRepositories(),
    initialData: initialRepositories,
    staleTime: 60_000, // Cache for 1 minute
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
            className="inline-flex items-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-teal-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          >
            <Plus className="-ml-0.5 mr-1.5 h-5 w-5" />
            Add repository
          </button>
        </div>
      </div>

      {/* Repositories List */}
      <div className="mt-8">
        {repositories.length === 0 ? (
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
                className="inline-flex items-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-teal-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
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

function RepositoriesSkeleton() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <div className="h-8 w-32 rounded bg-gray-200 dark:bg-gray-700 animate-pulse mb-2" />
          <div className="h-4 w-80 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <div className="h-10 w-32 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </div>
      </div>

      <div className="mt-8">
        <ul className="divide-y divide-gray-100 dark:divide-gray-700">
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="py-5 animate-pulse">
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:gap-x-6">
                <div className="min-w-0 flex-auto">
                  <div className="h-5 w-48 rounded bg-gray-200 dark:bg-gray-700 mb-2" />
                  <div className="h-4 w-64 rounded bg-gray-200 dark:bg-gray-700 mb-2" />
                  <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="flex shrink-0 items-start">
                  <div className="h-8 w-8 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
