'use client';

import { HeaderMode } from '@surf/ui/header';
import { TextInput } from '@surf/ui/text-input';
import { useBadgeAssignPage } from '@/app-pages/badge/model/useBadgeAssignPage';
import { BottomActionBar } from '@/shared/ui/BottomActionBar';
import { BadgeAssignAccordionList } from '@/widgets/badge/ui/BadgeAssignAccordionList';
import { AppHeader } from '@/widgets/header/ui/AppHeader';

type BadgeAssignPageProps = {
  badgeId: number;
};

export const BadgeAssignPage = ({ badgeId }: BadgeAssignPageProps) => {
  const { state, actions } = useBadgeAssignPage(badgeId);

  return (
    <>
      <AppHeader
        customBack={actions.handleBack}
        overrideHeader={{
          mode: HeaderMode.Default,
          title: '활동 배지 부여',
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
            value={state.keyword}
            onChange={actions.setKeyword}
            aria-label="회원이름 검색"
          />
        </div>

        {/* 현재 선택된 멤버 수 안내 영역 */}
        <div className="shrink-0 px-13 pt-10">
          <p className="text-body-body8 text-foreground-normal-lighter">
            {state.selectedIds.size}명 선택중
          </p>
        </div>

        {/* 기수별 멤버 목록 영역 */}
        <BadgeAssignAccordionList
          generations={state.generations}
          keyword={state.debouncedKeyword}
          selectedIds={state.selectedIds}
          assignedMemberIds={state.assignedMemberIds}
          onToggle={actions.toggleSelect}
        />

        {/* 선택된 멤버에게 배지를 부여하는 하단 액션 */}
        <div className="shrink-0">
          <BottomActionBar actions={actions.bottomActions} />
        </div>
      </div>
    </>
  );
};
