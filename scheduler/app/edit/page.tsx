import { OwnerScheduleEditor } from '@/components/OwnerScheduleEditor';

type PageProps = {
  searchParams: { token?: string };
};

export default function EditPage({ searchParams }: PageProps) {
  const token = searchParams.token;
  // Default to demo-schedule, or can be made dynamic based on user session
  return <OwnerScheduleEditor slug="demo-schedule" token={token} />;
}
