import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { getSession } from '../actions/auth';
import { SiGithub } from '@icons-pack/react-simple-icons';
import { Code, Tag, List, GitBranch, Search, Zap } from 'lucide-react';

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const session = await getSession();
    if (session) {
      throw redirect({ to: '/dashboard' });
    }
  },
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="relative bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              {/* Logo SVG */}
              <svg
                className="h-8 w-8 text-indigo-600"
                viewBox="0 0 24 24"
                fill="currentColor"
                width="24"
                height="24"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span className="ml-2 text-xl font-bold text-gray-900">
                Reposit
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Sign in
              </Link>
              <Link
                to="/login"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-white pt-12 pb-20 sm:pt-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Your Repository Management Hub
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              Keep track of repositories that matter. Organize, tag, and manage
              your GitHub repositories with powerful lists and intuitive
              workflows.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-x-6">
              <Link
                to="/login"
                className="bg-indigo-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 rounded-md flex items-center gap-2"
              >
                <SiGithub className="h-5 w-5" />
                Sign up with GitHub
              </Link>
              <a
                href="#features"
                className="text-lg font-semibold leading-6 text-gray-900"
              >
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to manage repositories
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Powerful features designed for developers who want to stay
              organized and productive.
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-indigo-600">
                <GitBranch className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900">
                Easy Repository Adding
              </h3>
              <p className="mt-2 text-gray-600">
                Add repositories to your collection by URL or org/name. Keep
                track of projects that inspire you.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-indigo-600">
                <Tag className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900">
                Smart Tagging System
              </h3>
              <p className="mt-2 text-gray-600">
                Organize with tags that automatically use GitHub&apos;s language
                colors. Tag by language, framework, or custom categories.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-indigo-600">
                <List className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900">
                Dynamic Lists
              </h3>
              <p className="mt-2 text-gray-600">
                Create powerful lists using tag filters. Include or exclude tags
                to build collections that update automatically.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-indigo-600">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900">
                Keyboard Shortcuts
              </h3>
              <p className="mt-2 text-gray-600">
                Power user features with keyboard shortcuts for common tasks.
                Navigate and manage repositories lightning-fast.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-indigo-600">
                <Code className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900">
                Language Intelligence
              </h3>
              <p className="mt-2 text-gray-600">
                Automatic language detection and color coding using
                GitHub&apos;s official language color scheme.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-indigo-600">
                <Search className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900">
                Team Management
              </h3>
              <p className="mt-2 text-gray-600">
                Perfect for teams managing multiple repositories. Keep everyone
                organized and on the same page.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to organize your repositories?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-indigo-200">
              Join developers who are already using Reposit to stay organized
              and productive.
            </p>
            <div className="mt-8">
              <Link
                to="/login"
                className="bg-white px-6 py-3 text-lg font-semibold text-indigo-600 shadow-sm hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded-md flex items-center gap-2 mx-auto"
              >
                <SiGithub className="h-5 w-5" />
                Get started with GitHub
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <svg
              className="h-6 w-6 text-indigo-600"
              viewBox="0 0 24 24"
              fill="currentColor"
              width="24"
              height="24"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="ml-2 text-lg font-semibold text-gray-900">
              Reposit
            </span>
          </div>
          <p className="mt-4 text-center text-sm text-gray-600">
            The ultimate repository management tool for developers.
          </p>
        </div>
      </footer>
    </div>
  );
}
