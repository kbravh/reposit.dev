import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { db } from '../db';
import { repository, repositoryInstance } from '../db/schema';
import { authMiddleware } from './middleware/auth';
import { getRepositoryDetails } from '../utils/github';
import { eq } from 'drizzle-orm';

export const createRepository = createServerFn({
  method: 'POST',
})
  .validator(z.object({ url: z.string() }))
  .middleware([authMiddleware])
  .handler(async ({ data: { url }, context: { session } }) => {
    const repoDetails = await getRepositoryDetails(url);
    return await db.transaction(async tx => {
      let repoRecord = (
        await tx
          .select()
          .from(repository)
          .where(eq(repository.providerId, repoDetails.id.toString()))
          .limit(1)
      )[0];

      if (!repoRecord) {
        repoRecord = (
          await tx
            .insert(repository)
            .values({
              provider: 'github',
              providerId: repoDetails.id.toString(),
              name: repoDetails.name,
              htmlUrl: repoDetails.htmlUrl,
              private: repoDetails.private,
              org: repoDetails.owner.login,
              description: repoDetails.description,
              primaryLanguage: repoDetails.language,
            })
            .returning()
        )[0];
      }
      const [newRepoInstance] = await tx
        .insert(repositoryInstance)
        .values({
          repositoryId: repoRecord.id,
          userId: session.userId,
        })
        .returning();
      return newRepoInstance;
    });
  });
