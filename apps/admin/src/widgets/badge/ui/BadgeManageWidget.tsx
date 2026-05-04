'use client';

import { BadgeAssignedMemberSection } from './BadgeAssignedMemberSection';
import { BadgeBasicSection } from './BadgeBasicSection';
import Loading from '@/app/loading';
import { useBadgeDetailQuery } from '@/features/badge/model/queries/useBadgeDetailQuery';
import { useBadgeMembersQuery } from '@/features/badge/model/queries/useBadgeMembersQuery';
import { ErrorState } from '@/shared/ui/error/ErrorState';

type BadgeManageMode = 'detail' | 'edit';

type BadgeManageWidgetProps = {
  badgeId: number;
  mode: BadgeManageMode;
};

/**
 * 배지 상세/수정 화면을 구성하는 공통 위젯.
 *
 * 배지 단건 정보와 부여 멤버 목록을 조회한 뒤,
 * 기본 정보 섹션과 부여 인원 섹션을 조합해서 렌더링한다.
 */
export const BadgeManageWidget = ({ badgeId, mode }: BadgeManageWidgetProps) => {
  const badgeQuery = useBadgeDetailQuery(badgeId);
  const membersQuery = useBadgeMembersQuery(badgeId);

  if (badgeQuery.isLoading || membersQuery.isLoading) {
    return <Loading />;
  }

  if (badgeQuery.isError || membersQuery.isError || !badgeQuery.data || !membersQuery.data) {
    return <ErrorState message="배지 정보를 불러오지 못했습니다." />;
  }

  return (
    <div className="bg-background-normal flex min-h-full flex-col gap-15 py-11">
      <BadgeBasicSection mode={mode} badge={badgeQuery.data} />
      <BadgeAssignedMemberSection mode={mode} members={membersQuery.data} />
    </div>
  );
};
