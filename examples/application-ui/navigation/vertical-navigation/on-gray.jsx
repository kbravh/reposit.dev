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
const secondaryNavigation = [
	{ name: "Website redesign", href: "#", initial: "W", current: false },
	{ name: "GraphQL API", href: "#", initial: "G", current: false },
	{
		name: "Customer migration guides",
		href: "#",
		initial: "C",
		current: false,
	},
	{ name: "Profit sharing program", href: "#", initial: "P", current: false },
];

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

export default function Example() {
	return (
		<nav aria-label="Sidebar" className="flex flex-1 flex-col">
			<ul className="flex flex-1 flex-col gap-y-7">
				<li>
					<ul className="-mx-2 space-y-1">
						{navigation.map((item) => (
							<li key={item.name}>
								<a
									href={item.href}
									className={classNames(
										item.current
											? "bg-gray-100 text-indigo-600"
											: "text-gray-700 hover:bg-gray-100 hover:text-indigo-600",
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
											className="ml-auto w-9 min-w-max whitespace-nowrap rounded-full bg-gray-50 px-2.5 py-0.5 text-center font-medium text-gray-600 text-xs/5 ring-1 ring-gray-200 ring-inset"
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
					<div className="font-semibold text-gray-400 text-xs/6">Projects</div>
					<ul className="-mx-2 mt-2 space-y-1">
						{secondaryNavigation.map((item) => (
							<li key={item.name}>
								<a
									href={item.href}
									className={classNames(
										item.current
											? "bg-gray-50 text-indigo-600"
											: "text-gray-700 hover:bg-gray-100 hover:text-indigo-600",
										"group flex gap-x-3 rounded-md p-2 font-semibold text-sm/6",
									)}
								>
									<span
										className={classNames(
											item.current
												? "border-indigo-600 text-indigo-600"
												: "border-gray-200 text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600",
											"flex size-6 shrink-0 items-center justify-center rounded-lg border bg-white font-medium text-[0.625rem]",
										)}
									>
										{item.initial}
									</span>
									<span className="truncate">{item.name}</span>
								</a>
							</li>
						))}
					</ul>
				</li>
			</ul>
		</nav>
	);
}
