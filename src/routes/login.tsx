import { createFileRoute, redirect, useRouter } from '@tanstack/react-router';
import { authClient } from '../lib/auth-client';
import { SiGithub } from '@icons-pack/react-simple-icons';
import { getSession } from '../actions/auth';
import { z } from 'zod';

const loginSearchSchema = z.object({
  redirect: z.string().optional(),
});

// Utility function to validate redirect URLs to prevent open redirect vulnerabilities
function validateRedirectUrl(url: string | undefined): string {
  if (!url) return '/dashboard';

  // Only allow relative URLs that start with '/'
  // This prevents redirecting to external sites
  if (url.startsWith('/') && !url.startsWith('//')) {
    return url;
  }

  // If the URL is invalid, default to dashboard
  return '/dashboard';
}

export const Route = createFileRoute('/login')({
  component: LoginPage,
  validateSearch: loginSearchSchema,
  beforeLoad: async ({ search }) => {
    const session = await getSession();
    if (session) {
      // If user is already logged in, redirect to their intended destination or dashboard
      // Use validation function to prevent open redirect vulnerabilities
      throw redirect({ to: validateRedirectUrl(search.redirect) });
    }
  },
});

function LoginPage() {
  const { redirect } = Route.useSearch();
  const router = useRouter();

  const handleGitHubSignIn = async () => {
    await authClient.signIn.social(
      {
        provider: 'github',
      },
      {
        onSuccess: () => {
          // Redirect to the intended destination or dashboard
          // Use validation function to prevent open redirect vulnerabilities
          router.navigate({ to: validateRedirectUrl(redirect) });
        },
        onError: ctx => {
          console.error('GitHub sign-in failed', ctx.error);
          // TODO: Handle error - maybe show a toast or redirect to an error page
        },
      }
    );
  };

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8">
        <div>
          <img
            className="mx-auto h-12 w-auto"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            alt="Reposit"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Welcome to Reposit - manage your repositories with ease
          </p>
        </div>
        <div>
          <button
            type="button"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-400 transition-colors duration-200"
            onClick={handleGitHubSignIn}
          >
            <SiGithub className="size-5 mr-2" />
            Sign in with GitHub
          </button>
        </div>
      </div>
    </div>
  );
}
