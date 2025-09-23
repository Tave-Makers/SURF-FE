import { AccordionGroupProps } from './types';
import { Accordion } from './Accordion';

export const AccordionGroup = ({ accordions }: AccordionGroupProps) => {
  return (
    <div>
      {accordions.map((accordion, idx) => (
        <Accordion
          key={idx}
          index={idx + 1}
          title={accordion.title}
          items={accordion.items}
          isDisabled={accordion.isDisabled}
        />
      ))}
    </div>
  );
};
