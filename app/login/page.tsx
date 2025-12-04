'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, AlertCircle, Check } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // TODO: replace with your real /api/auth/login call
    await new Promise((resolve) => setTimeout(resolve, 1200));

    try {
      if (email && password.length >= 6) {
        router.push('/dashboard');
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-8">
      {/* subtle background glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-32 -left-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left panel - brand / info (like register page) */}
        <section className="hidden md:flex flex-col justify-center gap-4 rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-lg">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-slate-900/70 px-3 py-1 text-[11px] font-medium text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            S.M.A.R.T. • Smart Monitoring & Response for Tourist
          </div>

          <h1 className="text-3xl font-bold text-slate-50 tracking-tight">
            Welcome back to <span className="text-emerald-400">S.M.A.R.T.</span>
          </h1>

          <p className="text-sm text-slate-400 max-w-md">
            Sign in to manage your trips, view your digital tourist IDs, and connect with your
            trusted guides across India.
          </p>

          <ul className="mt-2 space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Continue existing bookings and view all your guide confirmations in one place.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Access your secure digital tourist IDs for every S.M.A.R.T. journey.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Stay notified with real-time updates from guides and safety alerts.
            </li>
          </ul>

          <p className="mt-4 text-xs text-slate-500">
            New here?{' '}
            <Link
              href="/register"
              className="text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              Create an account
            </Link>{' '}
            in a few seconds.
          </p>
        </section>

        {/* Right panel - actual login form */}
        <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <header className="mb-6 text-center md:text-left">
            <h2 className="text-2xl font-semibold text-slate-50">Sign in</h2>
            <p className="mt-1 text-xs text-slate-400">
              Use your registered email and password to log in.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-300">
                Email address
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-4 w-4 text-slate-500" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 pl-9 pr-9 py-2.5 text-sm text-slate-100 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="you@example.com"
                />
                {email && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Check className="h-4 w-4 text-emerald-400" />
                  </span>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-slate-300">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] text-emerald-400 hover:text-emerald-300"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-4 w-4 text-slate-500" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 pl-9 pr-9 py-2.5 text-sm text-slate-100 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2">
                <AlertCircle className="h-4 w-4 text-red-400 mt-0.5" />
                <p className="text-xs text-red-200">{error}</p>
              </div>
            )}

            {/* Remember + submit */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border-slate-600 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
                />
                <span>Keep me signed in</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60 transition"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 pt-1">
              <div className="h-px flex-1 bg-slate-800" />
              <span className="text-[11px] text-slate-500">or</span>
              <div className="h-px flex-1 bg-slate-800" />
            </div>

            {/* Social login (optional) */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { name: 'Google', label: 'G' },
                { name: 'GitHub', label: 'GH' },
                { name: 'X', label: 'X' },
              ].map((p) => (
                <button
                  key={p.name}
                  type="button"
                  className="flex items-center justify-center rounded-lg border border-slate-700 bg-slate-950/80 px-2 py-2 text-xs font-medium text-slate-200 hover:border-emerald-400 hover:text-emerald-300 transition"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Register link */}
            <p className="pt-1 text-center text-xs text-slate-400">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="font-semibold text-emerald-400 hover:text-emerald-300"
              >
                Create one
              </Link>
            </p>
          </form>

          <p className="mt-4 text-[11px] text-center text-slate-500">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-slate-300">
              Terms
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline hover:text-slate-300">
              Privacy Policy
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
