import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { db } from '../db';
import { repository, repositoryInstance } from '../db/schema';
import { authMiddleware } from './middleware/auth';
import {
  getRepositoryDetails,
  getRepositoryDetailsFromProviderId,
} from '../utils/github';
import { eq, and, desc } from 'drizzle-orm';

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
              htmlUrl: repoDetails.html_url,
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

export const getRepositories = createServerFn({
  method: 'GET',
})
  .middleware([authMiddleware])
  .handler(async ({ context: { session } }) => {
    const userId = session.userId;
    const repositories = await db
      .select({
        repositoryInstance: repositoryInstance,
        repository: repository,
      })
      .from(repositoryInstance)
      .innerJoin(repository, eq(repositoryInstance.repositoryId, repository.id))
      .where(eq(repositoryInstance.userId, userId))
      .orderBy(desc(repositoryInstance.createdAt));

    return repositories;
  });

export const getRepository = createServerFn({
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
    const [repo] = await db
      .select({
        repositoryInstance: repositoryInstance,
        repository: repository,
      })
      .from(repositoryInstance)
      .innerJoin(repository, eq(repositoryInstance.repositoryId, repository.id))
      .where(
        and(
          eq(repositoryInstance.id, repositoryInstanceId),
          eq(repositoryInstance.userId, userId)
        )
      );

    if (!repo) {
      throw new Error('Repository not found');
    }

    return repo;
  });

export const deleteRepository = createServerFn()
  .validator(
    z.object({
      repositoryInstanceId: z.string(),
    })
  )
  .middleware([authMiddleware])
  .handler(async ({ data: { repositoryInstanceId }, context: { session } }) => {
    const userId = session.userId;

    // First verify the repository instance belongs to the user
    const [repoInstance] = await db
      .select()
      .from(repositoryInstance)
      .where(
        and(
          eq(repositoryInstance.id, repositoryInstanceId),
          eq(repositoryInstance.userId, userId)
        )
      );

    if (!repoInstance) {
      throw new Error('Repository not found');
    }

    // Delete the repository instance (this removes the user's connection to the repo)
    await db
      .delete(repositoryInstance)
      .where(eq(repositoryInstance.id, repositoryInstanceId));

    return { success: true };
  });

export const syncRepository = createServerFn()
  .validator(
    z.object({
      repositoryInstanceId: z.string(),
    })
  )
  .middleware([authMiddleware])
  .handler(async ({ data: { repositoryInstanceId }, context: { session } }) => {
    const userId = session.userId;

    // First verify the repository instance belongs to the user
    const [repoInstance] = await db
      .select({
        repositoryInstance: repositoryInstance,
        repository: repository,
      })
      .from(repositoryInstance)
      .innerJoin(repository, eq(repositoryInstance.repositoryId, repository.id))
      .where(
        and(
          eq(repositoryInstance.id, repositoryInstanceId),
          eq(repositoryInstance.userId, userId)
        )
      );

    if (!repoInstance) {
      throw new Error('Repository not found');
    }

    // Fetch latest repository details from GitHub
    const repoDetails = await getRepositoryDetailsFromProviderId(
      repoInstance.repository.providerId,
      repoInstance.repository.provider
    );

    // Update the repository with latest details
    const [updatedRepo] = await db
      .update(repository)
      .set({
        name: repoDetails.name,
        description: repoDetails.description,
        private: repoDetails.private,
        primaryLanguage: repoDetails.language,
        lastSyncedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(repository.id, repoInstance.repository.id))
      .returning();

    return updatedRepo;
  });
