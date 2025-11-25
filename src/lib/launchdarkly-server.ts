import * as ld from '@launchdarkly/node-server-sdk';
import { getEnv } from '../env';

let ldClient: ld.LDClient | null = null;

export async function getLaunchDarklyClient(): Promise<ld.LDClient> {
  if (ldClient) {
    return ldClient;
  }

  const env = getEnv();
  const sdkKey = env.LAUNCHDARKLY_SDK_KEY;

  ldClient = ld.init(sdkKey, {
    logger: ld.basicLogger({
      level: 'info',
    }),
  });

  await ldClient.waitForInitialization();

  return ldClient;
}

export async function closeLaunchDarklyClient(): Promise<void> {
  if (ldClient) {
    await ldClient.close();
    ldClient = null;
  }
}

export interface LDUser {
  kind?: 'user';
  key: string;
  email?: string;
  name?: string;
  anonymous?: boolean;
  custom?: Record<string, unknown>;
}

export async function getFeatureFlag(
  flagKey: string,
  user: LDUser,
  defaultValue: boolean = false
): Promise<boolean> {
  const client = await getLaunchDarklyClient();
  return await client.variation(
    flagKey,
    { kind: 'user', ...user },
    defaultValue
  );
}

export async function getFeatureFlagDetail<T>(
  flagKey: string,
  user: LDUser,
  defaultValue: T
): Promise<ld.LDEvaluationDetail> {
  const client = await getLaunchDarklyClient();
  return await client.variationDetail(
    flagKey,
    { kind: 'user', ...user },
    defaultValue
  );
}

export async function getAllFlags(user: LDUser): Promise<ld.LDFlagSet> {
  const client = await getLaunchDarklyClient();
  return await client.allFlagsState({ kind: 'user', ...user });
}
