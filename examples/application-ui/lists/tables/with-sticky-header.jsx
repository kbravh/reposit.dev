const people = [
	{
		name: "Lindsay Walton",
		title: "Front-end Developer",
		email: "lindsay.walton@example.com",
		role: "Member",
	},
	// More people...
];

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

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
				<div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
					<div className="inline-block min-w-full py-2 align-middle">
						<table className="min-w-full border-separate border-spacing-0">
							<thead>
								<tr>
									<th
										scope="col"
										className="sticky top-0 z-10 border-gray-300 border-b bg-white/75 py-3.5 pr-3 pl-4 text-left font-semibold text-gray-900 text-sm backdrop-blur-sm backdrop-filter sm:pl-6 lg:pl-8"
									>
										Name
									</th>
									<th
										scope="col"
										className="sticky top-0 z-10 hidden border-gray-300 border-b bg-white/75 px-3 py-3.5 text-left font-semibold text-gray-900 text-sm backdrop-blur-sm backdrop-filter sm:table-cell"
									>
										Title
									</th>
									<th
										scope="col"
										className="sticky top-0 z-10 hidden border-gray-300 border-b bg-white/75 px-3 py-3.5 text-left font-semibold text-gray-900 text-sm backdrop-blur-sm backdrop-filter lg:table-cell"
									>
										Email
									</th>
									<th
										scope="col"
										className="sticky top-0 z-10 border-gray-300 border-b bg-white/75 px-3 py-3.5 text-left font-semibold text-gray-900 text-sm backdrop-blur-sm backdrop-filter"
									>
										Role
									</th>
									<th
										scope="col"
										className="sticky top-0 z-10 border-gray-300 border-b bg-white/75 py-3.5 pr-4 pl-3 backdrop-blur-sm backdrop-filter sm:pr-6 lg:pr-8"
									>
										<span className="sr-only">Edit</span>
									</th>
								</tr>
							</thead>
							<tbody>
								{people.map((person, personIdx) => (
									<tr key={person.email}>
										<td
											className={classNames(
												personIdx !== people.length - 1
													? "border-gray-200 border-b"
													: "",
												"whitespace-nowrap py-4 pr-3 pl-4 font-medium text-gray-900 text-sm sm:pl-6 lg:pl-8",
											)}
										>
											{person.name}
										</td>
										<td
											className={classNames(
												personIdx !== people.length - 1
													? "border-gray-200 border-b"
													: "",
												"hidden whitespace-nowrap px-3 py-4 text-gray-500 text-sm sm:table-cell",
											)}
										>
											{person.title}
										</td>
										<td
											className={classNames(
												personIdx !== people.length - 1
													? "border-gray-200 border-b"
													: "",
												"hidden whitespace-nowrap px-3 py-4 text-gray-500 text-sm lg:table-cell",
											)}
										>
											{person.email}
										</td>
										<td
											className={classNames(
												personIdx !== people.length - 1
													? "border-gray-200 border-b"
													: "",
												"whitespace-nowrap px-3 py-4 text-gray-500 text-sm",
											)}
										>
											{person.role}
										</td>
										<td
											className={classNames(
												personIdx !== people.length - 1
													? "border-gray-200 border-b"
													: "",
												"relative whitespace-nowrap py-4 pr-4 pl-3 text-right font-medium text-sm sm:pr-8 lg:pr-8",
											)}
										>
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
