import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { Spinner } from './components/ui/Spinner';

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,

    // Default pending component shown while routes are loading
    defaultPendingComponent: () => (
      <div className="flex items-center justify-center min-h-32 py-8">
        <Spinner size="lg">Loading page...</Spinner>
      </div>
    ),

    // Timing configuration for pending states
    defaultPendingMs: 300, // Show pending component after 300ms of loading
    defaultPendingMinMs: 250, // Keep pending component visible briefly to avoid flashing

    // Preload routes on intent (hover/touchstart) for better performance
    defaultPreload: 'intent',
  });

  return router;
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
