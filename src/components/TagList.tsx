import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { TagModal } from './TagModal';
import { getTagsForRepository } from '../actions/tags';
import { useState } from 'react';

export function RepositoryTags({
  repositoryInstanceId,
}: {
  repositoryInstanceId: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: repositoryTags = [] } = useQuery({
    queryKey: ['repository-tags', repositoryInstanceId],
    queryFn: () => getTagsForRepository({ data: { repositoryInstanceId } }),
  });

  return (
    <>
      <div className="flex flex-wrap gap-1">
        {repositoryTags.slice(0, 3).map(tag => (
          <span
            key={tag.id}
            className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium"
            style={{ backgroundColor: tag.color + '20', color: tag.color }}
          >
            {tag.title}
          </span>
        ))}
        {repositoryTags.length > 3 && (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
            +{repositoryTags.length - 3}
          </span>
        )}
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1 rounded-full border border-dashed border-gray-300 px-2 py-1 text-xs text-gray-500 hover:border-gray-400 hover:text-gray-600"
        >
          <Plus className="h-3 w-3" />
          {repositoryTags.length === 0 ? 'Add tags' : 'Edit'}
        </button>
      </div>

      <TagModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        repositoryInstanceId={repositoryInstanceId}
      />
    </>
  );
}
