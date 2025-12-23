"use client";

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function GuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [guide, setGuide] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalEarnings: 0,
    rating: 0,
  });

  useEffect(() => {
    // only run on client
    if (typeof window !== 'undefined') {
      checkAuthAndLoad();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Client-side session check:
   * - Look for cookie 'guide_session' (adjust name if your cookie differs)
   * - If cookie exists, call protected endpoints to validate and load data
   * - If not present or validation fails, redirect to login
   */
  const checkAuthAndLoad = async () => {
    try {
      // simple client-side guard: look for cookie first to avoid calling the login POST route
      const hasSessionCookie =
        typeof document !== 'undefined' &&
        document.cookie.split(';').some((c) => c.trim().startsWith('guide_session='));

      if (!hasSessionCookie) {
        // no cookie -> not logged in
        router.push('/guide-login');
        return;
      }

      // cookie exists -> validate by calling a protected endpoint.
      // Try /api/guide/profile (if you have it) first, otherwise fall back to /api/guide/stats.
      let profileOk = false;
      try {
        const pRes = await fetch('/api/guide/profile', { credentials: 'include' });
        if (pRes.ok) {
          const pJson = await pRes.json().catch(() => ({}));
          setGuide(pJson.user || pJson.guide || pJson);
          profileOk = true;
        }
      } catch (err) {
        // ignore - maybe endpoint missing
      }

      // Always try to fetch stats to populate the sidebar (this also validates the session)
      try {
        const sRes = await fetch('/api/guide/stats', { credentials: 'include' });
        if (sRes.ok) {
          const sJson = await sRes.json().catch(() => ({}));
          // Accept multiple shapes: { stats: {...} } or direct object
          setStats(sJson.stats || sJson || stats);
        } else {
          // If stats endpoint returns 401/403/404 consider session invalid
          console.warn('Stats endpoint returned non-OK:', sRes.status);
          // If profile wasn't fetched successfully either, redirect to login
          if (!profileOk) {
            router.push('/guide-login');
            return;
          }
        }
      } catch (err) {
        console.error('Error fetching guide stats:', err);
        // If profile wasn't fetched and stats failed, redirect
        if (!profileOk) {
          router.push('/guide-login');
          return;
        }
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      router.push('/guide-login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/guide/logout', { method: 'POST', credentials: 'include' });
    } catch (err) {
      console.warn('Logout failed', err);
    } finally {
      // remove client-side tokens if any
      try {
        // attempt to clear cookie client-side (best-effort)
        document.cookie = 'guide_session=; Path=/; Max-Age=0; SameSite=Strict;';
      } catch (e) {}
      router.push('/guide-login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', href: '/guide/dashboard', icon: '📊' },
    { name: 'Booking Requests', href: '/guide/bookings', icon: '📅' },
    { name: 'My Profile', href: '/guide/profile', icon: '👤' },
    { name: 'Availability', href: '/guide/availability', icon: '⏰' },
    { name: 'Earnings', href: '/guide/earnings', icon: '💰' },
    { name: 'Reviews', href: '/guide/reviews', icon: '⭐' },
    { name: 'Documents', href: '/guide/documents', icon: '📄' },
    { name: 'Settings', href: '/guide/settings', icon: '⚙️' },
  ];

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'blocked': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 lg:hidden"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="flex-shrink-0 flex items-center">
                <Link href="/guide/dashboard" className="text-xl font-bold text-gray-800 ml-4 lg:ml-0">
                  Guide Dashboard
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Status Badge */}
              <div className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(guide?.status)}`}>
                {guide?.status?.toUpperCase() || 'PENDING'}
              </div>

              {/* Notifications */}
              <button className="p-2 rounded-full hover:bg-gray-100 relative">
                <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {stats.pendingBookings > 0 && (
                  <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
                )}
              </button>

              {/* Guide Profile */}
              <div className="relative group">
                <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                      {guide?.fullName?.charAt(0) || 'G'}
                    </div>
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium text-gray-700">{guide?.fullName || 'Guide'}</p>
                    <p className="text-xs text-gray-500">Tour Guide</p>
                  </div>
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                  <Link href="/guide/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    👤 My Profile
                  </Link>
                  <Link href="/guide/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    ⚙️ Settings
                  </Link>
                  <div className="border-t border-gray-100"></div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    🚪 Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block lg:w-64`}>
          <div className="h-full bg-white border-r border-gray-200">
            {/* Quick Stats */}
            <div className="p-4 border-b">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Bookings</span>
                  <span className="font-semibold">{stats.totalBookings}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Pending Requests</span>
                  <span className="font-semibold text-yellow-600">{stats.pendingBookings}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Earnings</span>
                  <span className="font-semibold text-green-600">₹{stats.totalEarnings?.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Rating</span>
                  <span className="font-semibold flex items-center">
                    ⭐ {stats.rating?.toFixed(1)}/5
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="p-4">
              <div className="space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Status Card */}
            <div className="p-4 border-t">
              <div className="text-xs text-gray-500 mb-2">Verification Status</div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Profile</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    guide?.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {guide?.isVerified ? 'Verified' : 'Pending'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Aadhaar</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    guide?.aadharVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {guide?.aadharVerified ? 'Verified' : 'Not Verified'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">PAN</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    guide?.panVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {guide?.panVerified ? 'Verified' : 'Not Verified'}
                  </span>
                </div>
              </div>

              {guide?.status === 'pending' && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-xs text-yellow-700">
                    Your profile is under review. You'll be listed on "Find Guides" page after approval.
                  </p>
                </div>
              )}

              {guide?.status === 'approved' && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-green-700">
                    ✅ Your profile is live on "Find Guides" page.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            ></div>
          )}

          <main className="p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
