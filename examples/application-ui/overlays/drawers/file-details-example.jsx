"use client";

import {
	Dialog,
	DialogBackdrop,
	DialogPanel,
	TransitionChild,
} from "@headlessui/react";
import { PencilIcon, PlusIcon } from "@heroicons/react/20/solid";
import { HeartIcon, XMarkIcon } from "@heroicons/react/24/outline";
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
				<DialogBackdrop
					transition
					className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-closed:opacity-0"
				/>

				<div className="fixed inset-0 overflow-hidden">
					<div className="absolute inset-0 overflow-hidden">
						<div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
							<DialogPanel
								transition
								className="pointer-events-auto relative w-96 transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
							>
								<TransitionChild>
									<div className="-ml-8 sm:-ml-10 absolute top-0 left-0 flex pt-4 pr-2 duration-500 ease-in-out data-closed:opacity-0 sm:pr-4">
										<button
											type="button"
											onClick={() => setOpen(false)}
											className="relative rounded-md text-gray-300 hover:text-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white"
										>
											<span className="-inset-2.5 absolute" />
											<span className="sr-only">Close panel</span>
											<XMarkIcon aria-hidden="true" className="size-6" />
										</button>
									</div>
								</TransitionChild>
								<div className="h-full overflow-y-auto bg-white p-8">
									<div className="space-y-6 pb-16">
										<div>
											<img
												alt=""
												src="https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80"
												className="block aspect-10/7 w-full rounded-lg object-cover"
											/>
											<div className="mt-4 flex items-start justify-between">
												<div>
													<h2 className="font-semibold text-base text-gray-900">
														<span className="sr-only">Details for </span>
														IMG_4985.HEIC
													</h2>
													<p className="font-medium text-gray-500 text-sm">
														3.9 MB
													</p>
												</div>
												<button
													type="button"
													className="relative ml-4 flex size-8 items-center justify-center rounded-full bg-white text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500"
												>
													<span className="-inset-1.5 absolute" />
													<HeartIcon aria-hidden="true" className="size-6" />
													<span className="sr-only">Favorite</span>
												</button>
											</div>
										</div>
										<div>
											<h3 className="font-medium text-gray-900">Information</h3>
											<dl className="mt-2 divide-y divide-gray-200 border-gray-200 border-t border-b">
												<div className="flex justify-between py-3 font-medium text-sm">
													<dt className="text-gray-500">Uploaded by</dt>
													<dd className="text-gray-900">Marie Culver</dd>
												</div>
												<div className="flex justify-between py-3 font-medium text-sm">
													<dt className="text-gray-500">Created</dt>
													<dd className="text-gray-900">June 8, 2020</dd>
												</div>
												<div className="flex justify-between py-3 font-medium text-sm">
													<dt className="text-gray-500">Last modified</dt>
													<dd className="text-gray-900">June 8, 2020</dd>
												</div>
												<div className="flex justify-between py-3 font-medium text-sm">
													<dt className="text-gray-500">Dimensions</dt>
													<dd className="text-gray-900">4032 x 3024</dd>
												</div>
												<div className="flex justify-between py-3 font-medium text-sm">
													<dt className="text-gray-500">Resolution</dt>
													<dd className="text-gray-900">72 x 72</dd>
												</div>
											</dl>
										</div>
										<div>
											<h3 className="font-medium text-gray-900">Description</h3>
											<div className="mt-2 flex items-center justify-between">
												<p className="text-gray-500 text-sm italic">
													Add a description to this image.
												</p>
												<button
													type="button"
													className="-mr-2 relative flex size-8 items-center justify-center rounded-full bg-white text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500"
												>
													<span className="-inset-1.5 absolute" />
													<PencilIcon aria-hidden="true" className="size-5" />
													<span className="sr-only">Add description</span>
												</button>
											</div>
										</div>
										<div>
											<h3 className="font-medium text-gray-900">Shared with</h3>
											<ul className="mt-2 divide-y divide-gray-200 border-gray-200 border-t border-b">
												<li className="flex items-center justify-between py-3">
													<div className="flex items-center">
														<img
															alt=""
															src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=1024&h=1024&q=80"
															className="size-8 rounded-full"
														/>
														<p className="ml-4 font-medium text-gray-900 text-sm">
															Aimee Douglas
														</p>
													</div>
													<button
														type="button"
														className="ml-6 rounded-md bg-white font-medium text-indigo-600 text-sm hover:text-indigo-500 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
													>
														Remove
														<span className="sr-only"> Aimee Douglas</span>
													</button>
												</li>
												<li className="flex items-center justify-between py-3">
													<div className="flex items-center">
														<img
															alt=""
															src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixqx=oilqXxSqey&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
															className="size-8 rounded-full"
														/>
														<p className="ml-4 font-medium text-gray-900 text-sm">
															Andrea McMillan
														</p>
													</div>
													<button
														type="button"
														className="ml-6 rounded-md bg-white font-medium text-indigo-600 text-sm hover:text-indigo-500 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
													>
														Remove
														<span className="sr-only"> Andrea McMillan</span>
													</button>
												</li>
												<li className="flex items-center justify-between py-2">
													<button
														type="button"
														className="group -ml-1 flex items-center rounded-md bg-white p-1 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500"
													>
														<span className="flex size-8 items-center justify-center rounded-full border-2 border-gray-300 border-dashed text-gray-400">
															<PlusIcon aria-hidden="true" className="size-5" />
														</span>
														<span className="ml-4 font-medium text-indigo-600 text-sm group-hover:text-indigo-500">
															Share
														</span>
													</button>
												</li>
											</ul>
										</div>
										<div className="flex">
											<button
												type="button"
												className="flex-1 rounded-md bg-indigo-600 px-3 py-2 font-semibold text-sm text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
											>
												Download
											</button>
											<button
												type="button"
												className="ml-3 flex-1 rounded-md bg-white px-3 py-2 font-semibold text-gray-900 text-sm shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
											>
												Delete
											</button>
										</div>
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
