import {
	ArrowLongLeftIcon,
	ArrowLongRightIcon,
} from "@heroicons/react/20/solid";

export default function Example() {
	return (
		<nav className="flex items-center justify-between border-gray-200 border-t px-4 sm:px-0">
			<div className="-mt-px flex w-0 flex-1">
				<a
					href="#"
					className="inline-flex items-center border-transparent border-t-2 pt-4 pr-1 font-medium text-gray-500 text-sm hover:border-gray-300 hover:text-gray-700"
				>
					<ArrowLongLeftIcon
						aria-hidden="true"
						className="mr-3 size-5 text-gray-400"
					/>
					Previous
				</a>
			</div>
			<div className="md:-mt-px hidden md:flex">
				<a
					href="#"
					className="inline-flex items-center border-transparent border-t-2 px-4 pt-4 font-medium text-gray-500 text-sm hover:border-gray-300 hover:text-gray-700"
				>
					1
				</a>
				{/* Current: "border-indigo-500 text-indigo-600", Default: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300" */}
				<a
					href="#"
					aria-current="page"
					className="inline-flex items-center border-indigo-500 border-t-2 px-4 pt-4 font-medium text-indigo-600 text-sm"
				>
					2
				</a>
				<a
					href="#"
					className="inline-flex items-center border-transparent border-t-2 px-4 pt-4 font-medium text-gray-500 text-sm hover:border-gray-300 hover:text-gray-700"
				>
					3
				</a>
				<span className="inline-flex items-center border-transparent border-t-2 px-4 pt-4 font-medium text-gray-500 text-sm">
					...
				</span>
				<a
					href="#"
					className="inline-flex items-center border-transparent border-t-2 px-4 pt-4 font-medium text-gray-500 text-sm hover:border-gray-300 hover:text-gray-700"
				>
					8
				</a>
				<a
					href="#"
					className="inline-flex items-center border-transparent border-t-2 px-4 pt-4 font-medium text-gray-500 text-sm hover:border-gray-300 hover:text-gray-700"
				>
					9
				</a>
				<a
					href="#"
					className="inline-flex items-center border-transparent border-t-2 px-4 pt-4 font-medium text-gray-500 text-sm hover:border-gray-300 hover:text-gray-700"
				>
					10
				</a>
			</div>
			<div className="-mt-px flex w-0 flex-1 justify-end">
				<a
					href="#"
					className="inline-flex items-center border-transparent border-t-2 pt-4 pl-1 font-medium text-gray-500 text-sm hover:border-gray-300 hover:text-gray-700"
				>
					Next
					<ArrowLongRightIcon
						aria-hidden="true"
						className="ml-3 size-5 text-gray-400"
					/>
				</a>
			</div>
		</nav>
	);
}
