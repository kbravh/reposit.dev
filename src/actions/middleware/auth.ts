import { createMiddleware } from '@tanstack/react-start';
import { auth } from '../../lib/auth';
import { getWebRequest } from '@tanstack/react-start/server';

export const authMiddleware = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    const response = await auth.api.getSession(getWebRequest());
    if (!response?.session) {
      throw new Error('Unauthorized');
    }
    return next({
      context: {
        session: response.session,
      },
    });
  }
);
