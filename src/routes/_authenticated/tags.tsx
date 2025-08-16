import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useState, lazy, Suspense } from 'react';
import { Tag, Plus } from 'lucide-react';
import { getTagsWithRepositoryCount } from '../../actions/tags';
import { TagCard } from '../../components/tags/TagCard';
import { tagKeys } from '../../lib/query-keys';
import type { TagWithCount } from '../../components/tags/types';
import { useDeleteTagMutation } from '../../hooks/tags';

const AddTagModal = lazy(() =>
  import('../../components/tags/AddTagModal').then(m => ({
    default: m.AddTagModal,
  }))
);
const EditTagModal = lazy(() =>
  import('../../components/tags/EditTagModal').then(m => ({
    default: m.EditTagModal,
  }))
);
const DeleteTagModal = lazy(() =>
  import('../../components/tags/DeleteTagModal').then(m => ({
    default: m.DeleteTagModal,
  }))
);

export const Route = createFileRoute('/_authenticated/tags')({
  component: Tags,
});

function Tags() {
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
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsAddingTag(true)}
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <Plus className="-ml-0.5 mr-1.5 h-5 w-5" />
            Add tag
          </button>
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
        ) : tags.length === 0 ? (
          <div className="text-center py-12">
            <Tag className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
              No tags
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Get started by creating a tag.
            </p>
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
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4 overflow-visible">
            {tags.map(tag => (
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

      {isAddingTag && (
        <Suspense fallback={null}>
          <AddTagModal isOpen={isAddingTag} onOpenChange={setIsAddingTag} />
        </Suspense>
      )}

      {editingTag && (
        <Suspense fallback={null}>
          <EditTagModal tag={editingTag} onClose={() => setEditingTag(null)} />
        </Suspense>
      )}

      {deletingTag && (
        <Suspense fallback={null}>
          <DeleteTagModal
            tag={deletingTag}
            onClose={() => setDeletingTag(null)}
          />
        </Suspense>
      )}
    </div>
  );
}
