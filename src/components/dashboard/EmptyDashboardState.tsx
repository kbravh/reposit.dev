import { Link } from '@tanstack/react-router';
import { Code, Tag, Users, Calendar, Plus } from 'lucide-react';

const quickStartItems = [
  {
    title: 'Add Your First Repository',
    description: 'Connect a GitHub repository to start organizing your code.',
    icon: Code,
    href: '/repositories',
    background: 'bg-blue-500',
    action: 'Add Repository',
  },
  {
    title: 'Create Tags',
    description: 'Organize your repositories with custom tags and categories.',
    icon: Tag,
    href: '/tags',
    background: 'bg-green-500',
    action: 'Create Tag',
  },
  {
    title: 'Explore Lists',
    description: 'Create and manage lists to group related repositories.',
    icon: Users,
    href: '/lists',
    background: 'bg-purple-500',
    action: 'View Lists',
  },
  {
    title: 'Customize Settings',
    description: 'Personalize your experience and manage preferences.',
    icon: Calendar,
    href: '/settings',
    background: 'bg-orange-500',
    action: 'Open Settings',
  },
];

export function EmptyDashboardState() {
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
          Let&apos;s get you started!
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Welcome to Reposit! Choose one of the options below to begin
          organizing your repositories.
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
