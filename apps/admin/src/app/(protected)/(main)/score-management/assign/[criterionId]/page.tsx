import { notFound } from 'next/navigation';
import { ScoreTargetSelectPage } from '@/app-pages/score-management/ui/ScoreTargetSelectPage';
import { getActivityTypesServer } from '@/entities/activity-score/api/getActivityTypesServer';
import { mapActivityTypeGroupsDtoToCategories } from '@/entities/activity-score/model/mapper';

type PageProps = {
  params: Promise<{ criterionId: string }>;
};

/** criterionId는 ActivityType enum 값 (예: STUDY_LATE_11_TO_20) */
const ACTIVITY_TYPE_PATTERN = /^[A-Z][A-Z0-9_]*$/;

const isKnownActivityType = async (criterionId: string) => {
  const activityTypeGroups = await getActivityTypesServer();

  // 조회 실패는 기존 클라이언트 에러 상태에서 처리하고, 정상 응답에서만 404를 결정한다.
  if (activityTypeGroups == null) return true;

  return mapActivityTypeGroupsDtoToCategories(activityTypeGroups).some((category) =>
    category.criteria.some((criterion) => criterion.id === criterionId),
  );
};

const Page = async ({ params }: PageProps) => {
  const { criterionId } = await params;

  if (!ACTIVITY_TYPE_PATTERN.test(criterionId)) return notFound();
  if (!(await isKnownActivityType(criterionId))) return notFound();

  return <ScoreTargetSelectPage criterionId={criterionId} />;
};

export default Page;
