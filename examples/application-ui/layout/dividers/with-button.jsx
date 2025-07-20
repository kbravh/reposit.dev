import { PlusIcon } from '@heroicons/react/20/solid';

export default function Example() {
  return (
    <div className="relative">
      <div aria-hidden="true" className="absolute inset-0 flex items-center">
        <div className="w-full border-gray-300 border-t" />
      </div>
      <div className="relative flex justify-center">
        <button
          type="button"
          className="inline-flex items-center gap-x-1.5 rounded-full bg-white px-3 py-1.5 font-semibold text-gray-900 text-sm shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
        >
          <PlusIcon
            aria-hidden="true"
            className="-mr-0.5 -ml-1 size-5 text-gray-400"
          />
          Button text
        </button>
      </div>
    </div>
  );
}
