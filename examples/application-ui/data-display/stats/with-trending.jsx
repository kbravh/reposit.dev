const stats = [
  {
    name: 'Revenue',
    value: '$405,091.00',
    change: '+4.75%',
    changeType: 'positive',
  },
  {
    name: 'Overdue invoices',
    value: '$12,787.00',
    change: '+54.02%',
    changeType: 'negative',
  },
  {
    name: 'Outstanding invoices',
    value: '$245,988.00',
    change: '-1.39%',
    changeType: 'positive',
  },
  {
    name: 'Expenses',
    value: '$30,156.00',
    change: '+10.18%',
    changeType: 'negative',
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Example() {
  return (
    <dl className="mx-auto grid grid-cols-1 gap-px bg-gray-900/5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map(stat => (
        <div
          key={stat.name}
          className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8"
        >
          <dt className="font-medium text-gray-500 text-sm/6">{stat.name}</dt>
          <dd
            className={classNames(
              stat.changeType === 'negative'
                ? 'text-rose-600'
                : 'text-gray-700',
              'font-medium text-xs'
            )}
          >
            {stat.change}
          </dd>
          <dd className="w-full flex-none font-medium text-3xl/10 text-gray-900 tracking-tight">
            {stat.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
