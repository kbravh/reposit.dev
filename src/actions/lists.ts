import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { and, desc, eq, inArray } from 'drizzle-orm';
import { db } from '../db';
import {
  list,
  listRepositoryExclude,
  listRepositoryInclude,
  listTagExclude,
  listTagInclude,
  repository,
  repositoryInstance,
  tagInstance,
  tagToRepository,
} from '../db/schema';
import { authMiddleware } from './middleware/auth';

const matchEnum = z.enum(['any', 'all']);

export const createList = createServerFn({ method: 'POST' })
  .validator(
    z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      includeMatch: matchEnum.optional().default('any'),
      excludeMatch: matchEnum.optional().default('any'),
      includeTagIds: z.array(z.string()).optional().default([]),
      excludeTagIds: z.array(z.string()).optional().default([]),
      includeRepositoryInstanceIds: z.array(z.string()).optional().default([]),
      excludeRepositoryInstanceIds: z.array(z.string()).optional().default([]),
    })
  )
  .middleware([authMiddleware])
  .handler(async ({ data, context: { session } }) => {
    const userId = session.userId;

    // Validate tags belong to user
    const allTagIds = [...new Set([...(data.includeTagIds ?? []), ...(data.excludeTagIds ?? [])])];
    if (allTagIds.length) {
      const userTags = await db
        .select({ id: tagInstance.id })
        .from(tagInstance)
        .where(and(eq(tagInstance.userId, userId), inArray(tagInstance.id, allTagIds)));
      if (userTags.length !== allTagIds.length) {
        throw new Error('Some tags do not exist or do not belong to the user');
      }
    }

    // Validate repositories belong to user
    const allRepoInstanceIds = [
      ...new Set([...(data.includeRepositoryInstanceIds ?? []), ...(data.excludeRepositoryInstanceIds ?? [])]),
    ];
    if (allRepoInstanceIds.length) {
      const userRepos = await db
        .select({ id: repositoryInstance.id })
        .from(repositoryInstance)
        .where(and(eq(repositoryInstance.userId, userId), inArray(repositoryInstance.id, allRepoInstanceIds)));
      if (userRepos.length !== allRepoInstanceIds.length) {
        throw new Error('Some repositories do not exist or do not belong to the user');
      }
    }

    return await db.transaction(async tx => {
      const [newList] = await tx
        .insert(list)
        .values({
          name: data.name,
          description: data.description,
          includeMatch: data.includeMatch ?? 'any',
          excludeMatch: data.excludeMatch ?? 'any',
          userId,
        })
        .returning();

      if (data.includeTagIds?.length) {
        await tx.insert(listTagInclude).values(
          data.includeTagIds.map(tagId => ({ listId: newList.id, tagInstanceId: tagId }))
        );
      }
      if (data.excludeTagIds?.length) {
        await tx.insert(listTagExclude).values(
          data.excludeTagIds.map(tagId => ({ listId: newList.id, tagInstanceId: tagId }))
        );
      }
      if (data.includeRepositoryInstanceIds?.length) {
        await tx.insert(listRepositoryInclude).values(
          data.includeRepositoryInstanceIds.map(repositoryInstanceId => ({
            listId: newList.id,
            repositoryInstanceId,
          }))
        );
      }
      if (data.excludeRepositoryInstanceIds?.length) {
        await tx.insert(listRepositoryExclude).values(
          data.excludeRepositoryInstanceIds.map(repositoryInstanceId => ({
            listId: newList.id,
            repositoryInstanceId,
          }))
        );
      }

      return newList;
    });
  });

export const getLists = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context: { session } }) => {
    const userId = session.userId;
    const lists = await db
      .select()
      .from(list)
      .where(eq(list.userId, userId))
      .orderBy(desc(list.createdAt));
    return lists;
  });

export const getList = createServerFn({ method: 'GET' })
  .validator(z.object({ listId: z.string() }))
  .middleware([authMiddleware])
  .handler(async ({ data: { listId }, context: { session } }) => {
    const userId = session.userId;

    const [l] = await db.select().from(list).where(and(eq(list.id, listId), eq(list.userId, userId)));
    if (!l) throw new Error('List not found');

    const [includeTags, excludeTags, includeRepos, excludeRepos] = await Promise.all([
      db
        .select({ id: tagInstance.id, title: tagInstance.title, color: tagInstance.color })
        .from(listTagInclude)
        .innerJoin(tagInstance, eq(listTagInclude.tagInstanceId, tagInstance.id))
        .where(eq(listTagInclude.listId, listId)),
      db
        .select({ id: tagInstance.id, title: tagInstance.title, color: tagInstance.color })
        .from(listTagExclude)
        .innerJoin(tagInstance, eq(listTagExclude.tagInstanceId, tagInstance.id))
        .where(eq(listTagExclude.listId, listId)),
      db
        .select({ id: repositoryInstance.id })
        .from(listRepositoryInclude)
        .innerJoin(
          repositoryInstance,
          eq(listRepositoryInclude.repositoryInstanceId, repositoryInstance.id)
        )
        .where(eq(listRepositoryInclude.listId, listId)),
      db
        .select({ id: repositoryInstance.id })
        .from(listRepositoryExclude)
        .innerJoin(
          repositoryInstance,
          eq(listRepositoryExclude.repositoryInstanceId, repositoryInstance.id)
        )
        .where(eq(listRepositoryExclude.listId, listId)),
    ]);

    return {
      ...l,
      includeTagIds: includeTags.map(t => t.id),
      excludeTagIds: excludeTags.map(t => t.id),
      includeRepositoryInstanceIds: includeRepos.map(r => r.id),
      excludeRepositoryInstanceIds: excludeRepos.map(r => r.id),
    };
  });

export const updateList = createServerFn()
  .validator(
    z.object({
      listId: z.string(),
      name: z.string().min(1).optional(),
      description: z.string().optional(),
      includeMatch: matchEnum.optional(),
      excludeMatch: matchEnum.optional(),
      includeTagIds: z.array(z.string()).optional(),
      excludeTagIds: z.array(z.string()).optional(),
      includeRepositoryInstanceIds: z.array(z.string()).optional(),
      excludeRepositoryInstanceIds: z.array(z.string()).optional(),
    })
  )
  .middleware([authMiddleware])
  .handler(async ({ data, context: { session } }) => {
    const userId = session.userId;

    const [existing] = await db.select().from(list).where(and(eq(list.id, data.listId), eq(list.userId, userId)));
    if (!existing) throw new Error('List not found');

    return await db.transaction(async tx => {
      const [updated] = await tx
        .update(list)
        .set({
          name: data.name ?? existing.name,
          description: data.description ?? existing.description,
          includeMatch: data.includeMatch ?? existing.includeMatch,
          excludeMatch: data.excludeMatch ?? existing.excludeMatch,
          updatedAt: new Date(),
        })
        .where(eq(list.id, data.listId))
        .returning();

      // If arrays are provided, replace the mappings
      if (data.includeTagIds) {
        await tx.delete(listTagInclude).where(eq(listTagInclude.listId, data.listId));
        if (data.includeTagIds.length) {
          await tx.insert(listTagInclude).values(
            data.includeTagIds.map(tagId => ({ listId: data.listId, tagInstanceId: tagId }))
          );
        }
      }
      if (data.excludeTagIds) {
        await tx.delete(listTagExclude).where(eq(listTagExclude.listId, data.listId));
        if (data.excludeTagIds.length) {
          await tx.insert(listTagExclude).values(
            data.excludeTagIds.map(tagId => ({ listId: data.listId, tagInstanceId: tagId }))
          );
        }
      }
      if (data.includeRepositoryInstanceIds) {
        await tx
          .delete(listRepositoryInclude)
          .where(eq(listRepositoryInclude.listId, data.listId));
        if (data.includeRepositoryInstanceIds.length) {
          await tx.insert(listRepositoryInclude).values(
            data.includeRepositoryInstanceIds.map(repositoryInstanceId => ({
              listId: data.listId,
              repositoryInstanceId,
            }))
          );
        }
      }
      if (data.excludeRepositoryInstanceIds) {
        await tx
          .delete(listRepositoryExclude)
          .where(eq(listRepositoryExclude.listId, data.listId));
        if (data.excludeRepositoryInstanceIds.length) {
          await tx.insert(listRepositoryExclude).values(
            data.excludeRepositoryInstanceIds.map(repositoryInstanceId => ({
              listId: data.listId,
              repositoryInstanceId,
            }))
          );
        }
      }

      return updated;
    });
  });

export const deleteList = createServerFn()
  .validator(z.object({ listId: z.string() }))
  .middleware([authMiddleware])
  .handler(async ({ data: { listId }, context: { session } }) => {
    const userId = session.userId;

    const [existing] = await db.select().from(list).where(and(eq(list.id, listId), eq(list.userId, userId)));
    if (!existing) throw new Error('List not found');

    await db.delete(list).where(eq(list.id, listId));
    return { success: true };
  });

export const getRepositoriesForList = createServerFn({ method: 'GET' })
  .validator(z.object({ listId: z.string() }))
  .middleware([authMiddleware])
  .handler(async ({ data: { listId }, context: { session } }) => {
    const userId = session.userId;

    const [l] = await db.select().from(list).where(and(eq(list.id, listId), eq(list.userId, userId)));
    if (!l) throw new Error('List not found');

    const [includeTagRows, excludeTagRows, includeRepoRows, excludeRepoRows, repoRows, repoTagRows] = await Promise.all([
      db.select({ tagId: listTagInclude.tagInstanceId }).from(listTagInclude).where(eq(listTagInclude.listId, listId)),
      db.select({ tagId: listTagExclude.tagInstanceId }).from(listTagExclude).where(eq(listTagExclude.listId, listId)),
      db
        .select({ repositoryInstanceId: listRepositoryInclude.repositoryInstanceId })
        .from(listRepositoryInclude)
        .where(eq(listRepositoryInclude.listId, listId)),
      db
        .select({ repositoryInstanceId: listRepositoryExclude.repositoryInstanceId })
        .from(listRepositoryExclude)
        .where(eq(listRepositoryExclude.listId, listId)),
      db
        .select({ repositoryInstance, repository })
        .from(repositoryInstance)
        .innerJoin(repository, eq(repositoryInstance.repositoryId, repository.id))
        .where(eq(repositoryInstance.userId, userId)),
      db
        .select({ repositoryInstanceId: tagToRepository.repositoryInstanceId, tagId: tagToRepository.tagInstanceId })
        .from(tagToRepository)
        .innerJoin(repositoryInstance, eq(repositoryInstance.id, tagToRepository.repositoryInstanceId))
        .where(eq(repositoryInstance.userId, userId)),
    ]);

    const includeTagIds = new Set(includeTagRows.map(r => r.tagId));
    const excludeTagIds = new Set(excludeTagRows.map(r => r.tagId));
    const includedRepoIds = new Set(includeRepoRows.map(r => r.repositoryInstanceId));
    const excludedRepoIds = new Set(excludeRepoRows.map(r => r.repositoryInstanceId));

    const repoIdToTagIds = new Map<string, Set<string>>();
    for (const row of repoTagRows) {
      const set = repoIdToTagIds.get(row.repositoryInstanceId) ?? new Set<string>();
      set.add(row.tagId);
      repoIdToTagIds.set(row.repositoryInstanceId, set);
    }

    const results = [] as Array<{ repositoryInstance: typeof repositoryInstance.$inferSelect; repository: typeof repository.$inferSelect }>;

    for (const row of repoRows) {
      const repoInst = row.repositoryInstance;
      const tagsForRepo = repoIdToTagIds.get(repoInst.id) ?? new Set<string>();

      // Explicit exclude wins
      if (excludedRepoIds.has(repoInst.id)) {
        continue;
      }
      // Explicit include always includes (unless explicitly excluded above)
      if (includedRepoIds.has(repoInst.id)) {
        results.push(row);
        continue;
      }

      // Include rule
      let includePass = true;
      if (includeTagIds.size > 0) {
        if (l.includeMatch === 'any') {
          includePass = [...includeTagIds].some(t => tagsForRepo.has(t));
        } else {
          includePass = [...includeTagIds].every(t => tagsForRepo.has(t));
        }
      }

      // Exclude rule
      let shouldExclude = false;
      if (excludeTagIds.size > 0) {
        if (l.excludeMatch === 'any') {
          shouldExclude = [...excludeTagIds].some(t => tagsForRepo.has(t));
        } else {
          shouldExclude = [...excludeTagIds].every(t => tagsForRepo.has(t));
        }
      }

      if (includePass && !shouldExclude) {
        results.push(row);
      }
    }

    return results;
  });