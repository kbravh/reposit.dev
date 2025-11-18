import {
  createStartHandler,
  defaultStreamHandler,
  defineHandlerCallback,
} from '@tanstack/react-start/server';
import * as Sentry from '@sentry/tanstackstart-react';

// Verify that the environment variables are set
import './env';

// Create the request handler
const handler = createStartHandler(
  defineHandlerCallback(({ request, router, responseHeaders }) => {
    return Sentry.wrapStreamHandlerWithSentry(defaultStreamHandler)({
      request,
      router,
      responseHeaders,
    });
  })
);

// Export as an object with fetch method
// eslint-disable-next-line react-refresh/only-export-components
export default {
  fetch: handler,
};

Sentry.init({
  dsn: 'https://bf06560f5ce6237f676e09fdcefd114a@o296138.ingest.us.sentry.io/4509703861764096',

  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
  environment: import.meta.env.MODE,
});
