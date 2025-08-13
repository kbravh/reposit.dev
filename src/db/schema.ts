import {
  sqliteTable,
  text,
  integer,
  uniqueIndex,
  index,
} from 'drizzle-orm/sqlite-core';
import uniqid from 'uniqid';
import { sql } from 'drizzle-orm';

export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('email_verified', { mode: 'boolean' })
    .$defaultFn(() => false)
    .notNull(),
  image: text('image'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const session = sqliteTable('session', {
  id: text('id').primaryKey(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  token: text('token').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});

export const account = sqliteTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: integer('access_token_expires_at', {
    mode: 'timestamp',
  }),
  refreshTokenExpiresAt: integer('refresh_token_expires_at', {
    mode: 'timestamp',
  }),
  scope: text('scope'),
  password: text('password'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const verification = sqliteTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const repository = sqliteTable(
  'repository',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => uniqid()),
    htmlUrl: text('html_url').notNull(),
    org: text('org').notNull(),
    name: text('name').notNull(),
    description: text('description'),
    private: integer('private', { mode: 'boolean' }).notNull(),
    provider: text('provider').default('github').notNull(),
    providerId: text('provider_id').notNull(),
    lastSyncedAt: integer('last_synced_at', { mode: 'timestamp' }),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .$defaultFn(() => new Date())
      .notNull(),
    primaryLanguage: text('primary_language'),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .$defaultFn(() => new Date())
      .notNull(),
  },
  table => [
    uniqueIndex('repository_org_name_provider_unique').on(
      table.org,
      table.name,
      table.provider
    ),
    uniqueIndex('repository_provider_id_unique').on(
      table.provider,
      table.providerId
    ),
    index('repository_org_idx').on(table.org),
    index('repository_name_idx').on(table.name),
    index('repository_org_name_idx').on(table.org, table.name),
  ]
);

export const repositoryInstance = sqliteTable(
  'repository_instance',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => uniqid()),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    repositoryId: text('repository_id')
      .notNull()
      .references(() => repository.id, { onDelete: 'cascade' }),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .$defaultFn(() => new Date())
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

export const tagInstance = sqliteTable(
  'tag_instance',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => uniqid()),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    color: text('color').default('#10b981').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .$defaultFn(() => new Date())
      .notNull(),
  },
  table => [
    uniqueIndex('tag_instance_user_title_unique').on(table.userId, table.title),
    index('tag_instance_user_idx').on(table.userId),
  ]
);

export const tagToRepository = sqliteTable(
  'tag_instance_repository_instance',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => uniqid()),
    tagInstanceId: text('tag_instance_id')
      .notNull()
      .references(() => tagInstance.id, { onDelete: 'cascade' }),
    repositoryInstanceId: text('repository_instance_id')
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

export const list = sqliteTable(
  'list',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => uniqid()),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    description: text('description'),
    includeMatch: text('include_match').default('any').notNull(), // 'any' | 'all'
    excludeMatch: text('exclude_match').default('any').notNull(), // 'any' | 'all'
    createdAt: integer('created_at', { mode: 'timestamp' })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .$defaultFn(() => new Date())
      .notNull(),
  },
  table => [
    index('list_user_idx').on(table.userId),
    uniqueIndex('list_user_name_unique').on(table.userId, table.name),
  ]
);

export const listTagInclude = sqliteTable(
  'list_tag_include',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => uniqid()),
    listId: text('list_id')
      .notNull()
      .references(() => list.id, { onDelete: 'cascade' }),
    tagInstanceId: text('tag_instance_id')
      .notNull()
      .references(() => tagInstance.id, { onDelete: 'cascade' }),
  },
  table => [
    uniqueIndex('list_tag_include_unique').on(table.listId, table.tagInstanceId),
    index('list_tag_include_list_idx').on(table.listId),
    index('list_tag_include_tag_idx').on(table.tagInstanceId),
  ]
);

export const listTagExclude = sqliteTable(
  'list_tag_exclude',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => uniqid()),
    listId: text('list_id')
      .notNull()
      .references(() => list.id, { onDelete: 'cascade' }),
    tagInstanceId: text('tag_instance_id')
      .notNull()
      .references(() => tagInstance.id, { onDelete: 'cascade' }),
  },
  table => [
    uniqueIndex('list_tag_exclude_unique').on(table.listId, table.tagInstanceId),
    index('list_tag_exclude_list_idx').on(table.listId),
    index('list_tag_exclude_tag_idx').on(table.tagInstanceId),
  ]
);

export const listRepositoryInclude = sqliteTable(
  'list_repository_include',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => uniqid()),
    listId: text('list_id')
      .notNull()
      .references(() => list.id, { onDelete: 'cascade' }),
    repositoryInstanceId: text('repository_instance_id')
      .notNull()
      .references(() => repositoryInstance.id, { onDelete: 'cascade' }),
  },
  table => [
    uniqueIndex('list_repo_include_unique').on(
      table.listId,
      table.repositoryInstanceId
    ),
    index('list_repo_include_list_idx').on(table.listId),
    index('list_repo_include_repo_idx').on(table.repositoryInstanceId),
  ]
);

export const listRepositoryExclude = sqliteTable(
  'list_repository_exclude',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => uniqid()),
    listId: text('list_id')
      .notNull()
      .references(() => list.id, { onDelete: 'cascade' }),
    repositoryInstanceId: text('repository_instance_id')
      .notNull()
      .references(() => repositoryInstance.id, { onDelete: 'cascade' }),
  },
  table => [
    uniqueIndex('list_repo_exclude_unique').on(
      table.listId,
      table.repositoryInstanceId
    ),
    index('list_repo_exclude_list_idx').on(table.listId),
    index('list_repo_exclude_repo_idx').on(table.repositoryInstanceId),
  ]
);
