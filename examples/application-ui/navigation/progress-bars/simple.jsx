const steps = [
	{ id: "Step 1", name: "Job details", href: "#", status: "complete" },
	{ id: "Step 2", name: "Application form", href: "#", status: "current" },
	{ id: "Step 3", name: "Preview", href: "#", status: "upcoming" },
];

export default function Example() {
	return (
		<nav aria-label="Progress">
			<ol className="space-y-4 md:flex md:space-x-8 md:space-y-0">
				{steps.map((step) => (
					<li key={step.name} className="md:flex-1">
						{step.status === "complete" ? (
							<a
								href={step.href}
								className="group flex flex-col border-indigo-600 border-l-4 py-2 pl-4 hover:border-indigo-800 md:border-t-4 md:border-l-0 md:pt-4 md:pb-0 md:pl-0"
							>
								<span className="font-medium text-indigo-600 text-sm group-hover:text-indigo-800">
									{step.id}
								</span>
								<span className="font-medium text-sm">{step.name}</span>
							</a>
						) : step.status === "current" ? (
							<a
								href={step.href}
								aria-current="step"
								className="flex flex-col border-indigo-600 border-l-4 py-2 pl-4 md:border-t-4 md:border-l-0 md:pt-4 md:pb-0 md:pl-0"
							>
								<span className="font-medium text-indigo-600 text-sm">
									{step.id}
								</span>
								<span className="font-medium text-sm">{step.name}</span>
							</a>
						) : (
							<a
								href={step.href}
								className="group flex flex-col border-gray-200 border-l-4 py-2 pl-4 hover:border-gray-300 md:border-t-4 md:border-l-0 md:pt-4 md:pb-0 md:pl-0"
							>
								<span className="font-medium text-gray-500 text-sm group-hover:text-gray-700">
									{step.id}
								</span>
								<span className="font-medium text-sm">{step.name}</span>
							</a>
						)}
					</li>
				))}
			</ol>
		</nav>
	);
}
