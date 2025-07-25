export default function Example() {
  return (
    <div className="-space-y-px">
      <div className="-outline-offset-1 focus-within:-outline-offset-2 rounded-t-md bg-white px-3 pt-2.5 pb-1.5 outline-1 outline-gray-300 focus-within:relative focus-within:outline-2 focus-within:outline-indigo-600">
        <label
          htmlFor="name"
          className="block font-medium text-gray-900 text-xs"
        >
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Jane Smith"
          className="block w-full text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
        />
      </div>
      <div className="-outline-offset-1 focus-within:-outline-offset-2 rounded-b-md bg-white px-3 pt-2.5 pb-1.5 outline-1 outline-gray-300 focus-within:relative focus-within:outline-2 focus-within:outline-indigo-600">
        <label
          htmlFor="job-title"
          className="block font-medium text-gray-900 text-xs"
        >
          Job title
        </label>
        <input
          id="job-title"
          name="job-title"
          type="text"
          placeholder="Head of Tomfoolery"
          className="block w-full text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
        />
      </div>
    </div>
  );
}
