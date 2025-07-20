export default function Example() {
  return (
    <div className="border-gray-200 border-b pb-5 sm:flex sm:items-center sm:justify-between">
      <h3 className="font-semibold text-base text-gray-900">Job Postings</h3>
      <div className="mt-3 flex sm:mt-0 sm:ml-4">
        <button
          type="button"
          className="inline-flex items-center rounded-md bg-white px-3 py-2 font-semibold text-gray-900 text-sm shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
        >
          Share
        </button>
        <button
          type="button"
          className="ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 font-semibold text-sm text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
        >
          Create
        </button>
      </div>
    </div>
  );
}
