// Standalone demo auth — persisted in localStorage. No backend required.
const USER_KEY = "careerai.demoUser";

export function getDemoUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
}

export function demoLogin({ name, email }) {
  const user = {
    id: "demo-user",
    email: (email || "").trim() || "demo@careerai.app",
    full_name: (name || "").trim() || "Demo User",
    role: "admin",
    created_date: new Date().toISOString(),
  };
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}

export function demoLogout() {
  localStorage.removeItem(USER_KEY);
}