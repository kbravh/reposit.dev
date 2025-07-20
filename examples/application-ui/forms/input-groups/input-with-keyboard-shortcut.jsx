export default function Example() {
	return (
		<div>
			<label
				htmlFor="search"
				className="block font-medium text-gray-900 text-sm/6"
			>
				Quick search
			</label>
			<div className="mt-2">
				<div className="-outline-offset-1 focus-within:-outline-offset-2 flex rounded-md bg-white outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-indigo-600">
					<input
						id="search"
						name="search"
						type="text"
						className="block min-w-0 grow px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
					/>
					<div className="flex py-1.5 pr-1.5">
						<kbd className="inline-flex items-center rounded-sm border border-gray-200 px-1 font-sans text-gray-400 text-xs">
							⌘K
						</kbd>
					</div>
				</div>
			</div>
		</div>
	);
}
