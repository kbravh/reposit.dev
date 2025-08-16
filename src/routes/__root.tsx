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
  component: RootComponent,
  notFoundComponent: () => <div>Not found</div>,
});

function RootComponent() {
  useEffect(() => {
    // Initialize theme from localStorage after component mounts
    initializeTheme();
  }, []);

  return (
    <RootDocument>
      <Outlet />
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
          {/* Global navigation loading indicator */}
          <NavigationProgressBar />
          {children}
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
}
