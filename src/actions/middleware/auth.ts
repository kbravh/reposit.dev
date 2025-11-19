import { createMiddleware } from '@tanstack/react-start';
import { getAuth } from '../../lib/auth';
import { getRequest } from '@tanstack/react-start/server';

export const authMiddleware = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    const response = await getAuth().api.getSession(getRequest());
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
