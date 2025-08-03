import { ExternalLink, MoreHorizontal, Trash2 } from 'lucide-react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RepositoryTags } from './TagList';
import { deleteRepository } from '../actions/repos';

type Repository = {
  repositoryInstance: {
    id: string;
    userId: string;
    repositoryId: string;
    createdAt: Date;
    updatedAt: Date;
  };
  repository: {
    id: string;
    htmlUrl: string;
    org: string;
    name: string;
    description: string | null;
    private: boolean;
    provider: string;
    providerId: string;
    lastSyncedAt: Date | null;
    deletedAt: Date | null;
    createdAt: Date;
    primaryLanguage: string | null;
    updatedAt: Date;
  };
};

interface RepositoryListItemProps {
  repository: Repository;
}

export function RepositoryListItem({ repository }: RepositoryListItemProps) {
  const queryClient = useQueryClient();

  const deleteRepoMutation = useMutation({
    mutationFn: (variables: { repositoryInstanceId: string }) =>
      deleteRepository({ data: variables }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repositories'] });
    },
  });
  return (
    <li className="flex flex-col gap-3 py-5 sm:flex-row sm:justify-between sm:gap-x-6">
      <div className="min-w-0 flex-auto">
        <div className="flex items-center gap-x-2">
          <p className="font-semibold text-gray-900 text-sm/6">
            {repository.repository.org}/{repository.repository.name}
          </p>
          <a
            href={repository.repository.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-600"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="sr-only">Open repository in GitHub</span>
          </a>
        </div>
        {repository.repository.description && (
          <p className="mt-1 text-gray-500 text-sm/6 truncate">
            {repository.repository.description}
          </p>
        )}
        <div className="mt-2">
          <RepositoryTags
            repositoryInstanceId={repository.repositoryInstance.id}
          />
        </div>
      </div>
      <div className="flex shrink-0 items-start justify-end sm:items-center">
        <Menu as="div" className="relative flex-none">
          <MenuButton className="relative block text-gray-500 hover:text-gray-900">
            <span className="-inset-2.5 absolute" />
            <span className="sr-only">Open options</span>
            <MoreHorizontal aria-hidden="true" className="size-5" />
          </MenuButton>
          <MenuItems
            transition
            className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-leave:duration-75 data-enter:ease-out data-leave:ease-in"
          >
            <MenuItem>
              <button
                onClick={() => {
                  deleteRepoMutation.mutate({
                    repositoryInstanceId: repository.repositoryInstance.id,
                  });
                }}
                disabled={deleteRepoMutation.isPending}
                className="flex w-full items-center px-4 py-2 text-sm text-red-600 data-focus:bg-gray-50 data-focus:outline-hidden disabled:opacity-50"
              >
                <Trash2 className="mr-3 h-4 w-4" />
                Remove repository
              </button>
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>
    </li>
  );
}
