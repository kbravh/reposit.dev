import { type FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Code } from 'lucide-react';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { createRepository } from '../../actions/repos';

interface AddRepositoryFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddRepositoryForm({
  isOpen,
  onOpenChange,
}: AddRepositoryFormProps) {
  const queryClient = useQueryClient();

  const createRepoMutation = useMutation({
    mutationFn: (variables: { url: string }) =>
      createRepository({ data: variables }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repositories'] });
      onOpenChange(false);
    },
  });

  const handleCreateRepository = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const url = formData.get('repo-url') as string;
    const trimmedUrl = url?.trim();

    if (trimmedUrl) {
      createRepoMutation.mutate({ url: trimmedUrl });
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    createRepoMutation.reset();
  };

  return (
    <>
      {/* Add Repository Button */}
      <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button
          type="button"
          onClick={() => onOpenChange(true)}
          className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <Plus className="inline-block w-4 h-4 mr-1" />
          Add repository
        </button>
      </div>

      {/* Add Repository Dialog */}
      <Dialog
        open={isOpen}
        onClose={() => onOpenChange(false)}
        className="relative z-10"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-leave:duration-200 data-enter:ease-out data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-leave:duration-200 data-enter:ease-out data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <div>
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-indigo-100">
                  <Code aria-hidden="true" className="size-6 text-indigo-600" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <DialogTitle
                    as="h3"
                    className="font-semibold text-base text-gray-900"
                  >
                    Add Repository
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-gray-500 text-sm">
                      Enter a repository URL or owner/name to add it to your
                      collection.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleCreateRepository} className="mt-5 sm:mt-6">
                <div>
                  <label
                    htmlFor="repo-url"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Repository URL or org/name
                  </label>
                  <div className="mt-1 grid grid-cols-1">
                    <input
                      id="repo-url"
                      name="repo-url"
                      type="text"
                      placeholder="microsoft/TypeScript or https://github.com/microsoft/TypeScript"
                      className="col-start-1 row-start-1 block w-full rounded-md bg-white py-1.5 pl-10 pr-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      required
                    />
                    <Code
                      aria-hidden="true"
                      className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400 sm:size-4"
                    />
                  </div>
                </div>

                {createRepoMutation.error && (
                  <div className="mt-3">
                    <p className="text-sm text-red-600">
                      {createRepoMutation.error instanceof Error
                        ? createRepoMutation.error.message
                        : 'Failed to add repository'}
                    </p>
                  </div>
                )}

                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="submit"
                    disabled={createRepoMutation.isPending}
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 font-semibold text-sm text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2 disabled:opacity-50 sm:col-start-2"
                  >
                    {createRepoMutation.isPending
                      ? 'Adding...'
                      : 'Add Repository'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 font-semibold text-gray-900 text-sm shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:col-start-1 sm:mt-0"
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
