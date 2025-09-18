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
  const [userProfile, setUserProfile] = useState<any>(null);
  const lastIdentifiedUserRef = useRef<string | null>(null);
  const isBootstrappingRef = useRef(true);
  const featurebaseInitialized = useRef(false);

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

  // Fetch user profile data from registrations table
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.id) {
        setUserProfile(null);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('registrations')
          .select('first_name, last_name, business_name')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching user profile:', error);
          return;
        }

        if (data) {
          setUserProfile(data);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [user?.id]);

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

    const metadata: Record<string, string> | null = (() => {
      if (!user) {
        return null;
      }

      const result: Record<string, string> = {};

      if (typeof user.id === 'string' && user.id.length > 0) {
        result.supabaseUserId = user.id;
      }

      if (typeof user.email === 'string' && user.email.length > 0) {
        result.supabaseEmail = user.email;
      }

      if (userProfile?.business_name) {
        result.businessName = userProfile.business_name;
      }

      return Object.keys(result).length > 0 ? result : null;
    })();

    const widgetOptions = {
      organization: 'vena',
      theme: 'light',
      placement: 'right',
      defaultBoard: 'Feature Request',
      locale: 'en',
      metadata,
    };

    const identifyUserIfNeeded = () => {
      if (!user || !userProfile) {
        lastIdentifiedUserRef.current = null;
        return;
      }

      const featurebase = window.Featurebase;

      if (typeof featurebase !== 'function') {
        return;
      }

      let identifier: string | null = null;

      if (typeof user.id === 'string' && user.id.length > 0) {
        identifier = user.id;
      } else if (typeof user.email === 'string' && user.email.length > 0) {
        identifier = user.email;
      }

      if (!identifier) {
        return;
      }

      if (lastIdentifiedUserRef.current === identifier) {
        return;
      }

      // Construct name from profile data
      let name = '';
      if (userProfile.first_name && userProfile.last_name) {
        name = `${userProfile.first_name} ${userProfile.last_name}`.trim();
      } else if (userProfile.first_name) {
        name = userProfile.first_name;
      } else if (userProfile.last_name) {
        name = userProfile.last_name;
      } else if (userProfile.business_name) {
        name = userProfile.business_name;
      }

      // Only proceed if we have a name (Featurebase requires it)
      if (!name) {
        console.warn('Featurebase identify skipped: no name available');
        return;
      }

      const payload: {
        organization: string;
        email?: string;
        userId?: string;
        name: string;
      } = {
        organization: 'vena',
        name: name,
      };

      if (typeof user.email === 'string' && user.email.length > 0) {
        payload.email = user.email;
      }

      if (typeof user.id === 'string' && user.id.length > 0) {
        payload.userId = user.id;
      }

      // Add rate limiting - only try once every 30 seconds per user
      const now = Date.now();
      const lastIdentifyTime = parseInt(localStorage.getItem('featurebase_last_identify') || '0');
      if (now - lastIdentifyTime < 30000) {
        console.log('Featurebase identify skipped: rate limited');
        return;
      }

      localStorage.setItem('featurebase_last_identify', now.toString());

      featurebase(
        'identify',
        payload,
        (err: unknown) => {
          if (err) {
            console.error('Featurebase identify failed', err);
            lastIdentifiedUserRef.current = null;
            // Clear rate limit on error to allow retry
            localStorage.removeItem('featurebase_last_identify');
            return;
          }

          console.log('Featurebase identify successful for:', name);
          lastIdentifiedUserRef.current = identifier;
        }
      );
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
        identifyUserIfNeeded();
        return;
      }

      try {
        identifyUserIfNeeded();
        featurebase('initialize_feedback_widget', widgetOptions);
        featurebaseInitialized.current = true;
        console.log('Featurebase widget initialized successfully');
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
      lastIdentifiedUserRef.current = null;
    };
  }, [user, userProfile]);


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
