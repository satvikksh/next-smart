// app/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowLeft,
  UserPlus,
  Check,
} from 'lucide-react';
import { useUser } from '../context/UserContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoggedIn } = useUser();

  // Get return URL and action from query params
  const returnUrl = searchParams?.get('returnUrl') || '/';
  const action = searchParams?.get('action');
  const guideId = searchParams?.get('guideId');

  useEffect(() => {
    const storedAction = typeof window !== 'undefined' ? localStorage.getItem('pending_action') : null;
    if (storedAction) setPendingAction(JSON.parse(storedAction));
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      handlePostLoginRedirect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  const handlePostLoginRedirect = () => {
    localStorage.removeItem('pending_action');

    if (action === 'book_guide' && guideId) {
      router.push(`/find-guide?book=${guideId}`);
    } else if (pendingAction?.action === 'book_guide') {
      router.push('/find-guide');
    } else {
      router.push(returnUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.message || 'Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#021017] via-[#071722] to-[#042027] py-16 relative overflow-hidden">
      {/* Decorative glow shapes */}
      <div className="pointer-events-none absolute -left-56 -top-40 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-[#002b2b]/30 to-transparent blur-3xl animate-blob" />
      <div className="pointer-events-none absolute -right-56 -bottom-40 w-[520px] h-[520px] rounded-full bg-gradient-to-bl from-[#00323a]/20 to-transparent blur-3xl animate-blob animation-delay-2000" />

      <div className="relative w-full max-w-6xl mx-auto px-6">
        {/* Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[rgba(6,10,12,0.65)] border border-[rgba(255,255,255,0.03)] shadow-[0_20px_60px_rgba(2,8,12,0.7)] rounded-2xl overflow-hidden backdrop-blur-md">
          {/* LEFT HERO */}
          <div className="p-10 lg:p-16 bg-[linear-gradient(90deg,rgba(7,21,28,0.55),rgba(2,12,15,0.2))]">
            <div className="max-w-lg">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-gradient-to-r from-emerald-500/10 to-cyan-400/10 text-emerald-300 border border-emerald-500/10 mb-6">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                NEW HERE? LET'S GET STARTED
              </span>

              <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
                Login your account <span className="text-emerald-400">in seconds</span>
              </h1>

              <p className="text-slate-300 mb-8">
                Join the platform and unlock a smarter way to manage your journey.
                Stay connected, secure and always in control.
              </p>

              <ul className="space-y-4 text-slate-300">
                <li className="flex items-center gap-3">
                  <span className="rounded-full bg-emerald-500/10 p-2 text-emerald-400">
                    <Check className="w-4 h-4" />
                  </span>
                  <span>Instant access to your dashboard</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="rounded-full bg-emerald-500/10 p-2 text-emerald-400">
                    <Check className="w-4 h-4" />
                  </span>
                  <span>Secure authentication & encrypted sessions</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="rounded-full bg-emerald-500/10 p-2 text-emerald-400">
                    <Check className="w-4 h-4" />
                  </span>
                  <span>Personalized experience tailored to you</span>
                </li>
              </ul>
              <br />
 <Link
                  href={`/guide/dashboard?returnUrl=${encodeURIComponent(returnUrl ?? '/')}${action ? `&action=${action}` : ''}`}
                  className="text-emerald-300 hover:underline font-medium"
                >
                  Login as a Guide
                </Link>





              <div className="mt-10 text-sm text-slate-400 flex items-center justify-between">
                <div>Powered by your next-gen platform</div>
                <div className="flex items-center gap-2 text-emerald-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" /> Live · Secure · Always on
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="p-8 lg:p-12">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center gap-2 text-slate-300 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              <Link href="/" className="text-xs text-slate-400 hover:text-white">Back to home</Link>
            </div>

            {pendingAction && (
              <div className="mb-6 bg-amber-900/10 border border-amber-700/10 rounded-lg p-3 text-amber-200">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-800/30 rounded-full p-2">
                    <UserPlus className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-amber-100">Complete your booking</div>
                    <div className="text-xs text-amber-200">Login to book {pendingAction.guideName || 'your selected guide'}</div>
                  </div>
                </div>
              </div>
            )}

            {action === 'book_guide' && !pendingAction && (
              <div className="mb-6 bg-amber-900/6 border border-amber-700/6 rounded-lg p-3 text-amber-200">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                  <div>
                    <div className="text-sm font-medium text-amber-100">Login Required</div>
                    <div className="text-xs text-amber-200">You need to login to book guides on GuideConnect</div>
                  </div>
                </div>
              </div>
            )}

            <h2 className="text-2xl text-white font-bold mb-4">Sign in to your account</h2>
            <p className="text-sm text-slate-400 mb-6">Welcome back — please enter your details.</p>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-900/20 border border-red-800/10 text-red-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <div className="text-sm">{error}</div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 mb-2 block">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-900/60 border border-slate-800 rounded-full placeholder:text-slate-500 text-slate-100 focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs text-slate-300">Password</label>
                  <Link href="/forgot-password" className="text-xs text-emerald-300 hover:underline">Forgot?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 bg-slate-900/60 border border-slate-800 rounded-full placeholder:text-slate-500 text-slate-100 focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* fake strength bar */}
                <div className="mt-2">
                  <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-amber-400" style={{ width: `${Math.min(password.length * 8, 100)}%` }} />
                  </div>
                  <div className="mt-1 text-xs text-slate-400">Strength: <span className="text-amber-200">Good</span></div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input id="remember" type="checkbox" className="w-4 h-4 rounded border-slate-700 text-emerald-400 focus:ring-emerald-400" />
                <label htmlFor="remember" className="text-sm text-slate-300">Remember me</label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-full font-semibold text-slate-900 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 hover:scale-[1.01] transition-transform"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div className="mt-6 text-center text-slate-400">
              <p className="text-sm">
                Don't have an account?{' '}
                <Link
                  href={`/register?returnUrl=${encodeURIComponent(returnUrl ?? '/')}${action ? `&action=${action}` : ''}`}
                  className="text-emerald-300 hover:underline font-medium"
                >
                  Sign up for free
                </Link>
              </p>
            </div>

            <div className="mt-6 border-t border-slate-800 pt-6">
              <div className="text-center text-slate-400 text-xs mb-4">or continue with</div>
              <div className="flex gap-3">
                <button className="flex-1 py-2 rounded-full border border-slate-800 bg-slate-900/50 text-slate-200 hover:bg-slate-900/70 flex items-center justify-center gap-2">
                  <span className="text-sm">G</span> Google
                </button>
                <button className="flex-1 py-2 rounded-full border border-slate-800 bg-slate-900/50 text-slate-200 hover:bg-slate-900/70 flex items-center justify-center gap-2">
                  <span className="text-sm"></span> Apple
                </button>
              </div>
            </div>
          </div>
        </div> {/* end card */}
      </div>

      {/* small inline styles for animation (optional) */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translateY(0) scale(1); }
          33% { transform: translateY(-10px) scale(1.05); }
          66% { transform: translateY(8px) scale(0.98); }
          100% { transform: translateY(0) scale(1); }
        }
        .animate-blob {
          animation: blob 8s infinite ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}
