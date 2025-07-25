'use client';

import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Label,
} from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';

const people = [
  { id: 1, name: 'Leslie Alexander', online: true },
  // More users...
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Example() {
  const [query, setQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState(null);

  const filteredPeople =
    query === ''
      ? people
      : people.filter(person => {
          return person.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Combobox
      as="div"
      value={selectedPerson}
      onChange={person => {
        setQuery('');
        setSelectedPerson(person);
      }}
    >
      <Label className="block font-medium text-gray-900 text-sm/6">
        Assigned to
      </Label>
      <div className="relative mt-2">
        <ComboboxInput
          className="-outline-offset-1 focus:-outline-offset-2 block w-full rounded-md bg-white py-1.5 pr-12 pl-3 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
          onChange={event => setQuery(event.target.value)}
          onBlur={() => setQuery('')}
          displayValue={person => person?.name}
        />
        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-hidden">
          <ChevronUpDownIcon
            className="size-5 text-gray-400"
            aria-hidden="true"
          />
        </ComboboxButton>

        {filteredPeople.length > 0 && (
          <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-hidden sm:text-sm">
            {filteredPeople.map(person => (
              <ComboboxOption
                key={person.id}
                value={person}
                className="group relative cursor-default select-none py-2 pr-9 pl-3 text-gray-900 data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden"
              >
                <div className="flex items-center">
                  <span
                    className={classNames(
                      'inline-block size-2 shrink-0 rounded-full',
                      person.online ? 'bg-green-400' : 'bg-gray-200'
                    )}
                    aria-hidden="true"
                  />
                  <span className="ml-3 truncate group-data-selected:font-semibold">
                    {person.name}
                    <span className="sr-only">
                      {' '}
                      is {person.online ? 'online' : 'offline'}
                    </span>
                  </span>
                </div>

                <span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-indigo-600 group-data-selected:flex group-data-focus:text-white">
                  <CheckIcon className="size-5" aria-hidden="true" />
                </span>
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        )}
      </div>
    </Combobox>
  );
}
