import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
	BriefcaseIcon,
	CalendarIcon,
	CheckIcon,
	ChevronDownIcon,
	ChevronRightIcon,
	CurrencyDollarIcon,
	LinkIcon,
	MapPinIcon,
	PencilIcon,
} from "@heroicons/react/20/solid";

export default function Example() {
	return (
		<div className="lg:flex lg:items-center lg:justify-between">
			<div className="min-w-0 flex-1">
				<nav aria-label="Breadcrumb" className="flex">
					<ol className="flex items-center space-x-4">
						<li>
							<div className="flex">
								<a
									href="#"
									className="font-medium text-gray-500 text-sm hover:text-gray-700"
								>
									Jobs
								</a>
							</div>
						</li>
						<li>
							<div className="flex items-center">
								<ChevronRightIcon
									aria-hidden="true"
									className="size-5 shrink-0 text-gray-400"
								/>
								<a
									href="#"
									className="ml-4 font-medium text-gray-500 text-sm hover:text-gray-700"
								>
									Engineering
								</a>
							</div>
						</li>
					</ol>
				</nav>
				<h2 className="mt-2 font-bold text-2xl/7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
					Back End Developer
				</h2>
				<div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
					<div className="mt-2 flex items-center text-gray-500 text-sm">
						<BriefcaseIcon
							aria-hidden="true"
							className="mr-1.5 size-5 shrink-0 text-gray-400"
						/>
						Full-time
					</div>
					<div className="mt-2 flex items-center text-gray-500 text-sm">
						<MapPinIcon
							aria-hidden="true"
							className="mr-1.5 size-5 shrink-0 text-gray-400"
						/>
						Remote
					</div>
					<div className="mt-2 flex items-center text-gray-500 text-sm">
						<CurrencyDollarIcon
							aria-hidden="true"
							className="mr-1.5 size-5 shrink-0 text-gray-400"
						/>
						$120k &ndash; $140k
					</div>
					<div className="mt-2 flex items-center text-gray-500 text-sm">
						<CalendarIcon
							aria-hidden="true"
							className="mr-1.5 size-5 shrink-0 text-gray-400"
						/>
						Closing on January 9, 2020
					</div>
				</div>
			</div>
			<div className="mt-5 flex lg:mt-0 lg:ml-4">
				<span className="hidden sm:block">
					<button
						type="button"
						className="inline-flex items-center rounded-md bg-white px-3 py-2 font-semibold text-gray-900 text-sm shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
					>
						<PencilIcon
							aria-hidden="true"
							className="-ml-0.5 mr-1.5 size-5 text-gray-400"
						/>
						Edit
					</button>
				</span>

				<span className="ml-3 hidden sm:block">
					<button
						type="button"
						className="inline-flex items-center rounded-md bg-white px-3 py-2 font-semibold text-gray-900 text-sm shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
					>
						<LinkIcon
							aria-hidden="true"
							className="-ml-0.5 mr-1.5 size-5 text-gray-400"
						/>
						View
					</button>
				</span>

				<span className="sm:ml-3">
					<button
						type="button"
						className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 font-semibold text-sm text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
					>
						<CheckIcon aria-hidden="true" className="-ml-0.5 mr-1.5 size-5" />
						Publish
					</button>
				</span>

				{/* Dropdown */}
				<Menu as="div" className="relative ml-3 sm:hidden">
					<MenuButton className="inline-flex items-center rounded-md bg-white px-3 py-2 font-semibold text-gray-900 text-sm shadow-xs ring-1 ring-gray-300 ring-inset hover:ring-gray-400">
						More
						<ChevronDownIcon
							aria-hidden="true"
							className="-mr-1 ml-1.5 size-5 text-gray-400"
						/>
					</MenuButton>

					<MenuItems
						transition
						className="-mr-1 absolute left-0 z-10 mt-2 w-24 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-200 data-leave:duration-75 data-enter:ease-out data-leave:ease-in"
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
