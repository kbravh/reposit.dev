import { PaperClipIcon } from "@heroicons/react/20/solid";

export default function Example() {
	return (
		<div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
			<div className="px-4 py-6 sm:px-6">
				<h3 className="font-semibold text-base/7 text-gray-900">
					Applicant Information
				</h3>
				<p className="mt-1 max-w-2xl text-gray-500 text-sm/6">
					Personal details and application.
				</p>
			</div>
			<div className="border-gray-100 border-t">
				<dl className="divide-y divide-gray-100">
					<div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
						<dt className="font-medium text-gray-900 text-sm">Full name</dt>
						<dd className="mt-1 text-gray-700 text-sm/6 sm:col-span-2 sm:mt-0">
							Margot Foster
						</dd>
					</div>
					<div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
						<dt className="font-medium text-gray-900 text-sm">
							Application for
						</dt>
						<dd className="mt-1 text-gray-700 text-sm/6 sm:col-span-2 sm:mt-0">
							Backend Developer
						</dd>
					</div>
					<div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
						<dt className="font-medium text-gray-900 text-sm">Email address</dt>
						<dd className="mt-1 text-gray-700 text-sm/6 sm:col-span-2 sm:mt-0">
							margotfoster@example.com
						</dd>
					</div>
					<div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
						<dt className="font-medium text-gray-900 text-sm">
							Salary expectation
						</dt>
						<dd className="mt-1 text-gray-700 text-sm/6 sm:col-span-2 sm:mt-0">
							$120,000
						</dd>
					</div>
					<div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
						<dt className="font-medium text-gray-900 text-sm">About</dt>
						<dd className="mt-1 text-gray-700 text-sm/6 sm:col-span-2 sm:mt-0">
							Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim
							incididunt cillum culpa consequat. Excepteur qui ipsum aliquip
							consequat sint. Sit id mollit nulla mollit nostrud in ea officia
							proident. Irure nostrud pariatur mollit ad adipisicing
							reprehenderit deserunt qui eu.
						</dd>
					</div>
					<div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
						<dt className="font-medium text-gray-900 text-sm/6">Attachments</dt>
						<dd className="mt-2 text-gray-900 text-sm sm:col-span-2 sm:mt-0">
							<ul className="divide-y divide-gray-100 rounded-md border border-gray-200">
								<li className="flex items-center justify-between py-4 pr-5 pl-4 text-sm/6">
									<div className="flex w-0 flex-1 items-center">
										<PaperClipIcon
											aria-hidden="true"
											className="size-5 shrink-0 text-gray-400"
										/>
										<div className="ml-4 flex min-w-0 flex-1 gap-2">
											<span className="truncate font-medium">
												resume_back_end_developer.pdf
											</span>
											<span className="shrink-0 text-gray-400">2.4mb</span>
										</div>
									</div>
									<div className="ml-4 shrink-0">
										<a
											href="#"
											className="font-medium text-indigo-600 hover:text-indigo-500"
										>
											Download
										</a>
									</div>
								</li>
								<li className="flex items-center justify-between py-4 pr-5 pl-4 text-sm/6">
									<div className="flex w-0 flex-1 items-center">
										<PaperClipIcon
											aria-hidden="true"
											className="size-5 shrink-0 text-gray-400"
										/>
										<div className="ml-4 flex min-w-0 flex-1 gap-2">
											<span className="truncate font-medium">
												coverletter_back_end_developer.pdf
											</span>
											<span className="shrink-0 text-gray-400">4.5mb</span>
										</div>
									</div>
									<div className="ml-4 shrink-0">
										<a
											href="#"
											className="font-medium text-indigo-600 hover:text-indigo-500"
										>
											Download
										</a>
									</div>
								</li>
							</ul>
						</dd>
					</div>
				</dl>
			</div>
		</div>
	);
}
