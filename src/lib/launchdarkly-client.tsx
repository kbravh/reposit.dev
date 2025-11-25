import {
  asyncWithLDProvider,
  type LDContext,
} from 'launchdarkly-react-client-sdk';

export interface LaunchDarklyConfig {
  clientSideId: string;
  context?: LDContext;
}

export async function initializeLaunchDarkly(config: LaunchDarklyConfig) {
  const { clientSideId, context } = config;

  const defaultContext: LDContext = context || {
    kind: 'user',
    anonymous: true,
    key: 'anonymous',
  };

  const LDProvider = await asyncWithLDProvider({
    clientSideID: clientSideId,
    context: defaultContext,
    options: {
      bootstrap: 'localStorage',
      streaming: true,
    },
  });

  return LDProvider;
}
