export default function Example() {
	return (
		<div className="-outline-offset-1 focus-within:-outline-offset-2 rounded-md bg-white px-3 pt-2.5 pb-1.5 outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-indigo-600">
			<label htmlFor="name" className="block font-medium text-gray-900 text-xs">
				Name
			</label>
			<input
				id="name"
				name="name"
				type="text"
				placeholder="Jane Smith"
				className="block w-full text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
			/>
		</div>
	);
}
