const items = [
  { id: 1 },
  // More items...
];

export default function Example() {
  return (
    <ul className="divide-y divide-gray-200">
      {items.map(item => (
        <li key={item.id} className="py-4">
          {/* Your content */}
        </li>
      ))}
    </ul>
  );
}
