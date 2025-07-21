import { sentryGlobalServerMiddlewareHandler } from '@sentry/tanstackstart-react';
import { createMiddleware } from '@tanstack/react-start';

export const sentryMiddleware = createMiddleware({ type: 'request' }).server(
  sentryGlobalServerMiddlewareHandler()
);
