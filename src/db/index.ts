import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { getEnv } from '../env';

let _db: ReturnType<typeof drizzle> | undefined;

function initDb() {
  if (_db) return _db;

  const env = getEnv();
  const client = createClient({
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
  });

  _db = drizzle({ client });
  return _db;
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_, prop) {
    const database = initDb();
    return database[prop as keyof typeof database];
  },
});
