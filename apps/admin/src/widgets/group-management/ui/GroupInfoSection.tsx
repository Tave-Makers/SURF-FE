import { FieldGroup } from '@surf/ui/field-group';
import { SelectField } from '@surf/ui/select-field';
import { TextArea } from '@surf/ui/text-area';
import { CONTENTS_TYPE_LABEL } from '@/shared/constants/contents';
import { ContentsType } from '@/shared/types/contents';
import { GroupManagementMode } from '@/widgets/group-management/model/types';

interface GroupInfoSectionProps {
  mode: GroupManagementMode;
  generation: number;
  groupType: ContentsType;
  groupName: string;
  groupIntroduction: string;
  onOpenGeneration: () => void;
  onOpenGroupType: () => void;
  onChangeGroupName: (value: string) => void;
  onChangeGroupIntroduction: (value: string) => void;
}

export const GroupInfoSection = ({
  mode,
  generation,
  groupType,
  groupName,
  groupIntroduction,
  onOpenGeneration,
  onOpenGroupType,
  onChangeGroupName,
  onChangeGroupIntroduction,
}: GroupInfoSectionProps) => {
  const isDisabled = mode === 'view';
  return (
    <div className="flex flex-col gap-14 px-14">
      <FieldGroup title="기수" isRequired>
        <SelectField
          size="l"
          selectedValue={generation.toString() + '기'}
          isDisabled={isDisabled}
          onClick={onOpenGeneration}
        />
      </FieldGroup>
      <FieldGroup title="그룹 유형" isRequired>
        <SelectField
          size="l"
          selectedValue={CONTENTS_TYPE_LABEL[groupType]}
          isDisabled={isDisabled}
          onClick={onOpenGroupType}
        />
      </FieldGroup>
      <FieldGroup title="그룹명" isRequired>
        <TextArea
          value={groupName}
          mode="oneLine"
          placeholder="그룹명을 입력해주세요."
          readOnly={isDisabled}
          isDisabled={isDisabled}
          onChange={onChangeGroupName}
        />
      </FieldGroup>
      <FieldGroup title="그룹 소개" isRequired>
        <TextArea
          value={groupIntroduction}
          mode="multiLine"
          textLimit={500}
          placeholder="그룹 소개를 작성해주세요."
          readOnly={isDisabled}
          isDisabled={isDisabled}
          onChange={onChangeGroupIntroduction}
        />
      </FieldGroup>
    </div>
  );
};
