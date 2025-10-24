import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { OwnerScheduleEditor } from '@/components/OwnerScheduleEditor';

const schedulerBasePath = (process.env.NEXT_PUBLIC_SCHEDULER_BASE_PATH ?? (process.env.NODE_ENV === 'production' ? '/scheduler' : '')).replace(/\/+$/, '');
const buildSchedulerPath = (suffix = '') => {
  const normalizedSuffix = suffix ? (suffix.startsWith('/') ? suffix : `/${suffix}`) : '';
  const combined = `${schedulerBasePath}${normalizedSuffix}`;
  if (!combined) {
    return '/';
  }
  return combined.startsWith('/') ? combined : `/${combined}`;
};

export default async function EditPage() {
  const supabase = createServerComponentClient({ cookies });
  
  // Get the authenticated user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    // If not logged in, redirect to sign-in
    redirect('https://app.vena.software/signin.html');
  }
  
  // Fetch the user's schedule
  const { data: schedule } = await supabase
    .from('schedules')
    .select('slug, edit_token')
    .eq('owner_id', user.id)
    .single();
  
  if (!schedule) {
    // If no schedule exists, redirect to home page which will create one
    redirect(buildSchedulerPath());
  }
  
  // Render the editor with the user's schedule
  return <OwnerScheduleEditor slug={schedule.slug} token={schedule.edit_token} />;
}
