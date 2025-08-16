import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { Suspense } from 'react';
import { getRepositories } from '../../actions/repos';
import { getTagsWithRepositoryCount } from '../../actions/tags';
import { EmptyDashboardState } from '../../components/dashboard/EmptyDashboardState';
import { QuickActions } from '../../components/ui/QuickActions';
import { DashboardStats } from '../../components/dashboard/DashboardStats';
import { RecentRepositories } from '../../components/dashboard/RecentRepositories';
import { repositoryKeys, tagKeys } from '../../lib/query-keys';
import { ReactNode } from 'react';

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: Dashboard,
  pendingComponent: () => <DashboardStatsSkeleton />,
});

function Dashboard() {
  return (
    <div className="space-y-8">
      <WelcomeSection>
        {"Here's what's happening with your repositories and tags."}
      </WelcomeSection>

      <Suspense fallback={<DashboardStatsSkeleton />}>
        <DashboardStatsSection />
      </Suspense>

      <QuickActions />

      <Suspense fallback={<RecentRepositoriesSkeleton />}>
        <RecentRepositoriesSection />
      </Suspense>
    </div>
  );
}

const WelcomeSection = ({ children }: { children: ReactNode }) => (
  <div className="border-b border-gray-200 dark:border-gray-700 pb-8">
    <div className="md:flex md:items-center md:justify-between">
      <div className="min-w-0 flex-1 flex flex-col gap-2">
        <h1 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
          Welcome back!
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {children}
        </p>
      </div>
    </div>
  </div>
);

function DashboardStatsSection() {
  const { data: repositories = [] } = useQuery({
    queryKey: repositoryKeys.all,
    queryFn: () => getRepositories(),
    suspense: true,
    staleTime: 60_000,
  });
  const { data: tags = [] } = useQuery({
    queryKey: tagKeys.withCount(),
    queryFn: () => getTagsWithRepositoryCount(),
    suspense: true,
    staleTime: 60_000,
  });

  const isNewUser = repositories.length === 0 && tags.length === 0;

  return isNewUser ? (
    <EmptyDashboardState />
  ) : (
    <DashboardStats repositories={repositories} tags={tags} isLoading={false} />
  );
}

function RecentRepositoriesSection() {
  const { data: repositories = [] } = useQuery({
    queryKey: repositoryKeys.all,
    queryFn: () => getRepositories(),
    suspense: true,
    staleTime: 60_000,
  });

  if (repositories.length === 0) return null;
  return <RecentRepositories repositories={repositories} />;
}

function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
        >
          <div className="p-5 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="h-6 w-6 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1">
                <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700 mb-2" />
                <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
            <div className="h-3 w-20 rounded bg-gray-200 dark:bg-gray-600" />
          </div>
        </div>
      ))}
    </div>
  );
}

function RecentRepositoriesSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="h-5 w-48 rounded bg-gray-200 dark:bg-gray-700 mb-4 animate-pulse" />
        <ul className="divide-y divide-gray-100 dark:divide-gray-700">
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="py-4">
              <div className="h-6 w-full rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
