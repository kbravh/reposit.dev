import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/repositories')({
  component: Repositories,
});

function Repositories() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900">Repositories</h1>
      <p className="mt-2 text-gray-600">Repositories page coming soon...</p>
    </div>
  );
}
