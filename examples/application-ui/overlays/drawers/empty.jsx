"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function Example() {
	const [open, setOpen] = useState(true);

	return (
		<div>
			<button
				onClick={() => setOpen(true)}
				className="rounded-md bg-gray-950/5 px-2.5 py-1.5 font-semibold text-gray-900 text-sm hover:bg-gray-950/10"
			>
				Open drawer
			</button>
			<Dialog open={open} onClose={setOpen} className="relative z-10">
				<div className="fixed inset-0" />

				<div className="fixed inset-0 overflow-hidden">
					<div className="absolute inset-0 overflow-hidden">
						<div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
							<DialogPanel
								transition
								className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
							>
								<div className="flex h-full flex-col overflow-y-auto bg-white py-6 shadow-xl">
									<div className="px-4 sm:px-6">
										<div className="flex items-start justify-between">
											<DialogTitle className="font-semibold text-base text-gray-900">
												Panel title
											</DialogTitle>
											<div className="ml-3 flex h-7 items-center">
												<button
													type="button"
													onClick={() => setOpen(false)}
													className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
												>
													<span className="-inset-2.5 absolute" />
													<span className="sr-only">Close panel</span>
													<XMarkIcon aria-hidden="true" className="size-6" />
												</button>
											</div>
										</div>
									</div>
									<div className="relative mt-6 flex-1 px-4 sm:px-6">
										{/* Your content */}
									</div>
								</div>
							</DialogPanel>
						</div>
					</div>
				</div>
			</Dialog>
		</div>
	);
}
