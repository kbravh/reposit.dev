/**
 * Logs a breadcrumb for tracking operations
 */
export async function logBreadcrumb(params: {
  category: string;
  message: string;
  level?: 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug';
  data?: Record<string, unknown>;
}) {
  const Sentry = await import('@sentry/node');
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
export async function captureError(
  error: unknown,
  context: {
    action: string;
    component: string;
    userId?: string;
    extra?: Record<string, unknown>;
    level?: 'fatal' | 'error' | 'warning';
  }
) {
  const Sentry = await import('@sentry/node');
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
export async function setUserContext(user: {
  id: string;
  email: string;
  username?: string | null;
}) {
  const Sentry = await import('@sentry/node');
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.username || undefined,
  });
}
