# LaunchDarkly Feature Flags

This application uses LaunchDarkly for feature flag management, enabling controlled feature rollouts and A/B testing.

## Setup

### 1. Environment Variables

Add the following environment variables to your `.env` file:

```bash
# LaunchDarkly Client-Side ID (public, safe to expose to client)
LAUNCHDARKLY_CLIENT_SIDE_ID=your-client-side-id-here

# LaunchDarkly SDK Key (secret, server-side only)
LAUNCHDARKLY_SDK_KEY=your-sdk-key-here
```

You can find these values in your LaunchDarkly project settings:
- **Client-Side ID**: Account Settings → Projects → Your Project → Client-side ID
- **SDK Key**: Account Settings → Projects → Your Project → SDK key (server-side)

### 2. Getting Your Keys

1. Log in to [LaunchDarkly](https://app.launchdarkly.com/)
2. Navigate to Account Settings → Projects
3. Select your project (or create a new one)
4. Copy the Client-side ID and SDK key for your environment (Production, Staging, etc.)

## Usage

### Client-Side Usage (React Components)

Use the provided hooks to access feature flags in your React components:

```tsx
import { useFeatureFlag, useFeatureFlags } from '../lib/use-feature-flags';

function MyComponent() {
  // Get a single feature flag with a default value
  const isNewFeatureEnabled = useFeatureFlag('new-feature', false);

  // Get all feature flags
  const flags = useFeatureFlags();

  if (isNewFeatureEnabled) {
    return <NewFeature />;
  }

  return <OldFeature />;
}
```

#### Available Hooks

- `useFeatureFlag<T>(flagKey: string, defaultValue: T): T` - Get a single feature flag value
- `useFeatureFlags(): FeatureFlags` - Get all feature flags
- `useLDClientInstance(): LDClient | undefined` - Get the LaunchDarkly client instance

### Server-Side Usage (Actions & Server Functions)

Use the server-side utilities to evaluate feature flags in server functions:

```typescript
import { getFeatureFlag, getAllFlags } from '../lib/launchdarkly-server';
import { createServerFn } from '@tanstack/start';

export const myServerAction = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await getSession();

    const user = {
      key: session?.user?.id || 'anonymous',
      email: session?.user?.email,
      name: session?.user?.name,
    };

    // Check a single feature flag
    const isFeatureEnabled = await getFeatureFlag('my-feature', user, false);

    if (isFeatureEnabled) {
      // Do something
    }

    // Get all flags for a user
    const allFlags = await getAllFlags(user);

    return { isFeatureEnabled, allFlags };
  },
);
```

#### Available Server Functions

- `getFeatureFlag(flagKey: string, user: LDUser, defaultValue: boolean): Promise<boolean>` - Evaluate a boolean feature flag
- `getFeatureFlagDetail(flagKey: string, user: LDUser, defaultValue: any): Promise<LDEvaluationDetail>` - Get detailed flag evaluation
- `getAllFlags(user: LDUser): Promise<LDFlagSet>` - Get all flags for a user
- `getLaunchDarklyClient(): Promise<LDClient>` - Get the LaunchDarkly client instance
- `closeLaunchDarklyClient(): Promise<void>` - Close the LaunchDarkly client connection

## User Context

LaunchDarkly automatically receives user context based on authentication state:

- **Authenticated users**: User ID, email, and name are sent to LaunchDarkly
- **Anonymous users**: Marked as anonymous with key `'anonymous'`

The user context is set automatically in the `LaunchDarklyProvider` component using the current session.

## Feature Flag Types

LaunchDarkly supports various flag types:

1. **Boolean flags**: Simple on/off toggles
2. **String flags**: Text values (e.g., feature variants)
3. **Number flags**: Numeric values (e.g., limits, thresholds)
4. **JSON flags**: Complex object values

```tsx
// Boolean flag
const isEnabled = useFeatureFlag('feature-enabled', false);

// String flag
const variant = useFeatureFlag<string>('feature-variant', 'control');

// Number flag
const limit = useFeatureFlag<number>('rate-limit', 100);

// JSON flag
const config = useFeatureFlag<{ theme: string; layout: string }>(
  'ui-config',
  { theme: 'light', layout: 'grid' }
);
```

## Best Practices

1. **Always provide default values**: Ensure your application works even if LaunchDarkly is unavailable
2. **Use descriptive flag names**: Use kebab-case names like `new-dashboard-layout`
3. **Clean up old flags**: Remove flags from code once they're fully rolled out
4. **Test with flags off**: Ensure your application works with flags disabled
5. **Use server-side flags for sensitive features**: Evaluate sensitive flags on the server to prevent manipulation

## Targeting Rules

You can create targeting rules in LaunchDarkly based on user attributes:

- User ID
- Email
- Name
- Custom attributes (can be added to the user context)

Example of adding custom attributes:

```typescript
// In server-side code
const user = {
  key: session.user.id,
  email: session.user.email,
  name: session.user.name,
  custom: {
    plan: 'premium',
    role: 'admin',
    signupDate: '2024-01-01',
  },
};

const isFeatureEnabled = await getFeatureFlag('premium-feature', user, false);
```

## Testing

When testing, you can:

1. **Use test environment**: Create a separate LaunchDarkly environment for testing
2. **Mock the hooks**: Mock `useFeatureFlag` in your tests
3. **Override flags**: Use LaunchDarkly's test data sources

Example test:

```tsx
import { vi } from 'vitest';
import * as featureFlags from '../lib/use-feature-flags';

vi.mock('../lib/use-feature-flags', () => ({
  useFeatureFlag: vi.fn((key, defaultValue) => {
    if (key === 'new-feature') return true;
    return defaultValue;
  }),
}));

// Your test code here
```

## Troubleshooting

### Flags not updating in real-time

- Ensure streaming is enabled (it's enabled by default)
- Check browser console for connection errors
- Verify your Client-Side ID is correct

### Server-side flags not working

- Verify your SDK Key is correct
- Check server logs for initialization errors
- Ensure the LaunchDarkly client has initialized before evaluating flags

### User context not being set

- Verify the session is being retrieved correctly
- Check that the user context is being passed to LaunchDarkly
- Review the LaunchDarkly dashboard to see user attributes

## Resources

- [LaunchDarkly Documentation](https://docs.launchdarkly.com/)
- [React SDK Reference](https://docs.launchdarkly.com/sdk/client-side/react/react-web)
- [Node.js SDK Reference](https://docs.launchdarkly.com/sdk/server-side/node-js)
