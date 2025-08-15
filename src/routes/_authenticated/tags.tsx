import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Search, Tag, Plus } from 'lucide-react';
import { getTagsWithRepositoryCount } from '../../actions/tags';
import { TagCard } from '../../components/tags/TagCard';
import { AddTagModal } from '../../components/tags/AddTagModal';
import { EditTagModal } from '../../components/tags/EditTagModal';
import { DeleteTagModal } from '../../components/tags/DeleteTagModal';
import { tagKeys } from '../../lib/query-keys';
import type { TagWithCount } from '../../components/tags/types';
import { useDeleteTagMutation } from '../../hooks/tags';

export const Route = createFileRoute('/_authenticated/tags')({
  component: Tags,
});

function Tags() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [editingTag, setEditingTag] = useState<TagWithCount | null>(null);
  const [deletingTag, setDeletingTag] = useState<TagWithCount | null>(null);

  const { data: tags = [], isLoading } = useQuery({
    queryKey: tagKeys.withCount(),
    queryFn: () => getTagsWithRepositoryCount(),
  });

  const deleteTagMutation = useDeleteTagMutation({
    onSuccess: () => setDeletingTag(null),
  });

  const filteredTags = tags.filter(tag =>
    tag.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteTag = (tag: TagWithCount) => {
    // If the tag has no repositories, delete directly without confirmation
    if (tag.repositoryCount === 0) {
      deleteTagMutation.mutate({ tagId: tag.id });
    } else {
      // For tags with repositories, show the confirmation modal
      setDeletingTag(tag);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Tags
          </h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Manage your tags and organize your repositories by topics.
          </p>
        </div>
        <AddTagModal isOpen={isAddingTag} onOpenChange={setIsAddingTag} />
      </div>

      {/* Search */}
      <div className="mt-6">
        <div className="grid grid-cols-1">
          <input
            type="text"
            placeholder="Search tags..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="col-start-1 row-start-1 block w-full max-w-md rounded-md bg-white dark:bg-gray-700 py-1.5 pl-10 pr-3 text-base text-gray-900 dark:text-gray-100 outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          />
          <Search
            aria-hidden="true"
            className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400 dark:text-gray-500 sm:size-4"
          />
        </div>
      </div>

      {/* Tags Grid */}
      <div className="mt-8 overflow-visible">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-gray-400"></div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Loading tags...
            </p>
          </div>
        ) : filteredTags.length === 0 ? (
          <div className="text-center py-12">
            <Tag className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
              No tags
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchQuery
                ? 'No tags match your search.'
                : 'Get started by creating a tag.'}
            </p>
            {!searchQuery && (
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddingTag(true)}
                  className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  <Plus className="-ml-0.5 mr-1.5 h-5 w-5" />
                  Add tag
                </button>
              </div>
            )}
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4 overflow-visible">
            {filteredTags.map(tag => (
              <TagCard
                key={tag.id}
                tag={tag}
                onEdit={setEditingTag}
                onDelete={handleDeleteTag}
              />
            ))}
          </ul>
        )}
      </div>

      <EditTagModal tag={editingTag} onClose={() => setEditingTag(null)} />

      <DeleteTagModal tag={deletingTag} onClose={() => setDeletingTag(null)} />
    </div>
  );
}
