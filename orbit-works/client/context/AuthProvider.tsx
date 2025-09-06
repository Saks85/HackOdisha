import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSupabaseClient } from '@/lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import type { User, Session } from '@supabase/supabase-js';

interface Profile {
  id: string;
  name?: string | null;
  email?: string | null;
  wallet?: string | null;
}

interface AuthError {
  message: string;
  status?: number;
}

interface AuthContextValue {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | null;
  initialized: boolean;
  signUp: (name: string, email: string, password: string) => Promise<{ data: any; error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ data: any; error: AuthError | null }>;
  signInWithOAuth: (provider: string) => Promise<{ data: any; error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ data: any; error: AuthError | null }>;
  updatePassword: (password: string) => Promise<{ data: any; error: AuthError | null }>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  const [initialized, setInitialized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      const client = getSupabaseClient();
      if (!client) {
        console.error('[auth] ❌ Supabase client not available at init');
        setLoading(false);
        setInitialized(true);
        return;
      }

      console.log('[auth] ✅ Supabase client available, initializing...');

      try {
        const { data, error: sessionError } = await client.auth.getSession();
        if (!mounted) return;

        if (sessionError) {
          console.error('[auth] ❌ Session error:', sessionError);
          setError({
            message: sessionError.message,
            status: sessionError.status
          });
        } else {
          setError(null);
        }

        setSession(data.session ?? null);
        setUser(data.session?.user ?? null);

        if (data.session?.user) {
          console.log('[auth] ✅ User found, fetching profile...');
          try {
            const { data: profileData, error: pErr } = await client.from('profiles').select('*').eq('id', data.session.user.id).single();
            if (!pErr) {
              setProfile(profileData ?? null);
              console.log('[auth] ✅ Profile loaded:', profileData);
            } else {
              console.warn('[auth] ⚠️ Error fetching profile at init:', pErr);
            }
          } catch (e) {
            console.warn('[auth] ⚠️ Error fetching profile at init:', e);
          }
        } else {
          setProfile(null);
          console.log('[auth] ℹ️ No user session found');
        }

        setLoading(false);
        setInitialized(true);

        // Redirect based on auth state
        if (data.session?.user) {
          // If currently on auth pages, navigate to dashboard
          if (['/login', '/signup', '/'].includes(window.location.pathname)) {
            console.log('[auth] 🔄 Redirecting to dashboard...');
            navigate('/dashboard', { replace: true });
          }
        } else {
          // If trying to access protected pages, redirect to login
          const protectedPaths = ['/dashboard', '/mint', '/create', '/settings'];
          if (protectedPaths.includes(window.location.pathname)) {
            console.log('[auth] 🔄 Redirecting to login...');
            navigate('/login', { replace: true });
          }
        }
      } catch (err) {
        if (!mounted) return;
        console.error('[auth] ❌ Error during initialization:', err);
        setError({
          message: `Failed to initialize authentication: ${err}`,
          status: 500
        });
        setLoading(false);
        setInitialized(true);
      }
    })();

    const client = getSupabaseClient();
    let subscription: any = null;
    if (client) {
      console.log('[auth] 🔄 Setting up auth state change listener...');
      const d = client.auth.onAuthStateChange(async (event, session) => {
        if (!mounted) return;

        console.log('[auth] 🔄 Auth state changed:', event, session?.user?.id);
        setSession(session ?? null);
        setUser(session?.user ?? null);
        setError(null);

        if (session?.user) {
          try {
            const { data: profileData, error: pErr } = await client.from('profiles').select('*').eq('id', session.user.id).single();
            if (!pErr) {
              setProfile(profileData ?? null);
              console.log('[auth] ✅ Profile updated:', profileData);
            } else {
              console.warn('[auth] ⚠️ Error fetching profile on auth change:', pErr);
            }
          } catch (e) {
            console.warn('[auth] ⚠️ Error fetching profile on auth change:', e);
          }
          if (['/login', '/signup'].includes(window.location.pathname)) {
            console.log('[auth] 🔄 Redirecting to dashboard...');
            navigate('/dashboard', { replace: true });
          }
        } else {
          setProfile(null);
          const protectedPaths = ['/dashboard', '/mint', '/create', '/settings'];
          if (protectedPaths.includes(window.location.pathname)) {
            console.log('[auth] 🔄 Redirecting to login...');
            navigate('/login', { replace: true });
          }
        }
        setLoading(false);
      });
      // client.auth.onAuthStateChange returns different shapes across versions; be defensive
      subscription = (d as any)?.data?.subscription ?? (d as any)?.subscription ?? null;
    } else {
      console.warn('[auth] ⚠️ Not subscribing to auth state changes; client unavailable');
    }

    return () => {
      mounted = false;
      if (subscription?.unsubscribe) subscription.unsubscribe();
    };
  }, [navigate]);

  const signUp = async (name: string, email: string, password: string) => {
    console.log('[auth] 📝 Starting sign up for:', email);
    setLoading(true);
    setError(null);
    try {
      const client = getSupabaseClient();
      if (!client) {
        throw new Error('Supabase client unavailable');
      }

      const { data, error } = await client.auth.signUp({ email, password });
      if (error) {
        console.error('[auth] ❌ Sign up error:', error);
        const authError = {
          message: error.message,
          status: error.status
        };
        setError(authError);
        setLoading(false);
        return { data: null, error: authError };
      }

      console.log('[auth] ✅ Sign up successful:', data.user?.id);

      // If a user id is available, upsert profile
      const userId = data?.user?.id ?? null;
      if (userId) {
        try {
          console.log('[auth] 📝 Creating profile for user:', userId);
          const { data: profileData, error: pErr } = await client.from('profiles').upsert({ 
            id: userId, 
            name, 
            email, 
            wallet: null 
          }).select().single();
          if (!pErr) {
            setProfile(profileData ?? null);
            console.log('[auth] ✅ Profile created:', profileData);
          } else {
            console.warn('[auth] ⚠️ Error creating profile:', pErr);
          }
        } catch (e) {
          console.warn('[auth] ⚠️ Error creating profile:', e);
        }
      }

      setLoading(false);
      return { data, error: null };
    } catch (err: any) {
      console.error('[auth] ❌ Sign up error:', err);
      const error = {
        message: err?.message || 'An unexpected error occurred during sign up',
        status: err?.status || 500
      };
      setError(error);
      setLoading(false);
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('[auth] 🔐 Starting sign in for:', email);
    setLoading(true);
    setError(null);
    try {
      const client = getSupabaseClient();
      if (!client) {
        throw new Error('Supabase client unavailable');
      }

      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('[auth] ❌ Sign in error:', error);
        const authError = {
          message: error.message,
          status: error.status
        };
        setError(authError);
        setLoading(false);
        return { data: null, error: authError };
      }

      console.log('[auth] ✅ Sign in successful:', data.user?.id);
      setUser(data.user ?? null);
      setSession(data.session ?? null);

      // Fetch profile
      try {
        const userId = data?.user?.id;
        if (userId) {
          console.log('[auth] 📝 Fetching profile for user:', userId);
          const { data: profileData, error: pErr } = await client.from('profiles').select('*').eq('id', userId).single();
          if (!pErr) {
            setProfile(profileData ?? null);
            console.log('[auth] ✅ Profile loaded:', profileData);
          } else {
            console.warn('[auth] ⚠️ Error fetching profile on signIn:', pErr);
          }
        }
      } catch (e) {
        console.warn('[auth] ⚠️ Error fetching profile on signIn:', e);
      }

      setLoading(false);
      return { data, error: null };
    } catch (err: any) {
      console.error('[auth] ❌ Sign in error:', err);
      const error = {
        message: err?.message || 'An unexpected error occurred during sign in',
        status: err?.status || 500
      };
      setError(error);
      setLoading(false);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    setLoading(true);
    setError(null);
    try {
      const client = getSupabaseClient();
      if (client) {
        await client.auth.signOut();
      }
      setUser(null);
      setSession(null);
      setProfile(null);
      setLoading(false);
      navigate('/login', { replace: true });
    } catch (err: any) {
      const error = {
        message: err?.message || 'An unexpected error occurred during sign out',
        status: err?.status || 500
      };
      setError(error);
      setLoading(false);
    }
  };

  const signInWithOAuth = async (provider: string) => {
    console.log('[auth] 🔗 Starting OAuth sign in with:', provider);
    setLoading(true);
    setError(null);
    try {
      const client = getSupabaseClient();
      if (!client) {
        throw new Error('Supabase client unavailable');
      }

      const { data, error } = await client.auth.signInWithOAuth({ 
        provider: provider as any,
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) {
        console.error('[auth] ❌ OAuth error:', error);
        const authError = {
          message: error.message,
          status: error.status
        };
        setError(authError);
        setLoading(false);
        return { data: null, error: authError };
      }

      console.log('[auth] ✅ OAuth redirect initiated');
      setLoading(false);
      return { data, error: null };
    } catch (err: any) {
      console.error('[auth] ❌ OAuth error:', err);
      const error = {
        message: err?.message || 'An unexpected error occurred during OAuth sign in',
        status: err?.status || 500
      };
      setError(error);
      setLoading(false);
      return { data: null, error };
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      const client = getSupabaseClient();
      if (!client) {
        const error = {
          message: 'Supabase client unavailable. Please check your environment configuration.',
          status: 500
        };
        setError(error);
        setLoading(false);
        return { data: null, error };
      }

      const { data, error } = await client.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`
      });
      
      if (error) {
        const authError = {
          message: error.message,
          status: error.status
        };
        setError(authError);
        setLoading(false);
        return { data: null, error: authError };
      }

      setLoading(false);
      return { data, error: null };
    } catch (err: any) {
      const error = {
        message: err?.message || 'An unexpected error occurred during password reset',
        status: err?.status || 500
      };
      setError(error);
      setLoading(false);
      return { data: null, error };
    }
  };

  const updatePassword = async (password: string) => {
    setLoading(true);
    setError(null);
    try {
      const client = getSupabaseClient();
      if (!client) {
        const error = {
          message: 'Supabase client unavailable. Please check your environment configuration.',
          status: 500
        };
        setError(error);
        setLoading(false);
        return { data: null, error };
      }

      const { data, error } = await client.auth.updateUser({ password });
      
      if (error) {
        const authError = {
          message: error.message,
          status: error.status
        };
        setError(authError);
        setLoading(false);
        return { data: null, error: authError };
      }

      setLoading(false);
      return { data, error: null };
    } catch (err: any) {
      const error = {
        message: err?.message || 'An unexpected error occurred during password update',
        status: err?.status || 500
      };
      setError(error);
      setLoading(false);
      return { data: null, error };
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextValue = {
    user,
    profile,
    session,
    loading,
    error,
    initialized,
    signUp,
    signIn,
    signInWithOAuth,
    signOut,
    resetPassword,
    updatePassword,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
