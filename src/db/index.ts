import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { getEnv } from '../env';

let _db: ReturnType<typeof drizzle> | null = null;

export const getDb = () => {
  if (!_db) {
    const env = getEnv();

    const client = createClient({
      url: env.DATABASE_URL,
      authToken: env.DATABASE_AUTH_TOKEN,
    });

    _db = drizzle({ client });
  }

  return _db;
};
