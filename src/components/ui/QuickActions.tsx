import { Link } from '@tanstack/react-router';
import { Code, Tag, Calendar, Plus, ArrowRight } from 'lucide-react';

export function QuickActions() {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/repositories"
            className="relative group bg-white dark:bg-gray-700 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-600"
          >
            <div>
              <span className="rounded-lg inline-flex p-3 bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 ring-4 ring-white dark:ring-gray-700">
                <Code className="h-6 w-6" />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                <span className="absolute inset-0" aria-hidden="true" />
                Add Repository
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Connect a new GitHub repository to your collection.
              </p>
            </div>
            <span
              className="pointer-events-none absolute top-6 right-6 text-gray-300 dark:text-gray-500 group-hover:text-gray-400 dark:group-hover:text-gray-400"
              aria-hidden="true"
            >
              <Plus className="h-6 w-6" />
            </span>
          </Link>

          <Link
            to="/tags"
            className="relative group bg-white dark:bg-gray-700 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-600"
          >
            <div>
              <span className="rounded-lg inline-flex p-3 bg-green-50 dark:bg-green-900/50 text-green-700 dark:text-green-400 ring-4 ring-white dark:ring-gray-700">
                <Tag className="h-6 w-6" />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                <span className="absolute inset-0" aria-hidden="true" />
                Create Tag
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Organize repositories with custom tags and labels.
              </p>
            </div>
            <span
              className="pointer-events-none absolute top-6 right-6 text-gray-300 dark:text-gray-500 group-hover:text-gray-400 dark:group-hover:text-gray-400"
              aria-hidden="true"
            >
              <Plus className="h-6 w-6" />
            </span>
          </Link>

          <Link
            to="/settings"
            className="relative group bg-white dark:bg-gray-700 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-600"
          >
            <div>
              <span className="rounded-lg inline-flex p-3 bg-purple-50 dark:bg-purple-900/50 text-purple-700 dark:text-purple-400 ring-4 ring-white dark:ring-gray-700">
                <Calendar className="h-6 w-6" />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                <span className="absolute inset-0" aria-hidden="true" />
                Manage Settings
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Customize your experience and preferences.
              </p>
            </div>
            <span
              className="pointer-events-none absolute top-6 right-6 text-gray-300 dark:text-gray-500 group-hover:text-gray-400 dark:group-hover:text-gray-400"
              aria-hidden="true"
            >
              <ArrowRight className="h-6 w-6" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
