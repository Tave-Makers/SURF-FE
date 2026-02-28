import { GenerationGroup } from '@/entities/group-management/model/types';
import { GroupManagementAccordionItem } from '@/entities/group-management/ui/GroupManagementAccordionItem';

interface Props {
  generationGroups: GenerationGroup[];
  onClick?: (id: number) => void;
}

export const GroupManagementAccordionList = ({ generationGroups, onClick }: Props) => {
  if (generationGroups.length === 0) return <div>그룹 목록이 존재하지 않습니다.</div>;
  return (
    <div className="flex flex-col">
      {generationGroups.map((group) => (
        <GroupManagementAccordionItem
          key={group.generation}
          generationGroup={group}
          onClick={onClick}
        />
      ))}
    </div>
  );
};
