export default function Example() {
  return (
    <div className="md:flex md:items-center md:justify-between">
      <div className="min-w-0 flex-1">
        <h2 className="font-bold text-2xl/7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Back End Developer
        </h2>
      </div>
      <div className="mt-4 flex md:mt-0 md:ml-4">
        <button
          type="button"
          className="inline-flex items-center rounded-md bg-white px-3 py-2 font-semibold text-gray-900 text-sm shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
        >
          Edit
        </button>
        <button
          type="button"
          className="ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 font-semibold text-sm text-white shadow-xs hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
        >
          Publish
        </button>
      </div>
    </div>
  );
}
