import {
  CalendarDaysIcon,
  CreditCardIcon,
  UserCircleIcon,
} from '@heroicons/react/20/solid';

export default function Example() {
  return (
    <div className="lg:col-start-3 lg:row-end-1">
      <h2 className="sr-only">Summary</h2>
      <div className="rounded-lg bg-gray-50 shadow-xs ring-1 ring-gray-900/5">
        <dl className="flex flex-wrap">
          <div className="flex-auto pt-6 pl-6">
            <dt className="font-semibold text-gray-900 text-sm/6">Amount</dt>
            <dd className="mt-1 font-semibold text-base text-gray-900">
              $10,560.00
            </dd>
          </div>
          <div className="flex-none self-end px-6 pt-4">
            <dt className="sr-only">Status</dt>
            <dd className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 font-medium text-green-700 text-xs ring-1 ring-green-600/20 ring-inset">
              Paid
            </dd>
          </div>
          <div className="mt-6 flex w-full flex-none gap-x-4 border-gray-900/5 border-t px-6 pt-6">
            <dt className="flex-none">
              <span className="sr-only">Client</span>
              <UserCircleIcon
                aria-hidden="true"
                className="h-6 w-5 text-gray-400"
              />
            </dt>
            <dd className="font-medium text-gray-900 text-sm/6">Alex Curren</dd>
          </div>
          <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
            <dt className="flex-none">
              <span className="sr-only">Due date</span>
              <CalendarDaysIcon
                aria-hidden="true"
                className="h-6 w-5 text-gray-400"
              />
            </dt>
            <dd className="text-gray-500 text-sm/6">
              <time dateTime="2023-01-31">January 31, 2023</time>
            </dd>
          </div>
          <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
            <dt className="flex-none">
              <span className="sr-only">Status</span>
              <CreditCardIcon
                aria-hidden="true"
                className="h-6 w-5 text-gray-400"
              />
            </dt>
            <dd className="text-gray-500 text-sm/6">Paid with MasterCard</dd>
          </div>
        </dl>
        <div className="mt-6 border-gray-900/5 border-t px-6 py-6">
          <a href="#" className="font-semibold text-gray-900 text-sm/6">
            Download receipt <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </div>
  );
}
