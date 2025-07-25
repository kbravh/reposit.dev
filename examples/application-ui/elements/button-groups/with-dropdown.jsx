import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

const items = [
  { name: 'Save and schedule', href: '#' },
  { name: 'Save and publish', href: '#' },
  { name: 'Export PDF', href: '#' },
];

export default function Example() {
  return (
    <div className="inline-flex rounded-md shadow-xs">
      <button
        type="button"
        className="relative inline-flex items-center rounded-l-md bg-white px-3 py-2 font-semibold text-gray-900 text-sm ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-10"
      >
        Save changes
      </button>
      <Menu as="div" className="-ml-px relative block">
        <MenuButton className="relative inline-flex items-center rounded-r-md bg-white px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-10">
          <span className="sr-only">Open options</span>
          <ChevronDownIcon aria-hidden="true" className="size-5" />
        </MenuButton>
        <MenuItems
          transition
          className="-mr-1 absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-leave:duration-75 data-enter:ease-out data-leave:ease-in"
        >
          <div className="py-1">
            {items.map(item => (
              <MenuItem key={item.name}>
                <a
                  href={item.href}
                  className="block px-4 py-2 text-gray-700 text-sm data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                >
                  {item.name}
                </a>
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      </Menu>
    </div>
  );
}
