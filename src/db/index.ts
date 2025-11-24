import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { getEnv } from '../env';
import * as Sentry from '@sentry/node';

let _db: ReturnType<typeof drizzle> | null = null;

export const getDb = () => {
  if (!_db) {
    try {
      Sentry.addBreadcrumb({
        category: 'database',
        message: 'Initializing database connection',
        level: 'info',
      });

      const env = getEnv();

      const client = createClient({
        url: env.DATABASE_URL,
        authToken: env.DATABASE_AUTH_TOKEN,
      });

      _db = drizzle({ client });

      Sentry.addBreadcrumb({
        category: 'database',
        message: 'Database connection initialized successfully',
        level: 'info',
        data: {
          databaseUrl: env.DATABASE_URL.replace(
            /\/\/([^@]+@)?/,
            '//<credentials>@'
          ), // Mask credentials
        },
      });
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          component: 'database',
          operation: 'initialization',
        },
        level: 'fatal',
      });
      throw error;
    }
  }

  return _db;
};
