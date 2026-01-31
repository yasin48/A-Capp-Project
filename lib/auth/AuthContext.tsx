'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/database/connection';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: string | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setRole(session?.user?.user_metadata?.role || 'user');
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[AuthContext] Auth state changed:', event, 'User:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setRole(session?.user?.user_metadata?.role || 'user');
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message || 'Sign up failed' } };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('[AuthContext] Starting signIn for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('[AuthContext] SignIn response:', { data, error });

      if (error) {
        console.log('[AuthContext] SignIn error:', error);
        return { error };
      }

      console.log('[AuthContext] SignIn successful, user:', data.user?.email);
      return { error: null };
    } catch (error: any) {
      console.log('[AuthContext] SignIn exception:', error);
      return { error: { message: error.message || 'Sign in failed' } };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      // Force a hard redirect to clear all state
      window.location.href = '/';

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message || 'Sign out failed' } };
    }
  };

  const value = {
    user,
    session,
    role,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
