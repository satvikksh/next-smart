'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';

/**
 * Guide Login UI — Dark themed, two-column layout
 * - Place as /app/guide-login/page.tsx
 * - Requires Tailwind CSS
 * - Uses localStorage safely (wrapped with window checks)
 * - Replace handleAuth with real API call in production
 */

export default function GuideLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = (searchParams?.get('returnUrl') as string) || '/find-guide';

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // safe localStorage read
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const t = window.localStorage.getItem('auth_token');
        if (t) router.push(returnUrl);
      }
    } catch (e) {
      // ignore
    }
  }, [router, returnUrl]);

  function passwordStrength(pw: string) {
    if (!pw) return { text: 'Empty', score: 0 };
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return { 
      text: score <= 1 ? 'Weak' : score === 2 ? 'Fair' : score === 3 ? 'Good' : 'Strong', 
      score 
    };
  }

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    if (!emailOrPhone.trim() || !password) {
      setMessage('Please enter credentials');
      return;
    }
    setLoading(true);
    try {
      // TODO: replace with real API call POST /api/auth/login
      await new Promise((r) => setTimeout(r, 700));

      // mock success
      const token = 'mock-token-xyz';
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem('auth_token', token);
          window.localStorage.setItem('auth_user', JSON.stringify({ email: emailOrPhone }));
        }
      } catch (err) {}

      // redirect preserving query (e.g., book action)
      const params = typeof window !== 'undefined' ? window.location.search : '';
      router.push(returnUrl + params);
    } catch (err) {
      setMessage('Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  }

  const strength = passwordStrength(password);
  const strengthPct = Math.min(100, (strength.score / 4) * 100);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#031018] to-[#071425] flex items-center justify-center p-6">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
       {/* LEFT HERO (Guide-focused copy) */}
<div className="hidden lg:flex flex-col justify-center rounded-2xl bg-gradient-to-br from-[#081825]/60 to-transparent p-12 border border-white/6 shadow-xl overflow-hidden">
  <div className="max-w-lg">
    <span className="inline-block px-3 py-1 rounded-full bg-emerald-900/40 text-emerald-300 text-xs font-medium">NEW HERE? WELCOME GUIDES</span>

    <h1 className="mt-6 text-5xl font-extrabold leading-tight text-white">
      Login to manage your <span className="text-emerald-400">guide profile</span>
    </h1>

    <p className="mt-4 text-slate-300">
      Access bookings, manage availability, and connect with travellers. Keep your profile verified, set your rates, and deliver memorable trips.
    </p>

    <ul className="mt-8 space-y-4 text-slate-300">
      <li className="flex items-start gap-3">
        <span className="w-7 h-7 rounded-full bg-emerald-900/40 flex items-center justify-center text-emerald-400">✓</span>
        <span>Manage bookings & schedules in one place</span>
      </li>
      <li className="flex items-start gap-3">
        <span className="w-7 h-7 rounded-full bg-emerald-900/40 flex items-center justify-center text-emerald-400">✓</span>
        <span>Get verified for higher traveller trust</span>
      </li>
      <li className="flex items-start gap-3">
        <span className="w-7 h-7 rounded-full bg-emerald-900/40 flex items-center justify-center text-emerald-400">✓</span>
        <span>Set your daily charge, manage payouts & offers</span>
      </li>
    </ul>

    <div className="mt-10 text-emerald-300">
      <Link href="/guide-signup" className="font-medium underline">Create or update your guide profile</Link>
    </div>
  </div>
</div>


        {/* RIGHT FORM */}
        <div className="rounded-2xl bg-[#07121a]/80 p-8 border border-white/6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-300 hover:text-white">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <Link href="/" className="text-slate-400 text-sm hover:underline">Back to home</Link>
          </div>

          <h2 className="text-2xl text-white font-bold">Sign in to your account</h2>
          <p className="mt-2 text-sm text-slate-400">Welcome back — please enter your details.</p>

          <form onSubmit={handleAuth} className="mt-6 space-y-4">
            {/* Email */}
            <div>
              <label className="text-sm text-slate-300 block mb-2">Email address</label>
              <div className="relative">
                <input
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="w-full rounded-full px-5 py-3 bg-[#0b1822] border border-white/6 placeholder:text-slate-500 text-slate-100 focus:ring-2 focus:ring-emerald-400 outline-none"
                  placeholder="you@example.com or +91 98765 43210"
                />
                <Mail className="absolute right-4 top-3.5 text-slate-400" />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-slate-300">Password</label>
                <Link href="#" onClick={(e) => e.preventDefault()} className="text-sm text-emerald-400 hover:underline">Forgot?</Link>
              </div>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-full px-5 py-3 bg-[#0b1822] border border-white/6 placeholder:text-slate-500 text-slate-100 focus:ring-2 focus:ring-amber-400 outline-none"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-4 top-3.5 text-slate-400">
                  {showPass ? <EyeOff /> : <Eye />}
                </button>
              </div>

              {/* strength bar */}
              <div className="mt-3">
                <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                  <div
                    style={{ width: `${strengthPct}%` }}
                    className={`h-full rounded-full ${strength.score <= 1 ? 'bg-rose-400' : strength.score === 2 ? 'bg-yellow-400' : strength.score === 3 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                  />
                </div>
                <div className="mt-1 text-xs text-slate-400">Strength: <span className="font-semibold text-slate-100">{strength.text}</span></div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 text-slate-300">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="w-4 h-4 rounded border-white/6 bg-transparent" />
                <span className="text-sm">Remember me</span>
              </label>
            </div>

            {message && <div className="text-sm text-rose-400">{message}</div>}

            {/* CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-1 rounded-full px-6 py-3 bg-gradient-to-r from-emerald-400 to-sky-400 text-black font-semibold text-lg shadow-md hover:scale-[1.01] transition-transform disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

            <div className="text-center text-sm text-slate-400 mt-3">
              Don't have an account? <Link href="/guide-signup" className="text-emerald-400 underline">Sign up as a Guide</Link>
            </div>

            <div className="mt-4 border-t border-white/6 pt-4 text-center">
              <div className="text-xs text-slate-400 mb-3">or continue with</div>
              <div className="flex gap-3 justify-center">
                <button type="button" className="flex items-center gap-3 px-6 py-2 rounded-full border border-white/6 bg-[#0b1822] hover:bg-[#0c1b25]">
                  <span className="text-sm">G</span>
                  <span className="text-sm text-slate-200">Google</span>
                </button>
                <button type="button" className="flex items-center gap-3 px-6 py-2 rounded-full border border-white/6 bg-[#0b1822] hover:bg-[#0c1b25]">
                  <span className="text-sm"></span>
                  <span className="text-sm text-slate-200">Apple</span>
                </button>
              </div>
            </div>
          </form>

          <div className="mt-6 text-xs text-slate-500 text-center">
            By signing in you agree to our <Link href="#" className="text-emerald-400 underline">Terms</Link> and <Link href="#" className="text-emerald-400 underline">Privacy</Link>.
          </div>
        </div>
      </div>
    </main>
  );
}
