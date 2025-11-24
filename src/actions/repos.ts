import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { getDb } from '../db';
import { repository, repositoryInstance } from '../db/schema';
import { authMiddleware } from './middleware/auth';
import {
  getRepositoryDetails,
  getRepositoryDetailsFromProviderId,
  searchRepositories,
} from '../utils/github';
import { eq, and, desc } from 'drizzle-orm';
import * as Sentry from '@sentry/node';

export const createRepository = createServerFn({
  method: 'POST',
})
  .inputValidator(z.object({ url: z.string() }))
  .middleware([authMiddleware])
  .handler(async ({ data: { url }, context: { session } }) => {
    try {
      const repoDetails = await getRepositoryDetails(url);
      return await getDb().transaction(async tx => {
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
    } catch (error) {
      Sentry.captureException(error, {
        tags: { action: 'createRepository', userId: session.userId },
        extra: { url },
      });
      throw error;
    }
  });

export const getRepositories = createServerFn({
  method: 'GET',
})
  .middleware([authMiddleware])
  .handler(async ({ context: { session } }) => {
    try {
      const userId = session.userId;
      const repositories = await getDb()
        .select({
          repositoryInstance: repositoryInstance,
          repository: repository,
        })
        .from(repositoryInstance)
        .innerJoin(
          repository,
          eq(repositoryInstance.repositoryId, repository.id)
        )
        .where(eq(repositoryInstance.userId, userId))
        .orderBy(desc(repositoryInstance.createdAt));

      return repositories;
    } catch (error) {
      Sentry.captureException(error, {
        tags: { action: 'getRepositories', userId: session.userId },
      });
      throw error;
    }
  });

export const getRepository = createServerFn({
  method: 'GET',
})
  .inputValidator(
    z.object({
      repositoryInstanceId: z.string(),
    })
  )
  .middleware([authMiddleware])
  .handler(async ({ data: { repositoryInstanceId }, context: { session } }) => {
    try {
      const userId = session.userId;
      const [repo] = await getDb()
        .select({
          repositoryInstance: repositoryInstance,
          repository: repository,
        })
        .from(repositoryInstance)
        .innerJoin(
          repository,
          eq(repositoryInstance.repositoryId, repository.id)
        )
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
    } catch (error) {
      Sentry.captureException(error, {
        tags: { action: 'getRepository', userId: session.userId },
        extra: { repositoryInstanceId },
      });
      throw error;
    }
  });

export const deleteRepository = createServerFn()
  .inputValidator(
    z.object({
      repositoryInstanceId: z.string(),
    })
  )
  .middleware([authMiddleware])
  .handler(async ({ data: { repositoryInstanceId }, context: { session } }) => {
    try {
      const userId = session.userId;

      // First verify the repository instance belongs to the user
      const [repoInstance] = await getDb()
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
      await getDb()
        .delete(repositoryInstance)
        .where(eq(repositoryInstance.id, repositoryInstanceId));

      return { success: true };
    } catch (error) {
      Sentry.captureException(error, {
        tags: { action: 'deleteRepository', userId: session.userId },
        extra: { repositoryInstanceId },
      });
      throw error;
    }
  });

export const syncRepository = createServerFn()
  .inputValidator(
    z.object({
      repositoryInstanceId: z.string(),
    })
  )
  .middleware([authMiddleware])
  .handler(async ({ data: { repositoryInstanceId }, context: { session } }) => {
    try {
      const userId = session.userId;

      // First verify the repository instance belongs to the user
      const [repoInstance] = await getDb()
        .select({
          repositoryInstance: repositoryInstance,
          repository: repository,
        })
        .from(repositoryInstance)
        .innerJoin(
          repository,
          eq(repositoryInstance.repositoryId, repository.id)
        )
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
      const [updatedRepo] = await getDb()
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
    } catch (error) {
      Sentry.captureException(error, {
        tags: { action: 'syncRepository', userId: session.userId },
        extra: { repositoryInstanceId },
      });
      throw error;
    }
  });

export const searchGitHubRepositories = createServerFn({
  method: 'POST',
})
  .inputValidator(z.object({ query: z.string() }))
  .handler(async ({ data: { query } }) => {
    try {
      return await searchRepositories(query, 25);
    } catch (error) {
      Sentry.captureException(error, {
        tags: { action: 'searchGitHubRepositories' },
        extra: { query },
      });
      throw error;
    }
  });
