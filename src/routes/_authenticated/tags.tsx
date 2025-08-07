import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Search, Plus, Tag } from 'lucide-react';
import { getTagsWithRepositoryCount, deleteTag } from '../../actions/tags';
import { TagCard } from '../../components/tags/TagCard';
import { AddTagForm } from '../../components/tags/AddTagForm';
import { EditTagModal } from '../../components/tags/EditTagModal';
import { DeleteTagModal } from '../../components/tags/DeleteTagModal';
import { tagKeys } from '../../lib/query-keys';

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
  const [editingTag, setEditingTag] = useState<TagWithCount | null>(null);
  const [deletingTag, setDeletingTag] = useState<TagWithCount | null>(null);

  const queryClient = useQueryClient();

  const { data: tags = [], isLoading } = useQuery({
    queryKey: tagKeys.withCount(),
    queryFn: () => getTagsWithRepositoryCount(),
  });

  const deleteTagMutation = useMutation({
    mutationFn: (variables: { tagId: string }) =>
      deleteTag({ data: variables }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.all });
      setDeletingTag(null);
    },
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

      <AddTagForm
        isVisible={isAddingTag}
        onClose={() => setIsAddingTag(false)}
      />

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
