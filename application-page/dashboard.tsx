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

      // CHANGE this line:
      if (!session) {
        window.location.href = 'https://vena.software/signin.html';  // Changed from '/signin'
      }
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      // CHANGE this line too:
      if (!session) {
        window.location.href = 'https://vena.software/signin.html';  // Changed from '/signin'
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

// New Dashboard component with authentication check
const Dashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        window.location.href = 'https://vena.software/signin.html';
      }
    };

    checkAuth();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = 'https://vena.software/signin.html';  // Make sure it's this URL
  };

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ADD this header section at the top */}
      <div className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Vena Dashboard</h1>
        <button 
          onClick={handleSignOut}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>
      
      {/* Your existing dashboard content stays the same */}
      {/* ... your existing JSX ... */}
    </div>
  );
};