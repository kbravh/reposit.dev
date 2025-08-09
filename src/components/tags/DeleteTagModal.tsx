import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRepositoriesForTag } from '../../actions/tags';
import { tagKeys } from '../../lib/query-keys';
import type { TagWithCount } from './types';
import { useDeleteTagMutation } from '../../hooks/tags';

type DeleteTagModalProps = {
  tag: TagWithCount | null;
  onClose: () => void;
};

export function DeleteTagModal({ tag, onClose }: DeleteTagModalProps) {
  const [confirmation, setConfirmation] = useState('');

  const { data: repositories = [] } = useQuery({
    queryKey: tag ? tagKeys.repositoriesForTag(tag.id) : [],
    queryFn: () =>
      tag ? getRepositoriesForTag({ data: { tagId: tag.id } }) : [],
    enabled: !!tag,
  });

  const deleteTagMutation = useDeleteTagMutation({
    onSuccess: () => {
      setConfirmation('');
      onClose();
    },
  });

  if (!tag) return null;

  const handleDelete = () => {
    if (confirmation === tag.title) {
      deleteTagMutation.mutate({ tagId: tag.id });
    }
  };

  const handleClose = () => {
    setConfirmation('');
    onClose();
  };

  return (
    <Dialog open={!!tag} onClose={handleClose} className="relative z-10">
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
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:size-10">
                <AlertTriangle
                  aria-hidden="true"
                  className="size-6 text-red-600 dark:text-red-400"
                />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <DialogTitle
                  as="h3"
                  className="font-semibold text-base text-gray-900 dark:text-gray-100"
                >
                  Delete Tag
                </DialogTitle>
                <div className="mt-2">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Are you sure you want to delete the tag &ldquo;{tag.title}
                    &rdquo;?
                    {repositories.length > 0 && (
                      <>
                        {' '}
                        This tag is currently attached to{' '}
                        <strong>{repositories.length}</strong>{' '}
                        {repositories.length === 1
                          ? 'repository'
                          : 'repositories'}
                        . It will be removed from all of them.
                      </>
                    )}
                  </p>
                  <div className="mt-4">
                    <label
                      htmlFor="delete-confirmation"
                      className="block font-medium text-gray-900 dark:text-gray-100 text-sm/6"
                    >
                      Type &ldquo;{tag.title}&rdquo; to confirm deletion:
                    </label>
                    <input
                      type="text"
                      id="delete-confirmation"
                      value={confirmation}
                      onChange={e => setConfirmation(e.target.value)}
                      className="mt-2 -outline-offset-1 focus:-outline-offset-2 block w-full rounded-md bg-white dark:bg-gray-700 px-3 py-1.5 text-base text-gray-900 dark:text-gray-100 outline-1 outline-gray-300 dark:outline-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:outline-red-600 sm:text-sm/6"
                      placeholder={tag.title}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={handleDelete}
                disabled={
                  deleteTagMutation.isPending || confirmation !== tag.title
                }
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 font-semibold text-sm text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto disabled:opacity-50"
              >
                {deleteTagMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
              <button
                type="button"
                data-autofocus
                onClick={handleClose}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-700 px-3 py-2 font-semibold text-gray-900 dark:text-gray-100 text-sm shadow-xs ring-1 ring-gray-300 dark:ring-gray-600 ring-inset hover:bg-gray-50 dark:hover:bg-gray-600 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
