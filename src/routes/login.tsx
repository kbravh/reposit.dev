import { createFileRoute, redirect } from '@tanstack/react-router';
import { authClient } from '../lib/auth-client';
import { SiGithub } from '@icons-pack/react-simple-icons';
import { getSession } from '../actions/auth';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

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
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGitHubSignIn = async () => {
    setIsSigningIn(true);
    await authClient.signIn.social(
      {
        provider: 'github',
        callbackURL: validateRedirectUrl(redirect),
      },
      {
        onError: ctx => {
          console.error('GitHub sign-in failed', ctx.error);
          setIsSigningIn(false);
          // TODO: Handle error - maybe show a toast or redirect to an error page
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Subtle grid background - matching landing page */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #fff 1px, transparent 1px),
              linear-gradient(to bottom, #fff 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Card container with matching border style */}
          <div className="relative">
            {/* Decorative elements - matching landing page aesthetic */}
            <div className="absolute -top-8 -right-8 h-32 w-32 bg-teal-500/10 rounded-full blur-2xl opacity-50" />
            <div className="absolute -bottom-8 -left-8 h-32 w-32 bg-cyan-500/10 rounded-full blur-2xl opacity-50" />

            <div className="relative rounded-lg border border-white/10 bg-gray-900 px-8 py-10 shadow-lg">
              <div className="text-center">
                {/* Reposit Logo - matching landing page */}
                <div className="flex justify-center">
                  <svg
                    className="h-12 w-12 text-teal-400"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width="24"
                    height="24"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>

                <h1 className="mt-6 text-3xl font-bold tracking-tight text-white">
                  Welcome to Reposit
                </h1>
                <p className="mt-3 text-base text-gray-400">
                  Sign in with GitHub to start organizing your repositories
                </p>
              </div>

              <div className="mt-8">
                <button
                  type="button"
                  disabled={isSigningIn}
                  className="group relative w-full flex justify-center items-center gap-2 bg-white text-gray-900 px-6 py-3.5 text-base font-semibold rounded-md border border-white shadow-sm hover:bg-gray-100 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:shadow-sm"
                  onClick={handleGitHubSignIn}
                >
                  {isSigningIn ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <SiGithub className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      <span>Sign in with GitHub</span>
                    </>
                  )}
                </button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  By signing in, you agree to organize your repositories with
                  the same care you put into your code
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
