import { createFileRoute } from '@tanstack/react-router';
import ThemeToggle from '../../components/ThemeToggle';

export const Route = createFileRoute('/_authenticated/settings')({
  component: Settings,
});

function Settings() {
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="pb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="py-6">
        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
          <div>
            <h2 className="font-semibold text-base/7 text-gray-900 dark:text-white">
              Appearance
            </h2>
            <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm/6">
              Customize how the interface looks and feels.
            </p>
          </div>

          <div className="md:col-span-2">
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="py-6">
        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
          <div>
            <h2 className="font-semibold text-base/7 text-gray-900 dark:text-white">
              Account
            </h2>
            <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm/6">
              Update your account information and preferences.
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Account settings coming soon...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
