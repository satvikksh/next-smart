// components/ProtectedRoute.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../context/UserContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectPath?: string;
}

export default function ProtectedRoute({ children, redirectPath = '/login' }: ProtectedRouteProps) {
  const { isLoggedIn, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      const currentPath = window.location.pathname;
      const returnUrl = encodeURIComponent(currentPath);
      router.push(`${redirectPath}?returnUrl=${returnUrl}`);
    }
  }, [isLoggedIn, isLoading, router, redirectPath]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return <>{children}</>;
}