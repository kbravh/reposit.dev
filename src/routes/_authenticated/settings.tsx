import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/settings')({
  component: Settings,
});

function Settings() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      <p className="mt-2 text-gray-600">Settings page coming soon...</p>
    </div>
  );
}
