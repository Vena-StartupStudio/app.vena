import { PublicScheduleView } from '@/components/PublicScheduleView';

export default function HomePage() {
  // Default to demo-schedule, or can be made dynamic based on user session
  return <PublicScheduleView slug="demo-schedule" />;
}
