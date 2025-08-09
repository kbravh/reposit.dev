import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { Tag, Plus } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useCreateTagMutation } from '../../hooks/tags';
import { TAG_COLORS } from '../../utils/colors';

interface AddTagModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTagModal({ isOpen, onOpenChange }: AddTagModalProps) {
  const [title, setTitle] = useState('');
  const [color, setColor] = useState(TAG_COLORS[0] as string);

  const createTagMutation = useCreateTagMutation({
    onSuccess: () => {
      handleReset();
      onOpenChange(false);
    },
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (trimmedTitle) {
      createTagMutation.mutate({ title: trimmedTitle, color });
    }
  };

  const handleReset = () => {
    setTitle('');
    setColor(TAG_COLORS[0] as string);
    createTagMutation.reset();
  };

  const handleCancel = () => {
    onOpenChange(false);
    handleReset();
  };

  return (
    <>
      {/* Add Tag Button */}
      <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button
          type="button"
          onClick={() => onOpenChange(true)}
          className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <Plus className="inline-block w-4 h-4 mr-1" />
          Add tag
        </button>
      </div>

      {/* Add Tag Dialog */}
      <Dialog open={isOpen} onClose={handleCancel} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/80 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-leave:duration-200 data-enter:ease-out data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-leave:duration-200 data-enter:ease-out data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <form onSubmit={handleSubmit}>
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30 sm:mx-0 sm:size-10">
                    <Tag className="size-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                    <DialogTitle
                      as="h3"
                      className="font-semibold text-base text-gray-900 dark:text-gray-100"
                    >
                      Add New Tag
                    </DialogTitle>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label
                          htmlFor="add-title"
                          className="block font-medium text-gray-900 dark:text-gray-100 text-sm/6"
                        >
                          Title
                        </label>
                        <input
                          type="text"
                          id="add-title"
                          value={title}
                          onChange={e => setTitle(e.target.value)}
                          placeholder="Enter tag name..."
                          className="mt-2 -outline-offset-1 focus:-outline-offset-2 block w-full rounded-md bg-white dark:bg-gray-700 px-3 py-1.5 text-base text-gray-900 dark:text-gray-100 outline-1 outline-gray-300 dark:outline-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6"
                          required
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-gray-900 dark:text-gray-100 text-sm/6 mb-2">
                          Color
                        </label>
                        <div className="grid grid-cols-6 gap-2">
                          {TAG_COLORS.map(tagColor => (
                            <button
                              key={tagColor}
                              type="button"
                              onClick={() => setColor(tagColor as string)}
                              className={`w-8 h-8 rounded-full border-2 ${
                                color === tagColor
                                  ? 'border-gray-900 dark:border-gray-100'
                                  : 'border-gray-300 dark:border-gray-600'
                              }`}
                              style={{ backgroundColor: tagColor }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {createTagMutation.error && (
                  <div className="mt-3">
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {createTagMutation.error instanceof Error
                        ? createTagMutation.error.message
                        : 'Failed to add tag'}
                    </p>
                  </div>
                )}

                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={createTagMutation.isPending}
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 font-semibold text-sm text-white shadow-xs hover:bg-indigo-500 sm:ml-3 sm:w-auto disabled:opacity-50"
                  >
                    {createTagMutation.isPending ? 'Adding...' : 'Add Tag'}
                  </button>
                  <button
                    type="button"
                    data-autofocus
                    onClick={handleCancel}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-700 px-3 py-2 font-semibold text-gray-900 dark:text-gray-100 text-sm shadow-xs ring-1 ring-gray-300 dark:ring-gray-600 ring-inset hover:bg-gray-50 dark:hover:bg-gray-600 sm:mt-0 sm:w-auto"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
