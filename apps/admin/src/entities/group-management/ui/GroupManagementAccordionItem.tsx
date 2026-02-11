import { Accordion } from '@surf/ui/accordion';
import { ContentItem, ContentsType } from '@/shared/ui/ContentItem';

interface Props {
  generation: number;
  groupList: { id: number; name: string; type: ContentsType }[];
  onClick?: (id: number) => void;
}

const renderItem = (
  id: number,
  name: string,
  type: ContentsType,
  onClick?: (id: number) => void,
) => {
  return (
    <div>
      <ContentItem
        id={id}
        name={name}
        isReorderMode={false}
        badge={{ kind: 'contents', type }}
        onClick={() => onClick?.(id)}
      />
    </div>
  );
};

export const GroupManagementAccordionItem = ({ generation, groupList, onClick }: Props) => {
  return (
    <div className="flex flex-col">
      <Accordion title={String(generation) + '기'}>
        {groupList.map((group) => (
          <div key={group.id} className="flex flex-col">
            {renderItem(group.id, group.name, group.type, onClick && (() => onClick(group.id)))}
          </div>
        ))}
      </Accordion>
    </div>
  );
};
