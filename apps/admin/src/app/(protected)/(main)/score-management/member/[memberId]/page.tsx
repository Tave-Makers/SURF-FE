import { notFound } from 'next/navigation';
import { ScoreMemberDetailPage } from '@/app-pages/score-management/ui/ScoreMemberDetailPage';

type PageProps = {
  params: Promise<{ memberId: string }>;
};

/** URL 세그먼트는 10진수 양의 정수만 허용한다. (`1.5`, `1e3`, `0x10`, `-1` 등을 차단) */
const parseMemberId = (rawMemberId: string) => {
  if (!/^\d+$/.test(rawMemberId)) return null;

  const memberId = Number(rawMemberId);

  return Number.isSafeInteger(memberId) && memberId > 0 ? memberId : null;
};

const Page = async ({ params }: PageProps) => {
  const { memberId: rawMemberId } = await params;
  const memberId = parseMemberId(rawMemberId);

  if (memberId == null) return notFound();

  return <ScoreMemberDetailPage memberId={memberId} />;
};

export default Page;
