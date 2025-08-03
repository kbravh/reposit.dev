import { Field, Label, Radio, RadioGroup } from '@headlessui/react';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore, type Theme } from '../stores/themeStore';
import { useEffect, useState } from 'react';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const themes = [
  {
    name: 'light',
    label: 'Light mode',
    description: 'Light background with dark text',
    icon: Sun,
  },
  {
    name: 'dark',
    label: 'Dark mode',
    description: 'Dark background with light text',
    icon: Moon,
  },
] as const;

export default function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before rendering to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Field>
      <Label className="font-medium text-base/7 text-gray-900 dark:text-white">
        Theme
      </Label>
      <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm/6">
        Choose your preferred theme for the interface.
      </p>

      <RadioGroup
        value={theme}
        onChange={(value: Theme) => setTheme(value)}
        className="mt-6"
      >
        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
          {themes.map(option => (
            <Radio
              key={option.name}
              value={option.name}
              className={({ checked, focus }) =>
                classNames(
                  'cursor-pointer focus:outline-none',
                  focus
                    ? 'ring-2 ring-indigo-600 ring-offset-2 dark:ring-offset-gray-800'
                    : '',
                  checked
                    ? 'border-transparent bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'border-gray-200 bg-white text-gray-900 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700',
                  'flex items-center justify-center rounded-md border py-3 px-3 text-sm font-medium uppercase sm:flex-1'
                )
              }
            >
              {({ checked }) => (
                <div className="flex items-center">
                  <option.icon className="mr-3 h-5 w-5" aria-hidden="true" />
                  <div className="text-left">
                    <div className="font-medium">{option.label}</div>
                    <div
                      className={classNames(
                        checked
                          ? 'text-indigo-200'
                          : 'text-gray-500 dark:text-gray-400',
                        'text-xs'
                      )}
                    >
                      {option.description}
                    </div>
                  </div>
                </div>
              )}
            </Radio>
          ))}
        </div>
      </RadioGroup>
    </Field>
  );
}
