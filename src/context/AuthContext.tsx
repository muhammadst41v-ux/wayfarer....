import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarColor: string;
  createdAt: string;
  rememberMe: boolean;
}

export interface PastEnquiry {
  id: string;
  type: 'expedition' | 'membership' | 'planner';
  title: string;
  date: string;
  status: 'Pending Curator Review' | 'Confirmed' | 'Archived';
  details: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: { name?: string; email?: string; avatarColor?: string }) => void;
  enquiries: PastEnquiry[];
  addEnquiry: (enquiry: Omit<PastEnquiry, 'id' | 'date' | 'status'>) => void;
}

const AUTH_USER_KEY = 'wayfarer_auth_user_v1';
const ENQUIRIES_KEY = 'wayfarer_user_enquiries_v1';

const DEFAULT_ENQUIRIES: PastEnquiry[] = [
  {
    id: 'enq-101',
    type: 'expedition',
    title: 'Berlin Brutalist Sanctuaries & Concrete Acoustics',
    date: 'Oct 14, 2026',
    status: 'Pending Curator Review',
    details: '2 explorers · Requested autumn residency access · Dietary: Vegetarian',
  },
  {
    id: 'enq-102',
    type: 'membership',
    title: 'Annual Fellowship Pass Membership',
    date: 'Sep 28, 2026',
    status: 'Confirmed',
    details: 'Annual billing · 15% discount unlocked · Alumni key dispatched',
  },
];

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem(AUTH_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [enquiries, setEnquiries] = useState<PastEnquiry[]>(() => {
    if (typeof window === 'undefined') return DEFAULT_ENQUIRIES;
    try {
      const saved = localStorage.getItem(ENQUIRIES_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_ENQUIRIES;
    } catch {
      return DEFAULT_ENQUIRIES;
    }
  });

  const login = async (email: string, password: string, rememberMe = true): Promise<{ success: boolean; error?: string }> => {
    // Simulated network authentication delay
    await new Promise((resolve) => setTimeout(resolve, 400));

    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (password.length < 6) {
      return { success: false, error: 'Password must contain at least 6 characters.' };
    }

    const defaultColors = ['#f59e0b', '#06b6d4', '#10b981', '#8b5cf6', '#f43f5e', '#38bdf8'];
    const randomColor = defaultColors[Math.abs(email.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % defaultColors.length];

    const newUser: AuthUser = {
      id: `usr-${Date.now().toString(36)}`,
      name: email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      email,
      avatarColor: randomColor,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      rememberMe,
    };

    setUser(newUser);
    if (rememberMe) {
      try {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
      } catch {
        // ignore
      }
    }
    return { success: true };
  };

  const signup = async (name: string, email: string, password: string, rememberMe = true): Promise<{ success: boolean; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    if (!name.trim()) {
      return { success: false, error: 'Please enter your full name.' };
    }
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const defaultColors = ['#f59e0b', '#06b6d4', '#10b981', '#8b5cf6', '#f43f5e', '#38bdf8'];
    const randomColor = defaultColors[Math.abs(name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % defaultColors.length];

    const newUser: AuthUser = {
      id: `usr-${Date.now().toString(36)}`,
      name: name.trim(),
      email: email.trim(),
      avatarColor: randomColor,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      rememberMe,
    };

    setUser(newUser);
    if (rememberMe) {
      try {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
      } catch {
        // ignore
      }
    }
    return { success: true };
  };

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(AUTH_USER_KEY);
    } catch {
      // ignore
    }
  }, []);

  const updateUser = useCallback((updates: { name?: string; email?: string; avatarColor?: string }) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const addEnquiry = useCallback((enquiry: Omit<PastEnquiry, 'id' | 'date' | 'status'>) => {
    const newEnq: PastEnquiry = {
      ...enquiry,
      id: `enq-${Date.now().toString(36)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Pending Curator Review',
    };
    setEnquiries((prev) => {
      const updated = [newEnq, ...prev];
      try {
        localStorage.setItem(ENQUIRIES_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateUser,
        enquiries,
        addEnquiry,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
