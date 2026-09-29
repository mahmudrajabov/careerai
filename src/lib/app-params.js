// Standalone demo build — no platform runtime params required.
// `token` is backed by the local demo session so the platform AuthContext
// treats the demo login as an authenticated session.

function hasDemoUser() {
  try {
    return !!localStorage.getItem("careerai.demoUser");
  } catch {
    return false;
  }
}

export const appParams = {
  appId: null,
  get token() {
    return hasDemoUser() ? "demo-token" : null;
  },
  functionsVersion: null,
  appBaseUrl: '',
};