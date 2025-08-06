import { Link } from '@tanstack/react-router';
import { Code, Tag, GitBranch, Star } from 'lucide-react';

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

type TagWithCount = {
  id: string;
  title: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  repositoryCount: number;
};

interface DashboardStatsProps {
  repositories: Repository[];
  tags: TagWithCount[];
}

export function DashboardStats({ repositories, tags }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Code className="h-6 w-6 text-gray-400 dark:text-gray-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Repositories
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                  {repositories.length}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
          <div className="text-sm">
            <Link
              to="/repositories"
              className="font-medium text-cyan-700 hover:text-cyan-900 dark:text-cyan-400 dark:hover:text-cyan-300"
            >
              View all
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Tag className="h-6 w-6 text-gray-400 dark:text-gray-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Tags
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                  {tags.length}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
          <div className="text-sm">
            <Link
              to="/tags"
              className="font-medium text-cyan-700 hover:text-cyan-900 dark:text-cyan-400 dark:hover:text-cyan-300"
            >
              Manage tags
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <GitBranch className="h-6 w-6 text-gray-400 dark:text-gray-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Languages
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                  {
                    new Set(
                      repositories
                        .map(r => r.repository.primaryLanguage)
                        .filter(Boolean)
                    ).size
                  }
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Unique languages
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Star className="h-6 w-6 text-gray-400 dark:text-gray-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Tagged Repos
                </dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                  {tags.reduce((sum, tag) => sum + tag.repositoryCount, 0)}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Total tag assignments
          </div>
        </div>
      </div>
    </div>
  );
}
