const stats = [
	{ name: "Number of deploys", value: "405" },
	{ name: "Average deploy time", value: "3.65", unit: "mins" },
	{ name: "Number of servers", value: "3" },
	{ name: "Success rate", value: "98.5%" },
];

export default function Example() {
	return (
		<div className="bg-gray-900">
			<div className="mx-auto max-w-7xl">
				<div className="grid grid-cols-1 gap-px bg-white/5 sm:grid-cols-2 lg:grid-cols-4">
					{stats.map((stat) => (
						<div
							key={stat.name}
							className="bg-gray-900 px-4 py-6 sm:px-6 lg:px-8"
						>
							<p className="font-medium text-gray-400 text-sm/6">{stat.name}</p>
							<p className="mt-2 flex items-baseline gap-x-2">
								<span className="font-semibold text-4xl text-white tracking-tight">
									{stat.value}
								</span>
								{stat.unit ? (
									<span className="text-gray-400 text-sm">{stat.unit}</span>
								) : null}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
