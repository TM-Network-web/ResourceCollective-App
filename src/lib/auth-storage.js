
const USER_KEY = "studyshare_user";

export const authStorage = {
  getUser() {
    if (typeof window === "undefined") return null;

    const user = localStorage.getItem(USER_KEY);

    if (!user) return null;

    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  },

  setUser(user) {
    if (typeof window === "undefined") return;

    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  setSession(user) {
    this.setUser(user);
  },

  clear() {
    if (typeof window === "undefined") return;

    localStorage.removeItem(USER_KEY);
  },

  clearSession() {
    this.clear();
  },
};
