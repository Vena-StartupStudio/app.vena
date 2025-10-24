import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { OwnerScheduleEditor } from '@/components/OwnerScheduleEditor';

export default async function EditPage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('https://app.vena.software/signin.html');
  }

  const { data: schedule } = await supabase
    .from('schedules')
    .select('slug, edit_token')
    .eq('owner_id', user.id)
    .single();

  if (!schedule) {
    redirect('/scheduler');
  }

  return <OwnerScheduleEditor slug={schedule.slug} token={schedule.edit_token} />;
}
