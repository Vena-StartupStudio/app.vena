'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AuthHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const handleAuth = async () => {
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');

      if (accessToken && refreshToken) {
        console.log('Scheduler: Found tokens in URL, setting session...');

        try {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error('Scheduler: Error setting session from URL tokens:', error);
          } else if (data.session?.user) {
            console.log('Scheduler: Session established from URL tokens');
            // Remove tokens from URL and reload
            window.history.replaceState({}, document.title, '/scheduler');
            router.refresh();
          }
        } catch (error) {
          console.error('Scheduler: Exception setting session:', error);
        }
      }
    };

    handleAuth();
  }, [searchParams, supabase, router]);

  return null;
}
