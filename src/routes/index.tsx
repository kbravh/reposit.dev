import { createFileRoute } from '@tanstack/react-router';
// import { authClient } from '../lib/auth-client';
// import { createTag } from '../actions/tags';
// import { useQuery } from '@tanstack/react-query';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  // const { data: user, isPending } = useQuery({
  //   queryKey: ['session'],
  //   queryFn: () => authClient.getSession().then(res => res.data?.user),
  // });

  // if (isPending) {
  //   return <div>Loading...</div>;
  // }

  // return (
  //   <>
  //     {user?.email}
  //     {user ? (
  //       <button
  //         type="button"
  //         className="bg-blue-500 text-white p-2 rounded-md"
  //         onClick={() => authClient.signOut()}
  //       >
  //         Sign Out
  //       </button>
  //     ) : (
  //       <button
  //         type="button"
  //         className="bg-blue-500 text-white p-2 rounded-md"
  //         onClick={() => authClient.signIn.social({ provider: 'github' })}
  //       >
  //         Sign In
  //       </button>
  //     )}
  //     <button onClick={() => createTag({ data: { title: 'test' } })}>
  //       Create Tag
  //     </button>
  //   </>
  // );
  return <div>Home</div>;
}
