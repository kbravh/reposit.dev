'use client';

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import { Bars3Icon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import {
  ChartBarSquareIcon,
  Cog6ToothIcon,
  FolderIcon,
  GlobeAltIcon,
  ServerIcon,
  SignalIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';

const navigation = [
  { name: 'Projects', href: '#', icon: FolderIcon, current: false },
  { name: 'Deployments', href: '#', icon: ServerIcon, current: false },
  { name: 'Activity', href: '#', icon: SignalIcon, current: false },
  { name: 'Domains', href: '#', icon: GlobeAltIcon, current: false },
  { name: 'Usage', href: '#', icon: ChartBarSquareIcon, current: false },
  { name: 'Settings', href: '#', icon: Cog6ToothIcon, current: true },
];
const teams = [
  { id: 1, name: 'Planetaria', href: '#', initial: 'P', current: false },
  { id: 2, name: 'Protocol', href: '#', initial: 'P', current: false },
  { id: 3, name: 'Tailwind Labs', href: '#', initial: 'T', current: false },
];
const secondaryNavigation = [
  { name: 'Account', href: '#', current: true },
  { name: 'Notifications', href: '#', current: false },
  { name: 'Billing', href: '#', current: false },
  { name: 'Teams', href: '#', current: false },
  { name: 'Integrations', href: '#', current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Example() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-900">
        <body class="h-full">
        ```
      */}
      <div>
        <Dialog
          open={sidebarOpen}
          onClose={setSidebarOpen}
          className="relative z-50 xl:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
          />

          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="data-closed:-translate-x-full relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out"
            >
              <TransitionChild>
                <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="-m-2.5 p-2.5"
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon
                      aria-hidden="true"
                      className="size-6 text-white"
                    />
                  </button>
                </div>
              </TransitionChild>

              {/* Sidebar component, swap this element with another sidebar if you like */}
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 ring-1 ring-white/10">
                <div className="flex h-16 shrink-0 items-center">
                  <img
                    alt="Your Company"
                    src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                    className="h-8 w-auto"
                  />
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul className="-mx-2 space-y-1">
                        {navigation.map(item => (
                          <li key={item.name}>
                            <a
                              href={item.href}
                              className={classNames(
                                item.current
                                  ? 'bg-gray-800 text-white'
                                  : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                                'group flex gap-x-3 rounded-md p-2 font-semibold text-sm/6'
                              )}
                            >
                              <item.icon
                                aria-hidden="true"
                                className="size-6 shrink-0"
                              />
                              {item.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                    <li>
                      <div className="font-semibold text-gray-400 text-xs/6">
                        Your teams
                      </div>
                      <ul className="-mx-2 mt-2 space-y-1">
                        {teams.map(team => (
                          <li key={team.name}>
                            <a
                              href={team.href}
                              className={classNames(
                                team.current
                                  ? 'bg-gray-800 text-white'
                                  : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                                'group flex gap-x-3 rounded-md p-2 font-semibold text-sm/6'
                              )}
                            >
                              <span className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 font-medium text-[0.625rem] text-gray-400 group-hover:text-white">
                                {team.initial}
                              </span>
                              <span className="truncate">{team.name}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                    <li className="-mx-6 mt-auto">
                      <a
                        href="#"
                        className="flex items-center gap-x-4 px-6 py-3 font-semibold text-sm/6 text-white hover:bg-gray-800"
                      >
                        <img
                          alt=""
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          className="size-8 rounded-full bg-gray-800"
                        />
                        <span className="sr-only">Your profile</span>
                        <span aria-hidden="true">Tom Cook</span>
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Static sidebar for desktop */}
        <div className="hidden xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-72 xl:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black/10 px-6 ring-1 ring-white/5">
            <div className="flex h-16 shrink-0 items-center">
              <img
                alt="Your Company"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                className="h-8 w-auto"
              />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul className="-mx-2 space-y-1">
                    {navigation.map(item => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className={classNames(
                            item.current
                              ? 'bg-gray-800 text-white'
                              : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                            'group flex gap-x-3 rounded-md p-2 font-semibold text-sm/6'
                          )}
                        >
                          <item.icon
                            aria-hidden="true"
                            className="size-6 shrink-0"
                          />
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
                <li>
                  <div className="font-semibold text-gray-400 text-xs/6">
                    Your teams
                  </div>
                  <ul className="-mx-2 mt-2 space-y-1">
                    {teams.map(team => (
                      <li key={team.name}>
                        <a
                          href={team.href}
                          className={classNames(
                            team.current
                              ? 'bg-gray-800 text-white'
                              : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                            'group flex gap-x-3 rounded-md p-2 font-semibold text-sm/6'
                          )}
                        >
                          <span className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 font-medium text-[0.625rem] text-gray-400 group-hover:text-white">
                            {team.initial}
                          </span>
                          <span className="truncate">{team.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="-mx-6 mt-auto">
                  <a
                    href="#"
                    className="flex items-center gap-x-4 px-6 py-3 font-semibold text-sm/6 text-white hover:bg-gray-800"
                  >
                    <img
                      alt=""
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      className="size-8 rounded-full bg-gray-800"
                    />
                    <span className="sr-only">Your profile</span>
                    <span aria-hidden="true">Tom Cook</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="xl:pl-72">
          {/* Sticky search header */}
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-6 border-white/5 border-b bg-gray-900 px-4 shadow-xs sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="-m-2.5 p-2.5 text-white xl:hidden"
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon aria-hidden="true" className="size-5" />
            </button>

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <form action="#" method="GET" className="grid flex-1 grid-cols-1">
                <input
                  name="search"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  className="col-start-1 row-start-1 block size-full bg-transparent pl-8 text-base text-white outline-hidden placeholder:text-gray-500 sm:text-sm/6"
                />
                <MagnifyingGlassIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 size-5 self-center text-gray-500"
                />
              </form>
            </div>
          </div>

          <main>
            <h1 className="sr-only">Account Settings</h1>

            <header className="border-white/5 border-b">
              {/* Secondary navigation */}
              <nav className="flex overflow-x-auto py-4">
                <ul className="flex min-w-full flex-none gap-x-6 px-4 font-semibold text-gray-400 text-sm/6 sm:px-6 lg:px-8">
                  {secondaryNavigation.map(item => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className={item.current ? 'text-indigo-400' : ''}
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </header>

            {/* Settings forms */}
            <div className="divide-y divide-white/5">
              <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                <div>
                  <h2 className="font-semibold text-base/7 text-white">
                    Personal Information
                  </h2>
                  <p className="mt-1 text-gray-400 text-sm/6">
                    Use a permanent address where you can receive mail.
                  </p>
                </div>

                <form className="md:col-span-2">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                    <div className="col-span-full flex items-center gap-x-8">
                      <img
                        alt=""
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        className="size-24 flex-none rounded-lg bg-gray-800 object-cover"
                      />
                      <div>
                        <button
                          type="button"
                          className="rounded-md bg-white/10 px-3 py-2 font-semibold text-sm text-white shadow-xs hover:bg-white/20"
                        >
                          Change avatar
                        </button>
                        <p className="mt-2 text-gray-400 text-xs/5">
                          JPG, GIF or PNG. 1MB max.
                        </p>
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="first-name"
                        className="block font-medium text-sm/6 text-white"
                      >
                        First name
                      </label>
                      <div className="mt-2">
                        <input
                          id="first-name"
                          name="first-name"
                          type="text"
                          autoComplete="given-name"
                          className="-outline-offset-1 focus:-outline-offset-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:outline-indigo-500 sm:text-sm/6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="last-name"
                        className="block font-medium text-sm/6 text-white"
                      >
                        Last name
                      </label>
                      <div className="mt-2">
                        <input
                          id="last-name"
                          name="last-name"
                          type="text"
                          autoComplete="family-name"
                          className="-outline-offset-1 focus:-outline-offset-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:outline-indigo-500 sm:text-sm/6"
                        />
                      </div>
                    </div>

                    <div className="col-span-full">
                      <label
                        htmlFor="email"
                        className="block font-medium text-sm/6 text-white"
                      >
                        Email address
                      </label>
                      <div className="mt-2">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          className="-outline-offset-1 focus:-outline-offset-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:outline-indigo-500 sm:text-sm/6"
                        />
                      </div>
                    </div>

                    <div className="col-span-full">
                      <label
                        htmlFor="username"
                        className="block font-medium text-sm/6 text-white"
                      >
                        Username
                      </label>
                      <div className="mt-2">
                        <div className="-outline-offset-1 focus-within:-outline-offset-2 flex items-center rounded-md bg-white/5 pl-3 outline-1 outline-white/10 focus-within:outline-2 focus-within:outline-indigo-500">
                          <div className="shrink-0 select-none text-base text-gray-500 sm:text-sm/6">
                            example.com/
                          </div>
                          <input
                            id="username"
                            name="username"
                            type="text"
                            placeholder="janesmith"
                            className="block min-w-0 grow bg-transparent py-1.5 pr-3 pl-1 text-base text-white placeholder:text-gray-500 focus:outline-none sm:text-sm/6"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-span-full">
                      <label
                        htmlFor="timezone"
                        className="block font-medium text-sm/6 text-white"
                      >
                        Timezone
                      </label>
                      <div className="mt-2 grid grid-cols-1">
                        <select
                          id="timezone"
                          name="timezone"
                          className="-outline-offset-1 focus:-outline-offset-2 col-start-1 row-start-1 w-full appearance-none rounded-md bg-white/5 py-1.5 pr-8 pl-3 text-base text-white outline-1 outline-white/10 *:bg-gray-800 focus:outline-2 focus:outline-indigo-500 sm:text-sm/6"
                        >
                          <option>Pacific Standard Time</option>
                          <option>Eastern Standard Time</option>
                          <option>Greenwich Mean Time</option>
                        </select>
                        <ChevronDownIcon
                          aria-hidden="true"
                          className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-400 sm:size-4"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex">
                    <button
                      type="submit"
                      className="rounded-md bg-indigo-500 px-3 py-2 font-semibold text-sm text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-indigo-500 focus-visible:outline-offset-2"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>

              <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                <div>
                  <h2 className="font-semibold text-base/7 text-white">
                    Change password
                  </h2>
                  <p className="mt-1 text-gray-400 text-sm/6">
                    Update your password associated with your account.
                  </p>
                </div>

                <form className="md:col-span-2">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                    <div className="col-span-full">
                      <label
                        htmlFor="current-password"
                        className="block font-medium text-sm/6 text-white"
                      >
                        Current password
                      </label>
                      <div className="mt-2">
                        <input
                          id="current-password"
                          name="current_password"
                          type="password"
                          autoComplete="current-password"
                          className="-outline-offset-1 focus:-outline-offset-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:outline-indigo-500 sm:text-sm/6"
                        />
                      </div>
                    </div>

                    <div className="col-span-full">
                      <label
                        htmlFor="new-password"
                        className="block font-medium text-sm/6 text-white"
                      >
                        New password
                      </label>
                      <div className="mt-2">
                        <input
                          id="new-password"
                          name="new_password"
                          type="password"
                          autoComplete="new-password"
                          className="-outline-offset-1 focus:-outline-offset-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:outline-indigo-500 sm:text-sm/6"
                        />
                      </div>
                    </div>

                    <div className="col-span-full">
                      <label
                        htmlFor="confirm-password"
                        className="block font-medium text-sm/6 text-white"
                      >
                        Confirm password
                      </label>
                      <div className="mt-2">
                        <input
                          id="confirm-password"
                          name="confirm_password"
                          type="password"
                          autoComplete="new-password"
                          className="-outline-offset-1 focus:-outline-offset-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:outline-indigo-500 sm:text-sm/6"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex">
                    <button
                      type="submit"
                      className="rounded-md bg-indigo-500 px-3 py-2 font-semibold text-sm text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-indigo-500 focus-visible:outline-offset-2"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>

              <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                <div>
                  <h2 className="font-semibold text-base/7 text-white">
                    Log out other sessions
                  </h2>
                  <p className="mt-1 text-gray-400 text-sm/6">
                    Please enter your password to confirm you would like to log
                    out of your other sessions across all of your devices.
                  </p>
                </div>

                <form className="md:col-span-2">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                    <div className="col-span-full">
                      <label
                        htmlFor="logout-password"
                        className="block font-medium text-sm/6 text-white"
                      >
                        Your password
                      </label>
                      <div className="mt-2">
                        <input
                          id="logout-password"
                          name="password"
                          type="password"
                          autoComplete="current-password"
                          className="-outline-offset-1 focus:-outline-offset-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:outline-indigo-500 sm:text-sm/6"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex">
                    <button
                      type="submit"
                      className="rounded-md bg-indigo-500 px-3 py-2 font-semibold text-sm text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-indigo-500 focus-visible:outline-offset-2"
                    >
                      Log out other sessions
                    </button>
                  </div>
                </form>
              </div>

              <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                <div>
                  <h2 className="font-semibold text-base/7 text-white">
                    Delete account
                  </h2>
                  <p className="mt-1 text-gray-400 text-sm/6">
                    No longer want to use our service? You can delete your
                    account here. This action is not reversible. All information
                    related to this account will be deleted permanently.
                  </p>
                </div>

                <form className="flex items-start md:col-span-2">
                  <button
                    type="submit"
                    className="rounded-md bg-red-500 px-3 py-2 font-semibold text-sm text-white shadow-xs hover:bg-red-400"
                  >
                    Yes, delete my account
                  </button>
                </form>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
