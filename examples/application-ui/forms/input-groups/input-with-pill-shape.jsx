export default function Example() {
	return (
		<div>
			<label
				htmlFor="name"
				className="ml-px block pl-4 font-medium text-gray-900 text-sm/6"
			>
				Name
			</label>
			<div className="mt-2">
				<input
					id="name"
					name="name"
					type="text"
					placeholder="Jane Smith"
					className="-outline-offset-1 focus:-outline-offset-2 block w-full rounded-full bg-white px-4 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
				/>
			</div>
		</div>
	);
}
