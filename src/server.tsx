import {
  createStartHandler,
  defaultStreamHandler,
} from '@tanstack/react-start/server';
import * as Sentry from '@sentry/tanstackstart-react';
import type { RequestHandler } from '@tanstack/react-start/server';
import type { Register } from '@tanstack/react-router';

// Verify that the environment variables are set
import './env';

Sentry.init({
  dsn: 'https://bf06560f5ce6237f676e09fdcefd114a@o296138.ingest.us.sentry.io/4509703861764096',

  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
  environment: import.meta.env.MODE,
});

const fetch = createStartHandler(
  Sentry.wrapStreamHandlerWithSentry(defaultStreamHandler)
);

export type ServerEntry = { fetch: RequestHandler<Register> };

export function createServerEntry(entry: ServerEntry): ServerEntry {
  return {
    async fetch(...args) {
      return await entry.fetch(...args);
    },
  };
}

// eslint-disable-next-line react-refresh/only-export-components
export default createServerEntry({ fetch });
