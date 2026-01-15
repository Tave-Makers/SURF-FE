import { Accordion } from './Accordion';
import { AccordionGroupProps } from './types';

/**
 * 여러 개의 Accordion을 리스트 기반으로 렌더링하는 그룹 컴포넌트.
 * 각 아이템에 자동으로 index를 부여하여 넘버링된 UI를 만들 때 사용.
 */

export const AccordionGroup = ({ accordions }: AccordionGroupProps) => {
  return (
    <div>
      {accordions.map((accordion, idx) => (
        <Accordion
          key={idx}
          index={idx + 1}
          title={accordion.title}
          isDisabled={accordion.isDisabled}
          renderTitle={accordion.renderTitle}
          onToggle={accordion.onToggle}
        >
          {accordion.children}
        </Accordion>
      ))}
    </div>
  );
};
