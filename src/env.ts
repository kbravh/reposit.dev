import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string(),
  DATABASE_AUTH_TOKEN: z.string().optional(),
  BETTER_AUTH_URL: z.url(),
  BETTER_AUTH_SECRET: z.string(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  SENTRY_AUTH_TOKEN: z.string(),
  LAUNCHDARKLY_CLIENT_SIDE_ID: z.string(),
  LAUNCHDARKLY_SDK_KEY: z.string(),
});

let _env: z.infer<typeof envSchema> | null = null;

export const getEnv = () => {
  if (!_env) {
    const parsed = envSchema.safeParse(process.env);

    if (!parsed.success && !process.env.CI) {
      console.error(z.prettifyError(parsed.error));
      throw new Error('Invalid environment variables');
    }

    if (!parsed.data) {
      throw new Error('Environment variables are not set.');
    }

    _env = parsed.data;
  }

  return _env;
};
