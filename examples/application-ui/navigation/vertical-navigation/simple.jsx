const navigation = [
  { name: 'Dashboard', href: '#', current: true },
  { name: 'Team', href: '#', current: false },
  { name: 'Projects', href: '#', current: false },
  { name: 'Calendar', href: '#', current: false },
  { name: 'Documents', href: '#', current: false },
  { name: 'Reports', href: '#', current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Example() {
  return (
    <nav aria-label="Sidebar" className="flex flex-1 flex-col">
      <ul className="-mx-2 space-y-1">
        {navigation.map(item => (
          <li key={item.name}>
            <a
              href={item.href}
              className={classNames(
                item.current
                  ? 'bg-gray-50 text-indigo-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                'group flex gap-x-3 rounded-md p-2 pl-3 font-semibold text-sm/6'
              )}
            >
              {item.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
