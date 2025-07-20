const plans = [
  {
    id: 1,
    name: 'Hobby',
    memory: '4 GB RAM',
    cpu: '4 CPUs',
    storage: '128 GB SSD disk',
    price: '$40',
    isCurrent: false,
  },
  {
    id: 2,
    name: 'Startup',
    memory: '8 GB RAM',
    cpu: '6 CPUs',
    storage: '256 GB SSD disk',
    price: '$80',
    isCurrent: true,
  },
  // More plans...
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Example() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="font-semibold text-base text-gray-900">Plans</h1>
          <p className="mt-2 text-gray-700 text-sm">
            Your team is on the{' '}
            <strong className="font-semibold text-gray-900">Startup</strong>{' '}
            plan. The next payment of $80 will be due on August 4, 2022.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center font-semibold text-sm text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
          >
            Update credit card
          </button>
        </div>
      </div>
      <div className="-mx-4 mt-10 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th
                scope="col"
                className="py-3.5 pr-3 pl-4 text-left font-semibold text-gray-900 text-sm sm:pl-6"
              >
                Plan
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left font-semibold text-gray-900 text-sm lg:table-cell"
              >
                Memory
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left font-semibold text-gray-900 text-sm lg:table-cell"
              >
                CPU
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left font-semibold text-gray-900 text-sm lg:table-cell"
              >
                Storage
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left font-semibold text-gray-900 text-sm"
              >
                Price
              </th>
              <th scope="col" className="relative py-3.5 pr-4 pl-3 sm:pr-6">
                <span className="sr-only">Select</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan, planIdx) => (
              <tr key={plan.id}>
                <td
                  className={classNames(
                    planIdx === 0 ? '' : 'border-transparent border-t',
                    'relative py-4 pr-3 pl-4 text-sm sm:pl-6'
                  )}
                >
                  <div className="font-medium text-gray-900">
                    {plan.name}
                    {plan.isCurrent ? (
                      <span className="ml-1 text-indigo-600">
                        (Current Plan)
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-1 flex flex-col text-gray-500 sm:block lg:hidden">
                    <span>
                      {plan.memory} / {plan.cpu}
                    </span>
                    <span className="hidden sm:inline">·</span>
                    <span>{plan.storage}</span>
                  </div>
                  {planIdx !== 0 ? (
                    <div className="-top-px absolute right-0 left-6 h-px bg-gray-200" />
                  ) : null}
                </td>
                <td
                  className={classNames(
                    planIdx === 0 ? '' : 'border-gray-200 border-t',
                    'hidden px-3 py-3.5 text-gray-500 text-sm lg:table-cell'
                  )}
                >
                  {plan.memory}
                </td>
                <td
                  className={classNames(
                    planIdx === 0 ? '' : 'border-gray-200 border-t',
                    'hidden px-3 py-3.5 text-gray-500 text-sm lg:table-cell'
                  )}
                >
                  {plan.cpu}
                </td>
                <td
                  className={classNames(
                    planIdx === 0 ? '' : 'border-gray-200 border-t',
                    'hidden px-3 py-3.5 text-gray-500 text-sm lg:table-cell'
                  )}
                >
                  {plan.storage}
                </td>
                <td
                  className={classNames(
                    planIdx === 0 ? '' : 'border-gray-200 border-t',
                    'px-3 py-3.5 text-gray-500 text-sm'
                  )}
                >
                  <div className="sm:hidden">{plan.price}/mo</div>
                  <div className="hidden sm:block">{plan.price}/month</div>
                </td>
                <td
                  className={classNames(
                    planIdx === 0 ? '' : 'border-transparent border-t',
                    'relative py-3.5 pr-4 pl-3 text-right font-medium text-sm sm:pr-6'
                  )}
                >
                  <button
                    type="button"
                    disabled={plan.isCurrent}
                    className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 font-semibold text-gray-900 text-sm shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                  >
                    Select<span className="sr-only">, {plan.name}</span>
                  </button>
                  {planIdx !== 0 ? (
                    <div className="-top-px absolute right-6 left-0 h-px bg-gray-200" />
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
