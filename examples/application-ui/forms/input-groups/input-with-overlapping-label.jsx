export default function Example() {
  return (
    <div className="relative">
      <label
        htmlFor="name"
        className="-top-2 absolute left-2 inline-block rounded-lg bg-white px-1 font-medium text-gray-900 text-xs"
      >
        Name
      </label>
      <input
        id="name"
        name="name"
        type="text"
        placeholder="Jane Smith"
        className="-outline-offset-1 focus:-outline-offset-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
      />
    </div>
  );
}
