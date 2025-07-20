# Reposit.dev - TanStack Start + Prisma + Turso DB

This project is set up with TanStack Start, Prisma ORM, and Turso DB following the [official Prisma TanStack Start guide](https://www.prisma.io/docs/guides/tanstack-start).

## Database Setup

### Prerequisites

1. Create a [Turso](https://turso.tech/) account
2. Create a new database in your Turso dashboard
3. Get your database URL and auth token

### Environment Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Turso database credentials in `.env`:
   ```env
   DATABASE_URL="libsql://your-database-name.turso.io"
   TURSO_AUTH_TOKEN="your-turso-auth-token-here"
   ```

### Database Commands

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (for development)
npm run db:push

# Create and run migrations (for production)
npm run db:migrate

# Reset database
npm run db:reset

# Seed database with sample data
npm run db:seed

# Open Prisma Studio
npm run db:studio
```

## Development Workflow

1. **First time setup:**
   ```bash
   npm install
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

## Database Schema

The database includes:

### Auth Tables (NextAuth.js compatible)
- `User` - User accounts
- `Account` - OAuth provider accounts
- `Session` - User sessions
- `VerificationToken` - Email verification tokens

### Application Tables
- `Repository` - GitHub/GitLab repositories
- `Tag` - Categorization tags
- `RepositoryTag` - Many-to-many relationship between repositories and tags
- `List` - Custom repository lists
- `ListRepositoryEntry` - Repositories included/excluded in lists
- `ListTagFilter` - Tag-based filters for lists

## ID Generation

This project uses `uniqid` for generating unique IDs for application entities (repositories, tags, lists, etc.) and `crypto.randomUUID()` for auth-related entities to maintain NextAuth.js compatibility.

```typescript
import { generateId, generateAuthId } from '@/lib/utils'

// For app entities
const repository = await prisma.repository.create({
  data: {
    id: generateId(), // Uses uniqid()
    name: 'My Repository',
    // ... other fields
  }
})

// For auth entities
const user = await prisma.user.create({
  data: {
    id: generateAuthId(), // Uses crypto.randomUUID()
    email: 'user@example.com',
    // ... other fields
  }
})
```

## Database Client Usage

```typescript
import { prisma } from '@/lib/db'

// Example: Get all repositories with their tags
const repositories = await prisma.repository.findMany({
  include: {
    tags: {
      include: {
        tag: true
      }
    },
    createdBy: true
  }
})
```

## Local Development

For local development, you can also use a local SQLite file by updating your `.env`:

```env
DATABASE_URL="file:./dev.db"
# Comment out TURSO_AUTH_TOKEN when using local file
```