'use client';

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/20/solid';
import { useEffect, useRef } from 'react';

export default function Example() {
  const container = useRef(null);
  const containerNav = useRef(null);
  const containerOffset = useRef(null);

  useEffect(() => {
    // Set the container scroll position based on the current time.
    const currentMinute = new Date().getHours() * 60;
    container.current.scrollTop =
      ((container.current.scrollHeight -
        containerNav.current.offsetHeight -
        containerOffset.current.offsetHeight) *
        currentMinute) /
      1440;
  }, []);

  return (
    <div className="flex h-full flex-col">
      <header className="flex flex-none items-center justify-between border-gray-200 border-b px-6 py-4">
        <h1 className="font-semibold text-base text-gray-900">
          <time dateTime="2022-01">January 2022</time>
        </h1>
        <div className="flex items-center">
          <div className="relative flex items-center rounded-md bg-white shadow-xs md:items-stretch">
            <button
              type="button"
              className="flex h-9 w-12 items-center justify-center rounded-l-md border-gray-300 border-y border-l pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50"
            >
              <span className="sr-only">Previous week</span>
              <ChevronLeftIcon className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="hidden border-gray-300 border-y px-3.5 font-semibold text-gray-900 text-sm hover:bg-gray-50 focus:relative md:block"
            >
              Today
            </button>
            <span className="-mx-px relative h-5 w-px bg-gray-300 md:hidden" />
            <button
              type="button"
              className="flex h-9 w-12 items-center justify-center rounded-r-md border-gray-300 border-y border-r pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50"
            >
              <span className="sr-only">Next week</span>
              <ChevronRightIcon className="size-5" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden md:ml-4 md:flex md:items-center">
            <Menu as="div" className="relative">
              <MenuButton
                type="button"
                className="flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 font-semibold text-gray-900 text-sm shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
              >
                Week view
                <ChevronDownIcon
                  className="-mr-1 size-5 text-gray-400"
                  aria-hidden="true"
                />
              </MenuButton>

              <MenuItems
                transition
                className="absolute right-0 z-10 mt-3 w-36 origin-top-right overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-hidden data-closed:scale-95 data-closed:opacity-0 data-enter:duration-100 data-leave:duration-75 data-enter:ease-out data-leave:ease-in"
              >
                <div className="py-1">
                  <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-gray-700 text-sm data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                    >
                      Day view
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-gray-700 text-sm data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                    >
                      Week view
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-gray-700 text-sm data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                    >
                      Month view
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-gray-700 text-sm data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                    >
                      Year view
                    </a>
                  </MenuItem>
                </div>
              </MenuItems>
            </Menu>
            <div className="ml-6 h-6 w-px bg-gray-300" />
            <button
              type="button"
              className="ml-6 rounded-md bg-indigo-600 px-3 py-2 font-semibold text-sm text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
            >
              Add event
            </button>
          </div>
          <Menu as="div" className="relative ml-6 md:hidden">
            <MenuButton className="relative flex items-center rounded-full border border-transparent text-gray-400 outline-offset-8 hover:text-gray-500">
              <span className="-inset-2 absolute" />
              <span className="sr-only">Open menu</span>
              <EllipsisHorizontalIcon className="size-5" aria-hidden="true" />
            </MenuButton>

            <MenuItems
              transition
              className="absolute right-0 z-10 mt-3 w-36 origin-top-right divide-y divide-gray-100 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-hidden data-closed:scale-95 data-closed:opacity-0 data-enter:duration-100 data-leave:duration-75 data-enter:ease-out data-leave:ease-in"
            >
              <div className="py-1">
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-gray-700 text-sm data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                  >
                    Create event
                  </a>
                </MenuItem>
              </div>
              <div className="py-1">
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-gray-700 text-sm data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                  >
                    Go to today
                  </a>
                </MenuItem>
              </div>
              <div className="py-1">
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-gray-700 text-sm data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                  >
                    Day view
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-gray-700 text-sm data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                  >
                    Week view
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-gray-700 text-sm data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                  >
                    Month view
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-gray-700 text-sm data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                  >
                    Year view
                  </a>
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
        </div>
      </header>
      <div
        ref={container}
        className="isolate flex flex-auto flex-col overflow-auto bg-white"
      >
        <div
          style={{ width: '165%' }}
          className="flex max-w-full flex-none flex-col sm:max-w-none md:max-w-full"
        >
          <div
            ref={containerNav}
            className="sticky top-0 z-30 flex-none bg-white shadow-sm ring-1 ring-black/5 sm:pr-8"
          >
            <div className="grid grid-cols-7 text-gray-500 text-sm/6 sm:hidden">
              <button
                type="button"
                className="flex flex-col items-center pt-2 pb-3"
              >
                M{' '}
                <span className="mt-1 flex size-8 items-center justify-center font-semibold text-gray-900">
                  10
                </span>
              </button>
              <button
                type="button"
                className="flex flex-col items-center pt-2 pb-3"
              >
                T{' '}
                <span className="mt-1 flex size-8 items-center justify-center font-semibold text-gray-900">
                  11
                </span>
              </button>
              <button
                type="button"
                className="flex flex-col items-center pt-2 pb-3"
              >
                W{' '}
                <span className="mt-1 flex size-8 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white">
                  12
                </span>
              </button>
              <button
                type="button"
                className="flex flex-col items-center pt-2 pb-3"
              >
                T{' '}
                <span className="mt-1 flex size-8 items-center justify-center font-semibold text-gray-900">
                  13
                </span>
              </button>
              <button
                type="button"
                className="flex flex-col items-center pt-2 pb-3"
              >
                F{' '}
                <span className="mt-1 flex size-8 items-center justify-center font-semibold text-gray-900">
                  14
                </span>
              </button>
              <button
                type="button"
                className="flex flex-col items-center pt-2 pb-3"
              >
                S{' '}
                <span className="mt-1 flex size-8 items-center justify-center font-semibold text-gray-900">
                  15
                </span>
              </button>
              <button
                type="button"
                className="flex flex-col items-center pt-2 pb-3"
              >
                S{' '}
                <span className="mt-1 flex size-8 items-center justify-center font-semibold text-gray-900">
                  16
                </span>
              </button>
            </div>

            <div className="-mr-px hidden grid-cols-7 divide-x divide-gray-100 border-gray-100 border-r text-gray-500 text-sm/6 sm:grid">
              <div className="col-end-1 w-14" />
              <div className="flex items-center justify-center py-3">
                <span>
                  Mon{' '}
                  <span className="items-center justify-center font-semibold text-gray-900">
                    10
                  </span>
                </span>
              </div>
              <div className="flex items-center justify-center py-3">
                <span>
                  Tue{' '}
                  <span className="items-center justify-center font-semibold text-gray-900">
                    11
                  </span>
                </span>
              </div>
              <div className="flex items-center justify-center py-3">
                <span className="flex items-baseline">
                  Wed{' '}
                  <span className="ml-1.5 flex size-8 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white">
                    12
                  </span>
                </span>
              </div>
              <div className="flex items-center justify-center py-3">
                <span>
                  Thu{' '}
                  <span className="items-center justify-center font-semibold text-gray-900">
                    13
                  </span>
                </span>
              </div>
              <div className="flex items-center justify-center py-3">
                <span>
                  Fri{' '}
                  <span className="items-center justify-center font-semibold text-gray-900">
                    14
                  </span>
                </span>
              </div>
              <div className="flex items-center justify-center py-3">
                <span>
                  Sat{' '}
                  <span className="items-center justify-center font-semibold text-gray-900">
                    15
                  </span>
                </span>
              </div>
              <div className="flex items-center justify-center py-3">
                <span>
                  Sun{' '}
                  <span className="items-center justify-center font-semibold text-gray-900">
                    16
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-auto">
            <div className="sticky left-0 z-10 w-14 flex-none bg-white ring-1 ring-gray-100" />
            <div className="grid flex-auto grid-cols-1 grid-rows-1">
              {/* Horizontal lines */}
              <div
                className="col-start-1 col-end-2 row-start-1 grid divide-y divide-gray-100"
                style={{ gridTemplateRows: 'repeat(48, minmax(3.5rem, 1fr))' }}
              >
                <div ref={containerOffset} className="row-end-1 h-7" />
                <div>
                  <div className="-mt-2.5 -ml-14 sticky left-0 z-20 w-14 pr-2 text-right text-gray-400 text-xs/5">
                    12AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="-mt-2.5 -ml-14 sticky left-0 z-20 w-14 pr-2 text-right text-gray-400 text-xs/5">
                    1AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="-mt-2.5 -ml-14 sticky left-0 z-20 w-14 pr-2 text-right text-gray-400 text-xs/5">
                    2AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="-mt-2.5 -ml-14 sticky left-0 z-20 w-14 pr-2 text-right text-gray-400 text-xs/5">
                    3AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="-mt-2.5 -ml-14 sticky left-0 z-20 w-14 pr-2 text-right text-gray-400 text-xs/5">
                    4AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="-mt-2.5 -ml-14 sticky left-0 z-20 w-14 pr-2 text-right text-gray-400 text-xs/5">
                    5AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="-mt-2.5 -ml-14 sticky left-0 z-20 w-14 pr-2 text-right text-gray-400 text-xs/5">
                    6AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="-mt-2.5 -ml-14 sticky left-0 z-20 w-14 pr-2 text-right text-gray-400 text-xs/5">
                    7AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="-mt-2.5 -ml-14 sticky left-0 z-20 w-14 pr-2 text-right text-gray-400 text-xs/5">
                    8AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="-mt-2.5 -ml-14 sticky left-0 z-20 w-14 pr-2 text-right text-gray-400 text-xs/5">
                    9AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="-mt-2.5 -ml-14 sticky left-0 z-20 w-14 pr-2 text-right text-gray-400 text-xs/5">
                    10AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="-mt-2.5 -ml-14 sticky left-0 z-20 w-14 pr-2 text-right text-gray-400 text-xs/5">
                    11AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="-mt-2.5 -ml-14 sticky left-0 z-20 w-14 pr-2 text-right text-gray-400 text-xs/5">
                    12PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="-mt-2.5 -ml-14 sticky left-0 z-20 w-14 pr-2 text-right text-gray-400 text-xs/5">
                    1PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="-mt-2.5 -ml-14 sticky left-0 z-20 w-14 pr-2 text-right text-gray-400 text-xs/5">
                    2PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="-mt-2.5 -ml-14 sticky left-0 z-20 w-14 pr-2 text-right text-gray-400 text-xs/5">
                    3PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="-mt-2.5 -ml-14 sticky left-0 z-20 w-14 pr-2 text-right text-gray-400 text-xs/5">
                    4PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="-mt-2.5 -ml-14 sticky left-0 z-20 w-14 pr-2 text-right text-gray-400 text-xs/5">
                    5PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="-mt-2.5 -ml-14 sticky left-0 z-20 w-14 pr-2 text-right text-gray-400 text-xs/5">
                    6PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="-mt-2.5 -ml-14 sticky left-0 z-20 w-14 pr-2 text-right text-gray-400 text-xs/5">
                    7PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="-mt-2.5 -ml-14 sticky left-0 z-20 w-14 pr-2 text-right text-gray-400 text-xs/5">
                    8PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="-mt-2.5 -ml-14 sticky left-0 z-20 w-14 pr-2 text-right text-gray-400 text-xs/5">
                    9PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="-mt-2.5 -ml-14 sticky left-0 z-20 w-14 pr-2 text-right text-gray-400 text-xs/5">
                    10PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="-mt-2.5 -ml-14 sticky left-0 z-20 w-14 pr-2 text-right text-gray-400 text-xs/5">
                    11PM
                  </div>
                </div>
                <div />
              </div>

              {/* Vertical lines */}
              <div className="col-start-1 col-end-2 row-start-1 hidden grid-cols-7 grid-rows-1 divide-x divide-gray-100 sm:grid sm:grid-cols-7">
                <div className="col-start-1 row-span-full" />
                <div className="col-start-2 row-span-full" />
                <div className="col-start-3 row-span-full" />
                <div className="col-start-4 row-span-full" />
                <div className="col-start-5 row-span-full" />
                <div className="col-start-6 row-span-full" />
                <div className="col-start-7 row-span-full" />
                <div className="col-start-8 row-span-full w-8" />
              </div>

              {/* Events */}
              <ol
                className="col-start-1 col-end-2 row-start-1 grid grid-cols-1 sm:grid-cols-7 sm:pr-8"
                style={{
                  gridTemplateRows: '1.75rem repeat(288, minmax(0, 1fr)) auto',
                }}
              >
                <li
                  className="relative mt-px flex sm:col-start-3"
                  style={{ gridRow: '74 / span 12' }}
                >
                  <a
                    href="#"
                    className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-blue-50 p-2 text-xs/5 hover:bg-blue-100"
                  >
                    <p className="order-1 font-semibold text-blue-700">
                      Breakfast
                    </p>
                    <p className="text-blue-500 group-hover:text-blue-700">
                      <time dateTime="2022-01-12T06:00">6:00 AM</time>
                    </p>
                  </a>
                </li>
                <li
                  className="relative mt-px flex sm:col-start-3"
                  style={{ gridRow: '92 / span 30' }}
                >
                  <a
                    href="#"
                    className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-pink-50 p-2 text-xs/5 hover:bg-pink-100"
                  >
                    <p className="order-1 font-semibold text-pink-700">
                      Flight to Paris
                    </p>
                    <p className="text-pink-500 group-hover:text-pink-700">
                      <time dateTime="2022-01-12T07:30">7:30 AM</time>
                    </p>
                  </a>
                </li>
                <li
                  className="relative mt-px hidden sm:col-start-6 sm:flex"
                  style={{ gridRow: '122 / span 24' }}
                >
                  <a
                    href="#"
                    className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-gray-100 p-2 text-xs/5 hover:bg-gray-200"
                  >
                    <p className="order-1 font-semibold text-gray-700">
                      Meeting with design team at Disney
                    </p>
                    <p className="text-gray-500 group-hover:text-gray-700">
                      <time dateTime="2022-01-15T10:00">10:00 AM</time>
                    </p>
                  </a>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
