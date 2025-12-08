// app/context/UserContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type User = {
  _id?: string;
  name?: string;
  username?: string;
  email?: string;
  role?: string;
  // add other public user fields you expect
} | null;

type LoginResult = { success: true } | { success: false; message?: string };

type UserContextValue = {
  user: User;
  loading: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within a UserProvider');
  return ctx;
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState<boolean>(true);

  async function refresh() {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/me', { method: 'GET', credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user ?? null);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('refresh user failed', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // run once on mount
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

async function login(
  email: string,
  password: string
): Promise<{ success: boolean; message?: string }> {
  try {
    // Prefer NEXT_PUBLIC_API_URL when set (production), else use relative path in dev
    const basePublic = typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_API_URL ?? '') : '';
    const url = basePublic
      ? `${basePublic.replace(/\/$/, '')}/api/auth/login`
      : '/api/auth/login';

    // debug: print URL to console so you can confirm what client is requesting
    console.info('[login] POST ->', url);

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    // debug: log status and url
    console.info('[login] response status', res.status, res.statusText);

    // try to parse JSON safely
    const data = await res.json().catch(() => ({} as any));

    if (res.ok) {
      await refresh(); // refresh user data
      return { success: true };
    }

    return { success: false, message: data?.message || data?.error || `HTTP ${res.status}` };
  } catch (err: any) {
    console.error('[login] network/error', err);
    return { success: false, message: err?.message || 'Network error' };
  }
}


// in app/context/UserContext.tsx or similar
async function logout() {
  try {
    // POST to logout route
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    // refresh user state (this will call /api/auth/me and get null)
    await refresh();

    // optional: redirect to home or login
    // router.push('/');
  } catch (err) {
    console.error("logout failed", err);
  }
}

  const value: UserContextValue = {
    user,
    loading,
    isLoggedIn: !!user,
    login,
    logout,
    refresh,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
