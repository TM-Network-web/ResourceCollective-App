
import { apiRequest } from "@/lib/api-client";
import { authStorage } from "@/lib/auth-storage";

export const authService = {
  async signup(userData) {
    return apiRequest("/api/auth/signup", {
      method: "POST",
      body: {
        full_name: userData.full_name,
        email: userData.email,
        password: userData.password,
      },
    });
  },

  async login(credentials) {
    const result = await apiRequest("/api/auth/login", {
      method: "POST",
      body: {
        email: credentials.email,
        password: credentials.password,
      },
    });

    if (!result?.user) {
      throw new Error("Invalid login response from server.");
    }

    authStorage.setUser(result.user);
    return result;
  },

  async getCurrentUser() {
    const result = await apiRequest("/api/auth/me");
    
    if (!result?.user) {
      authStorage.clear();
      throw new Error("No authenticated user found.");
    }

    authStorage.setUser(result.user);
    return result.user;
  },

  async logout() {
    await apiRequest("/api/auth/logout", {
      method: "POST",
    });

    authStorage.clear();
  },

  isAuthenticated() {
    return Boolean(authStorage.getUser());
  },

  getCurrentUserFromStorage() {
    return authStorage.getUser();
  },
};
