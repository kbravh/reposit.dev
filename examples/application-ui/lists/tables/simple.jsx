const people = [
	{
		name: "Lindsay Walton",
		title: "Front-end Developer",
		email: "lindsay.walton@example.com",
		role: "Member",
	},
	// More people...
];

export default function Example() {
	return (
		<div className="px-4 sm:px-6 lg:px-8">
			<div className="sm:flex sm:items-center">
				<div className="sm:flex-auto">
					<h1 className="font-semibold text-base text-gray-900">Users</h1>
					<p className="mt-2 text-gray-700 text-sm">
						A list of all the users in your account including their name, title,
						email and role.
					</p>
				</div>
				<div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
					<button
						type="button"
						className="block rounded-md bg-indigo-600 px-3 py-2 text-center font-semibold text-sm text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
					>
						Add user
					</button>
				</div>
			</div>
			<div className="mt-8 flow-root">
				<div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8 overflow-x-auto">
					<div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
						<table className="min-w-full divide-y divide-gray-300">
							<thead>
								<tr>
									<th
										scope="col"
										className="py-3.5 pr-3 pl-4 text-left font-semibold text-gray-900 text-sm sm:pl-0"
									>
										Name
									</th>
									<th
										scope="col"
										className="px-3 py-3.5 text-left font-semibold text-gray-900 text-sm"
									>
										Title
									</th>
									<th
										scope="col"
										className="px-3 py-3.5 text-left font-semibold text-gray-900 text-sm"
									>
										Email
									</th>
									<th
										scope="col"
										className="px-3 py-3.5 text-left font-semibold text-gray-900 text-sm"
									>
										Role
									</th>
									<th scope="col" className="relative py-3.5 pr-4 pl-3 sm:pr-0">
										<span className="sr-only">Edit</span>
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{people.map((person) => (
									<tr key={person.email}>
										<td className="whitespace-nowrap py-4 pr-3 pl-4 font-medium text-gray-900 text-sm sm:pl-0">
											{person.name}
										</td>
										<td className="whitespace-nowrap px-3 py-4 text-gray-500 text-sm">
											{person.title}
										</td>
										<td className="whitespace-nowrap px-3 py-4 text-gray-500 text-sm">
											{person.email}
										</td>
										<td className="whitespace-nowrap px-3 py-4 text-gray-500 text-sm">
											{person.role}
										</td>
										<td className="relative whitespace-nowrap py-4 pr-4 pl-3 text-right font-medium text-sm sm:pr-0">
											<a
												href="#"
												className="text-indigo-600 hover:text-indigo-900"
											>
												Edit<span className="sr-only">, {person.name}</span>
											</a>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}
