/// <reference types="vite/client" />
import type { ReactNode } from 'react';
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from '@tanstack/react-router';
import appCss from '../styles/app.css?url';
import { wrapCreateRootRouteWithSentry } from '@sentry/tanstackstart-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { initializeTheme } from '../stores/themeStore';
import { NavigationProgressBar } from '../components/navigation/NavigationLoadingIndicator';
import { LaunchDarklyProvider } from '../components/providers/LaunchDarklyProvider';

const queryClient = new QueryClient();

export const Route = wrapCreateRootRouteWithSentry(createRootRoute)({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Reposit',
      },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  beforeLoad: async () => {
    const ldClientId = process.env.LAUNCHDARKLY_CLIENT_SIDE_ID || '';
    return { ldClientId };
  },
  component: RootComponent,
  notFoundComponent: () => <div>Not found</div>,
});

function RootComponent() {
  const { ldClientId } = Route.useRouteContext();

  useEffect(() => {
    initializeTheme();
  }, []);

  return (
    <RootDocument>
      <LaunchDarklyProvider clientSideId={ldClientId}>
        <Outlet />
      </LaunchDarklyProvider>
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html className="h-full bg-white dark:bg-gray-900">
      <head>
        <script>
          {`(function() {
              const theme = localStorage.getItem('theme');
              const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

              if (theme === 'dark' || (!theme && prefersDark)) {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            })();`}
        </script>
        <HeadContent />
      </head>
      <body className="h-full">
        <QueryClientProvider client={queryClient}>
          <NavigationProgressBar />
          {children}
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
}
