export default function Example() {
	return (
		<div className="border-gray-200 border-b pb-5 sm:flex sm:items-center sm:justify-between">
			<h3 className="font-semibold text-base text-gray-900">Job Postings</h3>
			<div className="mt-3 sm:mt-0 sm:ml-4">
				<button
					type="button"
					className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 font-semibold text-sm text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
				>
					Create new job
				</button>
			</div>
		</div>
	);
}
