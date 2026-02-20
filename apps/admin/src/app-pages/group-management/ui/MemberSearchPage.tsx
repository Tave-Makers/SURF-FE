'use client';

import { useDebouncedValue } from '@surf/hooks';
import { SolidButton } from '@surf/ui/button';
import { HeaderMode } from '@surf/ui/header';
import { TextInput } from '@surf/ui/text-input';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMemberBaseListQuery } from '@/entities/member/model/queries/useMemberBaseListQuery';
import { useGroupFormStore } from '@/features/group-management/model/useGroupFormStore';
import { useSelectableListState } from '@/shared/hooks/useSelectableListState';
import { MemberSearchAccordionList } from '@/widgets/group-management/ui/MemberSearchAccordionList';
import { AppHeader } from '@/widgets/header/ui/AppHeader';

interface MemberSearchPageProps {
  generation: number;
  formKey: string;
}

export const MemberSearchPage = ({ generation, formKey }: MemberSearchPageProps) => {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');

  const debouncedKeyword = useDebouncedValue(keyword, 300);

  const { selectedIds, toggleSelect, resetSelectionState } = useSelectableListState<number>({
    initialMode: 'select',
  });

  const addMembers = useGroupFormStore((s) => s.addMembers);
  const { members } = useMemberBaseListQuery([...selectedIds]);

  const handleComplete = () => {
    const membersToAdd = members.filter((m) => selectedIds.has(m.id));

    addMembers(formKey, membersToAdd);
    resetSelectionState();
    router.back();
  };

  useEffect(() => {
    resetSelectionState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-full w-full flex-col">
      <AppHeader
        overrideHeader={{ mode: HeaderMode.Default, title: '팀원 설정', hasLeftIcon: true }}
      />
      {/** 검색어 입력창 */}
      <div className="px-13">
        <TextInput
          mode="search"
          placeholder="회원이름을 검색해주세요"
          iconName="Search"
          value={keyword}
          onChange={(value) => setKeyword(value)}
        />
      </div>
      {/** 상세 화면에서 선택한 기수의 회원 목록 리스트 */}
      <MemberSearchAccordionList
        generations={[generation]}
        keyword={debouncedKeyword}
        selectedIds={selectedIds}
        onToggle={toggleSelect}
      />
      <div className="px-13 pt-13 pb-16">
        <SolidButton
          size="l"
          variant="primary"
          onClick={handleComplete}
          isDisabled={selectedIds.size === 0}
        >
          적용하기
        </SolidButton>
      </div>
    </div>
  );
};
