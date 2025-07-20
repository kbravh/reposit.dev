export default function Example() {
	return (
		<div className="border-gray-200 border-b bg-white px-4 py-5 sm:px-6">
			<div className="-mt-4 -ml-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
				<div className="mt-4 ml-4">
					<h3 className="font-semibold text-base text-gray-900">
						Job Postings
					</h3>
					<p className="mt-1 text-gray-500 text-sm">
						Lorem ipsum dolor sit amet consectetur adipisicing elit quam
						corrupti consectetur.
					</p>
				</div>
				<div className="mt-4 ml-4 shrink-0">
					<button
						type="button"
						className="relative inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 font-semibold text-sm text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
					>
						Create new job
					</button>
				</div>
			</div>
		</div>
	);
}
