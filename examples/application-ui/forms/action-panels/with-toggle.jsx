'use client';

import { Description, Field, Label, Switch } from '@headlessui/react';
import { useState } from 'react';

export default function Example() {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="bg-white shadow-sm sm:rounded-lg">
      <Field className="px-4 py-5 sm:p-6">
        <Label
          as="h3"
          passive
          className="font-semibold text-base text-gray-900"
        >
          Renew subscription automatically
        </Label>
        <div className="mt-2 sm:flex sm:items-start sm:justify-between">
          <div className="max-w-xl text-gray-500 text-sm">
            <Description>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo
              totam non cumque deserunt officiis ex maiores nostrum.
            </Description>
          </div>
          <div className="mt-5 sm:mt-0 sm:ml-6 sm:flex sm:shrink-0 sm:items-center">
            <Switch
              checked={enabled}
              onChange={setEnabled}
              className="group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 data-checked:bg-indigo-600"
            >
              <span
                aria-hidden="true"
                className="inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-5"
              />
            </Switch>
          </div>
        </div>
      </Field>
    </div>
  );
}
