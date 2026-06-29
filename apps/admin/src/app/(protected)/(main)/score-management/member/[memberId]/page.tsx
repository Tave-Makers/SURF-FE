import { notFound } from 'next/navigation';
import { ScoreMemberDetailPage } from '@/app-pages/score-management/ui/ScoreMemberDetailPage';

type PageProps = {
  params: Promise<{ memberId: string }>;
};

const Page = async ({ params }: PageProps) => {
  const { memberId: rawMemberId } = await params;
  const memberId = Number(rawMemberId);

  if (!Number.isFinite(memberId)) return notFound();

  return <ScoreMemberDetailPage memberId={memberId} />;
};

export default Page;
