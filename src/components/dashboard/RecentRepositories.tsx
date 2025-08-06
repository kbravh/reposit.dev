import { Link } from '@tanstack/react-router';
import { RepositoryListItem } from '../repository/RepositoryListItem';

type Repository = {
  repositoryInstance: {
    id: string;
    userId: string;
    repositoryId: string;
    createdAt: Date;
    updatedAt: Date;
  };
  repository: {
    id: string;
    htmlUrl: string;
    org: string;
    name: string;
    description: string | null;
    private: boolean;
    provider: string;
    providerId: string;
    lastSyncedAt: Date | null;
    deletedAt: Date | null;
    createdAt: Date;
    primaryLanguage: string | null;
    updatedAt: Date;
  };
};

interface RecentRepositoriesProps {
  repositories: Repository[];
}

export function RecentRepositories({ repositories }: RecentRepositoriesProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
          Recent Repositories
        </h3>
        <ul className="divide-y divide-gray-100 dark:divide-gray-700">
          {repositories.slice(0, 5).map(repo => (
            <RepositoryListItem
              key={repo.repositoryInstance.id}
              repository={repo}
            />
          ))}
        </ul>
        {repositories.length > 5 && (
          <div className="mt-4 text-center">
            <Link
              to="/repositories"
              className="text-sm font-medium text-cyan-700 hover:text-cyan-900 dark:text-cyan-400 dark:hover:text-cyan-300"
            >
              View all {repositories.length} repositories →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
