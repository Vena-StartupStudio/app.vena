import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Suspense } from 'react';
import AuthHandler from '@/components/AuthHandler';

export default async function HomePage({ searchParams }: { searchParams: { access_token?: string; refresh_token?: string } }) {
  const supabase = createServerComponentClient({ cookies });

  if (searchParams.access_token && searchParams.refresh_token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Suspense fallback={<div>Loading...</div>}>
          <AuthHandler />
        </Suspense>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Setting up your session...</p>
        </div>
      </div>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('https://vena.software/signin.html?redirect=scheduler');
  }

  const { data: registration, error: regError } = await supabase
    .from('registrations')
    .select('business_name, profile_config')
    .eq('id', user.id)
    .single();

  if (!registration?.business_name) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <svg className="w-16 h-16 mx-auto mb-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="text-2xl font-bold mb-4 text-gray-900">Profile Setup Required</h1>
            <p className="text-gray-600 mb-6">Please complete your profile setup in the dashboard before creating your scheduling page.</p>
            <a 
              href="https://app.vena.software/dashboard"
              className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Go to Dashboard
            </a>
            {regError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">Error: {regError.message}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const baseSlug = registration.business_name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const { data: scheduleData, error: scheduleError } = await supabase
    .from('schedules')
    .select('slug')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (scheduleError) {
    console.warn('Scheduler lookup issue:', scheduleError);
  }

  let schedule = scheduleData;

  if (!schedule) {
    let slug = baseSlug || `page-${user.id.slice(0, 8).toLowerCase()}`;
    let counter = 1;

    while (true) {
      const { data: existing } = await supabase
        .from('schedules')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();

      if (!existing) break;

      slug = `${baseSlug || `page-${user.id.slice(0, 8).toLowerCase()}`}-${counter}`;
      counter++;
    }

    const { error: insertError } = await supabase.from('schedules').insert({
      owner_id: user.id,
      slug,
      title: registration.business_name,
      timezone: 'Asia/Jerusalem',
      duration_minutes: 60,
      edit_token: crypto.randomUUID().replace(/-/g, ''),
    });

    if (insertError) {
      console.error('Error creating schedule:', insertError);
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <svg className="w-16 h-16 mx-auto mb-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h1 className="text-2xl font-bold mb-4 text-gray-900">Unable to Create Schedule</h1>
              <p className="text-gray-600 mb-4">We encountered an error creating your scheduling page.</p>
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-6">
                <p className="text-sm text-red-600">{insertError.message}</p>
              </div>
              <a 
                href="https://app.vena.software/dashboard"
                className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Return to Dashboard
              </a>
            </div>
          </div>
        </div>
      );
    }

    schedule = { slug };
  }

  redirect(`/scheduler/s/${schedule.slug}`);
}
