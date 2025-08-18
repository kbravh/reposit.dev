import { useRouterState } from '@tanstack/react-router';
import { Spinner } from '../ui/Spinner';

/**
 * Global navigation loading indicator that shows when TanStack Router
 * is transitioning between routes. This provides user feedback during
 * client-side navigation, especially on slower connections.
 */
export function NavigationLoadingIndicator() {
  // Check if the router is in a pending state (transitioning between routes)
  const isNavigating = useRouterState({
    select: state => state.status === 'pending',
  });

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isNavigating
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-full pointer-events-none'
      }`}
    >
      {/* Top progress bar */}
      <div className="h-1 bg-indigo-600 animate-pulse" />

      {/* Optional: Content area with spinner */}
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 py-2 px-4">
        <div className="flex items-center justify-center gap-3">
          <Spinner size="sm" />
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Loading...
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Simpler variant that just shows a top progress bar
 */
export function NavigationProgressBar() {
  const routerState = useRouterState({
    select: state => ({
      status: state.status,
      isLoading: state.isLoading,
      isTransitioning: state.isTransitioning,
    }),
  });

  // Only show loading indicator during actual route transitions, not initial loads
  const isNavigating =
    routerState.isTransitioning && routerState.status === 'pending';

  return (
    <div
      className={`fixed top-0 left-0 right-0 h-1 z-50 transition-all duration-300 ${
        isNavigating ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-pulse" />
    </div>
  );
}
