import { Accordion } from '@surf/ui/accordion';
import { GenerationGroup } from '@/entities/group-management/model/types';
import { ContentItem } from '@/shared/ui/content-item';

interface Props {
  generationGroup: GenerationGroup;
  onClick?: (id: number) => void;
}

export const GroupManagementAccordionItem = ({ generationGroup, onClick }: Props) => {
  const { generation, groupList } = generationGroup;
  return (
    <Accordion title={`${generation}기`}>
      {groupList.map((group) => (
        <ContentItem
          key={group.id}
          id={group.id}
          name={group.name}
          isReorderMode={false}
          badge={{ kind: 'contents', type: group.type }}
          onClick={() => onClick?.(group.id)}
        />
      ))}
    </Accordion>
  );
};
