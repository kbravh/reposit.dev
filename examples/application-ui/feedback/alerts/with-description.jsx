import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';

export default function Example() {
  return (
    <div className="rounded-md bg-yellow-50 p-4">
      <div className="flex">
        <div className="shrink-0">
          <ExclamationTriangleIcon
            aria-hidden="true"
            className="size-5 text-yellow-400"
          />
        </div>
        <div className="ml-3">
          <h3 className="font-medium text-sm text-yellow-800">
            Attention needed
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid
              pariatur, ipsum similique veniam quo totam eius aperiam dolorum.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
