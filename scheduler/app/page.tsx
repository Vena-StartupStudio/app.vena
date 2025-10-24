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
    .select('business_name')
    .eq('id', user.id)
    .single();

  if (!registration?.business_name) {
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

    const { error } = await supabase.from('schedules').insert({
      owner_id: user.id,
      slug,
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

  redirect(`/s/${schedule.slug}`);
}
