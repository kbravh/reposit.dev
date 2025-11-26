import * as Sentry from '@sentry/node';

// Initialize Sentry for server-side error tracking and performance monitoring
Sentry.init({
  dsn: 'https://bf06560f5ce6237f676e09fdcefd114a@o296138.ingest.us.sentry.io/4509703861764096',

  // Environment configuration
  environment: process.env.NODE_ENV || 'production',

  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of transactions for performance monitoring

  // Send default PII data (IP addresses, user info)
  sendDefaultPii: true,

  // Enable debugging in development
  debug: process.env.NODE_ENV === 'development',

  // Add custom context to all events
  beforeSend: event => {
    // Add server-specific context
    event.tags = {
      ...event.tags,
      server: true,
      runtime: 'node',
    };

    return event;
  },
});
