"use client";

import {
	Label,
	Listbox,
	ListboxButton,
	ListboxOption,
	ListboxOptions,
} from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/16/solid";
import { CheckIcon } from "@heroicons/react/20/solid";
import { useState } from "react";

const people = [
	{ id: 1, name: "Wade Cooper" },
	{ id: 2, name: "Arlene Mccoy" },
	{ id: 3, name: "Devon Webb" },
	{ id: 4, name: "Tom Cook" },
	{ id: 5, name: "Tanya Fox" },
	{ id: 6, name: "Hellen Schmidt" },
	{ id: 7, name: "Caroline Schultz" },
	{ id: 8, name: "Mason Heaney" },
	{ id: 9, name: "Claudie Smitham" },
	{ id: 10, name: "Emil Schaefer" },
];

export default function Example() {
	const [selected, setSelected] = useState(people[3]);

	return (
		<Listbox value={selected} onChange={setSelected}>
			<Label className="block font-medium text-gray-900 text-sm/6">
				Assigned to
			</Label>
			<div className="relative mt-2">
				<ListboxButton className="-outline-offset-1 focus:-outline-offset-2 grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6">
					<span className="col-start-1 row-start-1 truncate pr-6">
						{selected.name}
					</span>
					<ChevronUpDownIcon
						aria-hidden="true"
						className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
					/>
				</ListboxButton>

				<ListboxOptions
					transition
					className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-hidden data-closed:data-leave:opacity-0 data-leave:transition data-leave:duration-100 data-leave:ease-in sm:text-sm"
				>
					{people.map((person) => (
						<ListboxOption
							key={person.id}
							value={person}
							className="group relative cursor-default select-none py-2 pr-9 pl-3 text-gray-900 data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden"
						>
							<span className="block truncate font-normal group-data-selected:font-semibold">
								{person.name}
							</span>

							<span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-not-data-selected:hidden group-data-focus:text-white">
								<CheckIcon aria-hidden="true" className="size-5" />
							</span>
						</ListboxOption>
					))}
				</ListboxOptions>
			</div>
		</Listbox>
	);
}
