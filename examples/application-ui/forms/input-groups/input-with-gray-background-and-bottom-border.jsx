export default function Example() {
	return (
		<div>
			<label
				htmlFor="name"
				className="block font-medium text-gray-900 text-sm/6"
			>
				Name
			</label>
			<div className="relative mt-2">
				<input
					id="name"
					name="name"
					type="text"
					placeholder="Jane Smith"
					className="peer block w-full bg-gray-50 px-3 py-1.5 text-gray-900 placeholder:text-gray-500 focus:outline-none sm:text-sm/6"
				/>
				<div
					aria-hidden="true"
					className="absolute inset-x-0 bottom-0 border-gray-300 border-t peer-focus:border-indigo-600 peer-focus:border-t-2"
				/>
			</div>
		</div>
	);
}
