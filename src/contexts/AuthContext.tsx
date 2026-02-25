import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api } from "@/lib/apiClient";

type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  role: "admin" | "artisan" | "user" | "visitor";
  status?: "pending" | "accepted" | "rejected" | "suspended";
  recommended?: boolean;
  shopName?: string;
  shopAddress?: string;
  cin?: string;
  artisanCode?: string;
  email?: string;
};

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (emailOrCode: string, password: string) => Promise<void>;
  registerArtisan: (payload: {
    firstName: string;
    lastName: string;
    cin: string;
    shopAddress: string;
    shopName: string;
    email?: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  refreshMe: () => Promise<void>;
};

const TOKEN_KEY = "fes-auth-token";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    }
  }, [token]);

  const refreshMe = async () => {
    if (!token) return;
    try {
      const result = await api.get<{ user: AuthUser }>("/api/auth/me", token);
      setUser(result.user);
    } catch {
      // Avoid unhandled promise rejection when API is unavailable or token expired.
      setUser(null);
    }
  };

  useEffect(() => {
    void refreshMe();
  }, [token]);

  const login = async (emailOrCode: string, password: string) => {
    const result = await api.post<{ token: string; user: AuthUser }>(
      "/api/auth/login",
      { emailOrCode, password },
      null,
    );
    setToken(result.token);
    setUser(result.user);
  };

  const registerArtisan: AuthContextValue["registerArtisan"] = async (payload) => {
    const result = await api.post<{ token: string; user: AuthUser }>("/api/auth/register-artisan", payload, null);
    setToken(result.token);
    setUser(result.user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      login,
      registerArtisan,
      logout,
      refreshMe,
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth doit etre utilise dans AuthProvider.");
  }
  return ctx;
};
