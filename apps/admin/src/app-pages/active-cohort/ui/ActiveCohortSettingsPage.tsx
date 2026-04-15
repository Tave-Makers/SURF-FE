'use client';

import { SelectField } from '@surf/ui/select-field';
import { useState } from 'react';
import { useBottomSheetStore } from '@/shared/store/bottomSheetStore';

export const ActiveCohortSettingsPage = () => {
  const [selectedCohort, setSelectedCohort] = useState<number | null>(null);
  const openBottomSheet = useBottomSheetStore((s) => s.open);
  const closeBottomSheet = useBottomSheetStore((s) => s.close);

  const handleOpenCohortSelect = () => {
    openBottomSheet({
      type: 'cohort',
      props: {
        maxCohort: 30,
        selectedCohort,
        onSelect: (cohort) => {
          setSelectedCohort(cohort);
          closeBottomSheet();
        },
      },
    });
  };

  return (
    <div className="flex flex-col gap-10 px-13 py-18">
      <h2 className="text-title-title2 text-foreground-normal">
        현재 활동하는 기수를 선택해 주세요.
      </h2>
      <SelectField
        size="m"
        placeholder="활동기수를 설정해 주세요."
        selectedValue={selectedCohort ? `${selectedCohort}기` : undefined}
        onClick={handleOpenCohortSelect}
      />
    </div>
  );
};
