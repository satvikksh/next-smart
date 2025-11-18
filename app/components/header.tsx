'use client';
import Link from 'next/link';
import { useState } from 'react';
import dynamic from 'next/dynamic';

// Lazy load the popup to avoid SSR issues
const LoginPopup = dynamic(() => import('../login/page'), { ssr: false });

export default function Header() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <header className="bg-slate-900/80 backdrop-blur-lg sticky top-0 z-40">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">

        <Link href="/" className="flex items-center space-x-2">
          <img src="/logo.png" alt="logo" width={90} height={60} />
          <span className="text-2xl font-bold text-blue-400">S.M.A.R.T.</span>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-slate-400 hover:text-blue-400">Home</Link>
          <Link href="/guides" className="text-slate-400 hover:text-blue-400">Find a Guide</Link>
          <Link href="/about" className="text-slate-400 hover:text-blue-400">About</Link>
          <Link href="/contact" className="text-slate-400 hover:text-blue-400">Contact</Link>
        </div>

        {/* LOGIN & SIGNUP BUTTONS */}
        <div className="flex items-center space-x-3">
          {/* Login Button → Opens Popup */}
          <button
            onClick={() => setShowLogin(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Login
          </button>

          {/* Signup Page Link */}
          <Link
            href="/signup"
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Popup */}
      {showLogin && (
        <LoginPopup open={showLogin} onClose={() => setShowLogin(false)} />
      )}
    </header>
  );
}
