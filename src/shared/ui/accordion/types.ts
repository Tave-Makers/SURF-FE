// 아코디언 그룹이 관리하는 아코디언 하나
export type AccordionGroupData = {
  title: string;
  items: AccordionItemData[];
  isDisabled?: boolean;
};

// 아코디언 그룹 컴포넌트가 받을 props
export type AccordionGroupProps = {
  accordions: AccordionGroupData[];
};

// 아코디언 안에 들어가는 개별 아이템
export type AccordionItemData = {
  title: string;
  scoreChange: string;
  descriptions?: string[];
};

// 아코디언 컴포넌트가 받을 props
export type AccordionProps = {
  index: number;
  title: string;
  items: AccordionItemData[];
  defaultOpen?: boolean;
  isDisabled?: boolean;
};

// 아코디언 안에 들어가는 개별 아이템 컴포넌트가 받을 props
export type AccordionTextItemProps = {
  index: number;
  title: string;
  scoreChange: string;
  descriptions?: string[];
};
