// Standalone demo build — the platform client is replaced by a local demo shim.
// AuthContext consumes the same API surface, but everything resolves locally:
// no network calls, no Base44 SDK, no backend services.

import { getDemoUser, demoLogout } from '@/lib/demoAuth';

export const base44 = {
  app: {
    getPublicSettings: async () => ({ id: 'demo', public_settings: {} }),
  },
  auth: {
    // Resolves with the local demo user when logged in, 401 otherwise.
    me: async () => {
      const user = getDemoUser();
      if (!user) {
        const err = new Error('Not authenticated');
        err.status = 401;
        throw err;
      }
      return user;
    },
    logout: () => {
      demoLogout();
    },
    redirectToLogin: () => {
      window.location.href = '/login';
    },
    loginViaEmailPassword: async () => {
      throw new Error('Demo mode — use the demo login form');
    },
    loginWithProvider: () => {
      window.location.href = '/login';
    },
    setToken: () => {},
  },
  users: {
    inviteUser: async () => {},
  },
};