import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';

export default function Example() {
  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex items-center justify-between gap-x-8 lg:mx-0">
        <div className="flex items-center gap-x-6">
          <img
            alt=""
            src="https://tailwindcss.com/plus-assets/img/logos/48x48/tuple.svg"
            className="size-16 flex-none rounded-full ring-1 ring-gray-900/10"
          />
          <h1>
            <div className="text-gray-500 text-sm/6">
              Invoice <span className="text-gray-700">#00011</span>
            </div>
            <div className="mt-1 font-semibold text-base text-gray-900">
              Tuple, Inc
            </div>
          </h1>
        </div>
        <div className="flex items-center gap-x-4 sm:gap-x-6">
          <button
            type="button"
            className="hidden font-semibold text-gray-900 text-sm/6 sm:block"
          >
            Copy URL
          </button>
          <a
            href="#"
            className="hidden font-semibold text-gray-900 text-sm/6 sm:block"
          >
            Edit
          </a>
          <a
            href="#"
            className="rounded-md bg-indigo-600 px-3 py-2 font-semibold text-sm text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
          >
            Send
          </a>

          <Menu as="div" className="relative sm:hidden">
            <MenuButton className="relative block">
              <span className="-inset-3 absolute" />
              <span className="sr-only">More</span>
              <EllipsisVerticalIcon
                aria-hidden="true"
                className="size-5 text-gray-500"
              />
            </MenuButton>

            <MenuItems
              transition
              className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-leave:duration-75 data-enter:ease-out data-leave:ease-in"
            >
              <MenuItem>
                <button
                  type="button"
                  className="block w-full px-3 py-1 text-left text-gray-900 text-sm/6 data-focus:bg-gray-50 data-focus:outline-hidden"
                >
                  Copy URL
                </button>
              </MenuItem>
              <MenuItem>
                <a
                  href="#"
                  className="block px-3 py-1 text-gray-900 text-sm/6 data-focus:bg-gray-50 data-focus:outline-hidden"
                >
                  Edit
                </a>
              </MenuItem>
            </MenuItems>
          </Menu>
        </div>
      </div>
    </div>
  );
}
