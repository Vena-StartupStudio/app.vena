import { OwnerScheduleEditor } from '@/components/OwnerScheduleEditor';

export default function EditPage() {
  // Authentication will be handled within OwnerScheduleEditor using Supabase session
  // No token needed - user must be logged in to edit their schedule
  return <OwnerScheduleEditor slug="demo-schedule" token={undefined} />;
}
