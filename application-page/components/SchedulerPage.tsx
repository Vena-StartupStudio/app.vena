import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import UserDashboard from './scheduler/UserDashboard';
import PublicScheduleView from './scheduler/PublicScheduleView';
import { Session } from '@supabase/supabase-js';

const SchedulerPage: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };
    getSession();
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => authListener.subscription.unsubscribe();
  }, []);

  if (loading) return <div>Loading Scheduler...</div>;

  // This logic needs to be adapted. For now, it shows the dashboard if logged in.
  if (session) {
    return <UserDashboard />;
  } else {
    // This needs a user ID from the URL to show a specific user's public calendar.
    // Example: /scheduler?user=some-user-id
    return <PublicScheduleView userId="<user-id-from-url>" />;
  }
};

export default SchedulerPage;