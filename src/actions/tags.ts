import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { getDb } from '../db';
import {
  tagInstance,
  tagToRepository,
  repositoryInstance,
  repository,
} from '../db/schema';
import { authMiddleware } from './middleware/auth';
import { eq, and, desc, sql } from 'drizzle-orm';
import { getPredefinedColor, getHashedTagColor } from '../utils/colors';

export const createTag = createServerFn({
  method: 'POST',
})
  .inputValidator(
    z.object({
      title: z
        .string()
        .min(1)
        .transform(val => val.toLowerCase().trim()),
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
      const Sentry = await import('@sentry/node');
      try {
        const userId = session.userId;

        return await getDb().transaction(async tx => {
          // Upsert the tag
          const [tag] = await tx
            .insert(tagInstance)
            .values({
              title,
              userId,
              color:
                color || getPredefinedColor(title) || getHashedTagColor(title),
            })
            .onConflictDoUpdate({
              target: [tagInstance.userId, tagInstance.title],
              set: {
                color: sql.raw(`excluded.${tagInstance.color.name}`),
                updatedAt: sql.raw(`excluded.${tagInstance.updatedAt.name}`),
              },
            })
            .returning();

          // Create the tag-to-repository relationship if a repository was specified
          if (repositoryInstanceId) {
            await tx
              .insert(tagToRepository)
              .values({
                tagInstanceId: tag.id,
                repositoryInstanceId,
              })
              .onConflictDoNothing(); // Don't error if relationship already exists
          }

          return tag;
        });
      } catch (error) {
        Sentry.captureException(error, {
          tags: { action: 'createTag', userId: session.userId },
          extra: { title, repositoryInstanceId },
        });
        throw error;
      }
    }
  );

export const getTags = createServerFn({
  method: 'GET',
})
  .middleware([authMiddleware])
  .handler(async ({ context: { session } }) => {
    const userId = session.userId;
    const tags = await getDb()
      .select()
      .from(tagInstance)
      .where(eq(tagInstance.userId, userId))
      .orderBy(desc(tagInstance.createdAt));

    return tags;
  });

export const getTag = createServerFn({
  method: 'GET',
})
  .inputValidator(
    z.object({
      tagId: z.string(),
    })
  )
  .middleware([authMiddleware])
  .handler(async ({ data: { tagId }, context: { session } }) => {
    const userId = session.userId;
    const [tag] = await getDb()
      .select()
      .from(tagInstance)
      .where(and(eq(tagInstance.id, tagId), eq(tagInstance.userId, userId)));

    if (!tag) {
      throw new Error('Tag not found');
    }

    return tag;
  });

export const updateTag = createServerFn()
  .inputValidator(
    z.object({
      tagId: z.string(),
      title: z
        .string()
        .optional()
        .transform(val => (val ? val.toLowerCase().trim() : val)),
      color: z.string().optional(),
    })
  )
  .middleware([authMiddleware])
  .handler(async ({ data: { tagId, title, color }, context: { session } }) => {
    const userId = session.userId;

    // First verify the tag belongs to the user
    const [existingTag] = await getDb()
      .select()
      .from(tagInstance)
      .where(and(eq(tagInstance.id, tagId), eq(tagInstance.userId, userId)));

    if (!existingTag) {
      throw new Error('Tag not found');
    }

    // If updating title, check for duplicates
    if (title && title !== existingTag.title) {
      const [duplicateTag] = await getDb()
        .select()
        .from(tagInstance)
        .where(
          and(eq(tagInstance.title, title), eq(tagInstance.userId, userId))
        )
        .limit(1);

      if (duplicateTag) {
        throw new Error('A tag with this title already exists');
      }
    }

    const [updatedTag] = await getDb()
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
  .inputValidator(
    z.object({
      tagId: z.string(),
    })
  )
  .middleware([authMiddleware])
  .handler(async ({ data: { tagId }, context: { session } }) => {
    const Sentry = await import('@sentry/node');
    try {
      const userId = session.userId;

      // First verify the tag belongs to the user
      const [existingTag] = await getDb()
        .select()
        .from(tagInstance)
        .where(and(eq(tagInstance.id, tagId), eq(tagInstance.userId, userId)));

      if (!existingTag) {
        throw new Error('Tag not found');
      }

      // Delete the tag (cascade will handle tagToRepository relationships)
      await getDb().delete(tagInstance).where(eq(tagInstance.id, tagId));

      return { success: true };
    } catch (error) {
      Sentry.captureException(error, {
        tags: { action: 'deleteTag', userId: session.userId },
        extra: { tagId },
      });
      throw error;
    }
  });

export const addTagToRepository = createServerFn({
  method: 'POST',
})
  .inputValidator(
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
      const [tag] = await getDb()
        .select()
        .from(tagInstance)
        .where(and(eq(tagInstance.id, tagId), eq(tagInstance.userId, userId)));

      if (!tag) {
        throw new Error('Tag not found');
      }

      // Verify the repository instance belongs to the user
      const [repositoryInst] = await getDb()
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
      const [tagToRepo] = await getDb()
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
  .inputValidator(
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
      const [tag] = await getDb()
        .select()
        .from(tagInstance)
        .where(and(eq(tagInstance.id, tagId), eq(tagInstance.userId, userId)));

      if (!tag) {
        throw new Error('Tag not found');
      }

      // Verify the repository instance belongs to the user
      const [repositoryInst] = await getDb()
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
      await getDb()
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
  .inputValidator(
    z.object({
      tagId: z.string(),
    })
  )
  .middleware([authMiddleware])
  .handler(async ({ data: { tagId }, context: { session } }) => {
    const userId = session.userId;

    // Verify the tag belongs to the user
    const [tag] = await getDb()
      .select()
      .from(tagInstance)
      .where(and(eq(tagInstance.id, tagId), eq(tagInstance.userId, userId)));

    if (!tag) {
      throw new Error('Tag not found');
    }

    // Get repositories for this tag
    const repositories = await getDb()
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
  .inputValidator(
    z.object({
      repositoryInstanceId: z.string(),
    })
  )
  .middleware([authMiddleware])
  .handler(async ({ data: { repositoryInstanceId }, context: { session } }) => {
    const userId = session.userId;

    // Verify the repository instance belongs to the user
    const [repositoryInst] = await getDb()
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
    const tags = await getDb()
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

export const createManyTags = createServerFn({
  method: 'POST',
})
  .inputValidator(
    z.object({
      titles: z.array(
        z
          .string()
          .min(1)
          .transform(val => val.toLowerCase().trim())
      ),
      repositoryInstanceId: z.string(),
    })
  )
  .middleware([authMiddleware])
  .handler(
    async ({
      data: { titles, repositoryInstanceId },
      context: { session },
    }) => {
      const Sentry = await import('@sentry/node');
      try {
        const userId = session.userId;

        // Verify the repository instance belongs to the user
        const [repositoryInst] = await getDb()
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

        const uniqueTitles = [...new Set(titles)]; // Remove duplicates

        // Bulk upsert all tags using onConflictDoUpdate
        const allTags = await getDb()
          .insert(tagInstance)
          .values(
            uniqueTitles.map(title => ({
              title,
              userId,
              color: getPredefinedColor(title) || getHashedTagColor(title),
            }))
          )
          .onConflictDoUpdate({
            target: [tagInstance.userId, tagInstance.title],
            set: {
              color: sql.raw(`excluded.${tagInstance.color.name}`),
              updatedAt: sql.raw(`excluded.${tagInstance.updatedAt.name}`),
            },
          })
          .returning();

        // Bulk upsert tag-to-repository relationships
        if (allTags.length > 0) {
          await getDb()
            .insert(tagToRepository)
            .values(
              allTags.map(tag => ({
                tagInstanceId: tag.id,
                repositoryInstanceId,
              }))
            )
            .onConflictDoNothing(); // Using onConflictDoNothing since we just want to create relationships that don't exist
        }

        return allTags;
      } catch (error) {
        Sentry.captureException(error, {
          tags: { action: 'createManyTags', userId: session.userId },
          extra: { tagCount: titles.length, repositoryInstanceId },
        });
        throw error;
      }
    }
  );

export const getTagsWithRepositoryCount = createServerFn({
  method: 'GET',
})
  .middleware([authMiddleware])
  .handler(async ({ context: { session } }) => {
    const userId = session.userId;

    const tagsWithCount = await getDb()
      .select({
        id: tagInstance.id,
        title: tagInstance.title,
        color: tagInstance.color,
        createdAt: tagInstance.createdAt,
        updatedAt: tagInstance.updatedAt,
        repositoryCount:
          sql<number>`count(case when ${tagToRepository.repositoryInstanceId} is not null then 1 end)`.as(
            'repositoryCount'
          ),
      })
      .from(tagInstance)
      .leftJoin(
        tagToRepository,
        eq(tagInstance.id, tagToRepository.tagInstanceId)
      )
      .where(eq(tagInstance.userId, userId))
      .groupBy(tagInstance.id)
      .orderBy(desc(tagInstance.createdAt));

    return tagsWithCount;
  });
