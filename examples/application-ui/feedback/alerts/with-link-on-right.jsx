import { InformationCircleIcon } from "@heroicons/react/20/solid";

export default function Example() {
	return (
		<div className="rounded-md bg-blue-50 p-4">
			<div className="flex">
				<div className="shrink-0">
					<InformationCircleIcon
						aria-hidden="true"
						className="size-5 text-blue-400"
					/>
				</div>
				<div className="ml-3 flex-1 md:flex md:justify-between">
					<p className="text-blue-700 text-sm">
						A new software update is available. See what’s new in version 2.0.4.
					</p>
					<p className="mt-3 text-sm md:mt-0 md:ml-6">
						<a
							href="#"
							className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600"
						>
							Details
							<span aria-hidden="true"> &rarr;</span>
						</a>
					</p>
				</div>
			</div>
		</div>
	);
}
