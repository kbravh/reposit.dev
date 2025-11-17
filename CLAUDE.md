# CLAUDE.md - AI Assistant Guide for Reposit.dev

This document provides comprehensive guidance for AI assistants working with the Reposit codebase. It covers architecture, conventions, workflows, and best practices to help you make effective contributions.

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack & Architecture](#tech-stack--architecture)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Code Conventions](#code-conventions)
- [Database Schema](#database-schema)
- [Server Functions (API)](#server-functions-api)
- [Authentication & Authorization](#authentication--authorization)
- [Testing](#testing)
- [Common Tasks & Patterns](#common-tasks--patterns)
- [Deployment](#deployment)
- [Important Notes for AI Assistants](#important-notes-for-ai-assistants)

---

## Project Overview

**Reposit** is a repository management hub for organizing, tagging, and managing GitHub repositories with intuitive workflows and powerful lists.

- **Node Version**: >=22.0.0
- **License**: ISC
- **Primary Language**: TypeScript
- **Framework**: TanStack React Start (full-stack React)
- **Database**: Turso (serverless SQLite)

### Key Features

- GitHub OAuth authentication
- Repository management (add, delete, sync, search)
- Smart auto-colored tagging system
- Dashboard with statistics
- Dark mode support
- Responsive design (mobile, tablet, desktop)
- Error tracking with Sentry

---

## Tech Stack & Architecture

### Frontend

- **React 19**: Latest React with concurrent features
- **TanStack Router** (v1.128.6): Type-safe file-based routing
- **TanStack React Start**: Full-stack SSR framework
- **TanStack React Query** (v5.83.0): Server state management
- **Zustand** (v5.0.6): Client state (theme, sidebar)
- **Tailwind CSS** (v4.1.11): Utility-first styling
- **Lucide React**: Icon library
- **Headless UI**: Accessible UI components

### Backend

- **TanStack React Start**: Server-side rendering + server functions
- **Drizzle ORM** (v0.44.3): Type-safe SQL query builder
- **Turso/LibSQL**: Serverless SQLite database
- **Better-Auth** (v1.3.1): Authentication framework

### Developer Tools

- **TypeScript** (v5.8.3): Strict type checking
- **Vite** (v7.0.5): Build tool and dev server
- **Vitest** (v3.2.4): Unit testing
- **ESLint** (v9.31.0): Code linting
- **Prettier** (v3.4.2): Code formatting
- **Husky** (v9.1.7): Git hooks
- **Lint-staged**: Pre-commit checks

### Monitoring

- **Sentry**: Error and performance tracking

---

## Project Structure

```
reposit.dev/
├── src/
│   ├── actions/              # Server-side functions (RSC Server Functions)
│   │   ├── __tests__/       # Action tests
│   │   ├── middleware/      # Auth middleware
│   │   ├── auth.ts          # Authentication handlers
│   │   ├── repos.ts         # Repository CRUD operations
│   │   └── tags.ts          # Tag CRUD operations
│   ├── components/          # React components
│   │   ├── dashboard/       # Dashboard-specific components
│   │   ├── layout/          # Layout components
│   │   ├── navigation/      # Navigation components
│   │   ├── repository/      # Repository components
│   │   ├── tags/            # Tag management components
│   │   └── ui/              # Reusable UI primitives
│   ├── data/                # Static data (colors, language aliases)
│   ├── db/
│   │   ├── index.ts         # Database client initialization
│   │   └── schema.ts        # Drizzle ORM schema definitions
│   ├── hooks/               # React Query custom hooks
│   │   ├── repositories.ts  # Repository-related hooks
│   │   └── tags.ts          # Tag-related hooks
│   ├── lib/
│   │   ├── auth.ts          # Better-Auth server config
│   │   ├── auth-client.ts   # Better-Auth client
│   │   └── query-keys.ts    # React Query key factory
│   ├── routes/              # TanStack Router file-based routes
│   │   ├── api/auth/$.ts    # Auth API catch-all handler
│   │   ├── _authenticated/  # Protected routes (requires auth)
│   │   ├── __root.tsx       # Root layout
│   │   ├── index.tsx        # Landing page
│   │   └── login.tsx        # Login page
│   ├── stores/              # Zustand state stores
│   │   ├── sidebarStore.ts  # Sidebar state
│   │   └── themeStore.ts    # Theme (dark/light) state
│   ├── utils/               # Utility functions
│   │   ├── array.ts         # Array utilities
│   │   ├── cn.ts            # classnames utility
│   │   ├── colors.ts        # Color utilities
│   │   └── github.ts        # GitHub API utilities
│   ├── client.tsx           # Client-side entry point
│   ├── server.tsx           # Server-side entry point
│   ├── router.tsx           # Router configuration
│   ├── env.ts               # Environment variable validation
│   └── global-middleware.ts # Global middleware
├── drizzle/                 # Database migrations
├── .github/workflows/       # CI/CD pipelines
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
├── eslint.config.js         # ESLint configuration
├── .prettierrc              # Prettier configuration
├── Dockerfile               # Production Docker image
└── package.json             # Dependencies and scripts
```

### Key Directories

- **`src/actions/`**: Server functions using `createServerFn` (RPC-style API)
- **`src/components/`**: React components organized by feature
- **`src/routes/`**: File-based routing (TanStack Router convention)
- **`src/db/schema.ts`**: Single source of truth for database schema
- **`src/lib/query-keys.ts`**: Centralized React Query key management

---

## Development Workflow

### Initial Setup

```bash
# Install dependencies
npm install

# Set up environment variables (create .env.local)
# Required variables:
# - DATABASE_URL
# - DATABASE_AUTH_TOKEN (optional for local)
# - BETTER_AUTH_URL
# - BETTER_AUTH_SECRET
# - GITHUB_CLIENT_ID
# - GITHUB_CLIENT_SECRET
# - SENTRY_AUTH_TOKEN

# Start development server
npm run dev  # Runs on http://localhost:3000
```

### Development Scripts

```bash
# Development
npm run dev              # Start dev server with HMR

# Code Quality
npm run lint             # Fix linting issues
npm run format          # Format all files
npm run check           # Run lint, format, and type checks
npm run types:check     # TypeScript type checking only

# Database
npm run db:generate     # Generate migration from schema changes
npm run db:push         # Push schema to remote database
npm run db:migrate      # Apply local migrations
npm run db:studio       # Visual DB management UI

# Testing
npm run test            # Run tests in watch mode
npm run test:ui         # Run tests with UI
npm run test:run        # Single test run (CI mode)

# Building
npm run build           # Production build
npm run start           # Start production server
```

### Git Workflow

- **Pre-commit hooks**: Automatically run lint and format on staged files
- **Branch naming**: Use descriptive names (e.g., `feature/list-filtering`, `fix/auth-race-condition`)
- **Commit messages**: Clear, concise descriptions of changes
- **Pull requests**: CI runs lint, format, type checks, and tests

---

## Code Conventions

### File Naming

- **Components**: PascalCase (e.g., `AddTagModal.tsx`, `RepositoryListItem.tsx`)
- **Utilities & Hooks**: camelCase (e.g., `useCreateTagMutation.ts`, `parseRepositoryUrl.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `TAG_COLORS`, `BRAND_COLORS`)
- **Stores**: camelCase with Store suffix (e.g., `themeStore.ts`, `sidebarStore.ts`)

### Import Organization

```typescript
// 1. External dependencies
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

// 2. Internal imports
import { getRepositories } from '../../actions/repos';
import { repositoryKeys } from '../../lib/query-keys';

// 3. Types
import type { Repository } from '../../components/repository/types';
```

### Component Patterns

#### Server Components (Routes)

```typescript
import { createFileRoute } from '@tanstack/react-router';
import { getRepositories } from '../actions/repos';

export const Route = createFileRoute('/_authenticated/dashboard')({
  loader: async () => {
    // Server-side data fetching
    return await getRepositories();
  },
  component: Dashboard,
});

function Dashboard() {
  const data = Route.useLoaderData();
  // Component implementation
}
```

#### Client Components (Interactive)

```typescript
import { useCreateTagMutation } from '../hooks/tags';

export function AddTagModal() {
  const mutation = useCreateTagMutation({
    onSuccess: () => {
      // Success callback
    },
  });

  // Component implementation
}
```

### Server Functions

```typescript
import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { authMiddleware } from './middleware/auth';

export const createTag = createServerFn({
  method: 'POST',
})
  .validator(z.object({ title: z.string() }))
  .middleware([authMiddleware])
  .handler(async ({ data, context: { session } }) => {
    // Implementation with session.userId available
  });
```

### Type Safety

- **Strict TypeScript**: Enable `strictNullChecks`
- **Zod Validation**: Runtime validation for all user inputs
- **Type Inference**: Leverage TypeScript inference
- **InferType Pattern**: Use `z.infer<typeof schema>`

### Error Handling

```typescript
// Server functions throw errors that propagate to client
if (!session) {
  throw new Error('Unauthorized');
}

// React Query error handling
mutation.onError((err) => {
  // Handle error in UI
  console.error('Failed to create tag:', err);
});
```

### Styling

- **Utility-First**: Use Tailwind CSS classes
- **Dark Mode**: Use `dark:` prefix for dark mode styles
- **Responsive**: Use `sm:`, `md:`, `lg:` breakpoints
- **cn() Helper**: Use for conditional classes

```typescript
import { cn } from '../utils/cn';

const buttonClass = cn(
  'px-4 py-2 rounded-md',
  isActive && 'bg-blue-500',
  isDisabled && 'opacity-50 cursor-not-allowed',
);
```

---

## Database Schema

### Core Tables

#### Authentication (Better-Auth)

```typescript
user: {
  id (PK)
  name, email (unique), emailVerified
  image, createdAt, updatedAt
}

session: {
  id (PK)
  userId (FK) → user
  token (unique), expiresAt
  ipAddress, userAgent
  createdAt, updatedAt
}

account: {
  id (PK)
  userId (FK) → user
  accountId, providerId (e.g., "github")
  accessToken, refreshToken
  scope, createdAt, updatedAt
}
```

#### Domain Tables

```typescript
repository: {
  id (PK, uniqid)
  providerId (unique per provider), provider (default: 'github')
  org, name, htmlUrl
  description, primaryLanguage
  private (boolean)
  lastSyncedAt, deletedAt
  createdAt, updatedAt

  Indexes:
  - UNIQUE(org, name, provider)
  - UNIQUE(provider, providerId)
}

repositoryInstance: {
  id (PK, uniqid)
  userId (FK) → user
  repositoryId (FK) → repository
  createdAt, updatedAt

  Unique: (userId, repositoryId)
}

tagInstance: {
  id (PK, uniqid)
  userId (FK) → user
  title, color (default: '#10b981')
  createdAt, updatedAt

  UNIQUE(userId, title)
}

tagToRepository: {
  id (PK, uniqid)
  tagInstanceId (FK) → tagInstance
  repositoryInstanceId (FK) → repositoryInstance

  UNIQUE(tagInstanceId, repositoryInstanceId)
}
```

### Database Operations

```bash
# Generate migration from schema changes
npm run db:generate

# Push schema to database (for development)
npm run db:push

# Apply migrations (for production)
npm run db:migrate

# Visual database management
npm run db:studio
```

### Key Patterns

- **User Isolation**: All queries filtered by `userId` from session
- **Soft Deletes**: `deletedAt` field on repositories
- **Cascade Deletes**: Foreign keys configured for cascade
- **Timestamps**: All tables have `createdAt` and `updatedAt`
- **Unique Constraints**: Prevent duplicate tags per user

---

## Server Functions (API)

Server functions are RPC-style endpoints using `createServerFn`. They run on the server and are called from the client like regular functions.

### Authentication Functions

```typescript
// Get current session (returns null if not authenticated)
getSession(): Promise<{ session, user } | null>

// Require authentication (throws if not authenticated)
requireAuth(): Promise<{ session }>
```

### Repository Functions

```typescript
// Create repository from GitHub URL
createRepository({ url: string }): Promise<RepositoryInstance>

// Get all repositories for current user
getRepositories(): Promise<RepositoryInstance[]>

// Get single repository
getRepository({ repositoryInstanceId: string }): Promise<RepositoryInstance>

// Delete repository connection
deleteRepository({ repositoryInstanceId: string }): Promise<void>

// Sync repository from GitHub
syncRepository({ repositoryInstanceId: string }): Promise<Repository>

// Search GitHub repositories (no auth required)
searchGitHubRepositories({ query: string }): Promise<GitHubRepo[]>
```

### Tag Functions

```typescript
// Create or update tag
createTag({ title: string, color?: string, repositoryInstanceId?: string }): Promise<TagInstance>

// Get all tags for current user
getTags(): Promise<TagInstance[]>

// Get single tag
getTag({ tagId: string }): Promise<TagInstance>

// Update tag
updateTag({ tagId: string, title?: string, color?: string }): Promise<TagInstance>

// Delete tag (cascades to relationships)
deleteTag({ tagId: string }): Promise<void>

// Add tag to repository
addTagToRepository({ tagId: string, repositoryInstanceId: string }): Promise<void>

// Remove tag from repository
removeTagFromRepository({ tagId: string, repositoryInstanceId: string }): Promise<void>

// Get repositories for tag
getRepositoriesForTag({ tagId: string }): Promise<RepositoryInstance[]>

// Get tags for repository
getTagsForRepository({ repositoryInstanceId: string }): Promise<TagInstance[]>

// Bulk create tags
createManyTags({ titles: string[], repositoryInstanceId: string }): Promise<TagInstance[]>

// Get tags with repository count
getTagsWithRepositoryCount(): Promise<{ tag: TagInstance, count: number }[]>
```

### Middleware

All data operations use `authMiddleware`:

```typescript
const authMiddleware = async ({ next }) => {
  const session = await auth.api.getSession(getWebRequest());
  if (!session?.session) {
    throw new Error('Unauthorized');
  }
  return next({ context: { session } });
};
```

---

## Authentication & Authorization

### Authentication Flow

1. User clicks "Sign in with GitHub"
2. Redirected to GitHub OAuth
3. GitHub redirects to `/api/auth/callback/github`
4. Better-Auth exchanges code for tokens
5. User/account/session created in database
6. HTTP-only session cookie set
7. User redirected to dashboard

### Protected Routes

```typescript
// Layout wrapper for authenticated routes
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    const session = await getSession();
    if (!session) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      });
    }
  },
});
```

### Authorization Pattern

All server functions validate the session and use `userId` for data isolation:

```typescript
.handler(async ({ context: { session } }) => {
  // session.userId is available here
  const tags = await db
    .select()
    .from(tagInstance)
    .where(eq(tagInstance.userId, session.userId));
});
```

### Security Features

- **HTTP-Only Cookies**: Session cannot be accessed by JavaScript
- **User Isolation**: All queries filtered by `userId`
- **Input Validation**: Zod schemas on all inputs
- **Open Redirect Prevention**: Login redirect URL validated
- **CSRF Protection**: Implicit via HTTP-only cookies

---

## Testing

### Test Framework: Vitest

```bash
npm run test        # Watch mode
npm run test:ui     # UI mode
npm run test:run    # Single run (CI)
```

### Test Configuration

- **Environment**: jsdom (browser-like)
- **Coverage**: v8 coverage provider
- **Exclude**: Examples, generated files

### Writing Tests

```typescript
import { describe, it, expect } from 'vitest';
import { getHashedTagColor } from '../colors';

describe('getHashedTagColor', () => {
  it('should return consistent color for same input', () => {
    const color1 = getHashedTagColor('react');
    const color2 = getHashedTagColor('react');
    expect(color1).toBe(color2);
  });
});
```

### Existing Test Files

- `src/actions/__tests__/tags.test.ts`
- `src/utils/__tests__/colors.test.ts`
- `src/utils/__tests__/github.test.ts`

---

## Common Tasks & Patterns

### Adding a New Server Function

1. Create function in appropriate action file (`src/actions/`)
2. Add Zod validator for input
3. Add `authMiddleware` if authentication required
4. Implement handler with database operations
5. Export function for use in components

```typescript
// src/actions/repos.ts
export const updateRepository = createServerFn({
  method: 'POST',
})
  .validator(z.object({
    repositoryInstanceId: z.string(),
    data: z.object({
      // fields to update
    }),
  }))
  .middleware([authMiddleware])
  .handler(async ({ data, context: { session } }) => {
    // Implementation
  });
```

### Creating a React Query Hook

1. Add function to appropriate hook file (`src/hooks/`)
2. Define query key in `src/lib/query-keys.ts`
3. Use `useMutation` or `useQuery` from React Query
4. Handle optimistic updates and cache invalidation

```typescript
// src/hooks/tags.ts
export function useCreateTagMutation(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTag,
    onMutate: async (variables) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: tagKeys.all });
      const previous = queryClient.getQueryData(tagKeys.all);
      // Update cache
      return { previous };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData(tagKeys.all, context.previous);
      }
    },
    onSettled: () => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: tagKeys.all });
    },
    ...options,
  });
}
```

### Adding a New Route

1. Create file in `src/routes/` following file-based convention
2. Use `createFileRoute` to define route
3. Add `loader` for server-side data fetching (optional)
4. Export component function

```typescript
// src/routes/_authenticated/new-page.tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/new-page')({
  loader: async () => {
    // Server-side data fetching
    return { data: 'example' };
  },
  component: NewPage,
});

function NewPage() {
  const data = Route.useLoaderData();
  return <div>{/* Component JSX */}</div>;
}
```

### Query Key Factory Pattern

```typescript
// src/lib/query-keys.ts
export const tagKeys = {
  all: ['tags'] as const,
  lists: () => [...tagKeys.all, 'list'] as const,
  withCount: () => [...tagKeys.all, 'with-count'] as const,
  forRepository: (id: string) => [...tagKeys.all, 'repository', id] as const,
};

// Usage in hooks
queryClient.invalidateQueries({ queryKey: tagKeys.all });
queryClient.invalidateQueries({ queryKey: tagKeys.forRepository('repo-123') });
```

### Auto-Coloring Logic

Tags are automatically colored based on:

1. **Brand colors**: Exact match (e.g., "React" → React blue)
2. **GitHub language colors**: Case-insensitive match
3. **Language aliases**: (e.g., "js" → "JavaScript")
4. **Hash-based fallback**: Deterministic color from tag title

```typescript
import { getTagColor } from '../utils/colors';

const color = getTagColor('TypeScript'); // Returns TypeScript blue
```

### Working with GitHub API

```typescript
import { parseRepositoryUrl, fetchRepositoryFromGitHub } from '../utils/github';

// Parse GitHub URL
const parsed = parseRepositoryUrl('https://github.com/owner/repo');
// { owner: 'owner', name: 'repo' }

// Fetch repository data
const repo = await fetchRepositoryFromGitHub('owner', 'repo');
// { org: 'owner', name: 'repo', description: '...', ... }
```

---

## Deployment

### Environment Variables

Required for production:

```bash
DATABASE_URL=libsql://your-db.turso.io
DATABASE_AUTH_TOKEN=your-auth-token
BETTER_AUTH_URL=https://your-domain.com
BETTER_AUTH_SECRET=random-32-char-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
SENTRY_AUTH_TOKEN=your-sentry-token
```

### CI/CD Pipeline

**Pull Requests**: Lint, format, type check, and test

**Main Branch Deployment**:
1. Run quality checks
2. Run tests
3. Build application
4. Push database schema (`db:push`)
5. Build Docker image (Linux ARM64)
6. Push to GitHub Container Registry
7. Trigger Coolify deployment

### Docker

```bash
# Build
docker build -t reposit.dev .

# Run
docker run -p 3000:3000 \
  -e DATABASE_URL=... \
  -e BETTER_AUTH_URL=... \
  reposit.dev
```

### Database Migrations

```bash
# Development: Push schema changes directly
npm run db:push

# Production: Use migrations
npm run db:generate  # Generate migration files
npm run db:migrate   # Apply migrations
```

---

## Important Notes for AI Assistants

### Code Quality Standards

- **Always run checks before committing**: `npm run check`
- **Pre-commit hooks**: Automatically lint and format staged files
- **No unused variables**: ESLint configured with `--max-warnings 0`
- **Consistent formatting**: Prettier enforces consistent style

### Data Access Patterns

- **Always filter by userId**: Every query must use `session.userId`
- **Use Drizzle ORM**: Never write raw SQL
- **Validate inputs**: Use Zod schemas for all user inputs
- **Handle errors**: Throw descriptive errors for better debugging

### React Query Best Practices

- **Use query keys factory**: Centralized in `src/lib/query-keys.ts`
- **Optimistic updates**: Update cache immediately for better UX
- **Error rollback**: Restore previous state on error
- **Invalidate strategically**: Use hierarchical keys for efficient invalidation

### Security Considerations

- **Never expose user data**: Always filter by `session.userId`
- **Validate URLs**: Use `parseRepositoryUrl` for GitHub URLs
- **Sanitize inputs**: Zod validation on all server functions
- **HTTP-only cookies**: Session management handled by Better-Auth

### Performance Optimizations

- **Server-side rendering**: Routes loaded with SSR by default
- **Code splitting**: Routes lazy-loaded on demand
- **Optimistic updates**: Immediate UI feedback
- **Query caching**: React Query caches for 5 minutes by default

### Common Pitfalls to Avoid

1. **Don't bypass authentication**: Always use `authMiddleware` on server functions
2. **Don't create duplicate tags**: Use upsert logic in `createTag`
3. **Don't forget to invalidate queries**: Cache must be updated after mutations
4. **Don't use `any` type**: TypeScript strict mode enabled
5. **Don't commit without running checks**: Pre-commit hooks enforce this

### File Organization

- **Colocation**: Keep related files together (components, hooks, tests)
- **Index exports**: Use index files to export types and utilities
- **Test proximity**: Tests in `__tests__/` next to implementation
- **Clear separation**: Routes, actions, components, hooks in separate directories

### When Adding New Features

1. **Check existing patterns**: Follow established conventions
2. **Add tests**: Write tests for new functionality
3. **Update types**: Ensure TypeScript types are accurate
4. **Document**: Add comments for complex logic
5. **Run checks**: `npm run check` before committing

### Recent Important Changes

- **Fix #29**: Resolved sign-in race condition by removing session cookie cache
- **PR #28**: Created list schema for advanced filtering feature
- **Update**: Added keyboard shortcuts documentation
- **Cleanup**: Improved auth flows and login redirects

### Useful Commands Reference

```bash
# Development
npm run dev              # Start dev server
npm run check           # Lint + format + type check
npm run db:studio       # Visual DB management

# Testing
npm run test            # Run tests
npm run test:ui         # Tests with UI

# Database
npm run db:generate     # Generate migrations
npm run db:push         # Push schema to database

# Build
npm run build           # Production build
npm run start           # Start production server
```

---

## Additional Resources

- **TanStack Router Docs**: https://tanstack.com/router
- **TanStack React Start Docs**: https://tanstack.com/start
- **Drizzle ORM Docs**: https://orm.drizzle.team
- **Better-Auth Docs**: https://better-auth.com
- **Tailwind CSS Docs**: https://tailwindcss.com

---

This document is maintained to reflect the current state of the codebase. If you make significant architectural changes, please update this file accordingly.

**Last Updated**: November 2025
