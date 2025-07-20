const people = [
  {
    name: 'Lindsay Walton',
    title: 'Front-end Developer',
    email: 'lindsay.walton@example.com',
    role: 'Member',
  },
  // More people...
];

export default function Example() {
  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="font-semibold text-base text-gray-900">Users</h1>
            <p className="mt-2 text-gray-700 text-sm">
              A list of all the users in your account including their name,
              title, email and role.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center font-semibold text-sm text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
            >
              Add user
            </button>
          </div>
        </div>
      </div>
      <div className="mt-8 flow-root overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <table className="w-full text-left">
            <thead className="bg-white">
              <tr>
                <th
                  scope="col"
                  className="relative isolate py-3.5 pr-3 text-left font-semibold text-gray-900 text-sm"
                >
                  Name
                  <div className="-z-10 absolute inset-y-0 right-full w-screen border-b border-b-gray-200" />
                  <div className="-z-10 absolute inset-y-0 left-0 w-screen border-b border-b-gray-200" />
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left font-semibold text-gray-900 text-sm sm:table-cell"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left font-semibold text-gray-900 text-sm md:table-cell"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left font-semibold text-gray-900 text-sm"
                >
                  Role
                </th>
                <th scope="col" className="relative py-3.5 pl-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {people.map(person => (
                <tr key={person.email}>
                  <td className="relative py-4 pr-3 font-medium text-gray-900 text-sm">
                    {person.name}
                    <div className="absolute right-full bottom-0 h-px w-screen bg-gray-100" />
                    <div className="absolute bottom-0 left-0 h-px w-screen bg-gray-100" />
                  </td>
                  <td className="hidden px-3 py-4 text-gray-500 text-sm sm:table-cell">
                    {person.title}
                  </td>
                  <td className="hidden px-3 py-4 text-gray-500 text-sm md:table-cell">
                    {person.email}
                  </td>
                  <td className="px-3 py-4 text-gray-500 text-sm">
                    {person.role}
                  </td>
                  <td className="relative py-4 pl-3 text-right font-medium text-sm">
                    <a
                      href="#"
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit<span className="sr-only">, {person.name}</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
