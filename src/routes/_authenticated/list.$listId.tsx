import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { getList, updateList, deleteList, getRepositoriesForList } from '../../actions/lists';
import { getTags } from '../../actions/tags';
import { getRepositories } from '../../actions/repos';
import { listKeys, tagKeys, repositoryKeys } from '../../lib/query-keys';

export const Route = createFileRoute('/_authenticated/list/$listId')({
  component: ListDetailPage,
});

function ListDetailPage() {
  const { listId } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: l } = useQuery({ queryKey: listKeys.detail(listId), queryFn: () => getList({ listId }) });
  const { data: tags = [] } = useQuery({ queryKey: tagKeys.lists(), queryFn: () => getTags() });
  const { data: repos = [] } = useQuery({ queryKey: repositoryKeys.lists(), queryFn: () => getRepositories() });
  const { data: listRepos = [] } = useQuery({
    queryKey: listKeys.repositories(listId),
    queryFn: () => getRepositoriesForList({ listId }),
  });

  const [name, setName] = useState(l?.name ?? '');
  const [description, setDescription] = useState(l?.description ?? '');
  const [includeMatch, setIncludeMatch] = useState<'any' | 'all'>(l?.includeMatch ?? 'any');
  const [excludeMatch, setExcludeMatch] = useState<'any' | 'all'>(l?.excludeMatch ?? 'any');
  const [includeTagIds, setIncludeTagIds] = useState<string[]>(l?.includeTagIds ?? []);
  const [excludeTagIds, setExcludeTagIds] = useState<string[]>(l?.excludeTagIds ?? []);
  const [includeRepositoryInstanceIds, setIncludeRepositoryInstanceIds] = useState<string[]>(
    l?.includeRepositoryInstanceIds ?? []
  );
  const [excludeRepositoryInstanceIds, setExcludeRepositoryInstanceIds] = useState<string[]>(
    l?.excludeRepositoryInstanceIds ?? []
  );

  // Keep local state in sync when the list is fetched (first render)
  useMemo(() => {
    if (l) {
      setName(l.name);
      setDescription(l.description ?? '');
      setIncludeMatch((l.includeMatch as 'any' | 'all') ?? 'any');
      setExcludeMatch((l.excludeMatch as 'any' | 'all') ?? 'any');
      setIncludeTagIds(l.includeTagIds ?? []);
      setExcludeTagIds(l.excludeTagIds ?? []);
      setIncludeRepositoryInstanceIds(l.includeRepositoryInstanceIds ?? []);
      setExcludeRepositoryInstanceIds(l.excludeRepositoryInstanceIds ?? []);
    }
  }, [l]);

  const saveMutation = useMutation({
    mutationFn: updateList,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: listKeys.detail(listId) });
      qc.invalidateQueries({ queryKey: listKeys.repositories(listId) });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: deleteList,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: listKeys.lists() });
      navigate({ to: '/lists' });
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{l?.name ?? 'List'}</h1>
          {l?.description && (
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{l.description}</p>
          )}
        </div>
        <button
          onClick={() => deleteMutation.mutate({ listId })}
          className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500"
        >
          Delete
        </button>
      </div>

      <section className="rounded-md bg-white dark:bg-gray-800 p-4 ring-1 ring-gray-200 dark:ring-gray-700">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Edit list</h2>
        <form
          className="mt-4 grid grid-cols-1 gap-4"
          onSubmit={e => {
            e.preventDefault();
            saveMutation.mutate({
              listId,
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

          <fieldset className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <legend className="text-sm font-medium text-gray-900 dark:text-gray-100">Include</legend>
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
                  <input type="radio" name="includeMatch" checked={includeMatch === 'any'} onChange={() => setIncludeMatch('any')} />
                  Any of selected
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <input type="radio" name="includeMatch" checked={includeMatch === 'all'} onChange={() => setIncludeMatch('all')} />
                  All selected
                </label>
              </div>
            </div>
          </fieldset>

          <fieldset className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <legend className="text-sm font-medium text-gray-900 dark:text-gray-100">Exclude</legend>
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
                  <input type="radio" name="excludeMatch" checked={excludeMatch === 'any'} onChange={() => setExcludeMatch('any')} />
                  Any of selected
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <input type="radio" name="excludeMatch" checked={excludeMatch === 'all'} onChange={() => setExcludeMatch('all')} />
                  All selected
                </label>
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
                    setIncludeRepositoryInstanceIds(Array.from(e.target.selectedOptions).map(o => o.value))
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
                    setExcludeRepositoryInstanceIds(Array.from(e.target.selectedOptions).map(o => o.value))
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
            <button type="submit" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
              Save
            </button>
          </div>
        </form>
      </section>

      <section>
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Repositories in this list</h2>
        <ul role="list" className="mt-4 divide-y divide-gray-200 dark:divide-gray-700 rounded-md bg-white dark:bg-gray-800 ring-1 ring-gray-200 dark:ring-gray-700">
          {listRepos.map(r => (
            <li key={r.repositoryInstance.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {r.repository.org}/{r.repository.name}
                </p>
                {r.repository.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-300">{r.repository.description}</p>
                )}
              </div>
              <Link
                to={`/repositories`}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
              >
                View repo
              </Link>
            </li>
          ))}
          {listRepos.length === 0 && (
            <li className="px-4 py-6 text-sm text-gray-600 dark:text-gray-300">No repositories match this list yet.</li>
          )}
        </ul>
      </section>
    </div>
  );
}