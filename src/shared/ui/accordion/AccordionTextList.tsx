import { AccordionItemData } from './types';
import { AccordionTextItem } from './AccordionTextItem';

export const AccordionTextList = ({ items }: { items: AccordionItemData[] }) => {
  return (
    <div className="space-y-[1.5rem]">
      {items.map((item, idx) => (
        <AccordionTextItem key={idx} index={idx + 1} {...item} />
      ))}
    </div>
  );
};
