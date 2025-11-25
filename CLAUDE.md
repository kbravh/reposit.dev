# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Reposit is a full-stack repository management application built with TanStack Start (React meta-framework), using GitHub OAuth authentication, LibSQL (Turso) database, and featuring LaunchDarkly feature flags and Sentry error tracking.

**Tech Stack:**

- TanStack Start 1.136 (React 19.2.0 with SSR)
- TanStack Router (file-based routing)
- TanStack React Query (server state caching)
- TypeScript 5.9.3
- Tailwind CSS 4.1.17
- Node.js 24

## Essential Commands

### Development

```bash
npm run dev              # Start development server (Vite)
npm run build            # Build for production
npm start                # Start production server
```

### Code Quality

```bash
npm run fix              # Run linting + formatting (ALWAYS run after changes)
npm run check            # Run all checks (lint + format + types)
npm run lint             # Fix ESLint errors
npm run format           # Format with Prettier
npm run types:check      # TypeScript type checking
```

### Testing

```bash
npm run test:run         # Run unit tests (no watch mode)
npm test                 # Run unit tests in watch mode
npm run test:ui          # Run unit tests with Vitest UI
npm run test:e2e         # Run Playwright E2E tests
npm run test:e2e:headed  # Run E2E tests with browser visible
npm run test:e2e:ui      # Run E2E tests with Playwright UI
```

### Database

```bash
npm run db:generate      # Generate migrations from schema changes
npm run db:migrate       # Apply migrations
npm run db:push          # Push schema changes directly (dev only)
npm run db:studio        # Open Drizzle Studio database browser
```

## Architecture

### Server Functions Pattern

This project uses TanStack Start's **server functions** instead of traditional API routes. Server functions are TypeScript functions that run exclusively on the server but are called directly from client components.

**Location:** `src/actions/`

- `auth.ts` - Authentication server functions
- `repos.ts` - Repository CRUD operations
- `tags.ts` - Tag management operations
- `launchdarkly.ts` - Feature flag server function

**Example Pattern:**

```typescript
// Server function (src/actions/repos.ts)
export const createRepository = createServerFn({
  method: 'POST',
})
  .inputValidator(z.object({ url: z.string() }))
  .middleware([authMiddleware])
  .handler(async ({ data, context: { session } }) => {
    // Direct database access here
    return await db.insert(repository).values(...)
  });

// Called from client component
const result = await createRepository({ url: '...' });
```

**Benefits:**

- Type-safe end-to-end (autocomplete in client)
- No manual API route definitions
- Automatic request/response serialization
- Middleware support for auth/validation

### File-Based Routing

Routes are automatically generated from `src/routes/` directory structure:

```
src/routes/
  __root.tsx              → Root layout (wraps all pages)
  index.tsx               → / (landing page)
  login.tsx               → /login
  _authenticated.tsx      → Protected layout wrapper
  _authenticated/
    dashboard.tsx         → /dashboard
    repositories.tsx      → /repositories
    tags.tsx              → /tags
    settings.tsx          → /settings
  api/
    health.ts             → /api/health
    auth/$.ts             → /api/auth/* (catch-all)
```

**Key Patterns:**

- `_authenticated.tsx` checks session in `beforeLoad`, redirects to login if missing
- Route loaders fetch data on server before rendering
- `pendingComponent` provides loading states
- Use `redirect()` for navigation in loaders/beforeLoad

### State Management

**Three-layer approach:**

1. **Server State (Source of Truth)**
   - Database: LibSQL (Turso) with Drizzle ORM
   - Location: `src/db/`

2. **Server Function Context**
   - Session, user info passed via middleware
   - Never exposed to client

3. **Client State**
   - **React Query** - Server function result caching (60s stale time)
   - **Zustand** - UI state only (theme, sidebar visibility)
   - Location: `src/stores/`

**IMPORTANT:** Use Zustand for global client state. Do NOT use React Context. Create stores in `src/stores/`.

### Database Schema

**Key Tables** (see `src/db/schema.ts`):

**Auth:**

- `user` - User accounts
- `session` - Active sessions
- `account` - OAuth provider connections

**Core Domain:**

- `repository` - Global repository table (provider-agnostic, shared across users)
- `repositoryInstance` - User's association with repositories (one-to-many)
- `tagInstance` - User-created tags
- `tagToRepository` - Tag-to-repository mapping

**Advanced:**

- `lists` - Custom repository collections
- `listFilterGroups` - Nested filter logic
- `listFilterTagClauses` - Tag-based filters
- `listRepoOverrides` - Include/exclude specific repos

**Pattern:** Shared `repository` table prevents duplicate GitHub data; users have `repositoryInstance` records that reference the shared repository.

### Authentication

**Library:** BetterAuth with GitHub OAuth
**Configuration:** `src/lib/auth.ts`

**Auth Flow:**

1. User clicks "Sign in with GitHub"
2. BetterAuth handles OAuth with GitHub
3. Session stored in database (encrypted)
4. Protected routes check session in `beforeLoad`
5. Server functions use `authMiddleware` to validate session

**Middleware Pattern:**

```typescript
// src/actions/middleware/auth.ts
export const authMiddleware = createServerFn(...)
  .handler(async () => {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized');
    return { session };
  });

// Used in server functions
.middleware([authMiddleware])
.handler(async ({ context: { session } }) => {
  // session.userId available here
});
```

### LaunchDarkly Feature Flags

**Dual SDK setup:**

- **Server SDK:** `src/lib/launchdarkly-server.ts` (evaluates flags in server functions)
- **Client SDK:** `src/lib/launchdarkly-client.tsx` (React provider for client components)

**Environment Variables:**

- `LAUNCHDARKLY_CLIENT_SIDE_ID` - Client-side public ID
- `LAUNCHDARKLY_SDK_KEY` - Server-side SDK key (secret)

**Usage:**

Client-side:

```typescript
import { useFeatureFlag } from '../lib/use-feature-flags';

const isEnabled = useFeatureFlag('my-feature', false);
```

Server-side:

```typescript
import { getFeatureFlag } from '../lib/launchdarkly-server';

const isEnabled = await getFeatureFlag('my-feature', user, false);
```

See `docs/LAUNCHDARKLY.md` for complete documentation.

### Sentry Error Tracking

**Dual initialization:**

- Client: `src/client.tsx` (browser errors)
- Server: `src/sentry.server.ts` (server-side errors)

Server functions automatically:

- Add breadcrumbs for audit trail
- Set user context via `Sentry.setUser()`
- Capture exceptions with tags/context

## Development Guidelines

### After Making Changes

**ALWAYS run `npm run fix` after making changes.** This runs linting and formatting.

### Running Tests

Use `npm run test:run` to avoid Vitest watch mode when running tests programmatically.

### Styling

- Use **Tailwind CSS v4** for all styling
- Check `examples/` directory for component patterns from Tailwind Plus
- If pattern doesn't exist, check [DaisyUI](https://daisyui.com/)
- Then check [ShadCN](https://ui.shadcn.com/)

### Icons

- Use `lucide-react` for standard icons
- Use `@icons-pack/react-simple-icons` for brand icons only

### Forms and Inputs

**Use uncontrolled inputs** where possible. Let the browser manage state. Form handlers should consume `FormData` (browser standard) instead of controlled state.

### Keyboard Shortcuts

Common tasks should be exposed via keyboard shortcuts. Take inspiration from:

- Web patterns (Cmd+K to search)
- Terminal patterns (Vim)
- See `keyboard-shortcuts.md` for planned shortcuts

All existing shortcuts should be catalogued in `keyboard-shortcuts.md`.

### Component Organization

```
src/components/
  providers/          # React providers (LaunchDarkly, etc.)
  layout/            # Layout components (sidebar, etc.)
  navigation/        # Navigation components
  repository/        # Repository-specific components
  tags/              # Tag-specific components
  dashboard/         # Dashboard components
  ui/                # Base UI components (buttons, inputs, etc.)
```

## Key Files

| File                     | Purpose                                   |
| ------------------------ | ----------------------------------------- |
| `src/router.tsx`         | Router configuration and initialization   |
| `src/client.tsx`         | Client entry point, Sentry initialization |
| `src/sentry.server.ts`   | Server-side Sentry initialization         |
| `src/env.ts`             | Environment variable validation (Zod)     |
| `src/lib/auth.ts`        | BetterAuth initialization                 |
| `src/lib/auth-client.ts` | Client-side auth SDK                      |
| `src/lib/query-keys.ts`  | React Query key factory                   |
| `drizzle.config.ts`      | Database migration config                 |
| `vite.config.ts`         | Build configuration                       |

## Environment Variables

Required environment variables (see `.env.example`):

```bash
# Database
DATABASE_URL=                    # LibSQL connection string
DATABASE_AUTH_TOKEN=            # LibSQL auth token

# Auth
BETTER_AUTH_URL=                # App URL for OAuth callback
BETTER_AUTH_SECRET=             # Session encryption key
GITHUB_CLIENT_ID=               # GitHub OAuth app ID
GITHUB_CLIENT_SECRET=           # GitHub OAuth secret

# Monitoring
SENTRY_AUTH_TOKEN=              # Sentry DSN

# Feature Flags
LAUNCHDARKLY_CLIENT_SIDE_ID=   # LaunchDarkly client ID (public)
LAUNCHDARKLY_SDK_KEY=          # LaunchDarkly server SDK key (secret)
```

Validate environment variables with Zod in `src/env.ts`.

## Common Patterns

### Adding a New Protected Route

1. Create file in `src/routes/_authenticated/my-route.tsx`
2. Add route to navigation in `src/routes/_authenticated.tsx`
3. Session check is automatic via `_authenticated` layout

### Adding a New Server Function

1. Create function in appropriate file in `src/actions/`
2. Add input validation with Zod
3. Add `authMiddleware` if protected
4. Use `context.session` for user info

### Adding a New Database Table

1. Define table in `src/db/schema.ts`
2. Run `npm run db:generate` to create migration
3. Run `npm run db:migrate` to apply migration
4. Update TypeScript types (auto-inferred from schema)

### Adding a Feature Flag

1. Create flag in LaunchDarkly dashboard
2. Use `useFeatureFlag()` in components
3. Use `getFeatureFlag()` in server functions
4. Always provide default values

## Data Flow

```
User Action → Client Component
    ↓
Server Function (with auth + validation)
    ↓
Database Query (Drizzle ORM)
    ↓
Response → React Query Cache
    ↓
Component Re-render
```

## Important Notes

- **Node.js 24** is required (see `package.json` engines)
- Server functions replace traditional REST APIs
- Type safety flows from database → server → client
- LaunchDarkly provides both server and client SDKs for different use cases
- BetterAuth handles OAuth flow and session management
- Drizzle ORM provides type-safe database queries
- All server state should be cached with React Query (60s stale time)
