import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { supabase } from './lib/supabaseClient';
import VenaProfileEditor from './components/VenaProfileEditor';

// Dashboard component with authentication check and sign out button
const Dashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      console.log('🔍 Dashboard: Checking authentication...');
      const { data: { user } } = await supabase.auth.getUser();
      
      console.log('👤 Dashboard: User check result:', user);
      
      if (user) {
        console.log('✅ Dashboard: User authenticated, setting state...');
        setIsAuthenticated(true);
        setUser(user);
      } else {
        console.log('❌ Dashboard: No user found, redirecting to sign-in...');
        window.location.href = 'https://vena.software/signin.html';
      }
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Dashboard: Auth state change:', event, session?.user);
      if (event === 'SIGNED_OUT' || !session?.user) {
        console.log('❌ Dashboard: User signed out, redirecting...');
        window.location.href = 'https://vena.software/signin.html';
      } else if (session?.user) {
        console.log('✅ Dashboard: User signed in via state change');
        setIsAuthenticated(true);
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
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