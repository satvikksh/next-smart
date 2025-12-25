// app/context/UserContext.tsx
'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

/* ----------------------------- Types ----------------------------- */

export type User = {
  _id: string;
  name?: string;
  username?: string;
  email?: string;
  role?: string;
} | null;

export type LoginResult =
  | { success: true }
  | { success: false; message: string };

export type UserContextValue = {
  user: User;
  loading: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

/* ---------------------------- Context ---------------------------- */

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return ctx;
}

/* ---------------------------- Provider --------------------------- */

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  // Used to cancel outdated requests (important on fast route changes)
  const abortRef = useRef<AbortController | null>(null);

  /* ---------------------------- Helpers --------------------------- */

  const apiFetch = useCallback(async (input: RequestInfo, init?: RequestInit) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    return fetch(input, {
      ...init,
      credentials: 'include',
      signal: controller.signal,
    });
  }, []);

  /* ---------------------------- Refresh --------------------------- */

  const refresh = useCallback(async () => {
    setLoading(true);

    try {
      const res = await apiFetch('/api/auth/me', { method: 'GET' });

      if (!res.ok) {
        setUser(null);
        return;
      }

      const data = await res.json();
      setUser(data?.user ?? null);
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        console.error('[auth] refresh failed', err);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, [apiFetch]);

  /* ----------------------------- Login ---------------------------- */

  const login = useCallback(
    async (email: string, password: string): Promise<LoginResult> => {
      try {
        const base =
          typeof window !== 'undefined'
            ? process.env.NEXT_PUBLIC_API_URL ?? ''
            : '';

        const url = base
          ? `${base.replace(/\/$/, '')}/api/auth/login`
          : '/api/auth/login';

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          return {
            success: false,
            message: data?.message || data?.error || 'Login failed',
          };
        }

        await refresh();
        return { success: true };
      } catch (err: any) {
        console.error('[auth] login error', err);
        return {
          success: false,
          message: err?.message || 'Network error',
        };
      }
    },
    [refresh]
  );

  /* ----------------------------- Logout --------------------------- */

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('[auth] logout failed', err);
    } finally {
      setUser(null);
    }
  }, []);

  /* ----------------------------- Mount ---------------------------- */

  useEffect(() => {
    refresh();
    return () => abortRef.current?.abort();
  }, [refresh]);

  /* ----------------------------- Value ---------------------------- */

  const value = useMemo<UserContextValue>(
    () => ({
      user,
      loading,
      isLoggedIn: Boolean(user),
      login,
      logout,
      refresh,
    }),
    [user, loading, login, logout, refresh]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
