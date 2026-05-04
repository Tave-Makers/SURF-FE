'use client';

import { useDebouncedValue } from '@surf/hooks';
import { HeaderMode } from '@surf/ui/header';
import { useToastStore } from '@surf/ui/store/toastStore';
import { TextInput } from '@surf/ui/text-input';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAssignBadgeMembersMutation } from '@/features/badge/model/queries/useAssignBadgeMembersMutation';
import { useBadgeMembersQuery } from '@/features/badge/model/queries/useBadgeMembersQuery';
import { PAGE_ROUTES } from '@/shared/config/path';
import { useSelectableListState } from '@/shared/hooks/useSelectableListState';
import { BottomActionBar } from '@/shared/ui/BottomActionBar';
import { BadgeAssignAccordionList } from '@/widgets/badge/ui/BadgeAssignAccordionList';
import { AppHeader } from '@/widgets/header/ui/AppHeader';
import { useMemberGenerationListQuery } from '@/widgets/member-directory/model/queries/useMemberGenerationListQuery';

type BadgeAssignPageProps = {
  badgeId: number;
};

export const BadgeAssignPage = ({ badgeId }: BadgeAssignPageProps) => {
  const router = useRouter();
  const showToast = useToastStore((s) => s.show);
  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebouncedValue(keyword, 300);

  const { selectedIds, toggleSelect, resetSelectionState } = useSelectableListState<number>({
    initialMode: 'select',
  });

  const { data: generations } = useMemberGenerationListQuery();
  const { data: assignedMembers = [] } = useBadgeMembersQuery(badgeId);
  const { mutateAsync: assignBadgeMembers, isPending } = useAssignBadgeMembersMutation(badgeId);

  const assignedMemberIds = new Set(assignedMembers.map((member) => member.id));

  const handleSubmit = async () => {
    if (selectedIds.size === 0 || isPending) return;

    try {
      await assignBadgeMembers({ memberIds: [...selectedIds] });
      showToast('배지가 부여되었습니다.');
      resetSelectionState();
      router.replace(PAGE_ROUTES.BADGE_MNG.EDIT(badgeId));
    } catch {
      showToast('배지 부여에 실패했습니다.');
    }
  };

  const bottomActions = [
    {
      key: 'assign',
      label: '부여하기',
      onClick: () => void handleSubmit(),
      disabled: selectedIds.size === 0 || isPending,
    },
  ];

  return (
    <>
      <AppHeader
        customBack={() => router.push(PAGE_ROUTES.BADGE_MNG.EDIT(badgeId))}
        overrideHeader={{
          mode: HeaderMode.Default,
          title: '활동 뱃지 부여',
          hasLeftIcon: true,
        }}
      />
      <div className="flex h-full min-h-0 w-full flex-col">
        {/* 회원 검색 입력 영역 */}
        <div className="shrink-0 px-13">
          <TextInput
            mode="search"
            placeholder="회원이름을 검색해주세요"
            iconName="Search"
            value={keyword}
            onChange={(value) => setKeyword(value)}
            aria-label="회원이름 검색"
          />
        </div>

        {/* 현재 선택된 멤버 수 안내 영역 */}
        <div className="shrink-0 px-13 pt-10">
          <p className="text-body-body8 text-foreground-normal-lighter">
            {selectedIds.size}명 선택중
          </p>
        </div>

        {/* 기수별 멤버 목록 영역 */}
        <BadgeAssignAccordionList
          generations={generations}
          keyword={debouncedKeyword}
          selectedIds={selectedIds}
          assignedMemberIds={assignedMemberIds}
          onToggle={toggleSelect}
        />

        {/* 선택된 멤버에게 배지를 부여하는 하단 액션 */}
        <div className="shrink-0">
          <BottomActionBar actions={bottomActions} />
        </div>
      </div>
    </>
  );
};
