const activityItems = [
  {
    user: {
      name: 'Michael Foster',
      imageUrl:
        'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    projectName: 'ios-app',
    commit: '2d89f0c8',
    branch: 'main',
    date: '1h',
    dateTime: '2023-01-23T11:00',
  },
  {
    user: {
      name: 'Lindsay Walton',
      imageUrl:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    projectName: 'mobile-api',
    commit: '249df660',
    branch: 'main',
    date: '3h',
    dateTime: '2023-01-23T09:00',
  },
  {
    user: {
      name: 'Courtney Henry',
      imageUrl:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    projectName: 'ios-app',
    commit: '11464223',
    branch: 'main',
    date: '12h',
    dateTime: '2023-01-23T00:00',
  },
  {
    user: {
      name: 'Courtney Henry',
      imageUrl:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    projectName: 'company-website',
    commit: 'dad28e95',
    branch: 'main',
    date: '2d',
    dateTime: '2023-01-21T13:00',
  },
  {
    user: {
      name: 'Michael Foster',
      imageUrl:
        'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    projectName: 'relay-service',
    commit: '624bc94c',
    branch: 'main',
    date: '5d',
    dateTime: '2023-01-18T12:34',
  },
];

export default function Example() {
  return (
    <ul className="divide-y divide-gray-100">
      {activityItems.map(item => (
        <li key={item.commit} className="py-4">
          <div className="flex items-center gap-x-3">
            <img
              alt=""
              src={item.user.imageUrl}
              className="size-6 flex-none rounded-full bg-gray-800"
            />
            <h3 className="flex-auto truncate font-semibold text-gray-900 text-sm/6">
              {item.user.name}
            </h3>
            <time
              dateTime={item.dateTime}
              className="flex-none text-gray-500 text-xs"
            >
              {item.date}
            </time>
          </div>
          <p className="mt-3 truncate text-gray-500 text-sm">
            Pushed to <span className="text-gray-700">{item.projectName}</span>{' '}
            (<span className="font-mono text-gray-700">{item.commit}</span> on{' '}
            <span className="text-gray-700">{item.branch}</span>)
          </p>
        </li>
      ))}
    </ul>
  );
}
