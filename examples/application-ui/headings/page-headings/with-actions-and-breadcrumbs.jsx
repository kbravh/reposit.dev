import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

export default function Example() {
  return (
    <div>
      <div>
        <nav aria-label="Back" className="sm:hidden">
          <a
            href="#"
            className="flex items-center font-medium text-gray-500 text-sm hover:text-gray-700"
          >
            <ChevronLeftIcon
              aria-hidden="true"
              className="-ml-1 mr-1 size-5 shrink-0 text-gray-400"
            />
            Back
          </a>
        </nav>
        <nav aria-label="Breadcrumb" className="hidden sm:flex">
          <ol className="flex items-center space-x-4">
            <li>
              <div className="flex">
                <a
                  href="#"
                  className="font-medium text-gray-500 text-sm hover:text-gray-700"
                >
                  Jobs
                </a>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRightIcon
                  aria-hidden="true"
                  className="size-5 shrink-0 text-gray-400"
                />
                <a
                  href="#"
                  className="ml-4 font-medium text-gray-500 text-sm hover:text-gray-700"
                >
                  Engineering
                </a>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRightIcon
                  aria-hidden="true"
                  className="size-5 shrink-0 text-gray-400"
                />
                <a
                  href="#"
                  aria-current="page"
                  className="ml-4 font-medium text-gray-500 text-sm hover:text-gray-700"
                >
                  Back End Developer
                </a>
              </div>
            </li>
          </ol>
        </nav>
      </div>
      <div className="mt-2 md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="font-bold text-2xl/7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Back End Developer
          </h2>
        </div>
        <div className="mt-4 flex shrink-0 md:mt-0 md:ml-4">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-white px-3 py-2 font-semibold text-gray-900 text-sm shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
          >
            Edit
          </button>
          <button
            type="button"
            className="ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 font-semibold text-sm text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
}
