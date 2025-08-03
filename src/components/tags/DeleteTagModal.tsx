import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';

type Repository = {
  repositoryInstance: { id: string };
  repository: { name: string; org: string };
};

type TagWithCount = {
  id: string;
  title: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  repositoryCount: number;
};

type DeleteTagModalProps = {
  tag: TagWithCount | null;
  repositories: Repository[];
  isDeleting: boolean;
  onDelete: () => void;
  onClose: () => void;
};

export function DeleteTagModal({
  tag,
  repositories,
  isDeleting,
  onDelete,
  onClose,
}: DeleteTagModalProps) {
  const [confirmation, setConfirmation] = useState('');

  // Reset confirmation when tag changes or modal closes
  useEffect(() => {
    setConfirmation('');
  }, [tag]);

  if (!tag) return null;

  const handleDelete = () => {
    if (confirmation === tag.title) {
      onDelete();
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
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-leave:duration-200 data-enter:ease-out data-leave:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-leave:duration-200 data-enter:ease-out data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                <AlertTriangle
                  aria-hidden="true"
                  className="size-6 text-red-600"
                />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <DialogTitle
                  as="h3"
                  className="font-semibold text-base text-gray-900"
                >
                  Delete Tag
                </DialogTitle>
                <div className="mt-2">
                  <p className="text-gray-500 text-sm">
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
                      className="block font-medium text-gray-900 text-sm/6"
                    >
                      Type &ldquo;{tag.title}&rdquo; to confirm deletion:
                    </label>
                    <input
                      type="text"
                      id="delete-confirmation"
                      value={confirmation}
                      onChange={e => setConfirmation(e.target.value)}
                      className="mt-2 -outline-offset-1 focus:-outline-offset-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-red-600 sm:text-sm/6"
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
                disabled={isDeleting || confirmation !== tag.title}
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 font-semibold text-sm text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
              <button
                type="button"
                data-autofocus
                onClick={handleClose}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 font-semibold text-gray-900 text-sm shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
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
