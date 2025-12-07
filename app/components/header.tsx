'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useUser } from '../context/UserContext'; // adjust path if needed

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const { user, isLoggedIn, refresh } = useUser();

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname?.startsWith(href));

  const navLinkBase =
    'text-sm font-medium transition-colors hover:text-emerald-400';
  const navLinkInactive = 'text-slate-400';
  const navLinkActive =
    'text-emerald-400 border-b border-emerald-400 pb-1 md:pb-0';

  const displayName = user?.name || user?.username || 'User';

  async function handleLogout() {
    try {
      setLoggingOut(true);
      // call API logout route (should clear server cookie). If you don't have one,
      // create POST /api/auth/logout that clears cookie(s).
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      }).catch(() => null);

      // refresh client-side user state
      try {
        await refresh();
      } catch {}
      // redirect to home or login
      router.push('/');
    } catch (err) {
      console.error('logout error', err);
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <header className="bg-slate-950/80 backdrop-blur-lg sticky top-0 z-40 border-b border-slate-800">
      <nav className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        {/* Logo + Brand */}
        <Link href="/" className="flex items-center space-x-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="logo" width={72} height={48} />
          <div className="flex flex-col leading-tight">
            <span className="text-lg md:text-2xl font-bold text-emerald-400">
              S.M.A.R.T.
            </span>
            <span className="hidden md:inline text-[11px] text-slate-400">
              Smart Monitoring & Response for Tourist
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className={`${navLinkBase} ${
              isActive('/') ? navLinkActive : navLinkInactive
            }`}
          >
            Home
          </Link>

          <Link
            href="/find-guide"
            className={`${navLinkBase} ${
              isActive('/find-guide') ? navLinkActive : navLinkInactive
            }`}
          >
            Find a Guide
          </Link>

          <Link
            href="/about"
            className={`${navLinkBase} ${
              isActive('/about') ? navLinkActive : navLinkInactive
            }`}
          >
            About
          </Link>

          <Link
            href="/contact"
            className={`${navLinkBase} ${
              isActive('/contact') ? navLinkActive : navLinkInactive
            }`}
          >
            Contact
          </Link>
        </div>

        {/* Desktop Auth Buttons or User Menu */}
        <div className="hidden md:flex items-center space-x-3">
          {!isLoggedIn ? (
            <>
              <Link
                href="/login"
                className="text-sm font-medium rounded-lg border border-slate-700 px-4 py-1.5 text-slate-200 hover:border-emerald-400 hover:text-emerald-400"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold rounded-lg bg-emerald-500 px-4 py-1.5 text-slate-950 shadow hover:bg-emerald-400"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-300">Welcome,</span>
              <Link
                href="/profile"
                className="text-sm font-medium text-emerald-300 hover:underline"
              >
                {displayName}
              </Link>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="ml-2 text-sm rounded-lg border border-slate-700 px-3 py-1 text-slate-200 hover:border-emerald-400 hover:text-emerald-400"
                aria-label="Logout"
              >
                {loggingOut ? 'Signing out...' : 'Logout'}
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          type="button"
          onClick={() => setOpen((p) => !p)}
          className="md:hidden inline-flex items-center justify-center rounded-lg border border-slate-700 p-2 text-slate-200 hover:border-emerald-400 hover:text-emerald-400"
          aria-label="Toggle navigation menu"
        >
          <span className="sr-only">Open menu</span>
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95">
          <div className="container mx-auto px-4 py-3 space-y-3">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className={`block ${navLinkBase} ${
                isActive('/') ? navLinkActive : navLinkInactive
              }`}
            >
              Home
            </Link>

            <Link
              href="/find-guide"
              onClick={() => setOpen(false)}
              className={`block ${navLinkBase} ${
                isActive('/find-guide') ? navLinkActive : navLinkInactive
              }`}
            >
              Find a Guide
            </Link>

            <Link
              href="/about"
              onClick={() => setOpen(false)}
              className={`block ${navLinkBase} ${
                isActive('/about') ? navLinkActive : navLinkInactive
              }`}
            >
              About
            </Link>

            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className={`block ${navLinkBase} ${
                isActive('/contact') ? navLinkActive : navLinkInactive
              }`}
            >
              Contact
            </Link>

            {/* Mobile auth area */}
            {!isLoggedIn ? (
              <div className="pt-2 flex gap-2">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex-1 text-center text-sm font-medium rounded-lg border border-slate-700 px-4 py-1.5 text-slate-200 hover:border-emerald-400 hover:text-emerald-400"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="flex-1 text-center text-sm font-semibold rounded-lg bg-emerald-500 px-4 py-1.5 text-slate-950 shadow hover:bg-emerald-400"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="pt-2 space-y-2">
                <div className="px-3 py-2 rounded-lg bg-slate-900/50">
                  <div className="text-sm text-slate-300">Signed in as</div>
                  <div className="font-medium text-emerald-300">{displayName}</div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="flex-1 text-center rounded-lg border border-slate-700 px-4 py-2 text-slate-200 hover:border-emerald-400"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setOpen(false);
                    }}
                    className="flex-1 text-center rounded-lg border border-slate-700 px-4 py-2 text-slate-200 hover:border-emerald-400"
                  >
                    {loggingOut ? 'Signing out...' : 'Logout'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
