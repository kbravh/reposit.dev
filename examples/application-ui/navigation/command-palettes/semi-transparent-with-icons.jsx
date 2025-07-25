'use client';

import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import {
  DocumentPlusIcon,
  FolderIcon,
  FolderPlusIcon,
  HashtagIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';

const projects = [
  { id: 1, name: 'Workflow Inc. / Website Redesign', url: '#' },
  // More projects...
];
const recent = [projects[0]];
const quickActions = [
  { name: 'Add new file...', icon: DocumentPlusIcon, shortcut: 'N', url: '#' },
  { name: 'Add new folder...', icon: FolderPlusIcon, shortcut: 'F', url: '#' },
  { name: 'Add hashtag...', icon: HashtagIcon, shortcut: 'H', url: '#' },
  { name: 'Add label...', icon: TagIcon, shortcut: 'L', url: '#' },
];

export default function Example() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(true);

  const filteredProjects =
    query === ''
      ? []
      : projects.filter(project => {
          return project.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Dialog
      className="relative z-10"
      open={open}
      onClose={() => {
        setOpen(false);
        setQuery('');
      }}
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/25 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-leave:duration-200 data-enter:ease-out data-leave:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto p-4 sm:p-6 md:p-20">
        <DialogPanel
          transition
          className="mx-auto max-w-2xl transform divide-y divide-gray-500/10 overflow-hidden rounded-xl bg-white/80 shadow-2xl ring-1 ring-black/5 backdrop-blur-sm backdrop-filter transition-all data-closed:scale-95 data-closed:opacity-0 data-enter:duration-300 data-leave:duration-200 data-enter:ease-out data-leave:ease-in"
        >
          <Combobox
            onChange={item => {
              if (item) {
                window.location = item.url;
              }
            }}
          >
            <div className="grid grid-cols-1">
              <ComboboxInput
                autoFocus
                className="col-start-1 row-start-1 h-12 w-full bg-transparent pr-4 pl-11 text-base text-gray-900 outline-hidden placeholder:text-gray-500 sm:text-sm"
                placeholder="Search..."
                onChange={event => setQuery(event.target.value)}
                onBlur={() => setQuery('')}
              />
              <MagnifyingGlassIcon
                className="pointer-events-none col-start-1 row-start-1 ml-4 size-5 self-center text-gray-900/40"
                aria-hidden="true"
              />
            </div>

            {(query === '' || filteredProjects.length > 0) && (
              <ComboboxOptions
                static
                as="ul"
                className="max-h-80 scroll-py-2 divide-y divide-gray-500/10 overflow-y-auto"
              >
                <li className="p-2">
                  {query === '' && (
                    <h2 className="mt-4 mb-2 px-3 font-semibold text-gray-900 text-xs">
                      Recent searches
                    </h2>
                  )}
                  <ul className="text-gray-700 text-sm">
                    {(query === '' ? recent : filteredProjects).map(project => (
                      <ComboboxOption
                        as="li"
                        key={project.id}
                        value={project}
                        className="group flex cursor-default select-none items-center rounded-md px-3 py-2 data-focus:bg-gray-900/5 data-focus:text-gray-900 data-focus:outline-hidden"
                      >
                        <FolderIcon
                          className="size-6 flex-none text-gray-900/40 group-data-focus:text-gray-900"
                          aria-hidden="true"
                        />
                        <span className="ml-3 flex-auto truncate">
                          {project.name}
                        </span>
                        <span className="ml-3 hidden flex-none text-gray-500 group-data-focus:inline">
                          Jump to...
                        </span>
                      </ComboboxOption>
                    ))}
                  </ul>
                </li>
                {query === '' && (
                  <li className="p-2">
                    <h2 className="sr-only">Quick actions</h2>
                    <ul className="text-gray-700 text-sm">
                      {quickActions.map(action => (
                        <ComboboxOption
                          as="li"
                          key={action.shortcut}
                          value={action}
                          className="group flex cursor-default select-none items-center rounded-md px-3 py-2 data-focus:bg-gray-900/5 data-focus:text-gray-900 data-focus:outline-hidden"
                        >
                          <action.icon
                            className="size-6 flex-none text-gray-900/40 group-data-focus:text-gray-900"
                            aria-hidden="true"
                          />
                          <span className="ml-3 flex-auto truncate">
                            {action.name}
                          </span>
                          <span className="ml-3 flex-none font-semibold text-gray-500 text-xs">
                            <kbd className="font-sans">⌘</kbd>
                            <kbd className="font-sans">{action.shortcut}</kbd>
                          </span>
                        </ComboboxOption>
                      ))}
                    </ul>
                  </li>
                )}
              </ComboboxOptions>
            )}

            {query !== '' && filteredProjects.length === 0 && (
              <div className="px-6 py-14 text-center sm:px-14">
                <FolderIcon
                  className="mx-auto size-6 text-gray-900/40"
                  aria-hidden="true"
                />
                <p className="mt-4 text-gray-900 text-sm">
                  We couldn't find any projects with that term. Please try
                  again.
                </p>
              </div>
            )}
          </Combobox>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
