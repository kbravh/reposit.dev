import {
  createStartHandler,
  defaultStreamHandler,
  defineHandlerCallback,
} from '@tanstack/react-start/server';
import * as Sentry from '@sentry/tanstackstart-react';

// Verify that the environment variables are set
import './env';

const customHandler = defineHandlerCallback(ctx => {
  return Sentry.wrapStreamHandlerWithSentry(defaultStreamHandler)(ctx);
});

export const fetch = createStartHandler(customHandler);

export default { fetch };

Sentry.init({
  dsn: 'https://bf06560f5ce6237f676e09fdcefd114a@o296138.ingest.us.sentry.io/4509703861764096',

  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
  environment: import.meta.env.MODE,
});
