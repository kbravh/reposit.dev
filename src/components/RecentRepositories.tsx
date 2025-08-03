import { Link } from '@tanstack/react-router';
import { Code, ArrowRight } from 'lucide-react';

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
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          Recent Repositories
        </h3>
        <div className="space-y-3">
          {repositories.slice(0, 5).map(repo => (
            <div
              key={repo.repositoryInstance.id}
              className="flex items-center justify-between py-2"
            >
              <div className="flex items-center space-x-3">
                <Code className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {repo.repository.org}/{repo.repository.name}
                  </p>
                  {repo.repository.description && (
                    <p className="text-sm text-gray-500 truncate max-w-md">
                      {repo.repository.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {repo.repository.primaryLanguage && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {repo.repository.primaryLanguage}
                  </span>
                )}
                <a
                  href={repo.repository.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
        {repositories.length > 5 && (
          <div className="mt-4 text-center">
            <Link
              to="/repositories"
              className="text-sm font-medium text-cyan-700 hover:text-cyan-900"
            >
              View all {repositories.length} repositories →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
