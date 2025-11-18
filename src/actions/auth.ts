import { createServerFn } from '@tanstack/react-start';
import { auth } from '../lib/auth';
import { getRequest } from '@tanstack/react-start/server';

export const getSession = createServerFn({
  method: 'GET',
}).handler(async () => {
  const request = getRequest();
  const session = await auth.api.getSession({ headers: request.headers });
  return session;
});

export const requireAuth = createServerFn({
  method: 'GET',
}).handler(async () => {
  const request = getRequest();
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    throw new Error('Authentication required');
  }

  return session;
});
