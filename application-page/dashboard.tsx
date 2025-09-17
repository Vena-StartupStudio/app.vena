import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { supabase } from './lib/supabaseClient';
import VenaProfileEditor from './components/VenaProfileEditor';

const AuthGuard: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);

      // If no session is found on initial load, redirect immediately.
      if (!session) {
        window.location.href = '/signin';
      }
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      // Also check here in case the user signs out.
      if (!session) {
        window.location.href = '/signin';
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading || !session) {
    // Show a loading indicator while checking the session or redirecting.
    return <div>Loading...</div>;
  }

  // If a session exists, show the user's dashboard.
  return <VenaProfileEditor />;
};

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AuthGuard />
  </React.StrictMode>
);