import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/20/solid';

const people = [
  {
    name: 'Jane Cooper',
    title: 'Paradigm Representative',
    role: 'Admin',
    email: 'janecooper@example.com',
    telephone: '+1-202-555-0170',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
  },
  // More people...
];

export default function Example() {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {people.map(person => (
        <li
          key={person.email}
          className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow-sm"
        >
          <div className="flex flex-1 flex-col p-8">
            <img
              alt=""
              src={person.imageUrl}
              className="mx-auto size-32 shrink-0 rounded-full"
            />
            <h3 className="mt-6 font-medium text-gray-900 text-sm">
              {person.name}
            </h3>
            <dl className="mt-1 flex grow flex-col justify-between">
              <dt className="sr-only">Title</dt>
              <dd className="text-gray-500 text-sm">{person.title}</dd>
              <dt className="sr-only">Role</dt>
              <dd className="mt-3">
                <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 font-medium text-green-700 text-xs ring-1 ring-green-600/20 ring-inset">
                  {person.role}
                </span>
              </dd>
            </dl>
          </div>
          <div>
            <div className="-mt-px flex divide-x divide-gray-200">
              <div className="flex w-0 flex-1">
                <a
                  href={`mailto:${person.email}`}
                  className="-mr-px relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 font-semibold text-gray-900 text-sm"
                >
                  <EnvelopeIcon
                    aria-hidden="true"
                    className="size-5 text-gray-400"
                  />
                  Email
                </a>
              </div>
              <div className="-ml-px flex w-0 flex-1">
                <a
                  href={`tel:${person.telephone}`}
                  className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 font-semibold text-gray-900 text-sm"
                >
                  <PhoneIcon
                    aria-hidden="true"
                    className="size-5 text-gray-400"
                  />
                  Call
                </a>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
