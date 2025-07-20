'use client';

import { Switch } from '@headlessui/react';
import { useState } from 'react';

export default function Example() {
  const [enabled, setEnabled] = useState(false);

  return (
    <Switch
      checked={enabled}
      onChange={setEnabled}
      className="group relative inline-flex h-5 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute size-full rounded-md bg-white"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute mx-auto h-4 w-9 rounded-full bg-gray-200 transition-colors duration-200 ease-in-out group-data-checked:bg-indigo-600"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-0 inline-block size-5 transform rounded-full border border-gray-200 bg-white shadow-sm ring-0 transition-transform duration-200 ease-in-out group-data-checked:translate-x-5"
      />
    </Switch>
  );
}
