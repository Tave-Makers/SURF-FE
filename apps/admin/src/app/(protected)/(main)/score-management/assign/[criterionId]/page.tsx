import { notFound } from 'next/navigation';
import { ScoreTargetSelectPage } from '@/app-pages/score-management/ui/ScoreTargetSelectPage';

type PageProps = {
  params: Promise<{ criterionId: string }>;
};

/** criterionId는 ActivityType enum 값이다. (예: STUDY_LATE_11_TO_20) */
const ACTIVITY_TYPE_PATTERN = /^[A-Z][A-Z0-9_]*$/;

const Page = async ({ params }: PageProps) => {
  const { criterionId } = await params;

  if (!ACTIVITY_TYPE_PATTERN.test(criterionId)) return notFound();

  return <ScoreTargetSelectPage criterionId={criterionId} />;
};

export default Page;
