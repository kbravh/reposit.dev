import { type ReactNode, useEffect } from 'react';
import { LDProvider, useLDClient } from 'launchdarkly-react-client-sdk';
import { getSession } from '../../actions/auth';

interface LaunchDarklyProviderProps {
  children: ReactNode;
  clientSideId: string;
  memberId: string;
}

function LaunchDarklyIdentifier({
  children,
  memberId,
}: {
  children: ReactNode;
  memberId: string;
}) {
  const ldClient = useLDClient();

  useEffect(() => {
    if (!ldClient) return;

    if (memberId) {
      ldClient.track(memberId);
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
  }, [ldClient, memberId]);

  return <>{children}</>;
}

export function LaunchDarklyProvider({
  children,
  clientSideId,
  memberId,
}: LaunchDarklyProviderProps) {
  return (
    <LDProvider
      clientSideID={clientSideId}
      context={{ kind: 'user', anonymous: true, key: 'anonymous' }}
    >
      <LaunchDarklyIdentifier memberId={memberId}>
        {children}
      </LaunchDarklyIdentifier>
    </LDProvider>
  );
}
