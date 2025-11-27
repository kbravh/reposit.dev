import { type ReactNode, useEffect } from 'react';
import { LDProvider, useLDClient } from 'launchdarkly-react-client-sdk';
import { getSession } from '../../actions/auth';

interface LaunchDarklyProviderProps {
  children: ReactNode;
  clientSideId: string;
}

function LaunchDarklyIdentifier({
  children,
  clientSideId,
}: {
  children: ReactNode;
  clientSideId: string;
}) {
  const ldClient = useLDClient();

  useEffect(() => {
    if (!ldClient) return;

    if (clientSideId) {
      ldClient.track(clientSideId);
    }

    async function identifyUser() {
      const session = await getSession();

      if (session?.user && ldClient) {
        await ldClient.identify({
          kind: 'user',
          key: session.user.id,
          email: session.user.email,
          name: session.user.name,
        });
      }
    }

    identifyUser();
  }, [ldClient, clientSideId]);

  return <>{children}</>;
}

export function LaunchDarklyProvider({
  children,
  clientSideId,
}: LaunchDarklyProviderProps) {
  return (
    <LDProvider
      clientSideID={clientSideId}
      context={{ kind: 'user', anonymous: true, key: 'anonymous' }}
    >
      <LaunchDarklyIdentifier clientSideId={clientSideId}>
        {children}
      </LaunchDarklyIdentifier>
    </LDProvider>
  );
}
