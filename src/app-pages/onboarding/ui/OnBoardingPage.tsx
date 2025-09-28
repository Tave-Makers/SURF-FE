'use client';
import { SelectField } from '@/shared/ui/select-field/SelectField';
import { SolidButton } from '@/shared/ui/solid-button/SolidButton';
import { TextArea } from '@/shared/ui/text-area/TextArea';
import { FieldGroup } from '@/widgets/field-group/ui/FieldGroup';
import { useState } from 'react';

export default function OnBoardingPage() {
  const [univ, setUniv] = useState('');
  return (
    <>
      <div className="flex h-full w-full flex-col justify-between px-[1rem]">
        <div className="flex flex-col gap-[0.25rem]">
          <div className="text-head-18-700--1 text-foreground-normal">
            필수 정보를 입력해주세요.
          </div>
          <div className="text-body-14-400--2-24 text-foreground-normal">
            기존 TAVE 활동 정보를 입력해주세요
          </div>
        </div>
        <div className="flex flex-col gap-[1.5rem] pt-[2.5rem]">
          <FieldGroup title="기수 및 파트" isRequired>
            <SelectField size="l" placeholder="기수 및 파트를 선택해주세요" />
          </FieldGroup>
          <FieldGroup title="대학교" isRequired>
            <TextArea
              placeholder="대학교를 입력해주세요."
              value={univ}
              onChange={(value) => setUniv(value)}
              isOneLine
            />
          </FieldGroup>
        </div>

        <SolidButton size="l" variant="primary" className="mt-auto mb-[1.25rem]">
          다음
        </SolidButton>
      </div>
    </>
  );
}
