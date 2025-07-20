export default function Example() {
	return (
		<div className="bg-white shadow-sm sm:rounded-lg">
			<div className="px-4 py-5 sm:p-6">
				<div className="sm:flex sm:items-start sm:justify-between">
					<div>
						<h3 className="font-semibold text-base text-gray-900">
							Manage subscription
						</h3>
						<div className="mt-2 max-w-xl text-gray-500 text-sm">
							<p>
								Lorem ipsum dolor sit amet consectetur adipisicing elit.
								Recusandae voluptatibus corrupti atque repudiandae nam.
							</p>
						</div>
					</div>
					<div className="mt-5 sm:mt-0 sm:ml-6 sm:flex sm:shrink-0 sm:items-center">
						<button
							type="button"
							className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 font-semibold text-sm text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
						>
							Change plan
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
