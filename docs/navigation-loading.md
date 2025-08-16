# Navigation Loading States

This document explains how navigation loading states are implemented in the application using TanStack Start/Router.

## Overview

When navigating between pages, especially on slower connections or with longer data loading times, users need visual feedback to understand that navigation is happening. This implementation provides multiple levels of loading indicators.

## Components

### 1. Global Navigation Loading Indicator

**File:** `src/components/navigation/NavigationLoadingIndicator.tsx`

Provides two variants:

- `NavigationProgressBar`: A simple progress bar at the top of the page
- `NavigationLoadingIndicator`: A more detailed indicator with spinner and text

The global indicator is added to the root layout and appears whenever any navigation is pending.

### 2. Reusable Spinner Component

**File:** `src/components/ui/Spinner.tsx`

A flexible spinner component with:

- Multiple size options (`sm`, `md`, `lg`)
- Optional text content
- Conditional rendering with `show` prop

### 3. Route-Specific Loading Indicators

**File:** `src/components/navigation/MatchRouteSpinner.tsx`

Shows loading spinners next to specific navigation links when those routes are pending. Perfect for sidebar navigation.

## Router Configuration

**File:** `src/router.tsx`

The router is configured with:

```typescript
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
  defaultPendingMs: 1000, // Show pending component after 1 second of loading
  defaultPendingMinMs: 500, // Keep pending component visible for at least 500ms to avoid flashing

  // Preload routes on intent (hover/touchstart) for better performance
  defaultPreload: 'intent',
});
```

### Configuration Options

- **`defaultPendingMs`**: How long to wait before showing the pending component (prevents flashing for fast loads)
- **`defaultPendingMinMs`**: Minimum time to show the pending component once displayed (prevents jarring quick flashes)
- **`defaultPreload`**: Preloads routes when user hovers over links, improving perceived performance

## Usage Examples

### Global Loading Indicator

The `NavigationProgressBar` is added to the root layout:

```tsx
// In __root.tsx
import { NavigationProgressBar } from '../components/navigation/NavigationLoadingIndicator';

function RootDocument({ children }) {
  return (
    <html>
      <body>
        <NavigationProgressBar />
        {children}
      </body>
    </html>
  );
}
```

### Navigation Link with Loading Spinner

```tsx
import { Link } from '@tanstack/react-router';
import { MatchRouteSpinner } from '../components/navigation/MatchRouteSpinner';

function NavigationItem({ href, name, icon: Icon }) {
  return (
    <Link to={href} preload="intent">
      <Icon />
      <span>{name}</span>
      <MatchRouteSpinner to={href} size="sm" />
    </Link>
  );
}
```

### Custom Route Pending Component

You can override the default pending component for specific routes:

```tsx
export const Route = createFileRoute('/slow-page')({
  component: SlowPageComponent,
  pendingComponent: () => (
    <div className="text-center py-8">
      <Spinner size="lg">Loading complex data...</Spinner>
    </div>
  ),
  pendingMs: 500, // Show faster for this specific route
  loader: async () => {
    // Slow data loading
    return await fetchSlowData();
  },
});
```

## How It Works

1. **Route Navigation**: When a user clicks a navigation link, TanStack Router begins the transition
2. **Pending State**: If the transition takes longer than `defaultPendingMs`, the router status becomes 'pending'
3. **Global Indicator**: `useRouterState` detects the pending status and shows the global loading indicator
4. **Route-Specific Indicators**: `MatchRoute` components detect which specific routes are pending
5. **Default Pending Component**: If a route's loader takes time, the `defaultPendingComponent` is shown
6. **Completion**: Once the route loads, all loading indicators disappear

## Performance Features

### Intent Preloading

Links configured with `preload="intent"` will preload route data when users hover over them, making subsequent navigation feel instant.

### Optimized Timing

The timing configuration prevents:

- **Flashing**: Short delays prevent loading indicators from appearing for fast loads
- **Jarring Transitions**: Minimum display times ensure smooth visual transitions

### Route-Level Control

Individual routes can override timing and pending components for specific UX needs.

## Benefits

1. **User Feedback**: Clear indication that navigation is happening
2. **Perceived Performance**: Preloading and smooth transitions make the app feel faster
3. **Professional UX**: Polished loading states improve user confidence
4. **Accessibility**: Loading indicators provide important feedback for screen readers
5. **Flexibility**: Multiple levels of loading indicators for different use cases

## Testing Loading States

To test loading states during development:

1. **Network Throttling**: Use browser dev tools to simulate slower connections
2. **Artificial Delays**: Add delays to route loaders for testing
3. **Router DevTools**: Use TanStack Router DevTools to observe pending states

```typescript
// Example: Add delay for testing
export const Route = createFileRoute('/test')({
  loader: async () => {
    // Simulate slow network
    await new Promise(resolve => setTimeout(resolve, 2000));
    return fetchData();
  },
});
```

This implementation provides a comprehensive solution for navigation loading states that improves both user experience and perceived performance of the application.
