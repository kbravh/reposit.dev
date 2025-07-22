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
