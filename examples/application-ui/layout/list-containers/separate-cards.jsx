const items = [
  { id: 1 },
  // More items...
];

export default function Example() {
  return (
    <ul className="space-y-3">
      {items.map(item => (
        <li
          key={item.id}
          className="overflow-hidden rounded-md bg-white px-6 py-4 shadow-sm"
        >
          {/* Your content */}
        </li>
      ))}
    </ul>
  );
}
