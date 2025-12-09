'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function getPasswordStrength(pwd: string) {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    const levels = [
      { label: 'Too weak', width: 'w-1/4', bar: 'bg-red-500' },
      { label: 'Weak', width: 'w-2/4', bar: 'bg-orange-500' },
      { label: 'Good', width: 'w-3/4', bar: 'bg-yellow-500' },
      { label: 'Strong', width: 'w-full', bar: 'bg-green-500' },
    ];

    if (!pwd) return null;
    return levels[Math.min(score - 1, levels.length - 1)];
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Signup failed');

      router.push('/login');
  } catch (err: unknown) {
  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError('Something went wrong');
  }
}
  }

  const strength = getPasswordStrength(password);

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950 text-slate-100">
      {/* Background gradient blobs */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-green-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-emerald-500/25 blur-3xl" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-5xl rounded-3xl border border-white/10 bg-slate-900/80 shadow-[0_0_80px_rgba(16,185,129,0.25)] backdrop-blur-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* LEFT SIDE – Branding / Hero */}
            <div className="relative hidden flex-col justify-between border-r border-white/10 p-8 md:flex">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs font-medium tracking-wide uppercase">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  New here? Let’s get started
                </div>

                <div>
                  <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
                    Create your account &nbsp;
                    <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-cyan-300 bg-clip-text text-transparent">
                      in seconds
                    </span>
                  </h1>
                  <p className="mt-3 text-sm text-slate-300/80">
                    Join the platform and unlock a smarter way to manage your journey.
                    Stay connected, secure and always in control.
                  </p>
                </div>

                <ul className="space-y-3 text-sm text-slate-200/90">
                  <li className="flex items-start gap-2">
                    <span className="mt-[3px] h-4 w-4 rounded-full bg-emerald-400/15 text-[10px] flex items-center justify-center">
                      ✓
                    </span>
                    Instant access to your dashboard
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-[3px] h-4 w-4 rounded-full bg-emerald-400/15 text-[10px] flex items-center justify-center">
                      ✓
                    </span>
                    Secure authentication & encrypted sessions
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-[3px] h-4 w-4 rounded-full bg-emerald-400/15 text-[10px] flex items-center justify-center">
                      ✓
                    </span>
                    Personalized experience tailored to you
                  </li>
                </ul>
              </div>
               <Link
                        href="/guide-signup"
                        className="font-medium text-emerald-400 hover:text-emerald-300"
                      >
                        Signup as a Guide
                      </Link>

              <div className="mt-8 flex items-center justify-between text-xs text-slate-400">
                <p>Powered by your next-gen platform</p>
                <p className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Live · Secure · Always on
                </p>
              </div>
            </div>

            {/* RIGHT SIDE – Form */}
            <div className="p-6 sm:p-8">
              <div className="mb-6 flex items-center justify-between md:hidden">
                <div>
                  <h1 className="text-2xl font-semibold">Create account</h1>
                  <p className="text-xs text-slate-400">
                    Start your journey in less than a minute.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium uppercase tracking-wide text-slate-300">
                    Full name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Satvik Kushwaha"
                      className="block w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-sm outline-none transition-all placeholder:text-slate-500 focus:-translate-y-px focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium uppercase tracking-wide text-slate-300">
                    Email address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                      className="block w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-sm outline-none transition-all placeholder:text-slate-500 focus:-translate-y-px focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40"
                    />
                    <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs text-slate-500">
                      .com
                    </span>
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium uppercase tracking-wide text-slate-300">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Create a strong password"
                      className="block w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-sm outline-none transition-all placeholder:text-slate-500 focus:-translate-y-px focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-3 flex items-center rounded-xl px-2 text-[11px] font-medium text-slate-300 hover:bg-slate-800/80"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>

                  {/* Password strength meter */}
                  {strength && (
                    <div className="mt-1 space-y-1">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                        <div
                          className={`h-full rounded-full ${strength.bar} transition-all`}
                          style={{ width: '100%' }}
                        >
                          <div
                            className={`h-full rounded-full ${strength.bar} ${strength.width}`}
                          />
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Strength:&nbsp;
                        <span className="font-medium text-slate-200">
                          {strength.label}
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Error */}
                {error && (
                  <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                    {error}
                  </p>
                )}

                {/* Submit + login link */}
                <div className="mt-3 flex flex-col gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition-transform hover:scale-[1.02] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span className="absolute inset-0 bg-white/20 opacity-0 mix-blend-overlay blur-3xl transition-opacity group-hover:opacity-100" />
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-3 w-3 animate-spin rounded-full border-[2px] border-slate-900 border-t-transparent" />
                        Creating your account...
                      </span>
                    ) : (
                      <span>Create account</span>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <p>
                      Already have an account?{' '}
                      <Link
                        href="/login"
                        className="font-medium text-emerald-400 hover:text-emerald-300"
                      >
                        Log in
                      </Link>
                    </p>
                    <Link
                      href="/"
                      className="hover:text-slate-200 underline-offset-4 hover:underline"
                    >
                      Back to home
                    </Link>
                  </div>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 pt-3 text-[11px] text-slate-500">
                  <div className="h-px flex-1 bg-slate-800" />
                  <span>or continue with</span>
                  <div className="h-px flex-1 bg-slate-800" />
                </div>

                {/* Social buttons (dummy) */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/60 px-3 py-2 font-medium text-slate-200 hover:border-slate-500 hover:bg-slate-900"
                  >
                    <span className="text-lg">G</span>
                    Google
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/60 px-3 py-2 font-medium text-slate-200 hover:border-slate-500 hover:bg-slate-900"
                  >
                    <span className="text-lg"></span>
                    Apple
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
