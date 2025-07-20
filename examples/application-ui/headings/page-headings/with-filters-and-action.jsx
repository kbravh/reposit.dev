import { PlusSmallIcon } from '@heroicons/react/20/solid';

export default function Example() {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <h1 className="font-semibold text-base/7 text-gray-900">Cashflow</h1>
        <div className="order-last flex w-full gap-x-8 font-semibold text-sm/6 sm:order-0 sm:w-auto sm:border-gray-200 sm:border-l sm:pl-6 sm:text-sm/7">
          <a href="#" className="text-indigo-600">
            Last 7 days
          </a>
          <a href="#" className="text-gray-700">
            Last 30 days
          </a>
          <a href="#" className="text-gray-700">
            All-time
          </a>
        </div>
        <a
          href="#"
          className="ml-auto flex items-center gap-x-1 rounded-md bg-indigo-600 px-3 py-2 font-semibold text-sm text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
        >
          <PlusSmallIcon aria-hidden="true" className="-ml-1.5 size-5" />
          New invoice
        </a>
      </div>
    </div>
  );
}
