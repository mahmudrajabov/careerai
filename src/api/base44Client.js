// Standalone demo build — the platform client is replaced by a local demo shim.
// AuthContext consumes the same API surface, but everything resolves locally:
// no network calls, no Base44 SDK, no backend services.

export const base44 = {
  app: {
    getPublicSettings: async () => ({ id: 'demo', public_settings: {} }),
  },
  auth: {
    // No demo session until the user logs in via /login or /register.
    me: async () => {
      const err = new Error('Not authenticated');
      err.status = 401;
      throw err;
    },
    logout: () => {
      window.location.href = '/login';
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