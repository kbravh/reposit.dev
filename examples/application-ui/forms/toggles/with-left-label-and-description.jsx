'use client';

import { Description, Field, Label, Switch } from '@headlessui/react';
import { useState } from 'react';

export default function Example() {
  const [enabled, setEnabled] = useState(false);

  return (
    <Field className="flex items-center justify-between">
      <span className="flex grow flex-col">
        <Label
          as="span"
          passive
          className="font-medium text-gray-900 text-sm/6"
        >
          Available to hire
        </Label>
        <Description as="span" className="text-gray-500 text-sm">
          Nulla amet tempus sit accumsan. Aliquet turpis sed sit lacinia.
        </Description>
      </span>
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className="group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 data-checked:bg-indigo-600"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-5"
        />
      </Switch>
    </Field>
  );
}
