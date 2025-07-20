import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
	BriefcaseIcon,
	CalendarIcon,
	CheckIcon,
	ChevronDownIcon,
	CurrencyDollarIcon,
	LinkIcon,
	MapPinIcon,
	PencilIcon,
} from "@heroicons/react/20/solid";

export default function Example() {
	return (
		<div className="lg:flex lg:items-center lg:justify-between">
			<div className="min-w-0 flex-1">
				<h2 className="font-bold text-2xl/7 text-white sm:truncate sm:text-3xl sm:tracking-tight">
					Back End Developer
				</h2>
				<div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
					<div className="mt-2 flex items-center text-gray-300 text-sm">
						<BriefcaseIcon
							aria-hidden="true"
							className="mr-1.5 size-5 shrink-0 text-gray-500"
						/>
						Full-time
					</div>
					<div className="mt-2 flex items-center text-gray-300 text-sm">
						<MapPinIcon
							aria-hidden="true"
							className="mr-1.5 size-5 shrink-0 text-gray-500"
						/>
						Remote
					</div>
					<div className="mt-2 flex items-center text-gray-300 text-sm">
						<CurrencyDollarIcon
							aria-hidden="true"
							className="mr-1.5 size-5 shrink-0 text-gray-500"
						/>
						$120k – $140k
					</div>
					<div className="mt-2 flex items-center text-gray-300 text-sm">
						<CalendarIcon
							aria-hidden="true"
							className="mr-1.5 size-5 shrink-0 text-gray-500"
						/>
						Closing on January 9, 2020
					</div>
				</div>
			</div>
			<div className="mt-5 flex lg:mt-0 lg:ml-4">
				<span className="hidden sm:block">
					<button
						type="button"
						className="inline-flex items-center rounded-md bg-white/10 px-3 py-2 font-semibold text-sm text-white shadow-xs hover:bg-white/20"
					>
						<PencilIcon aria-hidden="true" className="-ml-0.5 mr-1.5 size-5" />
						Edit
					</button>
				</span>
				<span className="ml-3 hidden sm:block">
					<button
						type="button"
						className="inline-flex items-center rounded-md bg-white/10 px-3 py-2 font-semibold text-sm text-white shadow-xs hover:bg-white/20"
					>
						<LinkIcon aria-hidden="true" className="-ml-0.5 mr-1.5 size-5" />
						View
					</button>
				</span>
				<span className="sm:ml-3">
					<button
						type="button"
						className="inline-flex items-center rounded-md bg-indigo-500 px-3 py-2 font-semibold text-sm text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-indigo-500 focus-visible:outline-offset-2"
					>
						<CheckIcon aria-hidden="true" className="-ml-0.5 mr-1.5 size-5" />
						Publish
					</button>
				</span>

				{/* Dropdown */}
				<Menu as="div" className="relative ml-3 sm:hidden">
					<MenuButton className="inline-flex items-center rounded-md bg-white/10 px-3 py-2 font-semibold text-sm text-white shadow-xs hover:bg-white/20">
						More
						<ChevronDownIcon
							aria-hidden="true"
							className="-mr-1 ml-1.5 size-5"
						/>
					</MenuButton>
					<MenuItems
						transition
						className="-ml-1 absolute left-0 z-10 mt-2 w-24 origin-top-left rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-200 data-leave:duration-75 data-enter:ease-out data-leave:ease-in"
					>
						<MenuItem>
							<a
								href="#"
								className="block px-4 py-2 text-gray-700 text-sm data-focus:bg-gray-100 data-focus:outline-hidden"
							>
								Edit
							</a>
						</MenuItem>
						<MenuItem>
							<a
								href="#"
								className="block px-4 py-2 text-gray-700 text-sm data-focus:bg-gray-100 data-focus:outline-hidden"
							>
								View
							</a>
						</MenuItem>
					</MenuItems>
				</Menu>
			</div>
		</div>
	);
}
