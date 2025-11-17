# CLAUDE.md - AI Assistant Guide for Reposit.dev

This document provides essential guidance for AI assistants working with the Reposit codebase. Focus on repository-specific patterns and conventions.

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Code Conventions](#code-conventions)
- [Database Schema](#database-schema)
- [Server Functions](#server-functions)
- [Authentication](#authentication)
- [Key Patterns](#key-patterns)
- [Deployment](#deployment)
- [Important Notes](#important-notes)

---

## Project Overview

**Reposit** is a repository management hub for organizing, tagging, and managing GitHub repositories.

- **Node**: >=22.0.0
- **Framework**: TanStack React Start (full-stack React with SSR)
- **Database**: Turso (serverless SQLite via Drizzle ORM)
- **Auth**: Better-Auth (GitHub OAuth only)

---

## Tech Stack

**Frontend**: React 19, TanStack Router, TanStack Query, Zustand, Tailwind CSS, Lucide icons
**Backend**: TanStack Start server functions, Drizzle ORM, Turso/LibSQL, Better-Auth
**Dev Tools**: TypeScript, Vite, Vitest, ESLint, Prettier, Husky
**Monitoring**: Sentry

---

## Project Structure

```
src/
├── actions/           # Server functions (createServerFn)
│   ├── middleware/   # authMiddleware for session validation
│   ├── auth.ts       # getSession, requireAuth
│   ├── repos.ts      # Repository CRUD
│   └── tags.ts       # Tag CRUD
├── components/       # React components by feature
├── db/
│   ├── index.ts      # Database client
│   └── schema.ts     # Drizzle schema (single source of truth)
├── hooks/            # React Query hooks
│   ├── repositories.ts
│   └── tags.ts
├── lib/
│   ├── auth.ts       # Better-Auth server config
│   ├── auth-client.ts
│   └── query-keys.ts # Query key factory (tagKeys, repositoryKeys)
├── routes/           # File-based routing
│   ├── _authenticated/  # Protected routes
│   └── api/auth/$.ts    # Better-Auth handler
├── stores/           # Zustand (theme, sidebar)
├── utils/
│   ├── colors.ts     # Auto-color logic for tags
│   └── github.ts     # GitHub API utilities
└── env.ts            # Zod validation for env vars
```

**Key Files**:
- `src/db/schema.ts`: Database schema
- `src/lib/query-keys.ts`: Centralized query keys
- `src/actions/middleware/auth.ts`: Session validation

---

## Development Workflow

```bash
# Setup
npm install
# Create .env.local with: DATABASE_URL, BETTER_AUTH_URL, BETTER_AUTH_SECRET,
# GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, SENTRY_AUTH_TOKEN

# Development
npm run dev              # Start dev server (localhost:3000)
npm run check            # Lint + format + type check (run before commit)

# Database
npm run db:push          # Push schema changes to database
npm run db:studio        # Visual DB management
npm run db:generate      # Generate migrations

# Testing
npm run test             # Watch mode
npm run test:run         # CI mode
```

**Pre-commit hooks**: Husky automatically runs lint + format on staged files

---

## Code Conventions

**File Naming**:
- Components: PascalCase (`AddTagModal.tsx`)
- Utilities/Hooks: camelCase (`useCreateTagMutation.ts`)
- Constants: UPPER_SNAKE_CASE (`TAG_COLORS`)
- Stores: camelCase + Store suffix (`themeStore.ts`)

**Import Order**: External deps → Internal imports → Types

**Server Functions Pattern**:
```typescript
export const actionName = createServerFn({ method: 'POST' })
  .validator(z.object({ /* schema */ }))
  .middleware([authMiddleware])  // All data operations use this
  .handler(async ({ data, context: { session } }) => {
    // session.userId available here
  });
```

**TypeScript**: Strict mode enabled (`strictNullChecks: true`)
**Styling**: Tailwind CSS with `cn()` helper for conditional classes
**Validation**: Zod schemas on all user inputs

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

**Key Patterns**:
- **User Isolation**: ALL queries MUST filter by `session.userId`
- **Soft Deletes**: `deletedAt` on repositories
- **Cascade Deletes**: FK constraints handle cleanup
- **Unique Constraints**: Prevent duplicate tags per user (`userId, title`)

---

## Server Functions

RPC-style endpoints using `createServerFn` (TanStack Start pattern).

**Authentication** (`src/actions/auth.ts`):
```typescript
getSession(): Promise<{ session, user } | null>
requireAuth(): Promise<{ session }>  // Throws if not authenticated
```

**Repository** (`src/actions/repos.ts`):
```typescript
createRepository({ url }): Promise<RepositoryInstance>
getRepositories(): Promise<RepositoryInstance[]>
getRepository({ repositoryInstanceId }): Promise<RepositoryInstance>
deleteRepository({ repositoryInstanceId }): Promise<void>
syncRepository({ repositoryInstanceId }): Promise<Repository>
searchGitHubRepositories({ query }): Promise<GitHubRepo[]>  // No auth required
```

**Tag** (`src/actions/tags.ts`):
```typescript
createTag({ title, color?, repositoryInstanceId? }): Promise<TagInstance>
getTags(): Promise<TagInstance[]>
getTag({ tagId }): Promise<TagInstance>
updateTag({ tagId, title?, color? }): Promise<TagInstance>
deleteTag({ tagId }): Promise<void>  // Cascades to tag-repo relationships
addTagToRepository({ tagId, repositoryInstanceId }): Promise<void>
removeTagFromRepository({ tagId, repositoryInstanceId }): Promise<void>
getRepositoriesForTag({ tagId }): Promise<RepositoryInstance[]>
getTagsForRepository({ repositoryInstanceId }): Promise<TagInstance[]>
createManyTags({ titles[], repositoryInstanceId }): Promise<TagInstance[]>
getTagsWithRepositoryCount(): Promise<{ tag, count }[]>
```

---

## Authentication

**Flow**: GitHub OAuth → Better-Auth → Session cookie (HTTP-only) → Redirect to dashboard

**Protected Routes**: `_authenticated/` layout checks session in `beforeLoad`, redirects to login if missing

**Authorization Pattern**: `authMiddleware` validates session on ALL server functions
```typescript
.middleware([authMiddleware])
.handler(async ({ context: { session } }) => {
  // session.userId available - ALL queries must filter by this
  where(eq(tagInstance.userId, session.userId))
})
```

**Security**: HTTP-only cookies, user isolation via `userId`, Zod validation, open redirect prevention

---

## Key Patterns

**Query Keys** (`src/lib/query-keys.ts`): Hierarchical factory pattern
```typescript
tagKeys = { all: ['tags'], withCount: () => [...tagKeys.all, 'with-count'], ... }
repositoryKeys = { all: ['repositories'], lists: () => [...repositoryKeys.all, 'list'], ... }
```

**Auto-Coloring** (`src/utils/colors.ts`): Tags colored by priority:
1. Brand colors (exact match: "React" → React blue)
2. GitHub language colors (case-insensitive)
3. Language aliases ("js" → "JavaScript")
4. Hash-based fallback (deterministic from title)

**GitHub API** (`src/utils/github.ts`):
- `parseRepositoryUrl(url)` - Extract owner/name from GitHub URL
- `fetchRepositoryFromGitHub(owner, repo)` - Fetch repo data from GitHub API

**React Query**: Use optimistic updates with rollback on error (see existing hooks in `src/hooks/`)

---

## Deployment

**Environment Variables** (required):
```
DATABASE_URL, DATABASE_AUTH_TOKEN, BETTER_AUTH_URL, BETTER_AUTH_SECRET,
GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, SENTRY_AUTH_TOKEN
```

**CI/CD** (GitHub Actions):
- **PRs**: Lint, format, type check, test
- **Main branch**: Quality checks → Tests → Build → `db:push` → Coolify deployment

**Database**: Use `npm run db:push` (pushes schema changes to Turso)

---

## Important Notes

### Critical Rules

1. **ALWAYS filter by `session.userId`** - Every database query must use this for user isolation
2. **ALWAYS use `authMiddleware`** - All server functions that touch user data must include this
3. **ALWAYS run `npm run check`** - Before committing (pre-commit hooks enforce this)
4. **NEVER write raw SQL** - Use Drizzle ORM exclusively
5. **NEVER bypass validation** - All user inputs must have Zod schemas

### Common Pitfalls

- **Don't create duplicate tags**: `createTag` uses upsert logic (checks `userId + title`)
- **Don't forget to invalidate queries**: React Query cache must be updated after mutations
- **Don't skip query key factory**: Use `tagKeys`/`repositoryKeys` from `src/lib/query-keys.ts`
- **Don't use `any` type**: Strict TypeScript mode enabled

### Data Model Notes

- **Repository vs RepositoryInstance**:
  - `repository` = the actual GitHub repo (shared)
  - `repositoryInstance` = user's connection to that repo (per-user)
- **Tag Uniqueness**: Tags are unique per user (`userId, title`)
- **Soft Deletes**: Repositories use `deletedAt` field, not hard deletes
- **Tag Auto-coloring**: Uses brand colors → language colors → hash fallback (see `src/utils/colors.ts`)

### Recent Changes

- **Fix #29**: Sign-in race condition resolved (removed session cookie cache)
- **PR #28**: Lists schema added for advanced filtering (in progress)

---

**Last Updated**: November 2025
