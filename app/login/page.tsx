// app/login/page.tsx - Updated with Action Handling
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft, UserPlus } from 'lucide-react';
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
  const returnUrl = searchParams.get('returnUrl') || '/';
  const action = searchParams.get('action');
  const guideId = searchParams.get('guideId');

  // Check for pending actions in localStorage
  useEffect(() => {
    const storedAction = localStorage.getItem('pending_action');
    if (storedAction) {
      setPendingAction(JSON.parse(storedAction));
    }
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      handlePostLoginRedirect();
    }
  }, [isLoggedIn]);

  const handlePostLoginRedirect = () => {
    // Clear pending action
    localStorage.removeItem('pending_action');
    
    // Handle specific actions
    if (action === 'book_guide' && guideId) {
      // Redirect to booking page with guide ID
      router.push(`/find-guide?book=${guideId}`);
    } else if (pendingAction?.action === 'book_guide') {
      // Redirect to find-guide page
      router.push('/find-guide');
    } else {
      // Redirect to return URL
      router.push(returnUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        // Login successful, redirect will happen in useEffect
      } else {
        setError(result.message || 'Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-gray-50 to-purple-50 py-12">
      <div className="max-w-md w-full mx-4">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                GuideConnect
              </h1>
              <p className="text-sm text-gray-500">Welcome back</p>
            </div>
          </Link>
        </div>

        {/* Pending Action Banner */}
        {pendingAction && (
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <UserPlus className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-blue-800">Complete your booking</p>
                <p className="text-sm text-blue-600">
                  Login to book {pendingAction.guideName || 'your selected guide'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Required Banner */}
        {action === 'book_guide' && !pendingAction && (
          <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <div>
                <p className="font-medium text-amber-800">Login Required</p>
                <p className="text-sm text-amber-600">
                  You need to login to book guides on GuideConnect
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign in to your account</h2>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-center text-gray-600">
              Don't have an account?{' '}
              <Link 
                href={`/register?returnUrl=${encodeURIComponent(returnUrl)}${action ? `&action=${action}` : ''}`}
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                Sign up for free
              </Link>
            </p>
          </div>

          {/* Continue without login (limited access) */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-500">
              Or{' '}
              <Link href="/find-guide" className="text-gray-700 hover:text-gray-900 font-medium">
                continue browsing guides
              </Link>
              {' '}without booking
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}