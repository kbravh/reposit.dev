import { createFileRoute, redirect } from '@tanstack/react-router';
import { authClient } from '../lib/auth-client';
import { SiGithub } from '@icons-pack/react-simple-icons';
import { getSession } from '../actions/auth';

// TODO: Take advantage of the `redirect` parameter to redirect to the specific page the user was trying to access

export const Route = createFileRoute('/login')({
  component: LoginPage,
  beforeLoad: async () => {
    const session = await getSession();
    if (session) {
      throw redirect({ to: '/' });
    }
  },
});

function LoginPage() {
  return (
    <div>
      <button
        type="button"
        className="bg-gray-800 text-white p-2 rounded-md flex gap-2 items-center"
        onClick={() => authClient.signIn.social({ provider: 'github' })}
      >
        Sign In with GitHub <SiGithub className="size-4" />
      </button>
    </div>
  );
}
