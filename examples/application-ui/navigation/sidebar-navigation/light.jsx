import {
	CalendarIcon,
	ChartPieIcon,
	DocumentDuplicateIcon,
	FolderIcon,
	HomeIcon,
	UsersIcon,
} from "@heroicons/react/24/outline";

const navigation = [
	{ name: "Dashboard", href: "#", icon: HomeIcon, count: "5", current: true },
	{ name: "Team", href: "#", icon: UsersIcon, current: false },
	{
		name: "Projects",
		href: "#",
		icon: FolderIcon,
		count: "12",
		current: false,
	},
	{
		name: "Calendar",
		href: "#",
		icon: CalendarIcon,
		count: "20+",
		current: false,
	},
	{ name: "Documents", href: "#", icon: DocumentDuplicateIcon, current: false },
	{ name: "Reports", href: "#", icon: ChartPieIcon, current: false },
];
const teams = [
	{ id: 1, name: "Heroicons", href: "#", initial: "H", current: false },
	{ id: 2, name: "Tailwind Labs", href: "#", initial: "T", current: false },
	{ id: 3, name: "Workcation", href: "#", initial: "W", current: false },
];

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

export default function Example() {
	return (
		<div className="flex grow flex-col gap-y-5 overflow-y-auto border-gray-200 border-r bg-white px-6">
			<div className="flex h-16 shrink-0 items-center">
				<img
					alt="Your Company"
					src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
					className="h-8 w-auto"
				/>
			</div>
			<nav className="flex flex-1 flex-col">
				<ul className="flex flex-1 flex-col gap-y-7">
					<li>
						<ul className="-mx-2 space-y-1">
							{navigation.map((item) => (
								<li key={item.name}>
									<a
										href={item.href}
										className={classNames(
											item.current
												? "bg-gray-50 text-indigo-600"
												: "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
											"group flex gap-x-3 rounded-md p-2 font-semibold text-sm/6",
										)}
									>
										<item.icon
											aria-hidden="true"
											className={classNames(
												item.current
													? "text-indigo-600"
													: "text-gray-400 group-hover:text-indigo-600",
												"size-6 shrink-0",
											)}
										/>
										{item.name}
										{item.count ? (
											<span
												aria-hidden="true"
												className="ml-auto w-9 min-w-max whitespace-nowrap rounded-full bg-white px-2.5 py-0.5 text-center font-medium text-gray-600 text-xs/5 ring-1 ring-gray-200 ring-inset"
											>
												{item.count}
											</span>
										) : null}
									</a>
								</li>
							))}
						</ul>
					</li>
					<li>
						<div className="font-semibold text-gray-400 text-xs/6">
							Your teams
						</div>
						<ul className="-mx-2 mt-2 space-y-1">
							{teams.map((team) => (
								<li key={team.name}>
									<a
										href={team.href}
										className={classNames(
											team.current
												? "bg-gray-50 text-indigo-600"
												: "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
											"group flex gap-x-3 rounded-md p-2 font-semibold text-sm/6",
										)}
									>
										<span
											className={classNames(
												team.current
													? "border-indigo-600 text-indigo-600"
													: "border-gray-200 text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600",
												"flex size-6 shrink-0 items-center justify-center rounded-lg border bg-white font-medium text-[0.625rem]",
											)}
										>
											{team.initial}
										</span>
										<span className="truncate">{team.name}</span>
									</a>
								</li>
							))}
						</ul>
					</li>
					<li className="-mx-6 mt-auto">
						<a
							href="#"
							className="flex items-center gap-x-4 px-6 py-3 font-semibold text-gray-900 text-sm/6 hover:bg-gray-50"
						>
							<img
								alt=""
								src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
								className="size-8 rounded-full bg-gray-50"
							/>
							<span className="sr-only">Your profile</span>
							<span aria-hidden="true">Tom Cook</span>
						</a>
					</li>
				</ul>
			</nav>
		</div>
	);
}
