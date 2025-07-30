import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { MoreHorizontal, Trash2, Tag, Edit3 } from 'lucide-react';

type TagWithCount = {
  id: string;
  title: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  repositoryCount: number;
};

type TagCardProps = {
  tag: TagWithCount;
  onEdit: (tag: TagWithCount) => void;
  onDelete: (tag: TagWithCount) => void;
};

export function TagCard({ tag, onEdit, onDelete }: TagCardProps) {
  return (
    <li className="col-span-1 flex rounded-md shadow-xs overflow-visible">
      <div
        className="flex w-16 shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white"
        style={{ backgroundColor: tag.color }}
      >
        <Tag className="h-6 w-6" />
      </div>
      <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-gray-200 border-t border-r border-b bg-white overflow-visible">
        <div className="flex-1 truncate px-4 py-2 text-sm">
          <div className="font-medium text-gray-900 truncate">{tag.title}</div>
          <p className="text-gray-500">
            {tag.repositoryCount}{' '}
            {tag.repositoryCount === 1 ? 'Repository' : 'Repositories'}
          </p>
        </div>
        <div className="shrink-0 pr-2">
          <Menu as="div" className="relative">
            <MenuButton className="flex cursor-pointer items-center justify-center rounded-full size-8 bg-white text-gray-400 hover:text-gray-500 focus:outline-none">
              <MoreHorizontal className="h-4 w-4" />
            </MenuButton>
            <MenuItems
              transition
              className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-leave:duration-75 data-enter:ease-out data-leave:ease-in"
            >
              <div className="py-1">
                <MenuItem>
                  <button
                    onClick={() => onEdit(tag)}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                  >
                    <Edit3 className="mr-3 h-4 w-4" />
                    Edit tag
                  </button>
                </MenuItem>
                <MenuItem>
                  <button
                    onClick={() => onDelete(tag)}
                    className="flex w-full items-center px-4 py-2 text-sm text-red-600 data-focus:bg-gray-100 data-focus:text-red-700 data-focus:outline-hidden"
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
