'use client';

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

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
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-closed:opacity-0"
        />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <DialogPanel
                transition
                className="pointer-events-auto relative w-screen max-w-md transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
              >
                <TransitionChild>
                  <div className="-ml-8 sm:-ml-10 absolute top-0 left-0 flex pt-4 pr-2 duration-500 ease-in-out data-closed:opacity-0 sm:pr-4">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="relative rounded-md text-gray-300 hover:text-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white"
                    >
                      <span className="-inset-2.5 absolute" />
                      <span className="sr-only">Close panel</span>
                      <XMarkIcon aria-hidden="true" className="size-6" />
                    </button>
                  </div>
                </TransitionChild>
                <div className="flex h-full flex-col overflow-y-auto bg-white py-6 shadow-xl">
                  <div className="px-4 sm:px-6">
                    <DialogTitle className="font-semibold text-base text-gray-900">
                      Panel title
                    </DialogTitle>
                  </div>
                  <div className="relative mt-6 flex-1 px-4 sm:px-6">
                    {/* Your content */}
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
