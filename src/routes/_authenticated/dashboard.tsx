import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { getRepositories } from '../../actions/repos';
import { getTagsWithRepositoryCount } from '../../actions/tags';
import { EmptyDashboardState } from '../../components/dashboard/EmptyDashboardState';
import { QuickActions } from '../../components/ui/QuickActions';
import { DashboardStats } from '../../components/dashboard/DashboardStats';
import { RecentRepositories } from '../../components/dashboard/RecentRepositories';
import { repositoryKeys, tagKeys } from '../../lib/query-keys';
import { Spinner } from '../../components/ui/Spinner';

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: Dashboard,
});

function Dashboard() {
  const { data: repositories = [], isLoading: isReposLoading } = useQuery({
    queryKey: repositoryKeys.all,
    queryFn: () => getRepositories(),
  });

  const { data: tags = [], isLoading: isTagsLoading } = useQuery({
    queryKey: tagKeys.withCount(),
    queryFn: () => getTagsWithRepositoryCount(),
  });

  const isLoading = isReposLoading || isTagsLoading;

  // Determine if user is new (has no repos and no tags)
  const isNewUser =
    !isLoading && repositories.length === 0 && tags.length === 0;

  // Show loading state while data is being fetched
  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Welcome Section - Show immediately */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="min-w-0 flex-1 flex flex-col gap-2">
              <h1 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
                Welcome back!
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Loading your dashboard...
              </p>
            </div>
          </div>
        </div>

        {/* Loading state */}
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1 flex flex-col gap-2">
            <h1 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
              Welcome back!
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {isNewUser
                ? "Let's get you started with organizing your repositories."
                : "Here's what's happening with your repositories and tags."}
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
          <DashboardStats
            repositories={repositories}
            tags={tags}
            isLoading={false}
          />

          {/* Quick Actions */}
          <QuickActions />

          {/* Recent Content */}
          {repositories.length > 0 && (
            <RecentRepositories repositories={repositories} />
          )}
        </div>
      )}
    </div>
  );
}
