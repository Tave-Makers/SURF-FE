'use client';

import { useRouter } from 'next/navigation';
import { BadgeAssignedMemberSection } from './BadgeAssignedMemberSection';
import { BadgeBasicSection } from './BadgeBasicSection';
import { BadgeEditActionSection } from './BadgeEditActionSection';
import { BadgeEditBottomBar } from './BadgeEditBottomBar';
import Loading from '@/app/loading';
import { useBadgeDetailQuery } from '@/features/badge/model/queries/useBadgeDetailQuery';
import { useBadgeMembersQuery } from '@/features/badge/model/queries/useBadgeMembersQuery';
import { useBadgeEditForm } from '@/features/badge/model/useBadgeEditForm';
import { PAGE_ROUTES } from '@/shared/config/path';
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
  const router = useRouter();
  const badgeQuery = useBadgeDetailQuery(badgeId);
  const membersQuery = useBadgeMembersQuery(badgeId);
  const editForm = useBadgeEditForm(badgeId, badgeQuery.data, membersQuery.data ?? []);

  if (badgeQuery.isLoading || membersQuery.isLoading) {
    return <Loading />;
  }

  if (badgeQuery.isError || membersQuery.isError || !badgeQuery.data || !membersQuery.data) {
    return <ErrorState message="배지 정보를 불러오지 못했습니다." />;
  }

  const isEdit = mode === 'edit';
  if (isEdit && editForm.state.isLoading) {
    return <Loading />;
  }

  const members = isEdit ? editForm.state.visibleMembers : membersQuery.data;
  const isSubmitting = editForm.state.isSubmitting || editForm.state.isDeleting;

  return (
    <div className="bg-background-normal flex min-h-full flex-col">
      {/* 배지 기본 정보와 부여 인원 목록을 담는 본문 영역 */}
      <div className="flex flex-1 flex-col gap-15 py-11">
        {/* 배지 이미지/이름 영역: 상세에서는 읽기 전용, 수정에서는 입력 가능 */}
        <BadgeBasicSection
          mode={mode}
          badge={badgeQuery.data}
          form={isEdit ? editForm.state.form : undefined}
          isSubmitting={isSubmitting}
          onChangeName={isEdit ? editForm.actions.setBadgeName : undefined}
          onSelectFile={isEdit ? editForm.actions.setBadgeFile : undefined}
        />
        {/* 배지를 부여받은 멤버 목록 영역 */}
        <BadgeAssignedMemberSection
          mode={mode}
          members={members}
          onRemoveMember={isEdit ? editForm.actions.removeMember : undefined}
          onAddMember={
            isEdit ? () => router.push(PAGE_ROUTES.BADGE_MNG.ASSIGN(badgeId)) : undefined
          }
        />
        {/* 수정 모드에서만 노출되는 배지 삭제 액션 */}
        {isEdit && (
          <BadgeEditActionSection
            isDisabled={isSubmitting}
            onDelete={editForm.actions.handleOpenDeleteAlert}
          />
        )}
      </div>
      {/* 수정 모드에서만 노출되는 하단 고정 저장 버튼 */}
      {isEdit && (
        <BadgeEditBottomBar
          canSubmit={editForm.state.canSubmit}
          isSubmitting={isSubmitting}
          onSubmit={editForm.actions.handleOpenSaveAlert}
        />
      )}
    </div>
  );
};
