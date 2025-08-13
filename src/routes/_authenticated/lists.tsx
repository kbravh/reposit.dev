import { createFileRoute, Link } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Folder, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { createList, deleteList, getLists } from '../../actions/lists';
import { getTags } from '../../actions/tags';
import { getRepositories } from '../../actions/repos';
import { listKeys, tagKeys, repositoryKeys } from '../../lib/query-keys';

export const Route = createFileRoute('/_authenticated/lists')({
  component: ListsPage,
});

function ListsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const { data: lists = [], isLoading } = useQuery({
    queryKey: listKeys.lists(),
    queryFn: () => getLists(),
  });

  const filteredLists = useMemo(
    () => lists.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [lists, searchQuery]
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Lists</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Create smart lists from tags and fine-tune with includes/excludes.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <Plus className="-ml-0.5 mr-1.5 h-5 w-5" /> New list
          </button>
        </div>
      </div>

      <div className="mt-6">
        <div className="grid grid-cols-1">
          <input
            type="text"
            placeholder="Search lists..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="col-start-1 row-start-1 block w-full max-w-md rounded-md bg-white dark:bg-gray-700 py-1.5 pl-10 pr-3 text-base text-gray-900 dark:text-gray-100 outline outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          />
          <Search aria-hidden="true" className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400 dark:text-gray-500 sm:size-4" />
        </div>
      </div>

      <div className="mt-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent text-gray-400" />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading lists...</p>
          </div>
        ) : filteredLists.length === 0 ? (
          <div className="text-center py-12">
            <Folder className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">No lists</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchQuery ? 'No lists match your search.' : 'Get started by creating a list.'}
            </p>
            {!searchQuery && (
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setIsAdding(true)}
                  className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  <Plus className="-ml-0.5 mr-1.5 h-5 w-5" /> New list
                </button>
              </div>
            )}
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {filteredLists.map(l => (
              <li key={l.id} className="col-span-1 rounded-md bg-white dark:bg-gray-800 p-4 ring-1 ring-gray-200 dark:ring-gray-700">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{l.name}</h3>
                    {l.description && (
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{l.description}</p>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <Link
                    to={`/list/${l.id}`}
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    View
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <AddListModal isOpen={isAdding} onOpenChange={setIsAdding} />
    </div>
  );
}

function AddListModal({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: (next: boolean) => void }) {
  const qc = useQueryClient();
  const { data: tags = [] } = useQuery({ queryKey: tagKeys.lists(), queryFn: () => getTags() });
  const { data: repos = [] } = useQuery({ queryKey: repositoryKeys.lists(), queryFn: () => getRepositories() });

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [includeMatch, setIncludeMatch] = useState<'any' | 'all'>('any');
  const [excludeMatch, setExcludeMatch] = useState<'any' | 'all'>('any');
  const [includeTagIds, setIncludeTagIds] = useState<string[]>([]);
  const [excludeTagIds, setExcludeTagIds] = useState<string[]>([]);
  const [includeRepositoryInstanceIds, setIncludeRepositoryInstanceIds] = useState<string[]>([]);
  const [excludeRepositoryInstanceIds, setExcludeRepositoryInstanceIds] = useState<string[]>([]);

  const createMutation = useMutation({
    mutationFn: createList,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: listKeys.lists() });
      onOpenChange(false);
      setName('');
      setDescription('');
      setIncludeTagIds([]);
      setExcludeTagIds([]);
      setIncludeRepositoryInstanceIds([]);
      setExcludeRepositoryInstanceIds([]);
      setIncludeMatch('any');
      setExcludeMatch('any');
    },
  });

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-list-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div className="w-full max-w-2xl rounded-md bg-white dark:bg-gray-800 p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 id="add-list-title" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Create list
          </h2>
          <button
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form
          className="mt-4 space-y-4"
          onSubmit={e => {
            e.preventDefault();
            createMutation.mutate({
              name,
              description: description || undefined,
              includeMatch,
              excludeMatch,
              includeTagIds,
              excludeTagIds,
              includeRepositoryInstanceIds,
              excludeRepositoryInstanceIds,
            });
          }}
        >
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="mt-1 block w-full rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-indigo-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <fieldset>
            <legend className="text-sm font-medium text-gray-900 dark:text-gray-100">Include repositories with</legend>
            <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300">Tags</label>
                <select
                  multiple
                  value={includeTagIds}
                  onChange={e => setIncludeTagIds(Array.from(e.target.selectedOptions).map(o => o.value))}
                  className="mt-1 block w-full rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-indigo-600 h-28"
                >
                  {tags.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <span className="block text-sm text-gray-700 dark:text-gray-300">Match</span>
                <div className="mt-2 flex items-center gap-4">
                  <label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <input
                      type="radio"
                      name="includeMatch"
                      checked={includeMatch === 'any'}
                      onChange={() => setIncludeMatch('any')}
                    />
                    Any of selected
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <input
                      type="radio"
                      name="includeMatch"
                      checked={includeMatch === 'all'}
                      onChange={() => setIncludeMatch('all')}
                    />
                    All selected
                  </label>
                </div>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-medium text-gray-900 dark:text-gray-100">Exclude repositories with</legend>
            <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300">Tags</label>
                <select
                  multiple
                  value={excludeTagIds}
                  onChange={e => setExcludeTagIds(Array.from(e.target.selectedOptions).map(o => o.value))}
                  className="mt-1 block w-full rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-indigo-600 h-28"
                >
                  {tags.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <span className="block text-sm text-gray-700 dark:text-gray-300">Match</span>
                <div className="mt-2 flex items-center gap-4">
                  <label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <input
                      type="radio"
                      name="excludeMatch"
                      checked={excludeMatch === 'any'}
                      onChange={() => setExcludeMatch('any')}
                    />
                    Any of selected
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <input
                      type="radio"
                      name="excludeMatch"
                      checked={excludeMatch === 'all'}
                      onChange={() => setExcludeMatch('all')}
                    />
                    All selected
                  </label>
                </div>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-medium text-gray-900 dark:text-gray-100">Individual repositories</legend>
            <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300">Always include</label>
                <select
                  multiple
                  value={includeRepositoryInstanceIds}
                  onChange={e =>
                    setIncludeRepositoryInstanceIds(
                      Array.from(e.target.selectedOptions).map(o => o.value)
                    )
                  }
                  className="mt-1 block w-full rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-indigo-600 h-28"
                >
                  {repos.map(r => (
                    <option key={r.repositoryInstance.id} value={r.repositoryInstance.id}>
                      {r.repository.org}/{r.repository.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300">Always exclude</label>
                <select
                  multiple
                  value={excludeRepositoryInstanceIds}
                  onChange={e =>
                    setExcludeRepositoryInstanceIds(
                      Array.from(e.target.selectedOptions).map(o => o.value)
                    )
                  }
                  className="mt-1 block w-full rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-indigo-600 h-28"
                >
                  {repos.map(r => (
                    <option key={r.repositoryInstance.id} value={r.repositoryInstance.id}>
                      {r.repository.org}/{r.repository.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </fieldset>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-md px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}