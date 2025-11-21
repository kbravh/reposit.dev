import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string(),
  DATABASE_AUTH_TOKEN: z.string().optional(),
  BETTER_AUTH_URL: z.url(),
  BETTER_AUTH_SECRET: z.string(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  SENTRY_AUTH_TOKEN: z.string(),
  ANTHROPIC_API_KEY: z.string().optional(),
});

let _env: z.infer<typeof envSchema> | null = null;

export const getEnv = () => {
  if (!_env) {
    // eslint-disable-next-line no-undef
    const parsed = envSchema.safeParse(process.env);

    // eslint-disable-next-line no-undef
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
