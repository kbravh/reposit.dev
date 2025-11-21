import { Switch } from '@headlessui/react';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before rendering to avoid hydration issues
  useEffect(() => {
    // Valid pattern for client-only hydration check
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = theme === 'dark';

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Sun className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        <Switch
          checked={isDark}
          onChange={() => setTheme(isDark ? 'light' : 'dark')}
          className="group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 dark:bg-gray-700 dark:focus:ring-offset-gray-800 data-checked:bg-teal-600"
        >
          <span className="sr-only">Toggle theme</span>
          <span className="pointer-events-none relative inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-5">
            <span
              aria-hidden="true"
              className="absolute inset-0 flex size-full items-center justify-center transition-opacity duration-200 ease-in group-data-checked:opacity-0 group-data-checked:duration-100 group-data-checked:ease-out"
            >
              <Sun className="size-3 text-gray-400" />
            </span>
            <span
              aria-hidden="true"
              className="absolute inset-0 flex size-full items-center justify-center opacity-0 transition-opacity duration-100 ease-out group-data-checked:opacity-100 group-data-checked:duration-200 group-data-checked:ease-in"
            >
              <Moon className="size-3 text-teal-600" />
            </span>
          </span>
        </Switch>
        <Moon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
      </div>
    </div>
  );
}
