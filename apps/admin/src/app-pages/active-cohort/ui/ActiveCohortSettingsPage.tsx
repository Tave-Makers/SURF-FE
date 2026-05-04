'use client';

import { SelectField } from '@surf/ui/select-field';
import { useActiveGenerationQuery } from '@/entities/active-cohort/model/queries/useActiveGenerationQuery';
import { useUpdateActiveGenerationMutation } from '@/features/active-cohort/model/useUpdateActiveGenerationMutation';
import { useBottomSheetStore } from '@/shared/store/bottomSheetStore';

export const ActiveCohortSettingsPage = () => {
  const { data } = useActiveGenerationQuery();
  const { mutate } = useUpdateActiveGenerationMutation();
  const openBottomSheet = useBottomSheetStore((s) => s.open);

  const handleOpenCohortSelect = () => {
    openBottomSheet({
      type: 'cohort',
      props: {
        maxCohort: 30,
        selectedCohort: data?.generation ?? null,
        onSelect: (cohort) => {
          mutate(cohort);
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
        size="l"
        placeholder="활동기수를 설정해 주세요."
        selectedValue={data?.generation ? `${data.generation}기` : undefined}
        onClick={handleOpenCohortSelect}
      />
    </div>
  );
};
