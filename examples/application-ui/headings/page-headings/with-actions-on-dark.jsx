export default function Example() {
	return (
		<div className="md:flex md:items-center md:justify-between">
			<div className="min-w-0 flex-1">
				<h2 className="font-bold text-2xl/7 text-white sm:truncate sm:text-3xl sm:tracking-tight">
					Back End Developer
				</h2>
			</div>
			<div className="mt-4 flex md:mt-0 md:ml-4">
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
	);
}
