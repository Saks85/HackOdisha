import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSupabaseClient } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

type User = any;

interface AuthContextValue {
  user: User | null;
  session: any | null;
  loading: boolean;
  signUp: (name: string, email: string, password: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signInWithOAuth: (provider: string) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<any>;
  updatePassword: (password: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      const client = getSupabaseClient();
      if (!client) {
        setLoading(false);
        console.warn('[auth] supabase client not available at init');
        return;
      }
      const { data } = await client.auth.getSession();
      if (!mounted) return;
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      setLoading(false);
      // Redirect based on auth state
      if (data.session?.user) {
        // If currently on auth pages, navigate to dashboard
        if (['/login', '/signup', '/'].includes(window.location.pathname)) {
          navigate('/dashboard', { replace: true });
        }
      } else {
        // If trying to access protected pages, redirect to login
        const protectedPaths = ['/dashboard', '/mint', '/create', '/settings'];
        if (protectedPaths.includes(window.location.pathname)) {
          navigate('/login', { replace: true });
        }
      }
    })();

    const client = getSupabaseClient();
    let subscription: any = null;
    if (client) {
      const d = client.auth.onAuthStateChange((event, session) => {
        setSession(session ?? null);
        setUser(session?.user ?? null);
        setLoading(false);
        if (session?.user) {
          if (['/login', '/signup'].includes(window.location.pathname)) {
            navigate('/dashboard', { replace: true });
          }
        } else {
          const protectedPaths = ['/dashboard', '/mint', '/create', '/settings'];
          if (protectedPaths.includes(window.location.pathname)) {
            navigate('/login', { replace: true });
          }
        }
      });
      // client.auth.onAuthStateChange returns different shapes across versions; be defensive
      subscription = (d as any)?.data?.subscription ?? (d as any)?.subscription ?? null;
    } else {
      console.warn('[auth] not subscribing to auth state changes; client unavailable');
    }

    return () => {
      mounted = false;
      if (subscription?.unsubscribe) subscription.unsubscribe();
    };
  }, [navigate]);

  const signUp = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase client unavailable');
      const { data, error } = await client.auth.signUp({ email, password });
      if (error) throw error;
      // if a user id is available, upsert profile
      const userId = data.user?.id ?? null;
      if (userId) {
        await client.from('profiles').upsert({ id: userId, full_name: name, email }).select();
      }
      setLoading(false);
      return { data, error: null };
    } catch (err) {
      setLoading(false);
      return { data: null, error: err };
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase client unavailable');
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setUser(data.user ?? null);
      setSession(data.session ?? null);
      setLoading(false);
      return { data, error: null };
    } catch (err) {
      setLoading(false);
      return { data: null, error: err };
    }
  };

  const signOut = async () => {
    const client = getSupabaseClient();
    if (client) await client.auth.signOut();
    setUser(null);
    setSession(null);
    navigate('/login', { replace: true });
  };

  const signInWithOAuth = async (provider: string) => {
    setLoading(true);
    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase client unavailable');
      const res = await client.auth.signInWithOAuth({ provider: provider as any });
      setLoading(false);
      return res;
    } catch (err) {
      setLoading(false);
      return { error: err };
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase client unavailable');
      const { data, error } = await client.auth.resetPasswordForEmail(email);
      setLoading(false);
      return { data, error };
    } catch (err) {
      setLoading(false);
      return { data: null, error: err };
    }
  };

  const updatePassword = async (password: string) => {
    setLoading(true);
    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase client unavailable');
      const { data, error } = await client.auth.updateUser({ password });
      setLoading(false);
      return { data, error };
    } catch (err) {
      setLoading(false);
      return { data: null, error: err };
    }
  };

  const value: AuthContextValue = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithOAuth,
    signOut,
    resetPassword,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
