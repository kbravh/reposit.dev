import { relations, sql } from "drizzle-orm";
import { index, primaryKey, sqliteTableCreator } from "drizzle-orm/sqlite-core";
import type { AdapterAccount } from "next-auth/adapters";
import uniqid from "uniqid";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator((name) => `reposit.dev_${name}`);

// Auth Tables
export const users = createTable("user", (d) => ({
	id: d
		.text({ length: 255 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: d.text({ length: 255 }),
	email: d.text({ length: 255 }).notNull(),
	emailVerified: d.integer({ mode: "timestamp" }).default(sql`(unixepoch())`),
	image: d.text({ length: 255 }),
}));

export const accounts = createTable(
	"account",
	(d) => ({
		userId: d
			.text({ length: 255 })
			.notNull()
			.references(() => users.id),
		type: d.text({ length: 255 }).$type<AdapterAccount["type"]>().notNull(),
		provider: d.text({ length: 255 }).notNull(),
		providerAccountId: d.text({ length: 255 }).notNull(),
		refresh_token: d.text(),
		access_token: d.text(),
		expires_at: d.integer(),
		token_type: d.text({ length: 255 }),
		scope: d.text({ length: 255 }),
		id_token: d.text(),
		session_state: d.text({ length: 255 }),
	}),
	(t) => [
		primaryKey({
			columns: [t.provider, t.providerAccountId],
		}),
		index("account_user_id_idx").on(t.userId),
	],
);

export const sessions = createTable(
	"session",
	(d) => ({
		sessionToken: d.text({ length: 255 }).notNull().primaryKey(),
		userId: d
			.text({ length: 255 })
			.notNull()
			.references(() => users.id),
		expires: d.integer({ mode: "timestamp" }).notNull(),
	}),
	(t) => [index("session_userId_idx").on(t.userId)],
);

export const verificationTokens = createTable(
	"verification_token",
	(d) => ({
		identifier: d.text({ length: 255 }).notNull(),
		token: d.text({ length: 255 }).notNull(),
		expires: d.integer({ mode: "timestamp" }).notNull(),
	}),
	(t) => [primaryKey({ columns: [t.identifier, t.token] })],
);

// Reposit.dev Tables
export const repositories = createTable(
	"repository",
	(d) => ({
		id: d.text({ length: 255 }).notNull().primaryKey().$defaultFn(() => uniqid()),
		name: d.text({ length: 256 }).notNull(),
		owner: d.text({ length: 256 }).notNull(), // The GitHub/GitLab/etc. username or org
		url: d.text({ length: 512 }).notNull(),
		description: d.text({ length: 1024 }),
		isArchived: d.integer().default(0).notNull(), // For hiding/archiving (0=false, 1=true)
		createdById: d.text({ length: 255 }).notNull().references(() => users.id),
		createdAt: d.integer({ mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
		updatedAt: d.integer({ mode: "timestamp" }).$onUpdate(() => new Date()),
	}),
	(t) => [
		index("repository_owner_name_idx").on(t.owner, t.name),
		index("repository_created_by_idx").on(t.createdById),
		index("repository_is_archived_idx").on(t.isArchived),
	]
);

export const tags = createTable(
	"tag",
	(d) => ({
		id: d.text({ length: 255 }).notNull().primaryKey().$defaultFn(() => uniqid()),
		name: d.text({ length: 64 }).notNull(),
		color: d.text({ length: 7 }).default("#3B82F6"), // Default blue hex color
		createdById: d.text({ length: 255 }).notNull().references(() => users.id),
		createdAt: d.integer({ mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
	}),
	(t) => [
		index("tag_name_idx").on(t.name),
		index("tag_created_by_idx").on(t.createdById),
	]
);

export const repositoryTags = createTable(
	"repository_tag",
	(d) => ({
		repositoryId: d.text({ length: 255 }).notNull().references(() => repositories.id),
		tagId: d.text({ length: 255 }).notNull().references(() => tags.id),
		createdAt: d.integer({ mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
	}),
	(t) => [
		primaryKey({ columns: [t.repositoryId, t.tagId] }),
		index("repository_tag_repository_id_idx").on(t.repositoryId),
		index("repository_tag_tag_id_idx").on(t.tagId),
	]
);

export const lists = createTable(
	"list",
	(d) => ({
		id: d.text({ length: 255 }).notNull().primaryKey().$defaultFn(() => uniqid()),
		name: d.text({ length: 128 }).notNull(),
		description: d.text({ length: 512 }),
		createdById: d.text({ length: 255 }).notNull().references(() => users.id),
		createdAt: d.integer({ mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
		updatedAt: d.integer({ mode: "timestamp" }).$onUpdate(() => new Date()),
	}),
	(t) => [
		index("list_name_idx").on(t.name),
		index("list_created_by_idx").on(t.createdById),
	]
);

export const listRepositoryEntries = createTable(
	"list_repository_entry",
	(d) => ({
		id: d.text({ length: 255 }).notNull().primaryKey().$defaultFn(() => uniqid()),
		listId: d.text({ length: 255 }).notNull().references(() => lists.id),
		repositoryId: d.text({ length: 255 }).notNull().references(() => repositories.id),
		entryType: d.text({ length: 16 }).notNull(), // "include" or "exclude"
		createdAt: d.integer({ mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
	}),
	(t) => [
		index("list_repository_entry_list_id_idx").on(t.listId),
		index("list_repository_entry_repository_id_idx").on(t.repositoryId),
		// Ensure a repo can't be both included and excluded in the same list
		index("list_repository_entry_unique_idx").on(t.listId, t.repositoryId),
	]
);

export const listTagFilters = createTable(
	"list_tag_filter",
	(d) => ({
		id: d.text({ length: 255 }).notNull().primaryKey().$defaultFn(() => uniqid()),
		listId: d.text({ length: 255 }).notNull().references(() => lists.id),
		tagId: d.text({ length: 255 }).notNull().references(() => tags.id),
		filterType: d.text({ length: 16 }).notNull(), // "include" or "exclude"
		createdAt: d.integer({ mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
	}),
	(t) => [
		index("list_tag_filter_list_id_idx").on(t.listId),
		index("list_tag_filter_tag_id_idx").on(t.tagId),
	]
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
	accounts: many(accounts),
	repositories: many(repositories, { relationName: "creator" }),
	tags: many(tags, { relationName: "creator" }),
	lists: many(lists, { relationName: "creator" }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
	user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const repositoriesRelations = relations(repositories, ({ one, many }) => ({
	createdBy: one(users, { fields: [repositories.createdById], references: [users.id], relationName: "creator" }),
	tags: many(repositoryTags),
	listEntries: many(listRepositoryEntries),
}));

export const tagsRelations = relations(tags, ({ one, many }) => ({
	createdBy: one(users, { fields: [tags.createdById], references: [users.id], relationName: "creator" }),
	repositories: many(repositoryTags),
	listFilters: many(listTagFilters),
}));

export const listsRelations = relations(lists, ({ one, many }) => ({
	createdBy: one(users, { fields: [lists.createdById], references: [users.id], relationName: "creator" }),
	repositoryEntries: many(listRepositoryEntries),
	tagFilters: many(listTagFilters),
}));

export const repositoryTagsRelations = relations(repositoryTags, ({ one }) => ({
	repository: one(repositories, { fields: [repositoryTags.repositoryId], references: [repositories.id] }),
	tag: one(tags, { fields: [repositoryTags.tagId], references: [tags.id] }),
}));

export const listRepositoryEntriesRelations = relations(listRepositoryEntries, ({ one }) => ({
	list: one(lists, { fields: [listRepositoryEntries.listId], references: [lists.id] }),
	repository: one(repositories, { fields: [listRepositoryEntries.repositoryId], references: [repositories.id] }),
}));

export const listTagFiltersRelations = relations(listTagFilters, ({ one }) => ({
	list: one(lists, { fields: [listTagFilters.listId], references: [lists.id] }),
	tag: one(tags, { fields: [listTagFilters.tagId], references: [tags.id] }),
}));
