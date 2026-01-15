'use client';

import { AccordionGroup } from '@surf/ui/accordion';
import { AccordionGroupProps } from '@surf/ui/accordion';
import { trackBylawsEvent } from '@/features/bylaws/lib/trackBylawsEvent';
import { BYLAWS_EVENTS } from '@/features/bylaws/model/types';

export const BylawsAccordionGroup = ({ accordions }: AccordionGroupProps) => {
  const handleClick = (title: string, isOpen: boolean) => {
    if (isOpen) {
      trackBylawsEvent(BYLAWS_EVENTS.CLICK_RULES_SECTION, {
        section_name: title,
      });
    }
  };

  // accordionGroup이 render만 담당하므로,
  // children으로 트래킹용 클릭 핸들러를 넘긴다.
  const accordionsWithTracking = accordions.map((section) => ({
    ...section,
    onToggle: (isOpen: boolean) => handleClick(section.title, isOpen),
  }));

  return <AccordionGroup accordions={accordionsWithTracking} />;
};
