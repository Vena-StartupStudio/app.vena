import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { supabase } from './lib/supabaseClient';
import VenaProfileEditor from './components/VenaProfileEditor';

declare global {
  interface Window {
    Featurebase?: (...args: any[]) => void;
  }
}


// Dashboard component with authentication check and sign out button
const Dashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<any>(null);
  const isBootstrappingRef = useRef(true);

  useEffect(() => {
    let isMounted = true;

    const bootstrapSession = async () => {
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
          } else if (data.session?.user && isMounted) {
            console.log('Dashboard: Session established from URL tokens');
            setIsAuthenticated(true);
            setUser(data.session.user);
            window.history.replaceState({}, document.title, window.location.pathname);
            return;
          }
        }

        const { data: { user } } = await supabase.auth.getUser();

        if (!isMounted) {
          return;
        }

        if (user) {
          console.log('Dashboard: Existing session found');
          setIsAuthenticated(true);
          setUser(user);
        } else {
          console.log('Dashboard: No session found, redirecting to sign-in');
          setIsAuthenticated(false);
          window.location.href = 'https://vena.software/signin.html';
        }
      } finally {
        isBootstrappingRef.current = false;
      }
    };

    bootstrapSession();

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
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);


  useEffect(() => {
    if (typeof window === 'undefined') {
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
      metadata: null,
    } as const;

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

      featurebase('initialize_feedback_widget', widgetOptions);
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
    };
  }, []);

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
      <div className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Vena Dashboard</h1>
        <div className="flex items-center space-x-4">
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
      <VenaProfileEditor language="en" />
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
