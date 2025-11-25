import { createServerFn } from '@tanstack/start';
import { getEnv } from '../env';

export const getLaunchDarklyClientId = createServerFn({ method: 'GET' }).handler(
  async () => {
    const env = getEnv();
    return env.LAUNCHDARKLY_CLIENT_SIDE_ID;
  },
);
