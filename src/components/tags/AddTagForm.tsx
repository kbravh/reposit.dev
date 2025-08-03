import { Tag } from 'lucide-react';
import { type FormEvent } from 'react';

type AddTagFormProps = {
  isVisible: boolean;
  newTagTitle: string;
  isCreating: boolean;
  error: Error | null;
  onSubmit: (e: FormEvent) => void;
  onTitleChange: (title: string) => void;
  onCancel: () => void;
};

export function AddTagForm({
  isVisible,
  newTagTitle,
  isCreating,
  error,
  onSubmit,
  onTitleChange,
  onCancel,
}: AddTagFormProps) {
  if (!isVisible) return null;

  return (
    <div className="mt-6 bg-gray-50 rounded-lg p-4">
      <form onSubmit={onSubmit} className="flex gap-3">
        <div className="flex-1">
          <label htmlFor="tag-title" className="sr-only">
            Tag title
          </label>
          <div className="grid grid-cols-1">
            <input
              id="tag-title"
              name="tag-title"
              type="text"
              placeholder="Enter tag name..."
              value={newTagTitle}
              onChange={e => onTitleChange(e.target.value)}
              className="col-start-1 row-start-1 block w-full rounded-md bg-white py-1.5 pl-10 pr-3 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              required
            />
            <Tag
              aria-hidden="true"
              className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400 sm:size-4"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isCreating}
          className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
        >
          {isCreating ? 'Adding...' : 'Add'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Cancel
        </button>
      </form>
      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error instanceof Error ? error.message : 'Failed to add tag'}
        </p>
      )}
    </div>
  );
}
