"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { authApi, clearTokens, UserResponse } from "./api";

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "vero_token";

interface AuthContextValue {
  user: UserResponse | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, role?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const me = await authApi.me();
      setUser(me);
    } catch {
      // Token invalid/expired
      clearTokens();
      setToken(null);
      setUser(null);
    }
  }, []);

  // Boot: restore token from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored) {
      setToken(stored);
      fetchMe().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [fetchMe]);

  const login = useCallback(async (email: string, password: string) => {
    const data = await authApi.login(email, password);
    setToken(data.access_token);
    const me = await authApi.me();
    setUser(me);
  }, []);

  const loginWithGoogle = useCallback(async (credential: string) => {
    const data = await authApi.googleLogin(credential);
    setToken(data.access_token);
    const me = await authApi.me();
    setUser(me);
  }, []);

  const register = useCallback(
    async (email: string, password: string, fullName: string, role = "customer") => {
      const data = await authApi.register({ email, password, full_name: fullName, role });
      // After register, log in to get token
      await login(email, password);
    },
    [login]
  );

  const logout = useCallback(async () => {
    // Clear local state and storage FIRST (synchronously) so the boot
    // effect cannot re-hydrate a stale session on the login page.
    clearTokens();
    setToken(null);
    setUser(null);
    // Then revoke the refresh token on the backend (best-effort).
    try {
      await authApi.logout();
    } catch {
      // Ignore – local session is already cleared.
    }
    window.location.href = "/login";
  }, []);

  const refreshUser = useCallback(async () => {
    await fetchMe();
  }, [fetchMe]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        login,
        loginWithGoogle,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

// ── Route guard helper ────────────────────────────────────────────────────────
// Determines where to send a user after login based on their role & onboarding state.
export function getDashboardPath(user: UserResponse): string {
  if (!user.onboarding_completed) {
    return "/setup";
  }
  if (user.role === "technician") {
    return "/dashboard/worker";
  }
  if (user.role === "admin") {
    return "/dashboard/admin";
  }
  if (user.role === "customer") {
    return "/dashboard/company";
  }
  return "/setup";
}

// ── Protected Route Wrapper ───────────────────────────────────────────────────
import { useRouter } from "next/navigation";

export function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace("/login");
      } else if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
        router.replace(getDashboardPath(user));
      } else if (!user?.onboarding_completed && window.location.pathname !== "/setup") {
        router.replace("/setup");
      }
    }
  }, [isLoading, isAuthenticated, user, router, allowedRoles]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-black">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    );
  }

  // If role isn't allowed, or onboarding incomplete (and we're not on setup page), it will redirect and show nothing
  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) return null;
  if (!user?.onboarding_completed && window.location.pathname !== "/setup") return null;

  return <>{children}</>;
}
