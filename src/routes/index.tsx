import { createFileRoute } from '@tanstack/react-router';
import { authClient } from '../lib/auth-client';
import { createTag } from '../actions/tags';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  const { data: session } = authClient.useSession();

  return (
    <>
      {session?.user?.email}
      {session?.user ? (
        <button
          type="button"
          className="bg-blue-500 text-white p-2 rounded-md"
          onClick={() => authClient.signOut()}
        >
          Sign Out
        </button>
      ) : (
        <button
          type="button"
          className="bg-blue-500 text-white p-2 rounded-md"
          onClick={() => authClient.signIn.social({ provider: 'github' })}
        >
          Sign In
        </button>
      )}
      <button onClick={() => createTag({ data: { title: 'test' } })}>
        Create Tag
      </button>
    </>
  );
}
