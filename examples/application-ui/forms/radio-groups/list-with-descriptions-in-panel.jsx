const settings = [
	{
		id: "public",
		name: "Public access",
		description: "This project would be available to anyone who has the link",
	},
	{
		id: "private-to-project-members",
		name: "Private to project members",
		description: "Only members of this project would be able to access",
	},
	{
		id: "private-to-you",
		name: "Private to you",
		description: "You are the only one able to access this project",
	},
];

export default function Example() {
	return (
		<fieldset
			aria-label="Privacy setting"
			className="-space-y-px rounded-md bg-white"
		>
			{settings.map((setting) => (
				<label
					key={setting.id}
					aria-label={setting.name}
					className="group flex border border-gray-200 p-4 first:rounded-tl-md first:rounded-tr-md last:rounded-br-md last:rounded-bl-md focus:outline-hidden has-checked:relative has-checked:border-indigo-200 has-checked:bg-indigo-50"
				>
					<input
						defaultValue={setting.id}
						defaultChecked={setting.id === "public"}
						name="privacy-setting"
						type="radio"
						className="relative mt-0.5 size-4 shrink-0 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 not-checked:before:hidden before:rounded-full before:bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
					/>
					<span className="ml-3 flex flex-col">
						<span className="block font-medium text-gray-900 text-sm group-has-checked:text-indigo-900">
							{setting.name}
						</span>
						<span className="block text-gray-500 text-sm group-has-checked:text-indigo-700">
							{setting.description}
						</span>
					</span>
				</label>
			))}
		</fieldset>
	);
}
