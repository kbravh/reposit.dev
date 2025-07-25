'use client';

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

const tabs = [
  { name: 'All', href: '#', current: true },
  { name: 'Online', href: '#', current: false },
  { name: 'Offline', href: '#', current: false },
];
const team = [
  {
    name: 'Leslie Alexander',
    handle: 'lesliealexander',
    href: '#',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'online',
  },
  // More people...
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Example() {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="rounded-md bg-gray-950/5 px-2.5 py-1.5 font-semibold text-gray-900 text-sm hover:bg-gray-950/10"
      >
        Open drawer
      </button>
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <DialogPanel
                transition
                className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
              >
                <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <DialogTitle className="font-semibold text-base text-gray-900">
                        Team
                      </DialogTitle>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          onClick={() => setOpen(false)}
                          className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus-visible:ring-2 focus-visible:ring-indigo-500"
                        >
                          <span className="-inset-2.5 absolute" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon aria-hidden="true" className="size-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="border-gray-200 border-b">
                    <div className="px-6">
                      <nav className="-mb-px flex space-x-6">
                        {tabs.map(tab => (
                          <a
                            key={tab.name}
                            href={tab.href}
                            className={classNames(
                              tab.current
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                              'whitespace-nowrap border-b-2 px-1 pb-4 font-medium text-sm'
                            )}
                          >
                            {tab.name}
                          </a>
                        ))}
                      </nav>
                    </div>
                  </div>
                  <ul className="flex-1 divide-y divide-gray-200 overflow-y-auto">
                    {team.map(person => (
                      <li key={person.handle}>
                        <div className="group relative flex items-center px-5 py-6">
                          <a
                            href={person.href}
                            className="-m-1 block flex-1 p-1"
                          >
                            <div
                              aria-hidden="true"
                              className="absolute inset-0 group-hover:bg-gray-50"
                            />
                            <div className="relative flex min-w-0 flex-1 items-center">
                              <span className="relative inline-block shrink-0">
                                <img
                                  alt=""
                                  src={person.imageUrl}
                                  className="size-10 rounded-full"
                                />
                                <span
                                  aria-hidden="true"
                                  className={classNames(
                                    person.status === 'online'
                                      ? 'bg-green-400'
                                      : 'bg-gray-300',
                                    'absolute top-0 right-0 block size-2.5 rounded-full ring-2 ring-white'
                                  )}
                                />
                              </span>
                              <div className="ml-4 truncate">
                                <p className="truncate font-medium text-gray-900 text-sm">
                                  {person.name}
                                </p>
                                <p className="truncate text-gray-500 text-sm">
                                  {`@${person.handle}`}
                                </p>
                              </div>
                            </div>
                          </a>
                          <Menu
                            as="div"
                            className="relative ml-2 inline-block shrink-0 text-left"
                          >
                            <MenuButton className="group relative inline-flex size-8 items-center justify-center rounded-full bg-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2">
                              <span className="-inset-1.5 absolute" />
                              <span className="sr-only">Open options menu</span>
                              <span className="flex size-full items-center justify-center rounded-full">
                                <EllipsisVerticalIcon
                                  aria-hidden="true"
                                  className="size-5 text-gray-400 group-hover:text-gray-500"
                                />
                              </span>
                            </MenuButton>
                            <MenuItems
                              transition
                              className="absolute top-0 right-full z-10 mr-1 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus-visible:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-leave:duration-75 data-enter:ease-out data-leave:ease-in"
                            >
                              <div className="py-1">
                                <MenuItem>
                                  <a
                                    href="#"
                                    className="block px-4 py-2 text-gray-700 text-sm data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                                  >
                                    View profile
                                  </a>
                                </MenuItem>
                                <MenuItem>
                                  <a
                                    href="#"
                                    className="block px-4 py-2 text-gray-700 text-sm data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                                  >
                                    Send message
                                  </a>
                                </MenuItem>
                              </div>
                            </MenuItems>
                          </Menu>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
