import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { MoreHorizontal, Trash2, Tag, Edit3 } from 'lucide-react';
import type { TagWithCount } from './types';

type TagCardProps = {
  tag: TagWithCount;
  onEdit: (tag: TagWithCount) => void;
  onDelete: (tag: TagWithCount) => void;
};

export function TagCard({ tag, onEdit, onDelete }: TagCardProps) {
  return (
    <li className="col-span-1 flex h-16 rounded-md shadow-xs overflow-visible">
      <div
        className="flex w-16 shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white"
        style={{ backgroundColor: tag.color }}
      >
        <Tag className="h-6 w-6" />
      </div>
      <div className="flex flex-1 items-center justify-between rounded-r-md border-gray-200 dark:border-gray-600 border-t border-r border-b bg-white dark:bg-gray-800">
        <div className="flex-1 px-4 py-2 text-sm min-w-0">
          <div className="font-medium text-gray-900 dark:text-gray-100">
            {tag.title}
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            {tag.repositoryCount}{' '}
            {tag.repositoryCount === 1 ? 'Repository' : 'Repositories'}
          </p>
        </div>
        <div className="shrink-0 pr-2 relative overflow-visible">
          <Menu as="div" className="relative">
            <MenuButton className="flex cursor-pointer items-center justify-center rounded-full size-8 bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none">
              <MoreHorizontal className="h-4 w-4" />
            </MenuButton>
            <MenuItems
              transition
              className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-700 shadow-lg ring-1 ring-black/5 dark:ring-white/10 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-leave:duration-75 data-enter:ease-out data-leave:ease-in"
            >
              <div className="py-1">
                <MenuItem>
                  <button
                    onClick={() => onEdit(tag)}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 data-focus:bg-gray-100 dark:data-focus:bg-gray-600 data-focus:text-gray-900 dark:data-focus:text-gray-100 data-focus:outline-hidden"
                  >
                    <Edit3 className="mr-3 h-4 w-4" />
                    Edit tag
                  </button>
                </MenuItem>
                <MenuItem>
                  <button
                    onClick={() => onDelete(tag)}
                    className="flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 data-focus:bg-gray-100 dark:data-focus:bg-gray-600 data-focus:text-red-700 dark:data-focus:text-red-300 data-focus:outline-hidden"
                  >
                    <Trash2 className="mr-3 h-4 w-4" />
                    Delete tag
                  </button>
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
        </div>
      </div>
    </li>
  );
}
