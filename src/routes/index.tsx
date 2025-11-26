import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { getSession } from '../actions/auth';
import { SiGithub } from '@icons-pack/react-simple-icons';
import { Tag, GitBranch, Sparkles } from 'lucide-react';

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const session = await getSession();
    if (session) {
      throw redirect({ to: '/dashboard' });
    }
  },
  component: Home,
});

// Sample tag colors from the app's tag system
const SAMPLE_TAGS = [
  { name: 'React', color: '#61dafb' },
  { name: 'TypeScript', color: '#3178c6' },
  { name: 'Python', color: '#3776ab' },
  { name: 'Go', color: '#00add8' },
  { name: 'Rust', color: '#dea584' },
  { name: 'Vue', color: '#42b883' },
];

function Home() {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Subtle grid background */}
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

      {/* Header */}
      <header className="relative border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-2">
              {/* Logo SVG */}
              <svg
                className="h-8 w-8 text-teal-400"
                viewBox="0 0 24 24"
                fill="currentColor"
                width="24"
                height="24"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span className="text-xl font-bold text-white">Reposit</span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-gray-400 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/login"
                className="bg-white text-gray-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors border border-white"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="h-5 w-5 text-teal-400" />
              <span className="text-sm font-medium text-teal-400 tracking-wide uppercase">
                Repository Organization Made Simple
              </span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl">
              Your GitHub{' '}
              <span className="relative">
                <span className="relative z-10">repositories</span>
                <span
                  className="absolute bottom-2 left-0 right-0 h-3 bg-teal-500/30 -rotate-1"
                  aria-hidden="true"
                />
              </span>
              <br />
              organized beautifully
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-400">
              Keep track of every repository that matters. Tag, organize, and
              find your projects with a system that&apos;s as clean and
              structured as your code.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/login"
                className="bg-white text-gray-900 px-6 py-3.5 text-base font-semibold shadow-sm hover:bg-gray-100 transition-all rounded-md border border-white flex items-center gap-2 group"
              >
                <SiGithub className="h-5 w-5 group-hover:scale-110 transition-transform" />
                Start organizing with GitHub
              </Link>
              <a
                href="#features"
                className="px-6 py-3.5 text-base font-semibold text-gray-300 hover:text-white transition-colors flex items-center gap-1 group"
              >
                See how it works
                <span
                  aria-hidden="true"
                  className="group-hover:translate-x-1 transition-transform"
                >
                  →
                </span>
              </a>
            </div>
          </div>

          {/* Visual Tag Examples */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-3 opacity-90">
            {SAMPLE_TAGS.map(tag => (
              <div
                key={tag.name}
                className="flex items-center gap-2 rounded-md border border-white/10 bg-gray-900 shadow-xs hover:shadow-sm hover:border-white/20 transition-all"
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-l-md"
                  style={{ backgroundColor: tag.color }}
                >
                  <Tag className="h-4 w-4 text-white" />
                </div>
                <span className="pr-4 text-sm font-medium text-gray-200">
                  {tag.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-24 bg-gray-900 border-y border-white/10"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Built for developers who value organization
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
              Simple, powerful tools to keep your GitHub workflow organized and
              efficient.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="relative group">
              <div className="h-full p-8 bg-gray-800 rounded-lg border border-white/10 shadow-xs hover:shadow-md hover:border-white/20 transition-all">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">
                  <GitBranch className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-white">
                  Quick Repository Tracking
                </h3>
                <p className="mt-3 text-gray-400 leading-relaxed">
                  Add any GitHub repository with a simple URL. Keep track of
                  projects you&apos;re working on, learning from, or just want
                  to remember.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="relative group">
              <div className="h-full p-8 bg-gray-800 rounded-lg border border-white/10 shadow-xs hover:shadow-md hover:border-white/20 transition-all">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-sm">
                  <Tag className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-white">
                  Colorful Smart Tags
                </h3>
                <p className="mt-3 text-gray-400 leading-relaxed">
                  Tags automatically match GitHub&apos;s language colors.
                  Organize by framework, language, or any custom category that
                  makes sense for you.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="relative group">
              <div className="h-full p-8 bg-gray-800 rounded-lg border border-white/10 shadow-xs hover:shadow-md hover:border-white/20 transition-all">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-br from-teal-500 to-teal-600 shadow-sm">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-white">
                  Clean, Focused Interface
                </h3>
                <p className="mt-3 text-gray-400 leading-relaxed">
                  A distraction-free workspace designed with the same care you
                  put into your code. Everything in its right place.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Example Section */}
      <section className="py-24 bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Your repositories, your way
              </h2>
              <p className="mt-4 text-lg text-gray-400 leading-relaxed">
                Tag repositories by language, framework, or project type. Filter
                and find what you need in seconds. Keep your GitHub stars and
                important projects organized in one beautiful dashboard.
              </p>
              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-500/20 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-teal-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">
                      Auto-synced metadata
                    </h4>
                    <p className="text-gray-400 text-sm mt-1">
                      Repository details stay up to date with GitHub
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">
                      Flexible organization
                    </h4>
                    <p className="text-gray-400 text-sm mt-1">
                      Create as many tags as you need, use what works for you
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-cyan-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">
                      Fast and lightweight
                    </h4>
                    <p className="text-gray-400 text-sm mt-1">
                      Built for speed, designed for developers
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              {/* Mock repository card */}
              <div className="rounded-lg border border-white/10 bg-gray-800 shadow-lg overflow-hidden">
                <div className="border-b border-white/10 bg-gray-900 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded bg-gray-700" />
                      <span className="font-semibold text-white font-mono text-sm">
                        awesome-project
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <p className="text-gray-400 text-sm">
                    A collection of awesome tools and libraries for modern web
                    development
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 rounded-md border border-white/10 bg-gray-900">
                      <div
                        className="h-8 w-8 shrink-0 rounded-l-md flex items-center justify-center"
                        style={{ backgroundColor: '#3178c6' }}
                      >
                        <Tag className="h-3.5 w-3.5 text-white" />
                      </div>
                      <span className="pr-3 text-xs font-medium text-gray-200">
                        TypeScript
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-md border border-white/10 bg-gray-900">
                      <div
                        className="h-8 w-8 shrink-0 rounded-l-md flex items-center justify-center"
                        style={{ backgroundColor: '#61dafb' }}
                      >
                        <Tag className="h-3.5 w-3.5 text-white" />
                      </div>
                      <span className="pr-3 text-xs font-medium text-gray-200">
                        React
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-md border border-white/10 bg-gray-900">
                      <div
                        className="h-8 w-8 shrink-0 rounded-l-md flex items-center justify-center"
                        style={{ backgroundColor: '#14b8a6' }}
                      >
                        <Tag className="h-3.5 w-3.5 text-white" />
                      </div>
                      <span className="pr-3 text-xs font-medium text-gray-200">
                        Learning
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 h-24 w-24 bg-teal-500/10 rounded-full blur-2xl opacity-50" />
              <div className="absolute -bottom-4 -left-4 h-32 w-32 bg-emerald-500/10 rounded-full blur-2xl opacity-50" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-white/10 bg-gradient-to-br from-gray-900 to-gray-950">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Start organizing today
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
              Join developers who are bringing order to their GitHub workflow.
              Free to use, easy to love.
            </p>
            <div className="mt-10">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 text-lg font-semibold shadow-lg hover:bg-gray-100 transition-all rounded-md border border-white group hover:shadow-xl"
              >
                <SiGithub className="h-5 w-5 group-hover:scale-110 transition-transform" />
                Get started with GitHub
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2">
            <svg
              className="h-6 w-6 text-teal-400"
              viewBox="0 0 24 24"
              fill="currentColor"
              width="24"
              height="24"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="text-lg font-semibold text-white">Reposit</span>
          </div>
          <p className="mt-4 text-center text-sm text-gray-400">
            Built for developers who love organized code.
          </p>
        </div>
      </footer>
    </div>
  );
}
