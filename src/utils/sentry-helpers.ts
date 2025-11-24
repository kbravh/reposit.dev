import * as Sentry from '@sentry/node';

/**
 * Logs a breadcrumb for tracking operations
 */
export function logBreadcrumb(params: {
  category: string;
  message: string;
  level?: 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug';
  data?: Record<string, unknown>;
}) {
  Sentry.addBreadcrumb({
    category: params.category,
    message: params.message,
    level: params.level || 'info',
    data: params.data,
  });
}

/**
 * Captures an exception with context
 */
export function captureError(
  error: unknown,
  context: {
    action: string;
    component: string;
    userId?: string;
    extra?: Record<string, unknown>;
    level?: 'fatal' | 'error' | 'warning';
  }
) {
  Sentry.captureException(error, {
    tags: {
      action: context.action,
      component: context.component,
      ...(context.userId && { userId: context.userId }),
    },
    extra: context.extra,
    level: context.level || 'error',
  });
}

/**
 * Sets user context for Sentry
 */
export function setUserContext(user: {
  id: string;
  email: string;
  username?: string | null;
}) {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.username || undefined,
  });
}
