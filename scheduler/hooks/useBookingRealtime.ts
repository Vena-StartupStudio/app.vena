'use client';

import { useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export function useBookingRealtime(scheduleId: string | null | undefined, onChange: () => void) {
  useEffect(() => {
    if (!scheduleId) {
      return;
    }
    const supabase = createClientComponentClient();
    const channel = supabase
      .channel(`public_bookings_${scheduleId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'public_bookings',
          filter: `schedule_id=eq.${scheduleId}`
        },
        () => {
          onChange();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [scheduleId, onChange]);
}
