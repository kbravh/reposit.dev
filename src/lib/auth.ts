import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { getDb } from '../db';
import { getEnv } from '../env';
import { user, session, account, verification } from '../db/schema';

let _auth: ReturnType<typeof betterAuth> | null = null;

export const getAuth = () => {
  if (!_auth) {
    const env = getEnv();
    const db = getDb();

    _auth = betterAuth({
      database: drizzleAdapter(db, {
        provider: 'sqlite',
        schema: {
          user,
          session,
          account,
          verification,
        },
      }),
      socialProviders: {
        github: {
          clientId: env.GITHUB_CLIENT_ID,
          clientSecret: env.GITHUB_CLIENT_SECRET,
        },
      },
    });
  }

  return _auth;
};
