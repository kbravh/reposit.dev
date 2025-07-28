import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from '@headlessui/react';
import { NavigationItem } from '../routes/_authenticated';
import { Menu, X } from 'lucide-react';
import { Link } from '@tanstack/react-router';

import { create } from 'zustand';

const useSidebarStore = create<{
  sidebarOpen: boolean;
  setSidebarOpen: (sidebarOpen: boolean) => void;
}>(set => ({
  sidebarOpen: false,
  setSidebarOpen: sidebarOpen => set({ sidebarOpen }),
}));

export default function MobileSidebar({
  navigationItems,
}: {
  navigationItems: NavigationItem[];
}) {
  const sidebarOpen = useSidebarStore(state => state.sidebarOpen);
  const setSidebarOpen = useSidebarStore(state => state.setSidebarOpen);

  return (
    <Dialog
      open={sidebarOpen}
      onClose={setSidebarOpen}
      className="relative z-50 lg:hidden"
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
                <X aria-hidden="true" className="size-6 text-white" />
              </button>
            </div>
          </TransitionChild>

          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-2 ring-1 ring-white/10">
            <div className="flex h-16 shrink-0 items-center">
              {/* TODO: Add logo */}
              <img
                alt="Reposit"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                className="h-8 w-auto"
              />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul className="-mx-2 space-y-1">
                    {navigationItems.map(item => (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          activeProps={{
                            className:
                              'bg-gray-800 text-white group flex gap-x-3 rounded-md p-2 font-semibold text-sm/6',
                          }}
                          inactiveProps={{
                            className:
                              'text-gray-400 hover:bg-gray-800 hover:text-white group flex gap-x-3 rounded-md p-2 font-semibold text-sm/6',
                          }}
                        >
                          <item.icon
                            aria-hidden="true"
                            className="size-6 shrink-0"
                          />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export function MobileSidebarButton() {
  const setSidebarOpen = useSidebarStore(state => state.setSidebarOpen);
  return (
    <button
      type="button"
      onClick={() => setSidebarOpen(true)}
      className="-m-2.5 p-2.5 text-gray-400 lg:hidden"
    >
      <span className="sr-only">Open sidebar</span>
      <Menu aria-hidden="true" className="size-6" />
    </button>
  );
}
