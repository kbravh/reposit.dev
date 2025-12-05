import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { lazy, Suspense, useState } from 'react';
import { getTagsForRepository } from '../../actions/tags';
import { tagKeys } from '../../lib/query-keys';
import { Tag } from './Tag';

const TagModal = lazy(() =>
  import('./TagModal').then(m => ({ default: m.TagModal }))
);

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
          <Tag key={tag.id} title={tag.title} color={tag.color} />
        ))}
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1 rounded-full border border-dashed border-gray-300 dark:border-gray-600 px-2 py-1 text-xs text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
        >
          <Plus className="h-3 w-3" />
          {repositoryTags.length === 0 ? 'Add tags' : 'Edit'}
        </button>
      </div>

      {isModalOpen && (
        <Suspense fallback={null}>
          <TagModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            repositoryInstanceId={repositoryInstanceId}
          />
        </Suspense>
      )}
    </>
  );
}
