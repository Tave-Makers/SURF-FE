import { ScoreTargetSelectPage } from '@/app-pages/score-management/ui/ScoreTargetSelectPage';

type PageProps = {
  params: Promise<{ criterionId: string }>;
};

const Page = async ({ params }: PageProps) => {
  const { criterionId } = await params;

  return <ScoreTargetSelectPage criterionId={decodeURIComponent(criterionId)} />;
};

export default Page;
