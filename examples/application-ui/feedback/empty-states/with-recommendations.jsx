import { PlusIcon } from '@heroicons/react/20/solid';

const people = [
  {
    name: 'Lindsay Walton',
    role: 'Front-end Developer',
    imageUrl:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Courtney Henry',
    role: 'Designer',
    imageUrl:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Tom Cook',
    role: 'Director of Product',
    imageUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
];

export default function Example() {
  return (
    <div className="mx-auto max-w-lg">
      <div>
        <div className="text-center">
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 48 48"
            aria-hidden="true"
            className="mx-auto size-12 text-gray-400"
          >
            <path
              d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A10.003 10.003 0 0124 26c4.21 0 7.813 2.602 9.288 6.286M30 14a6 6 0 11-12 0 6 6 0 0112 0zm12 6a4 4 0 11-8 0 4 4 0 018 0zm-28 0a4 4 0 11-8 0 4 4 0 018 0z"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h2 className="mt-2 font-semibold text-base text-gray-900">
            Add team members
          </h2>
          <p className="mt-1 text-gray-500 text-sm">
            You haven’t added any team members to your project yet. As the owner
            of this project, you can manage team member permissions.
          </p>
        </div>
        <form action="#" className="mt-6 flex">
          <input
            name="email"
            type="email"
            placeholder="Enter an email"
            aria-label="Email address"
            className="-outline-offset-1 focus:-outline-offset-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
          />
          <button
            type="submit"
            className="ml-4 shrink-0 rounded-md bg-indigo-600 px-3 py-2 font-semibold text-sm text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
          >
            Send invite
          </button>
        </form>
      </div>
      <div className="mt-10">
        <h3 className="font-medium text-gray-500 text-sm">
          Team members previously added to projects
        </h3>
        <ul className="mt-4 divide-y divide-gray-200 border-gray-200 border-t border-b">
          {people.map((person, personIdx) => (
            <li
              key={personIdx}
              className="flex items-center justify-between space-x-3 py-4"
            >
              <div className="flex min-w-0 flex-1 items-center space-x-3">
                <div className="shrink-0">
                  <img
                    alt=""
                    src={person.imageUrl}
                    className="size-10 rounded-full"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-gray-900 text-sm">
                    {person.name}
                  </p>
                  <p className="truncate font-medium text-gray-500 text-sm">
                    {person.role}
                  </p>
                </div>
              </div>
              <div className="shrink-0">
                <button
                  type="button"
                  className="inline-flex items-center gap-x-1.5 font-semibold text-gray-900 text-sm/6"
                >
                  <PlusIcon
                    aria-hidden="true"
                    className="size-5 text-gray-400"
                  />
                  Invite <span className="sr-only">{person.name}</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
