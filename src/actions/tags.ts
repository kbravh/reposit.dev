import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { db } from '../db';
import { tagInstance, tagToRepository } from '../db/schema';
import { authMiddleware } from './middleware/auth';

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
        const [tag] = await tx
          .insert(tagInstance)
          .values({
            title,
            userId,
            color,
          })
          .returning();
        if (repositoryInstanceId) {
          await tx.insert(tagToRepository).values({
            tagInstanceId: tag.id,
            repositoryInstanceId,
          });
        }
        return tag;
      });
      return newTag;
    }
  );
