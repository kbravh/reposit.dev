const notificationMethods = [
	{ id: "email", title: "Email" },
	{ id: "sms", title: "Phone (SMS)" },
	{ id: "push", title: "Push notification" },
];

export default function Example() {
	return (
		<fieldset>
			<legend className="font-semibold text-gray-900 text-sm/6">
				Notifications
			</legend>
			<p className="mt-1 text-gray-600 text-sm/6">
				How do you prefer to receive notifications?
			</p>
			<div className="mt-6 space-y-6">
				{notificationMethods.map((notificationMethod) => (
					<div key={notificationMethod.id} className="flex items-center">
						<input
							defaultChecked={notificationMethod.id === "email"}
							id={notificationMethod.id}
							name="notification-method"
							type="radio"
							className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 not-checked:before:hidden before:rounded-full before:bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
						/>
						<label
							htmlFor={notificationMethod.id}
							className="ml-3 block font-medium text-gray-900 text-sm/6"
						>
							{notificationMethod.title}
						</label>
					</div>
				))}
			</div>
		</fieldset>
	);
}
