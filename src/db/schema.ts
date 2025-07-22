import {
  pgTable,
  text,
  timestamp,
  boolean,
  uniqueIndex,
  index,
  uuid,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified')
    .$defaultFn(() => false)
    .notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => sql`now()`)
    .notNull(),
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => sql`now()`)
    .notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => sql`now()`)
    .notNull(),
});

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => sql`now()`)
    .notNull(),
});

export const repository = pgTable(
  'repository',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    htmlUrl: text('html_url').notNull(),
    org: text('org').notNull(),
    name: text('name').notNull(),
    description: text('description'),
    private: boolean('private').notNull(),
    provider: text('provider').default('github').notNull(),
    lastSyncedAt: timestamp('last_synced_at'),
    deletedAt: timestamp('deleted_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    primaryLanguage: text('primary_language'),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => sql`now()`)
      .notNull(),
  },
  table => [
    // Unique constraint for org, name, provider (a repo is unique in a provider/org by name)
    uniqueIndex('repository_org_name_provider_unique').on(
      table.org,
      table.name,
      table.provider
    ),
    // Indexes for common queries
    index('repository_org_idx').on(table.org),
    index('repository_name_idx').on(table.name),
    index('repository_org_name_idx').on(table.org, table.name),
  ]
);

export const repositoryInstance = pgTable(
  'repository_instance',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    repositoryId: text('repository_id')
      .notNull()
      .references(() => repository.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => sql`now()`)
      .notNull(),
  },
  table => [
    uniqueIndex('repository_instance_user_repository_unique').on(
      table.userId,
      table.repositoryId
    ),
    index('repository_instance_user_idx').on(table.userId),
    index('repository_instance_repository_idx').on(table.repositoryId),
  ]
);

export const tagInstance = pgTable(
  'tag_instance',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    color: text('color').default('#10b981').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => sql`now()`)
      .notNull(),
  },
  table => [index('tag_instance_user_idx').on(table.userId)]
);

export const tagToRepository = pgTable(
  'tag_instance_repository_instance',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tagInstanceId: uuid('tag_instance_id')
      .notNull()
      .references(() => tagInstance.id, { onDelete: 'cascade' }),
    repositoryInstanceId: uuid('repository_instance_id')
      .notNull()
      .references(() => repositoryInstance.id, { onDelete: 'cascade' }),
  },
  table => [
    uniqueIndex('tag_instance_repository_instance_unique').on(
      table.tagInstanceId,
      table.repositoryInstanceId
    ),
  ]
);
