import { type ComponentType, type ReactNode, useEffect, useState } from 'react';
import { withLDProvider, type LDContext } from 'launchdarkly-react-client-sdk';
import { getSession } from '../../actions/auth';

interface LaunchDarklyProviderProps {
  children: ReactNode;
  clientSideId: string;
}

function LaunchDarklyProviderInner({
  children,
  clientSideId,
}: LaunchDarklyProviderProps) {
  const [LDProvider, setLDProvider] = useState<ComponentType<{
    children: ReactNode;
  }> | null>(null);

  useEffect(() => {
    async function setupLaunchDarkly() {
      const session = await getSession();

      const context: LDContext = session?.user
        ? {
            kind: 'user',
            key: session.user.id,
            email: session.user.email,
            name: session.user.name,
          }
        : {
            kind: 'user',
            anonymous: true,
            key: 'anonymous',
          };

      const Provider = withLDProvider({
        clientSideID: clientSideId,
        context,
        options: {
          bootstrap: 'localStorage',
          streaming: true,
        },
      })(({ children }) => <>{children}</>);

      setLDProvider(() => Provider);
    }

    setupLaunchDarkly();
  }, [clientSideId]);

  if (!LDProvider) {
    return <>{children}</>;
  }

  return <LDProvider>{children}</LDProvider>;
}

export function LaunchDarklyProvider({
  children,
  clientSideId,
}: LaunchDarklyProviderProps) {
  return (
    <LaunchDarklyProviderInner clientSideId={clientSideId}>
      {children}
    </LaunchDarklyProviderInner>
  );
}
