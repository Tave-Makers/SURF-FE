import { GenerationGroup } from '@/entities/group-management/model/types';
import { GroupManagementAccordionItem } from '@/entities/group-management/ui/GroupManagementAccordionItem';

interface Props {
  generationGroups: GenerationGroup[];
  onClick?: (id: number) => void;
}

export const GroupManagementAccordionList = ({ generationGroups, onClick }: Props) => {
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
