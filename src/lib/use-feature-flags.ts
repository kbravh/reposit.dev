import {
  useFlags,
  useLDClient,
  type LDClient,
} from 'launchdarkly-react-client-sdk';

export interface FeatureFlags {
  [key: string]: boolean | string | number | object;
}

export function useFeatureFlags(): FeatureFlags {
  return useFlags();
}

export function useFeatureFlag<T = boolean>(
  flagKey: string,
  defaultValue: T,
): T {
  const flags = useFlags();
  return (flags[flagKey] as T) ?? defaultValue;
}

export function useLDClientInstance(): LDClient | undefined {
  return useLDClient();
}
