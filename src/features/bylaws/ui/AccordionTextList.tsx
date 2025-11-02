import { AccordionTextItem } from './AccordionTextItem';
import { AccordionTextListProps } from './types';

export const AccordionTextList = ({ items }: AccordionTextListProps) => {
  const showIndex = items.length > 1;
  return (
    <div className="bg-background-background-secondary-lighter w-full space-y-16 rounded-[0.62rem] px-13 py-15">
      {items.map((item, idx) => (
        <AccordionTextItem key={idx} index={idx + 1} {...item} showIndex={showIndex} />
      ))}
    </div>
  );
};
