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
								<div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
									<div className="bg-indigo-700 px-4 py-6 sm:px-6">
										<div className="flex items-center justify-between">
											<DialogTitle className="font-semibold text-base text-white">
												Panel title
											</DialogTitle>
											<div className="ml-3 flex h-7 items-center">
												<button
													type="button"
													onClick={() => setOpen(false)}
													className="relative rounded-md bg-indigo-700 text-indigo-200 hover:text-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white"
												>
													<span className="-inset-2.5 absolute" />
													<span className="sr-only">Close panel</span>
													<XMarkIcon aria-hidden="true" className="size-6" />
												</button>
											</div>
										</div>
										<div className="mt-1">
											<p className="text-indigo-300 text-sm">
												Lorem, ipsum dolor sit amet consectetur adipisicing elit
												aliquam ad hic recusandae soluta.
											</p>
										</div>
									</div>
									<div className="relative flex-1 px-4 py-6 sm:px-6">
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
