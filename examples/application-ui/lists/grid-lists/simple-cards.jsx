import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';

const projects = [
  {
    name: 'Graph API',
    initials: 'GA',
    href: '#',
    members: 16,
    bgColor: 'bg-pink-600',
  },
  {
    name: 'Component Design',
    initials: 'CD',
    href: '#',
    members: 12,
    bgColor: 'bg-purple-600',
  },
  {
    name: 'Templates',
    initials: 'T',
    href: '#',
    members: 16,
    bgColor: 'bg-yellow-500',
  },
  {
    name: 'React Components',
    initials: 'RC',
    href: '#',
    members: 8,
    bgColor: 'bg-green-500',
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Example() {
  return (
    <div>
      <h2 className="font-medium text-gray-500 text-sm">Pinned Projects</h2>
      <ul className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {projects.map(project => (
          <li
            key={project.name}
            className="col-span-1 flex rounded-md shadow-xs"
          >
            <div
              className={classNames(
                project.bgColor,
                'flex w-16 shrink-0 items-center justify-center rounded-l-md font-medium text-sm text-white'
              )}
            >
              {project.initials}
            </div>
            <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-gray-200 border-t border-r border-b bg-white">
              <div className="flex-1 truncate px-4 py-2 text-sm">
                <a
                  href={project.href}
                  className="font-medium text-gray-900 hover:text-gray-600"
                >
                  {project.name}
                </a>
                <p className="text-gray-500">{project.members} Members</p>
              </div>
              <div className="shrink-0 pr-2">
                <button
                  type="button"
                  className="inline-flex size-8 items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="sr-only">Open options</span>
                  <EllipsisVerticalIcon aria-hidden="true" className="size-5" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
