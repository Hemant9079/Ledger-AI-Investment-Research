"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

const USER_KEY = "ledger_user";
const GUEST_COUNT_KEY = "ledger_guest_count";

export interface LedgerUser {
  name: string;
  email: string;
  loggedIn: boolean;
}

interface AuthContextValue {
  user: LedgerUser | null;
  isLoggedIn: boolean;
  login: (name: string, email: string) => void;
  logout: () => void;
  incrementGuestCount: () => void;
  getGuestCount: () => number;
  resetGuestCount: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LedgerUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(USER_KEY);
        if (raw) {
          const parsed: LedgerUser = JSON.parse(raw);
          if (parsed.loggedIn) setUser(parsed);
        }
      } catch {
        // ignore corrupt data
      }
    }
    setHydrated(true);
  }, []);

  const login = useCallback((name: string, email: string) => {
    const newUser: LedgerUser = { name: name || email.split("@")[0], email, loggedIn: true };
    if (typeof window !== "undefined") {
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    }
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(USER_KEY);
    }
    setUser(null);
  }, []);

  const getGuestCount = useCallback((): number => {
    if (typeof window === "undefined") return 0;
    return parseInt(localStorage.getItem(GUEST_COUNT_KEY) ?? "0", 10);
  }, []);

  const incrementGuestCount = useCallback(() => {
    if (typeof window === "undefined") return;
    const current = getGuestCount();
    localStorage.setItem(GUEST_COUNT_KEY, String(current + 1));
  }, [getGuestCount]);

  const resetGuestCount = useCallback(() => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(GUEST_COUNT_KEY);
  }, []);

  if (!hydrated) return null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user?.loggedIn,
        login,
        logout,
        incrementGuestCount,
        getGuestCount,
        resetGuestCount,
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
