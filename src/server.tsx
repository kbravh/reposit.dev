import {
  createStartHandler,
  defaultStreamHandler,
} from '@tanstack/react-start/server';
import { createRouter } from './router';
import * as Sentry from '@sentry/tanstackstart-react';

// eslint-disable-next-line react-refresh/only-export-components
export default createStartHandler({
  createRouter,
})(Sentry.wrapStreamHandlerWithSentry(defaultStreamHandler));

Sentry.init({
  dsn: 'https://bf06560f5ce6237f676e09fdcefd114a@o296138.ingest.us.sentry.io/4509703861764096',

  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
  environment: import.meta.env.MODE,
});
