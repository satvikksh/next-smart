// context/UserContext.tsx - Updated Version
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'traveler' | 'guide' | 'admin';
  verified: boolean;
  createdAt: string;
}

interface UserContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (userData: any) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  requireAuth: (action: string, redirectPath?: string) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is logged in from localStorage
    const loadUser = async () => {
      setIsLoading(true);
      try {
        const savedUser = localStorage.getItem('guide_user');
        const savedToken = localStorage.getItem('guide_token');
        
        if (savedUser && savedToken) {
          // Validate token with backend (simulated)
          const isValid = await validateToken(savedToken);
          if (isValid) {
            setUser(JSON.parse(savedUser));
          } else {
            // Token expired or invalid
            localStorage.removeItem('guide_user');
            localStorage.removeItem('guide_token');
            localStorage.removeItem('guide_refresh_token');
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Simulate token validation
  const validateToken = async (token: string): Promise<boolean> => {
    // In real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 100));
    return true; // For demo, always return true
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock validation
      if (!email || !password) {
        return { success: false, message: 'Please enter email and password' };
      }

      // Mock user data
      const mockUser = {
        id: 'user-' + Date.now(),
        name: email.split('@')[0],
        email: email,
        phone: '+1 (555) 123-4567',
        role: 'traveler' as const,
        verified: true,
        createdAt: new Date().toISOString(),
      };

      // Mock token
      const token = 'mock_jwt_token_' + Date.now();
      const refreshToken = 'mock_refresh_token_' + Date.now();

      setUser(mockUser);
      localStorage.setItem('guide_user', JSON.stringify(mockUser));
      localStorage.setItem('guide_token', token);
      localStorage.setItem('guide_refresh_token', refreshToken);

      return { success: true };
    } catch (error) {
      return { success: false, message: 'Login failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    try {
      setIsLoading(true);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newUser = {
        id: `user-${Date.now()}`,
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '',
        role: 'traveler' as const,
        verified: false,
        createdAt: new Date().toISOString(),
      };

      const token = 'mock_jwt_token_' + Date.now();
      const refreshToken = 'mock_refresh_token_' + Date.now();

      setUser(newUser);
      localStorage.setItem('guide_user', JSON.stringify(newUser));
      localStorage.setItem('guide_token', token);
      localStorage.setItem('guide_refresh_token', refreshToken);

      return { success: true };
    } catch (error) {
      return { success: false, message: 'Registration failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('guide_user');
    localStorage.removeItem('guide_token');
    localStorage.removeItem('guide_refresh_token');
    localStorage.removeItem('user_bookings');
    router.push('/');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('guide_user', JSON.stringify(updatedUser));
    }
  };

  // Function to check if user is authenticated for specific actions
  const requireAuth = (action: string, redirectPath?: string): boolean => {
    if (!user) {
      // Store the intended action and path for after login
      const returnUrl = redirectPath || pathname;
      const actionData = { action, data: {} };
      
      localStorage.setItem('pending_action', JSON.stringify(actionData));
      localStorage.setItem('return_url', returnUrl);
      
      // Redirect to login
      router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}&action=${encodeURIComponent(action)}`);
      return false;
    }
    return true;
  };

  // Check for pending actions on login
  useEffect(() => {
    if (user && pathname === '/login') {
      const pendingAction = localStorage.getItem('pending_action');
      const returnUrl = localStorage.getItem('return_url');
      
      if (pendingAction) {
        const actionData = JSON.parse(pendingAction);
        
        // Clear pending action
        localStorage.removeItem('pending_action');
        localStorage.removeItem('return_url');
        
        // Redirect to return URL or handle action
        if (returnUrl) {
          router.push(returnUrl);
        }
      }
    }
  }, [user, pathname, router]);

  return (
    <UserContext.Provider value={{
      user,
      isLoggedIn: !!user,
      isLoading,
      login,
      register,
      logout,
      updateUser,
      requireAuth
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}