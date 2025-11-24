import { createServerFn } from '@tanstack/react-start';
import { getAuth } from '../lib/auth';
import { getRequest } from '@tanstack/react-start/server';

export const getSession = createServerFn({
  method: 'GET',
}).handler(async () => {
  const Sentry = await import('@sentry/node');
  try {
    Sentry.addBreadcrumb({
      category: 'auth',
      message: 'Retrieving user session',
      level: 'info',
    });

    const request = getRequest();
    const session = await getAuth().api.getSession({
      headers: request.headers,
    });

    // Set user context for Sentry if session exists
    if (session?.user) {
      Sentry.setUser({
        id: session.user.id,
        email: session.user.email,
        username: session.user.name,
      });
    }

    return session;
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        action: 'getSession',
        component: 'auth',
      },
    });
    throw error;
  }
});

export const requireAuth = createServerFn({
  method: 'GET',
}).handler(async () => {
  const Sentry = await import('@sentry/node');
  try {
    Sentry.addBreadcrumb({
      category: 'auth',
      message: 'Checking authentication requirement',
      level: 'info',
    });

    const request = getRequest();
    const session = await getAuth().api.getSession({
      headers: request.headers,
    });

    if (!session) {
      Sentry.addBreadcrumb({
        category: 'auth',
        message: 'Authentication failed - no session found',
        level: 'warning',
      });

      const error = new Error('Authentication required');
      Sentry.captureException(error, {
        tags: {
          action: 'requireAuth',
          component: 'auth',
          reason: 'no_session',
        },
        level: 'warning',
      });

      throw error;
    }

    // Set user context for Sentry
    if (session.user) {
      Sentry.setUser({
        id: session.user.id,
        email: session.user.email,
        username: session.user.name,
      });
    }

    return session;
  } catch (error) {
    // Only capture if not already captured above
    if (
      !(error instanceof Error && error.message === 'Authentication required')
    ) {
      Sentry.captureException(error, {
        tags: {
          action: 'requireAuth',
          component: 'auth',
        },
      });
    }
    throw error;
  }
});
