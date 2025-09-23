import { AccordionTextItem } from './AccordionTextItem';
import { AccordionTextListProps } from './types';

export const AccordionTextList = ({ items }: AccordionTextListProps) => {
  const showIndex = items.length > 1;
  return (
    <div className="bg-background-tertiary w-full space-y-[1.5rem] rounded-[0.62rem] px-[1rem] py-[1.25rem]">
      {items.map((item, idx) => (
        <AccordionTextItem key={idx} index={idx + 1} {...item} showIndex={showIndex} />
      ))}
    </div>
  );
};
