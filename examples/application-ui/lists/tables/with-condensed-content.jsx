const transactions = [
  {
    id: 'AAPS0L',
    company: 'Chase & Co.',
    share: 'CAC',
    commission: '+$4.37',
    price: '$3,509.00',
    quantity: '12.00',
    netAmount: '$4,397.00',
  },
  // More transactions...
];

export default function Example() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="font-semibold text-base text-gray-900">
            Transactions
          </h1>
          <p className="mt-2 text-gray-700 text-sm">
            A table of placeholder stock market data that does not make any
            sense.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center font-semibold text-sm text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
          >
            Export
          </button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8 overflow-x-auto">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="whitespace-nowrap py-3.5 pr-3 pl-4 text-left font-semibold text-gray-900 text-sm sm:pl-0"
                  >
                    Transaction ID
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left font-semibold text-gray-900 text-sm"
                  >
                    Company
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left font-semibold text-gray-900 text-sm"
                  >
                    Share
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left font-semibold text-gray-900 text-sm"
                  >
                    Commision
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left font-semibold text-gray-900 text-sm"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left font-semibold text-gray-900 text-sm"
                  >
                    Quantity
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left font-semibold text-gray-900 text-sm"
                  >
                    Net amount
                  </th>
                  <th
                    scope="col"
                    className="relative whitespace-nowrap py-3.5 pr-4 pl-3 sm:pr-0"
                  >
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {transactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td className="whitespace-nowrap py-2 pr-3 pl-4 text-gray-500 text-sm sm:pl-0">
                      {transaction.id}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 font-medium text-gray-900 text-sm">
                      {transaction.company}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-gray-900 text-sm">
                      {transaction.share}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-gray-500 text-sm">
                      {transaction.commission}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-gray-500 text-sm">
                      {transaction.price}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-gray-500 text-sm">
                      {transaction.quantity}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-gray-500 text-sm">
                      {transaction.netAmount}
                    </td>
                    <td className="relative whitespace-nowrap py-2 pr-4 pl-3 text-right font-medium text-sm sm:pr-0">
                      <a
                        href="#"
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit<span className="sr-only">, {transaction.id}</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
