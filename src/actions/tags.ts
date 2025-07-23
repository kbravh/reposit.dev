import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { db } from '../db';
import {
  tagInstance,
  tagToRepository,
  repositoryInstance,
  repository,
} from '../db/schema';
import { authMiddleware } from './middleware/auth';
import { eq, and, desc } from 'drizzle-orm';

export const createTag = createServerFn({
  method: 'POST',
})
  .validator(
    z.object({
      title: z.string(),
      color: z.string().optional(),
      repositoryInstanceId: z.string().optional(),
    })
  )
  .middleware([authMiddleware])
  .handler(
    async ({
      data: { title, repositoryInstanceId, color },
      context: { session },
    }) => {
      const userId = session.userId;
      const newTag = await db.transaction(async tx => {
        console.log('Beginning transaction');
        const [tag] = await tx
          .insert(tagInstance)
          .values({
            title,
            userId,
            color,
          })
          .returning();
        console.log('Tag created', tag);
        if (repositoryInstanceId) {
          console.log('Adding tag to repository');
          await tx.insert(tagToRepository).values({
            tagInstanceId: tag.id,
            repositoryInstanceId,
          });
        }
        console.log('Transaction complete');
        return tag;
      });
      console.log('Transaction complete', newTag);
      return newTag;
    }
  );

export const getTags = createServerFn({
  method: 'GET',
})
  .middleware([authMiddleware])
  .handler(async ({ context: { session } }) => {
    const userId = session.userId;
    const tags = await db
      .select()
      .from(tagInstance)
      .where(eq(tagInstance.userId, userId))
      .orderBy(desc(tagInstance.createdAt));

    return tags;
  });

export const getTag = createServerFn({
  method: 'GET',
})
  .validator(
    z.object({
      tagId: z.string(),
    })
  )
  .middleware([authMiddleware])
  .handler(async ({ data: { tagId }, context: { session } }) => {
    const userId = session.userId;
    const [tag] = await db
      .select()
      .from(tagInstance)
      .where(and(eq(tagInstance.id, tagId), eq(tagInstance.userId, userId)));

    if (!tag) {
      throw new Error('Tag not found');
    }

    return tag;
  });

export const updateTag = createServerFn()
  .validator(
    z.object({
      tagId: z.string(),
      title: z.string().optional(),
      color: z.string().optional(),
    })
  )
  .middleware([authMiddleware])
  .handler(async ({ data: { tagId, title, color }, context: { session } }) => {
    const userId = session.userId;

    // First verify the tag belongs to the user
    const [existingTag] = await db
      .select()
      .from(tagInstance)
      .where(and(eq(tagInstance.id, tagId), eq(tagInstance.userId, userId)));

    if (!existingTag) {
      throw new Error('Tag not found');
    }

    const [updatedTag] = await db
      .update(tagInstance)
      .set({
        title: title ?? existingTag.title,
        color: color ?? existingTag.color,
        updatedAt: new Date(),
      })
      .where(eq(tagInstance.id, tagId))
      .returning();

    return updatedTag;
  });

export const deleteTag = createServerFn()
  .validator(
    z.object({
      tagId: z.string(),
    })
  )
  .middleware([authMiddleware])
  .handler(async ({ data: { tagId }, context: { session } }) => {
    const userId = session.userId;

    // First verify the tag belongs to the user
    const [existingTag] = await db
      .select()
      .from(tagInstance)
      .where(and(eq(tagInstance.id, tagId), eq(tagInstance.userId, userId)));

    if (!existingTag) {
      throw new Error('Tag not found');
    }

    // Delete the tag (cascade will handle tagToRepository relationships)
    await db.delete(tagInstance).where(eq(tagInstance.id, tagId));

    return { success: true };
  });

export const addTagToRepository = createServerFn({
  method: 'POST',
})
  .validator(
    z.object({
      tagId: z.string(),
      repositoryInstanceId: z.string(),
    })
  )
  .middleware([authMiddleware])
  .handler(
    async ({ data: { tagId, repositoryInstanceId }, context: { session } }) => {
      const userId = session.userId;

      // Verify the tag belongs to the user
      const [tag] = await db
        .select()
        .from(tagInstance)
        .where(and(eq(tagInstance.id, tagId), eq(tagInstance.userId, userId)));

      if (!tag) {
        throw new Error('Tag not found');
      }

      // Verify the repository instance belongs to the user
      const [repositoryInst] = await db
        .select()
        .from(repositoryInstance)
        .where(
          and(
            eq(repositoryInstance.id, repositoryInstanceId),
            eq(repositoryInstance.userId, userId)
          )
        );

      if (!repositoryInst) {
        throw new Error('Repository not found');
      }

      // Add the relationship
      const [tagToRepo] = await db
        .insert(tagToRepository)
        .values({
          tagInstanceId: tagId,
          repositoryInstanceId,
        })
        .returning();

      return tagToRepo;
    }
  );

export const removeTagFromRepository = createServerFn()
  .validator(
    z.object({
      tagId: z.string(),
      repositoryInstanceId: z.string(),
    })
  )
  .middleware([authMiddleware])
  .handler(
    async ({ data: { tagId, repositoryInstanceId }, context: { session } }) => {
      const userId = session.userId;

      // Verify the tag belongs to the user
      const [tag] = await db
        .select()
        .from(tagInstance)
        .where(and(eq(tagInstance.id, tagId), eq(tagInstance.userId, userId)));

      if (!tag) {
        throw new Error('Tag not found');
      }

      // Verify the repository instance belongs to the user
      const [repositoryInst] = await db
        .select()
        .from(repositoryInstance)
        .where(
          and(
            eq(repositoryInstance.id, repositoryInstanceId),
            eq(repositoryInstance.userId, userId)
          )
        );

      if (!repositoryInst) {
        throw new Error('Repository not found');
      }

      // Remove the relationship
      await db
        .delete(tagToRepository)
        .where(
          and(
            eq(tagToRepository.tagInstanceId, tagId),
            eq(tagToRepository.repositoryInstanceId, repositoryInstanceId)
          )
        );

      return { success: true };
    }
  );

export const getRepositoriesForTag = createServerFn({
  method: 'GET',
})
  .validator(
    z.object({
      tagId: z.string(),
    })
  )
  .middleware([authMiddleware])
  .handler(async ({ data: { tagId }, context: { session } }) => {
    const userId = session.userId;

    // Verify the tag belongs to the user
    const [tag] = await db
      .select()
      .from(tagInstance)
      .where(and(eq(tagInstance.id, tagId), eq(tagInstance.userId, userId)));

    if (!tag) {
      throw new Error('Tag not found');
    }

    // Get repositories for this tag
    const repositories = await db
      .select({
        repositoryInstance: repositoryInstance,
        repository: repository,
      })
      .from(tagToRepository)
      .innerJoin(
        repositoryInstance,
        eq(tagToRepository.repositoryInstanceId, repositoryInstance.id)
      )
      .innerJoin(repository, eq(repositoryInstance.repositoryId, repository.id))
      .where(
        and(
          eq(tagToRepository.tagInstanceId, tagId),
          eq(repositoryInstance.userId, userId)
        )
      );

    return repositories;
  });

export const getTagsForRepository = createServerFn({
  method: 'GET',
})
  .validator(
    z.object({
      repositoryInstanceId: z.string(),
    })
  )
  .middleware([authMiddleware])
  .handler(async ({ data: { repositoryInstanceId }, context: { session } }) => {
    const userId = session.userId;

    // Verify the repository instance belongs to the user
    const [repositoryInst] = await db
      .select()
      .from(repositoryInstance)
      .where(
        and(
          eq(repositoryInstance.id, repositoryInstanceId),
          eq(repositoryInstance.userId, userId)
        )
      );

    if (!repositoryInst) {
      throw new Error('Repository not found');
    }

    // Get tags for this repository
    const tags = await db
      .select({
        tagInstance: tagInstance,
      })
      .from(tagToRepository)
      .innerJoin(tagInstance, eq(tagToRepository.tagInstanceId, tagInstance.id))
      .where(
        and(
          eq(tagToRepository.repositoryInstanceId, repositoryInstanceId),
          eq(tagInstance.userId, userId)
        )
      );

    return tags.map(t => t.tagInstance);
  });
