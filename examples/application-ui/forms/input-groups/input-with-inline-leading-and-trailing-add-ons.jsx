export default function Example() {
  return (
    <div>
      <label
        htmlFor="price"
        className="block font-medium text-gray-900 text-sm/6"
      >
        Price
      </label>
      <div className="mt-2">
        <div className="-outline-offset-1 focus-within:-outline-offset-2 flex items-center rounded-md bg-white px-3 outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-indigo-600">
          <div className="shrink-0 select-none text-base text-gray-500 sm:text-sm/6">
            $
          </div>
          <input
            id="price"
            name="price"
            type="text"
            placeholder="0.00"
            aria-describedby="price-currency"
            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
          />
          <div
            id="price-currency"
            className="shrink-0 select-none text-base text-gray-500 sm:text-sm/6"
          >
            USD
          </div>
        </div>
      </div>
    </div>
  );
}
