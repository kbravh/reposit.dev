import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { 
  Code, 
  Tag, 
  Plus, 
  ArrowRight, 
  GitBranch, 
  Star,
  Users,
  Calendar
} from 'lucide-react';
import { getRepositories } from '../../actions/repos';
import { getTagsWithRepositoryCount } from '../../actions/tags';
import { authClient } from '../../lib/auth-client';

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: Dashboard,
});

function Dashboard() {
  const { data: user } = useQuery({
    queryKey: ['session'],
    queryFn: () => authClient.getSession().then(res => res.data?.user),
  });

  const { data: repositories = [], isLoading: reposLoading } = useQuery({
    queryKey: ['repositories'],
    queryFn: () => getRepositories(),
  });

  const { data: tags = [], isLoading: tagsLoading } = useQuery({
    queryKey: ['tags-with-count'],
    queryFn: () => getTagsWithRepositoryCount(),
  });

  const isNewUser = repositories.length === 0 && tags.length === 0;
  const hasRepos = repositories.length > 0;
  const hasTags = tags.length > 0;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="border-b border-gray-200 pb-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Welcome back{user?.name ? `, ${user.name}` : ''}!
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {isNewUser 
                ? "Let's get you started with organizing your repositories."
                : "Here's what's happening with your repositories and tags."
              }
            </p>
          </div>
        </div>
      </div>

      {isNewUser ? (
        /* Empty State for New Users */
        <EmptyDashboardState />
      ) : (
        /* Dashboard Content for Existing Users */
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Code className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Repositories
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {repositories.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link 
                    to="/repositories" 
                    className="font-medium text-cyan-700 hover:text-cyan-900"
                  >
                    View all
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Tag className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Tags
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {tags.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link 
                    to="/tags" 
                    className="font-medium text-cyan-700 hover:text-cyan-900"
                  >
                    Manage tags
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <GitBranch className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Languages
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {new Set(repositories.map(r => r.primaryLanguage).filter(Boolean)).size}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm text-gray-500">
                  Unique languages
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Star className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Tagged Repos
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {tags.reduce((sum, tag) => sum + tag.repositoryCount, 0)}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm text-gray-500">
                  Total tag assignments
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <QuickActions />

          {/* Recent Content */}
          {hasRepos && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  Recent Repositories
                </h3>
                <div className="space-y-3">
                  {repositories.slice(0, 5).map((repo) => (
                    <div key={repo.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-3">
                        <Code className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {repo.org}/{repo.name}
                          </p>
                          {repo.description && (
                            <p className="text-sm text-gray-500 truncate max-w-md">
                              {repo.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {repo.primaryLanguage && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {repo.primaryLanguage}
                          </span>
                        )}
                        <a
                          href={repo.htmlUrl}
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
          )}
        </div>
      )}
    </div>
  );
}

function EmptyDashboardState() {
  const quickStartItems = [
    {
      title: 'Add Your First Repository',
      description: 'Connect a GitHub repository to start organizing your code.',
      icon: Code,
      href: '/repositories',
      background: 'bg-blue-500',
      action: 'Add Repository'
    },
    {
      title: 'Create Tags',
      description: 'Organize your repositories with custom tags and categories.',
      icon: Tag,
      href: '/tags',
      background: 'bg-green-500',
      action: 'Create Tag'
    },
    {
      title: 'Explore Lists',
      description: 'Create and manage lists to group related repositories.',
      icon: Users,
      href: '/lists',
      background: 'bg-purple-500',
      action: 'View Lists'
    },
    {
      title: 'Customize Settings',
      description: 'Personalize your experience and manage preferences.',
      icon: Calendar,
      href: '/settings',
      background: 'bg-orange-500',
      action: 'Open Settings'
    },
  ];

  return (
    <div className="text-center">
      <div className="mx-auto max-w-lg">
        <svg
          fill="none"
          stroke="currentColor"
          viewBox="0 0 48 48"
          aria-hidden="true"
          className="mx-auto h-12 w-12 text-gray-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5a2 2 0 00-2 2v8a2 2 0 002 2h14m-5-8v2m0 0v2m0-2h2m-2 0H9m18-8a2 2 0 012 2v8a2 2 0 01-2 2H27"
          />
        </svg>
        <h2 className="mt-2 text-base font-semibold text-gray-900">
          Let's get you started!
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Welcome to Reposit! Choose one of the options below to begin organizing your repositories.
        </p>
      </div>

      <ul className="mt-8 grid grid-cols-1 gap-6 border-b border-t border-gray-200 py-6 sm:grid-cols-2">
        {quickStartItems.map((item, itemIdx) => (
          <li key={itemIdx} className="flow-root">
            <div className="relative -m-2 flex items-center space-x-4 rounded-xl p-2 focus-within:ring-2 focus-within:ring-indigo-500 hover:bg-gray-50">
              <div
                className={`${item.background} flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg`}
              >
                <item.icon aria-hidden="true" className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-medium text-gray-900">
                  <Link to={item.href} className="focus:outline-none">
                    <span aria-hidden="true" className="absolute inset-0" />
                    <span>{item.title}</span>
                    <span aria-hidden="true"> →</span>
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-gray-500">{item.description}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <Link
          to="/repositories"
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Your First Repository
        </Link>
      </div>
    </div>
  );
}

function QuickActions() {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/repositories"
            className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 hover:bg-gray-50 rounded-lg border border-gray-200"
          >
            <div>
              <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-700 ring-4 ring-white">
                <Code className="h-6 w-6" />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium">
                <span className="absolute inset-0" aria-hidden="true" />
                Add Repository
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Connect a new GitHub repository to your collection.
              </p>
            </div>
            <span
              className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
              aria-hidden="true"
            >
              <Plus className="h-6 w-6" />
            </span>
          </Link>

          <Link
            to="/tags"
            className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 hover:bg-gray-50 rounded-lg border border-gray-200"
          >
            <div>
              <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
                <Tag className="h-6 w-6" />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium">
                <span className="absolute inset-0" aria-hidden="true" />
                Create Tag
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Organize repositories with custom tags and labels.
              </p>
            </div>
            <span
              className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
              aria-hidden="true"
            >
              <Plus className="h-6 w-6" />
            </span>
          </Link>

          <Link
            to="/settings"
            className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 hover:bg-gray-50 rounded-lg border border-gray-200"
          >
            <div>
              <span className="rounded-lg inline-flex p-3 bg-purple-50 text-purple-700 ring-4 ring-white">
                <Calendar className="h-6 w-6" />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium">
                <span className="absolute inset-0" aria-hidden="true" />
                Manage Settings
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Customize your experience and preferences.
              </p>
            </div>
            <span
              className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
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
