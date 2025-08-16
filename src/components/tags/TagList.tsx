import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { TagModal } from './TagModal';
import { getTagsForRepository } from '../../actions/tags';
import { useState } from 'react';
import { tagKeys } from '../../lib/query-keys';

export function RepositoryTags({
  repositoryInstanceId,
}: {
  repositoryInstanceId: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: repositoryTags = [] } = useQuery({
    queryKey: tagKeys.forRepository(repositoryInstanceId),
    queryFn: () => getTagsForRepository({ data: { repositoryInstanceId } }),
  });

  return (
    <>
      <div className="flex flex-wrap gap-1">
        {repositoryTags.map(tag => (
          <span
            key={tag.id}
            className="inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium text-gray-900 dark:text-white ring-1 ring-gray-300 dark:ring-gray-600 ring-inset"
          >
            <svg
              viewBox="0 0 6 6"
              aria-hidden="true"
              className="size-1.5"
              style={{ fill: tag.color }}
              width="6"
              height="6"
            >
              <circle r={3} cx={3} cy={3} />
            </svg>
            {tag.title}
          </span>
        ))}
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1 rounded-full border border-dashed border-gray-300 dark:border-gray-600 px-2 py-1 text-xs text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
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
