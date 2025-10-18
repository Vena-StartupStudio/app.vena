import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { supabase } from './lib/supabaseClient';
import VenaProfileEditor from './components/VenaProfileEditor';

type FeaturebaseClient = ((...args: any[]) => void) & {
  identify?: (payload: { name?: string; email?: string | null; userId?: string }) => void;
};

declare global {
  interface Window {
    Featurebase?: FeaturebaseClient;
  }
}


// Dashboard component with authentication check and sign out button
const Dashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<any>(null);
  const isBootstrappingRef = useRef(true);
  const featurebaseInitialized = useRef(false);

  useEffect(() => {
    const checkAuthAndFetchProfile = async () => {
      isBootstrappingRef.current = true;

      try {
        console.log('Dashboard: Checking authentication...');

        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        if (accessToken && refreshToken) {
          console.log('Dashboard: Found tokens in URL, setting session...');

          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error('Dashboard: Error setting session from URL tokens:', error);
          } else if (data.session?.user) {
            console.log('Dashboard: Session established from URL tokens');
            setIsAuthenticated(true);
            setUser(data.session.user);
            window.history.replaceState({}, document.title, window.location.pathname);
            return;
          }
        }

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          console.log('Dashboard: No session found, redirecting to sign-in');
          setIsAuthenticated(false);
          window.location.href = 'https://vena.software/signin.html';
          return;
        }

        setIsAuthenticated(true);
        setUser(user);
        console.log('DIAGNOSTIC: Logged in user ID:', user.id);

        // Fetch profile from registrations table
        console.log('DIAGNOSTIC: Querying "registrations" table for user profile...');
        const { data: profileData, error: profileError } = await supabase
          .from('registrations')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
        } else if (profileData) {
          console.log('DIAGNOSTIC: Profile data found and received from Supabase:', profileData.profile_config);
          
          // FIX: Initialize Featurebase with the user's name
          if (window.Featurebase) {
            window.Featurebase?.identify?.({
              // The error occurs because 'name' is missing.
              // Your logs show the name is in `profileData.profile_config.me`
              name: profileData.profile_config?.me, 
              email: user.email,
              userId: user.id,
            });
          }
        }
      } finally {
        isBootstrappingRef.current = false;
      }
    };

    checkAuthAndFetchProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Dashboard: Auth state change:', event, session?.user);

      if (event === 'SIGNED_OUT') {
        if (isBootstrappingRef.current) {
          console.log('Dashboard: Ignoring SIGNED_OUT event during bootstrap');
          return;
        }

        setIsAuthenticated(false);
        setUser(null);
        window.location.href = 'https://vena.software/signin.html';
        return;
      }

      if (session?.user) {
        setIsAuthenticated(true);
        setUser(session.user);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);


  useEffect(() => {
    // Don't run on server or if no user is logged in.
    if (typeof window === 'undefined' || !user) {
      return;
    }

    let isActive = true;
    let retries = 0;
    let retryTimeout: number | undefined;
    const maxRetries = 10;
    const retryDelayMs = 200;
    const scriptId = 'featurebase-sdk';

    const widgetOptions = {
      organization: 'vena',
      theme: 'light',
      placement: 'right',
      defaultBoard: 'Feature Request',
      locale: 'en',
    };

    const initializeWidget = () => {
      if (!isActive) {
        return;
      }

      const featurebase = window.Featurebase;

      if (typeof featurebase !== 'function') {
        if (retries < maxRetries) {
          retries += 1;
          retryTimeout = window.setTimeout(initializeWidget, retryDelayMs);
        } else {
          console.error('Featurebase SDK loaded but Featurebase function is unavailable.');
        }
        return;
      }

      if (retryTimeout !== undefined) {
        window.clearTimeout(retryTimeout);
        retryTimeout = undefined;
      }

      // Only initialize once
      if (featurebaseInitialized.current) {
        return;
      }

      try {
        // We no longer call identify. We just initialize the widget.
        featurebase('initialize_feedback_widget', widgetOptions);
        featurebaseInitialized.current = true;
        console.log('Featurebase widget initialized for anonymous user.');
      } catch (error) {
        console.error('Error initializing Featurebase widget:', error);
        featurebaseInitialized.current = false;
      }
    };

    if (typeof window.Featurebase === 'function') {
      initializeWidget();
      return () => {
        isActive = false;
        if (retryTimeout !== undefined) {
          window.clearTimeout(retryTimeout);
        }
      };
    }

    const script = (() => {
      const existing = document.getElementById(scriptId) as HTMLScriptElement | null;

      if (existing) {
        return existing;
      }

      const created = document.createElement('script');
      created.id = scriptId;
      created.async = true;
      created.src = 'https://do.featurebase.app/js/sdk.js';
      document.body.appendChild(created);

      return created;
    })();

    const handleLoad = () => {
      retries = 0;
      initializeWidget();
    };

    const handleError = (event: ErrorEvent | Event) => {
      console.error('Failed to load Featurebase SDK.', event);
    };

    script.addEventListener('load', handleLoad);
    script.addEventListener('error', handleError);

    return () => {
      isActive = false;
      script.removeEventListener('load', handleLoad);
      script.removeEventListener('error', handleError);
      if (retryTimeout !== undefined) {
        window.clearTimeout(retryTimeout);
      }
      // Reset initialization state when component unmounts or user changes
      featurebaseInitialized.current = false;
    };
  }, [user]);


  const handleJumpToMembersClub = () => {
    if (typeof document === 'undefined') {
      return;
    }
    const target = document.getElementById('members-lounge');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      console.warn('Members lounge section not found on the page.');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // The auth state change listener will handle the redirect
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with sign out button */}
      <div className="bg-white shadow-sm px-6 py-4 flex flex-wrap items-center gap-4 justify-between">
        <h1 className="text-xl font-semibold">Vena Dashboard</h1>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={handleJumpToMembersClub}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400"
          >
            <span>Members Club</span>
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              aria-hidden="true"
            >
              <path d="M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span className="text-sm text-gray-600">Welcome, {user?.email}</span>
          <button 
            onClick={handleSignOut}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      </div>
      
      {/* Profile Editor */}
      <VenaProfileEditor initialLanguage="en" />
    </div>
  );
};

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Dashboard />  {/* Only use Dashboard, remove AuthGuard */}
  </React.StrictMode>
);



