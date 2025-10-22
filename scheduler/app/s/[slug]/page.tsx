import { PublicScheduleView } from '@/components/PublicScheduleView';

type PageProps = {
  params: { slug: string };
};

export default function SchedulePage({ params }: PageProps) {
  return <PublicScheduleView slug={decodeURIComponent(params.slug)} />;
}
