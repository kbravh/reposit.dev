const projects = [
  {
    id: 1,
    name: 'Logo redesign',
    description: 'New logo and digital asset playbook.',
    hours: '20.0',
    rate: '$100.00',
    price: '$2,000.00',
  },
  // More projects...
];

export default function Example() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="font-semibold text-base text-gray-900">Invoice</h1>
          <p className="mt-2 text-gray-700 text-sm">
            For work completed from{' '}
            <time dateTime="2022-08-01">August 1, 2022</time> to{' '}
            <time dateTime="2022-08-31">August 31, 2022</time>.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center font-semibold text-sm text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
          >
            Print
          </button>
        </div>
      </div>
      <div className="-mx-4 mt-8 flow-root sm:mx-0">
        <table className="min-w-full">
          <colgroup>
            <col className="w-full sm:w-1/2" />
            <col className="sm:w-1/6" />
            <col className="sm:w-1/6" />
            <col className="sm:w-1/6" />
          </colgroup>
          <thead className="border-gray-300 border-b text-gray-900">
            <tr>
              <th
                scope="col"
                className="py-3.5 pr-3 pl-4 text-left font-semibold text-gray-900 text-sm sm:pl-0"
              >
                Project
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-right font-semibold text-gray-900 text-sm sm:table-cell"
              >
                Hours
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-right font-semibold text-gray-900 text-sm sm:table-cell"
              >
                Rate
              </th>
              <th
                scope="col"
                className="py-3.5 pr-4 pl-3 text-right font-semibold text-gray-900 text-sm sm:pr-0"
              >
                Price
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.map(project => (
              <tr key={project.id} className="border-gray-200 border-b">
                <td className="max-w-0 py-5 pr-3 pl-4 text-sm sm:pl-0">
                  <div className="font-medium text-gray-900">
                    {project.name}
                  </div>
                  <div className="mt-1 truncate text-gray-500">
                    {project.description}
                  </div>
                </td>
                <td className="hidden px-3 py-5 text-right text-gray-500 text-sm sm:table-cell">
                  {project.hours}
                </td>
                <td className="hidden px-3 py-5 text-right text-gray-500 text-sm sm:table-cell">
                  {project.rate}
                </td>
                <td className="py-5 pr-4 pl-3 text-right text-gray-500 text-sm sm:pr-0">
                  {project.price}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th
                scope="row"
                colSpan={3}
                className="hidden pt-6 pr-3 pl-4 text-right font-normal text-gray-500 text-sm sm:table-cell sm:pl-0"
              >
                Subtotal
              </th>
              <th
                scope="row"
                className="pt-6 pr-3 pl-4 text-left font-normal text-gray-500 text-sm sm:hidden"
              >
                Subtotal
              </th>
              <td className="pt-6 pr-4 pl-3 text-right text-gray-500 text-sm sm:pr-0">
                $8,800.00
              </td>
            </tr>
            <tr>
              <th
                scope="row"
                colSpan={3}
                className="hidden pt-4 pr-3 pl-4 text-right font-normal text-gray-500 text-sm sm:table-cell sm:pl-0"
              >
                Tax
              </th>
              <th
                scope="row"
                className="pt-4 pr-3 pl-4 text-left font-normal text-gray-500 text-sm sm:hidden"
              >
                Tax
              </th>
              <td className="pt-4 pr-4 pl-3 text-right text-gray-500 text-sm sm:pr-0">
                $1,760.00
              </td>
            </tr>
            <tr>
              <th
                scope="row"
                colSpan={3}
                className="hidden pt-4 pr-3 pl-4 text-right font-semibold text-gray-900 text-sm sm:table-cell sm:pl-0"
              >
                Total
              </th>
              <th
                scope="row"
                className="pt-4 pr-3 pl-4 text-left font-semibold text-gray-900 text-sm sm:hidden"
              >
                Total
              </th>
              <td className="pt-4 pr-4 pl-3 text-right font-semibold text-gray-900 text-sm sm:pr-0">
                $10,560.00
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
