import { OwnerScheduleEditor } from '@/components/OwnerScheduleEditor';

type PageProps = {
  params: { slug: string };
  searchParams: { token?: string };
};

export default function ScheduleEditPage({ params, searchParams }: PageProps) {
  return <OwnerScheduleEditor slug={decodeURIComponent(params.slug)} token={searchParams?.token} />;
}
