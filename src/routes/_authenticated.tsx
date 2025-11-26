import { Home, Settings, Code, User, Tag, Loader2 } from 'lucide-react';
import {
  ElementType,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { authClient } from '../lib/auth-client';
import {
  createFileRoute,
  Link,
  Outlet,
  useLoaderData,
  useRouterState,
  useRouter,
} from '@tanstack/react-router';
import { redirect } from '@tanstack/react-router';
import { getSession } from '../actions/auth';
import { MatchRouteSpinner } from '../components/navigation/MatchRouteSpinner';

export type NavigationItem = {
  name: string;
  href: string;
  icon: ElementType;
};

const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Repositories', href: '/repositories', icon: Code },
  { name: 'Tags', href: '/tags', icon: Tag },
  // { name: 'Lists', href: '/lists', icon: List },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const LazyMobileSidebar = lazy(
  () => import('../components/layout/MobileSidebar')
);
const LazyMobileSidebarButton = lazy(() =>
  import('../components/layout/MobileSidebar').then(m => ({
    default: m.MobileSidebarButton,
  }))
);

export const Route = createFileRoute('/_authenticated')({
  component: LoggedInLayout,
  beforeLoad: async ({ location }) => {
    const session = await getSession();

    if (!session) {
      throw redirect({ to: '/login', search: { redirect: location.href } });
    }
  },
  loader: async () => {
    const session = await getSession();
    return { user: session?.user ?? null };
  },
});

function LoggedInLayout() {
  const { user } = useLoaderData({ from: '/_authenticated' }) as {
    user: { name?: string | null; image?: string | null } | null;
  };

  const router = useRouter();
  const routerState = useRouterState();

  // Render mobile-only components lazily and only on small screens
  const [hasMounted, setHasMounted] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  useEffect(() => {
    // Valid pattern for client-only setup
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasMounted(true);
    const mql = window.matchMedia('(min-width: 1024px)');
    const handler = (e: MediaQueryListEvent) => setIsLargeScreen(e.matches);
    setIsLargeScreen(mql.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // Get the current page name based on the route
  const getCurrentPageName = () => {
    const pathname = routerState.location.pathname;
    const currentNav = navigation.find(item => item.href === pathname);
    return currentNav?.name || 'Dashboard';
  };

  const handleSignOut = useCallback(() => {
    setIsSigningOut(true);
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.navigate({ to: '/' });
        },
        onError: () => {
          setIsSigningOut(false);
        },
      },
    });
  }, [router]);

  return (
    <>
      <div>
        {hasMounted && !isLargeScreen && (
          <Suspense fallback={null}>
            <LazyMobileSidebar navigationItems={navigation} />
          </Suspense>
        )}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 dark:bg-gray-900 dark:border-white/10 px-6">
            <div className="flex h-16 shrink-0 items-center">
              {/* TODO: Add logo */}
              <img
                alt="Reposit"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=teal&shade=500"
                className="h-8 w-auto"
              />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul className="-mx-2 space-y-1">
                    {navigation.map(item => (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          preload="intent"
                          activeProps={{
                            className:
                              'bg-gray-50 text-teal-600 dark:bg-gray-800 dark:text-white group flex gap-x-3 rounded-md p-2 font-semibold text-sm/6',
                          }}
                          inactiveProps={{
                            className:
                              'text-gray-700 hover:bg-gray-50 hover:text-teal-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white group flex gap-x-3 rounded-md p-2 font-semibold text-sm/6',
                          }}
                        >
                          <item.icon
                            aria-hidden="true"
                            className="size-6 shrink-0"
                          />
                          <span className="flex-1">{item.name}</span>
                          <MatchRouteSpinner
                            to={item.href}
                            size="sm"
                            className="opacity-75"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
                {user && (
                  <li className="-mx-6 mt-auto">
                    <div className="border-t border-gray-700 pt-4">
                      <div className="flex items-center gap-x-4 px-6 py-3">
                        <>
                          {user?.image ? (
                            <img
                              alt=""
                              src={user.image}
                              className="size-8 rounded-full bg-gray-800"
                            />
                          ) : (
                            <User className="size-8 rounded-full bg-gray-800" />
                          )}
                        </>
                        <div className="flex-1">
                          <span className="text-sm font-semibold text-white">
                            {user?.name}
                          </span>
                          <span className="sr-only">Your profile</span>
                        </div>
                      </div>
                      <button
                        onClick={handleSignOut}
                        disabled={isSigningOut}
                        className="w-full text-left px-6 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isSigningOut && (
                          <Loader2 className="size-4 animate-spin" />
                        )}
                        Sign out
                      </button>
                    </div>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </div>

        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white dark:bg-gray-900 px-4 py-4 shadow-xs border-b border-gray-200 dark:border-white/5 sm:px-6 lg:hidden">
          {hasMounted && !isLargeScreen && (
            <Suspense fallback={null}>
              <LazyMobileSidebarButton />
            </Suspense>
          )}
          <div className="flex-1 font-semibold text-sm/6 text-gray-900 dark:text-white">
            {getCurrentPageName()}
          </div>
          {user && (
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSigningOut && <Loader2 className="size-4 animate-spin" />}
              Sign out
            </button>
          )}
        </div>

        <main className="py-10 lg:pl-72">
          <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}
