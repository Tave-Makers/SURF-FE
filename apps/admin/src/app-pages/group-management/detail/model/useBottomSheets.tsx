import { useCallback } from 'react';
import type { MemberSummary } from '@/entities/member/model/types';
import { useBottomSheetStore } from '@/shared/store/bottomSheetStore';
import type { ContentsType } from '@/shared/types/contents';

type Params = {
  // generation
  maxGeneration: number;
  selectedGeneration: number;
  onSelectGeneration: (v: number) => void;

  // groupType
  selectedGroupType: ContentsType;
  onSelectGroupType: (v: ContentsType) => void;

  // pickLeader
  members: MemberSummary[];
  onSelectLeader: (m: MemberSummary) => void;
};

export const useBottomSheets = ({
  maxGeneration,
  selectedGeneration,
  onSelectGeneration,
  selectedGroupType,
  onSelectGroupType,
  members,
  onSelectLeader,
}: Params) => {
  const open = useBottomSheetStore((s) => s.open);
  const close = useBottomSheetStore((s) => s.close);

  const openGenerationBottomSheet = useCallback(() => {
    open({
      type: 'generation',
      props: {
        maxGeneration,
        selectedGeneration,
        onSelect: (val: number) => {
          onSelectGeneration(val);
          close();
        },
      },
    });
  }, [open, close, maxGeneration, selectedGeneration, onSelectGeneration]);

  const openGroupTypeBottomSheet = useCallback(() => {
    open({
      type: 'groupType',
      props: {
        groupType: selectedGroupType,
        onSelect: (val: ContentsType) => {
          onSelectGroupType(val);
          close();
        },
      },
    });
  }, [open, close, selectedGroupType, onSelectGroupType]);

  const openPickLeaderBottomSheet = useCallback(() => {
    open({
      type: 'pickLeader',
      props: {
        members,
        onSelect: (member: MemberSummary) => {
          onSelectLeader(member);
          close();
        },
      },
    });
  }, [open, close, members, onSelectLeader]);

  return {
    openGenerationBottomSheet,
    openGroupTypeBottomSheet,
    openPickLeaderBottomSheet,
  };
};
