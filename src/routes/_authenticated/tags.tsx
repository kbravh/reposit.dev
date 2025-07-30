import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { type FormEvent } from 'react';
import { Search, Plus, MoreHorizontal, Trash2, Tag, Edit3 } from 'lucide-react';
import {
  getTagsWithRepositoryCount,
  createTag,
  updateTag,
  deleteTag,
  getRepositoriesForTag,
} from '../../actions/tags';
import { TAG_COLORS } from '../../utils/colors';

export const Route = createFileRoute('/_authenticated/tags')({
  component: Tags,
});

type TagWithCount = {
  id: string;
  title: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  repositoryCount: number;
};

function Tags() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagTitle, setNewTagTitle] = useState('');
  const [editingTag, setEditingTag] = useState<TagWithCount | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editColor, setEditColor] = useState('');
  const [deletingTag, setDeletingTag] = useState<TagWithCount | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const queryClient = useQueryClient();

  const { data: tags = [], isLoading } = useQuery({
    queryKey: ['tags-with-count'],
    queryFn: () => getTagsWithRepositoryCount(),
  });

  const { data: repositoriesForDeletingTag = [] } = useQuery({
    queryKey: ['repositories-for-tag', deletingTag?.id],
    queryFn: () =>
      deletingTag
        ? getRepositoriesForTag({ data: { tagId: deletingTag.id } })
        : [],
    enabled: !!deletingTag,
  });

  const createTagMutation = useMutation({
    mutationFn: (variables: { title: string }) =>
      createTag({ data: variables }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags-with-count'] });
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      setIsAddingTag(false);
      setNewTagTitle('');
    },
  });

  const updateTagMutation = useMutation({
    mutationFn: (variables: {
      tagId: string;
      title?: string;
      color?: string;
    }) => updateTag({ data: variables }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags-with-count'] });
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      setEditingTag(null);
      setEditTitle('');
      setEditColor('');
    },
  });

  const deleteTagMutation = useMutation({
    mutationFn: (variables: { tagId: string }) =>
      deleteTag({ data: variables }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags-with-count'] });
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      queryClient.invalidateQueries({ queryKey: ['repository-tags'] });
      setDeletingTag(null);
      setDeleteConfirmation('');
    },
  });

  const filteredTags = tags.filter(tag =>
    tag.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateTag = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedTitle = newTagTitle.trim();
    if (trimmedTitle) {
      createTagMutation.mutate({ title: trimmedTitle });
    }
  };

  const handleEditTag = (tag: TagWithCount) => {
    setEditingTag(tag);
    setEditTitle(tag.title);
    setEditColor(tag.color);
  };

  const handleUpdateTag = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingTag) return;

    const updates: { tagId: string; title?: string; color?: string } = {
      tagId: editingTag.id,
    };

    if (editTitle.trim() !== editingTag.title) {
      updates.title = editTitle.trim();
    }

    if (editColor !== editingTag.color) {
      updates.color = editColor;
    }

    if (updates.title || updates.color) {
      updateTagMutation.mutate(updates);
    } else {
      setEditingTag(null);
    }
  };

  const handleDeleteTag = async () => {
    if (!deletingTag || deleteConfirmation !== deletingTag.title) return;
    deleteTagMutation.mutate({ tagId: deletingTag.id });
  };

  const startDeleteTag = (tag: TagWithCount) => {
    setDeletingTag(tag);
    setDeleteConfirmation('');
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Tags</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your tags and organize your repositories by topics.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsAddingTag(!isAddingTag)}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <Plus className="inline-block w-4 h-4 mr-1" />
            Add tag
          </button>
        </div>
      </div>

      {/* Add Tag Form */}
      {isAddingTag && (
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <form onSubmit={handleCreateTag} className="flex gap-3">
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
                  onChange={e => setNewTagTitle(e.target.value)}
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
              disabled={createTagMutation.isPending}
              className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
            >
              {createTagMutation.isPending ? 'Adding...' : 'Add'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAddingTag(false);
                setNewTagTitle('');
              }}
              className="rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Cancel
            </button>
          </form>
          {createTagMutation.error && (
            <p className="mt-2 text-sm text-red-600">
              {createTagMutation.error instanceof Error
                ? createTagMutation.error.message
                : 'Failed to add tag'}
            </p>
          )}
        </div>
      )}

      {/* Search */}
      <div className="mt-6">
        <div className="grid grid-cols-1">
          <input
            type="text"
            placeholder="Search tags..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="col-start-1 row-start-1 block w-full max-w-md rounded-md bg-white py-1.5 pl-10 pr-3 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          />
          <Search
            aria-hidden="true"
            className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400 sm:size-4"
          />
        </div>
      </div>

      {/* Tags Grid */}
      <div className="mt-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-gray-400"></div>
            <p className="mt-2 text-sm text-gray-500">Loading tags...</p>
          </div>
        ) : filteredTags.length === 0 ? (
          <div className="text-center py-12">
            <Tag className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              No tags
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery
                ? 'No tags match your search.'
                : 'Get started by creating a tag.'}
            </p>
            {!searchQuery && (
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddingTag(true)}
                  className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  <Plus className="-ml-0.5 mr-1.5 h-5 w-5" />
                  Add tag
                </button>
              </div>
            )}
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {filteredTags.map(tag => (
              <li key={tag.id} className="col-span-1 flex rounded-md shadow-xs">
                <div
                  className="flex w-16 shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white"
                  style={{ backgroundColor: tag.color }}
                >
                  <Tag className="h-6 w-6" />
                </div>
                <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-gray-200 border-t border-r border-b bg-white">
                  <div className="flex-1 truncate px-4 py-2 text-sm">
                    <div className="font-medium text-gray-900 truncate">
                      {tag.title}
                    </div>
                    <p className="text-gray-500">
                      {tag.repositoryCount}{' '}
                      {tag.repositoryCount === 1
                        ? 'Repository'
                        : 'Repositories'}
                    </p>
                  </div>
                  <div className="shrink-0 pr-2">
                    <div className="relative">
                      <details className="group">
                        <summary className="flex cursor-pointer items-center justify-center rounded-full size-8 bg-transparent bg-white text-gray-400 hover:text-gray-500 focus:outline-none group-open:text-gray-600">
                          <MoreHorizontal className="h-4 w-4" />
                        </summary>
                        <div className="absolute right-0 z-10 mt-1 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <button
                            onClick={() => {
                              handleEditTag(tag);
                              // Close the menu by removing focus
                              (document.activeElement as HTMLElement)?.blur();
                            }}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Edit3 className="mr-3 h-4 w-4" />
                            Edit tag
                          </button>
                          <button
                            onClick={() => {
                              startDeleteTag(tag);
                              // Close the menu by removing focus
                              (document.activeElement as HTMLElement)?.blur();
                            }}
                            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          >
                            <Trash2 className="mr-3 h-4 w-4" />
                            Delete tag
                          </button>
                        </div>
                      </details>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Edit Tag Modal */}
      {editingTag && (
        <div
          className="fixed inset-0 z-10 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            ></div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleUpdateTag}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                      <Edit3 className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                      <h3
                        className="text-lg leading-6 font-medium text-gray-900"
                        id="modal-title"
                      >
                        Edit Tag
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label
                            htmlFor="edit-title"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Title
                          </label>
                          <input
                            type="text"
                            id="edit-title"
                            value={editTitle}
                            onChange={e => setEditTitle(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Color
                          </label>
                          <div className="grid grid-cols-6 gap-2">
                            {TAG_COLORS.map(color => (
                              <button
                                key={color}
                                type="button"
                                onClick={() => setEditColor(color)}
                                className={`w-8 h-8 rounded-full border-2 ${
                                  editColor === color
                                    ? 'border-gray-900'
                                    : 'border-gray-300'
                                }`}
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={updateTagMutation.isPending}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {updateTagMutation.isPending ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingTag(null)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Tag Modal */}
      {deletingTag && (
        <div
          className="fixed inset-0 z-10 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            ></div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      Delete Tag
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete the tag &ldquo;
                        {deletingTag.title}&rdquo;?
                        {repositoriesForDeletingTag.length > 0 && (
                          <>
                            {' '}
                            This tag is currently attached to{' '}
                            <strong>
                              {repositoriesForDeletingTag.length}
                            </strong>{' '}
                            {repositoriesForDeletingTag.length === 1
                              ? 'repository'
                              : 'repositories'}
                            . It will be removed from all of them.
                          </>
                        )}
                      </p>
                      <div className="mt-4">
                        <label
                          htmlFor="delete-confirmation"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Type &ldquo;{deletingTag.title}&rdquo; to confirm
                          deletion:
                        </label>
                        <input
                          type="text"
                          id="delete-confirmation"
                          value={deleteConfirmation}
                          onChange={e => setDeleteConfirmation(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                          placeholder={deletingTag.title}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDeleteTag}
                  disabled={
                    deleteTagMutation.isPending ||
                    deleteConfirmation !== deletingTag.title
                  }
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {deleteTagMutation.isPending ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingTag(null)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
