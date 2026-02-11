import { GroupManagementAccordionItem } from '@/entities/group-management/ui/GroupManagementAccordionItem';
import { ContentsType } from '@/shared/ui/ContentItem';

interface Props {
  groupedByGeneration: {
    generation: number;
    groupList: { id: number; name: string; type: ContentsType }[];
  }[];
}
export const GroupManagementAccordionList = ({ groupedByGeneration }: Props) => {
  return (
    <div className="flex flex-col">
      {groupedByGeneration.map(({ generation, groupList }) => (
        <div key={generation}>
          <GroupManagementAccordionItem generation={generation} groupList={groupList} />
        </div>
      ))}
    </div>
  );
};
