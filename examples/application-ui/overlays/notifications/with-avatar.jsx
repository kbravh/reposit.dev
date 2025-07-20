"use client";

import { Transition } from "@headlessui/react";
import { useState } from "react";

export default function Example() {
	const [show, setShow] = useState(true);

	return (
		<>
			{/* Global notification live region, render this permanently at the end of the document */}
			<div
				aria-live="assertive"
				className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
			>
				<div className="flex w-full flex-col items-center space-y-4 sm:items-end">
					{/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
					<Transition show={show}>
						<div className="pointer-events-auto flex w-full max-w-md rounded-lg bg-white shadow-lg ring-1 ring-black/5 transition data-closed:data-enter:translate-y-2 data-enter:transform data-closed:opacity-0 data-enter:duration-300 data-leave:duration-100 data-enter:ease-out data-leave:ease-in data-closed:data-enter:sm:translate-x-2 data-closed:data-enter:sm:translate-y-0">
							<div className="w-0 flex-1 p-4">
								<div className="flex items-start">
									<div className="shrink-0 pt-0.5">
										<img
											alt=""
											src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
											className="size-10 rounded-full"
										/>
									</div>
									<div className="ml-3 w-0 flex-1">
										<p className="font-medium text-gray-900 text-sm">
											Emilia Gates
										</p>
										<p className="mt-1 text-gray-500 text-sm">
											Sure! 8:30pm works great!
										</p>
									</div>
								</div>
							</div>
							<div className="flex border-gray-200 border-l">
								<button
									type="button"
									onClick={() => {
										setShow(false);
									}}
									className="flex w-full items-center justify-center rounded-none rounded-r-lg border border-transparent p-4 font-medium text-indigo-600 text-sm hover:text-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
								>
									Reply
								</button>
							</div>
						</div>
					</Transition>
				</div>
			</div>
		</>
	);
}
