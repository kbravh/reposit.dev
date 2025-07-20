import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

export default function Example() {
	return (
		<div>
			<div>
				<nav aria-label="Back" className="sm:hidden">
					<a
						href="#"
						className="flex items-center font-medium text-gray-400 text-sm hover:text-gray-200"
					>
						<ChevronLeftIcon
							aria-hidden="true"
							className="-ml-1 mr-1 size-5 shrink-0 text-gray-500"
						/>
						Back
					</a>
				</nav>
				<nav aria-label="Breadcrumb" className="hidden sm:flex">
					<ol className="flex items-center space-x-4">
						<li>
							<div className="flex">
								<a
									href="#"
									className="font-medium text-gray-400 text-sm hover:text-gray-200"
								>
									Jobs
								</a>
							</div>
						</li>
						<li>
							<div className="flex items-center">
								<ChevronRightIcon
									aria-hidden="true"
									className="size-5 shrink-0 text-gray-500"
								/>
								<a
									href="#"
									className="ml-4 font-medium text-gray-400 text-sm hover:text-gray-200"
								>
									Engineering
								</a>
							</div>
						</li>
						<li>
							<div className="flex items-center">
								<ChevronRightIcon
									aria-hidden="true"
									className="size-5 shrink-0 text-gray-500"
								/>
								<a
									href="#"
									aria-current="page"
									className="ml-4 font-medium text-gray-400 text-sm hover:text-gray-200"
								>
									Back End Developer
								</a>
							</div>
						</li>
					</ol>
				</nav>
			</div>
			<div className="mt-2 md:flex md:items-center md:justify-between">
				<div className="min-w-0 flex-1">
					<h2 className="font-bold text-2xl/7 text-white sm:truncate sm:text-3xl sm:tracking-tight">
						Back End Developer
					</h2>
				</div>
				<div className="mt-4 flex shrink-0 md:mt-0 md:ml-4">
					<button
						type="button"
						className="inline-flex items-center rounded-md bg-white/10 px-3 py-2 font-semibold text-sm text-white shadow-xs hover:bg-white/20"
					>
						Edit
					</button>
					<button
						type="button"
						className="ml-3 inline-flex items-center rounded-md bg-indigo-500 px-3 py-2 font-semibold text-sm text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-indigo-500 focus-visible:outline-offset-2"
					>
						Publish
					</button>
				</div>
			</div>
		</div>
	);
}
