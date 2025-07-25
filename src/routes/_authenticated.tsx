import { Home, Settings, List, Code, User } from 'lucide-react';
import { cn } from '../utils/cn';
import { ElementType, ReactNode } from 'react';
import MobileSidebar, {
  MobileSidebarButton,
} from '../components/MobileSidebar';
import { authClient } from '../lib/auth-client';
import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';

export type NavigationItem = {
  name: string;
  href: string;
  icon: ElementType;
  current: boolean;
};

const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, current: true },
  { name: 'Repositories', href: '/repositories', icon: Code, current: false },
  { name: 'Lists', href: '/lists', icon: List, current: false },
  { name: 'Settings', href: '/settings', icon: Settings, current: false },
];

export const Route = createFileRoute('/_authenticated')({
  component: LoggedInLayout,
});

function LoggedInLayout({ children }: { children: ReactNode }) {
  const { data: user, isPending } = useQuery({
    queryKey: ['session'],
    queryFn: () => authClient.getSession().then(res => res.data?.user),
  });

  return (
    <>
      <div>
        <MobileSidebar navigationItems={navigation} />
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6">
            <div className="flex h-16 shrink-0 items-center">
              {/* TODO: Add logo */}
              <img
                alt="Reposit"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                className="h-8 w-auto"
              />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul className="-mx-2 space-y-1">
                    {navigation.map(item => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className={cn(
                            item.current
                              ? 'bg-gray-800 text-white'
                              : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                            'group flex gap-x-3 rounded-md p-2 font-semibold text-sm/6'
                          )}
                        >
                          <item.icon
                            aria-hidden="true"
                            className="size-6 shrink-0"
                          />
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
                {!isPending && user && (
                  <li className="-mx-6 mt-auto">
                    <a
                      href="#"
                      className="flex items-center gap-x-4 px-6 py-3 font-semibold text-sm/6 text-white hover:bg-gray-800"
                    >
                      <>
                        {user?.image ? (
                          <img
                            alt=""
                            src={user.image}
                            className="size-8 rounded-full bg-gray-800"
                          />
                        ) : (
                          <User className="size-8 rounded-full bg-gray-800" />
                        )}
                      </>
                      <span className="sr-only">Your profile</span>
                      <span aria-hidden="true">{user?.name}</span>
                    </a>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </div>

        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-gray-900 px-4 py-4 shadow-xs sm:px-6 lg:hidden">
          <MobileSidebarButton />
          <div className="flex-1 font-semibold text-sm/6 text-white">
            Dashboard
          </div>
          {!isPending && user && (
            <a href="#">
              <span className="sr-only">Your profile</span>
              {!isPending && user?.image ? (
                <img
                  alt=""
                  src={user.image}
                  className="size-8 rounded-full bg-gray-800"
                />
              ) : (
                <User className="size-8 rounded-full bg-gray-800" />
              )}
            </a>
          )}
        </div>

        <main className="py-10 lg:pl-72">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </>
  );
}
