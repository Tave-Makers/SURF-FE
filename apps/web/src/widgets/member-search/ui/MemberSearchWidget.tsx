import { Menu } from '@surf/ui/menu';
import { TextInput } from '@surf/ui/text-input';
import { useMemo, useState } from 'react';
import { toEnumPartMap, toLabelPartMap } from '@/entities/user/model/mappers';
import { useGenerationListQuery } from '@/features/member-search/model/queries/useGenerationListQuery';
import { useMemberFilters } from '@/features/member-search/model/useMemberFilters';

interface MemberSearchWidgetProps {
  filters: ReturnType<typeof useMemberFilters>;
  totalCount: number;
}

type OpenMenuType = 'generation' | 'part' | null;

export const MemberSearchWidget = ({ filters, totalCount }: MemberSearchWidgetProps) => {
  const [openMenu, setOpenMenu] = useState<OpenMenuType>(null);
  const { keyword, generation, part, setKeyword, setGeneration, setPart } = filters;

  const { data: generations, isPending, isError } = useGenerationListQuery();

  // 1. 기수 메뉴 아이템 (id를 generation 숫자 그대로 사용)
  const generationItems = useMemo(() => {
    if (isPending) {
      return [{ id: -1, label: '기수 목록 불러오는 중…', isSelected: false, onClick: () => {} }];
    }
    if (isError) {
      return [{ id: -2, label: '기수 목록 조회 실패', isSelected: false, onClick: () => {} }];
    }
    const gens = generations ?? [];
    return [
      { id: 0, label: '전체', isSelected: !generation, onClick: () => setGeneration(undefined) },
      ...gens
        .slice()
        .sort((a, b) => b - a)
        .map((gen) => ({
          id: gen,
          label: `${gen}기`,
          isSelected: generation === gen,
          onClick: () => setGeneration(gen),
        })),
    ];
  }, [generations, generation, setGeneration, isPending, isError]);

  // 2. 파트 메뉴 아이템 (id를 인덱스로 부여)
  const partItems = useMemo(
    () => [
      { id: 100, label: '전체', isSelected: !part, onClick: () => setPart(undefined) },
      ...Object.entries(toEnumPartMap).map(([label, value], index) => ({
        id: index + 101, // 101부터 시작하는 number 타입 id
        label: label,
        isSelected: part === value,
        onClick: () => setPart(value),
      })),
    ],
    [part, setPart],
  );

  // 3. 현재 선택된 파트의 한글 라벨 (버튼 표시용)
  const currentPartLabel = part ? toLabelPartMap[part] : '파트';

  // 메뉴 토글 함수
  const handleToggle = (menuName: OpenMenuType) => {
    setOpenMenu((prev) => (prev === menuName ? null : menuName));
  };

  return (
    <div className="flex flex-col">
      <div className="px-13 py-10">
        <TextInput
          mode="search"
          value={keyword}
          onChange={setKeyword}
          placeholder="이름, 학교를 입력해주세요"
          iconName="Search"
        />
      </div>

      <div className="flex justify-between px-13 pt-10">
        <span>전체 {totalCount}명</span>
        <div className="flex flex-row">
          <Menu
            label={generation ? `${generation}기` : '기수'}
            itemList={generationItems}
            align="right"
            isOpen={openMenu === 'generation'}
            onToggle={() => handleToggle('generation')}
            onClose={() => setOpenMenu(null)}
          />
          <Menu
            label={currentPartLabel}
            itemList={partItems}
            align="right"
            isOpen={openMenu === 'part'}
            onToggle={() => handleToggle('part')}
            onClose={() => setOpenMenu(null)}
          />
        </div>
      </div>
    </div>
  );
};
