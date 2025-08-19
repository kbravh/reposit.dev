import {
  sqliteTable,
  text,
  integer,
  uniqueIndex,
  index,
} from 'drizzle-orm/sqlite-core';
import uniqid from 'uniqid';

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

export const lists = sqliteTable('list', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  name: text('name').notNull(),
  description: text('description'),
  visibility: text('visibility', { enum: ['private', 'public', 'unlisted'] })
    .notNull()
    .default('private'),
  shareToken: text('share_token').unique(),
  startWithAll: integer('start_with_all', { mode: 'boolean' })
    .notNull()
    .default(false),
  defaultSortPrimary: text('default_sort_primary', {
    enum: ['name', 'org', 'stars'],
  })
    .notNull()
    .default('name'),
  defaultSortPrimaryDir: text('default_sort_primary_dir', {
    enum: ['asc', 'desc'],
  })
    .notNull()
    .default('asc'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const listFilterGroups = sqliteTable('list_filter_group', {
  id: text('id').primaryKey(),
  listId: text('list_id')
    .notNull()
    .references(() => lists.id),
  parentGroupId: text('parent_group_id').references(() => listFilterGroups.id),
  operator: text('operator', { enum: ['AND', 'OR'] }).notNull(),
  position: integer('position').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const listFilterTagClauses = sqliteTable(
  'list_filter_tag_clause',
  {
    id: text('id').primaryKey(),
    groupId: text('group_id')
      .notNull()
      .references(() => listFilterGroups.id),
    mode: text('mode', { enum: ['INCLUDE', 'EXCLUDE'] }).notNull(),
    tagInstanceId: text('tag_instance_id')
      .notNull()
      .references(() => tagInstance.id),
    position: integer('position').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  },
  table => [index('list_filter_tag_clause_group_id_idx').on(table.groupId)]
);

export const listRepoOverrides = sqliteTable(
  'list_repo_override',
  {
    id: text('id').primaryKey(),
    listId: text('list_id')
      .notNull()
      .references(() => lists.id),
    repositoryInstanceId: text('repository_instance_id')
      .notNull()
      .references(() => repositoryInstance.id),
    action: text('action', { enum: ['INCLUDE', 'EXCLUDE'] }).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  },
  table => [
    uniqueIndex('list_repo_override_list_id_repository_instance_id_unique').on(
      table.listId,
      table.repositoryInstanceId
    ),
    index('list_repo_override_list_id_idx').on(table.listId),
    index('list_repo_override_repository_instance_id_idx').on(
      table.repositoryInstanceId
    ),
  ]
);
