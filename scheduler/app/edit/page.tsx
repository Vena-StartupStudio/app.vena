import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { OwnerScheduleEditor } from '@/components/OwnerScheduleEditor';

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
    .eq('user_id', user.id)
    .single();
  
  if (!schedule) {
    // If no schedule exists, redirect to home page which will create one
    redirect('/scheduler');
  }
  
  // Render the editor with the user's schedule
  return <OwnerScheduleEditor slug={schedule.slug} token={schedule.edit_token} />;
}
