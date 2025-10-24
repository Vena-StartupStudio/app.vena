import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Suspense } from 'react';
import AuthHandler from '@/components/AuthHandler';

const schedulerBasePath = (process.env.NEXT_PUBLIC_SCHEDULER_BASE_PATH ?? (process.env.NODE_ENV === 'production' ? '/scheduler' : '')).replace(/\/+$/, '');
const buildSchedulerPath = (suffix = '') => {
  const normalizedSuffix = suffix ? (suffix.startsWith('/') ? suffix : `/${suffix}`) : '';
  const combined = `${schedulerBasePath}${normalizedSuffix}`;
  if (!combined) {
    return '/';
  }
  return combined.startsWith('/') ? combined : `/${combined}`;
};

export default async function HomePage({ searchParams }: { searchParams: { access_token?: string; refresh_token?: string } }) {
  const supabase = createServerComponentClient({ cookies });
  
  // If tokens are in the URL, render the client component to handle them
  if (searchParams.access_token && searchParams.refresh_token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Suspense fallback={<div>Loading...</div>}>
          <AuthHandler />
        </Suspense>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Setting up your session...</p>
        </div>
      </div>
    );
  }
  
  // Get the authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  console.log('Auth check:', { user: user?.id, error: authError });
  
  if (!user) {
    // If not logged in, redirect to sign-in with scheduler redirect parameter
    redirect('https://vena.software/signin.html?redirect=scheduler');
  }
  
  // Fetch the user's business name from registrations table
  const { data: registration, error: regError } = await supabase
    .from('registrations')
    .select('business_name')
    .eq('id', user.id)
    .single();
  
  console.log('Registration check:', { registration, error: regError });
  
  if (!registration?.business_name) {
    // If no business name, show error or redirect
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Business Name Required</h1>
          <p>Please set up your business name in your profile first.</p>
          <div className="mt-4 text-sm text-gray-600">
            <p>User ID: {user.id}</p>
            {regError && <p className="text-red-600">Error: {regError.message}</p>}
          </div>
        </div>
      </div>
    );
  }
  
  // Convert business name to slug (lowercase, replace spaces with hyphens)
  const baseSlug = registration.business_name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  // First, let's see ALL schedules for this user to diagnose the issue
  const { data: allSchedules, error: allSchedulesError } = await supabase
    .from('schedules')
    .select('id, slug, created_at')
    .eq('owner_id', user.id);
  
  console.log('=== DIAGNOSTIC INFO ===');
  console.log('User ID:', user.id);
  console.log('All schedules for user:', allSchedules);
  console.log('Schedules count:', allSchedules?.length);
  console.log('All schedules error:', allSchedulesError);
  
  // Check if a schedule exists for this user, if not create one
  const { data: scheduleData, error: scheduleError } = await supabase
    .from('schedules')
    .select('slug')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  console.log('Schedule lookup result:', { scheduleData, scheduleError });

  if (scheduleError) {
    console.warn('Scheduler lookup issue:', scheduleError);
  }

  let schedule = scheduleData;
  
  if (!schedule) {
    // Find an available slug by checking for conflicts
    let slug = baseSlug;
    let counter = 1;
    
    while (true) {
      const { data: existing } = await supabase
        .from('schedules')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();
      
      if (!existing) break;
      
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    // Create the schedule for this user
    const { error } = await supabase
      .from('schedules')
      .insert({
        owner_id: user.id,
        slug: slug,
        title: registration.business_name,
        timezone: 'Asia/Jerusalem',
        duration_minutes: 60,
        edit_token: crypto.randomUUID().replace(/-/g, ''),
      });
    
    if (error) {
      console.error('Error creating schedule:', error);
    }
    
    schedule = { slug };
  }
  
  // Redirect to the user's specific schedule page
  redirect(buildSchedulerPath(`/s/${schedule.slug}`));
}
