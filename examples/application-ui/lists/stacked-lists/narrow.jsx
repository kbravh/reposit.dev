const people = [
	{
		name: "Leslie Alexander",
		email: "leslie.alexander@example.com",
		imageUrl:
			"https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
	},
	{
		name: "Michael Foster",
		email: "michael.foster@example.com",
		imageUrl:
			"https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
	},
	{
		name: "Dries Vincent",
		email: "dries.vincent@example.com",
		imageUrl:
			"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
	},
	{
		name: "Lindsay Walton",
		email: "lindsay.walton@example.com",
		imageUrl:
			"https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
	},
	{
		name: "Courtney Henry",
		email: "courtney.henry@example.com",
		imageUrl:
			"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
	},
	{
		name: "Tom Cook",
		email: "tom.cook@example.com",
		imageUrl:
			"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
	},
];

export default function Example() {
	return (
		<ul className="divide-y divide-gray-100">
			{people.map((person) => (
				<li key={person.email} className="flex gap-x-4 py-5">
					<img
						alt=""
						src={person.imageUrl}
						className="size-12 flex-none rounded-full bg-gray-50"
					/>
					<div className="min-w-0">
						<p className="font-semibold text-gray-900 text-sm/6">
							{person.name}
						</p>
						<p className="mt-1 truncate text-gray-500 text-xs/5">
							{person.email}
						</p>
					</div>
				</li>
			))}
		</ul>
	);
}
