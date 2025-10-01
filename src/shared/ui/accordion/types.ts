// 아코디언 그룹이 관리하는 아코디언 하나
export type AccordionGroupData = {
  title: string;
  isDisabled?: boolean;
  children: React.ReactNode;
  renderTitle?: (index: number | undefined, title: string) => React.ReactNode;
};

// 아코디언 그룹 컴포넌트가 받을 props
export type AccordionGroupProps = {
  accordions: AccordionGroupData[];
};

// 아코디언 컴포넌트가 받을 props
export type AccordionProps = {
  index?: number;
  title: string;
  defaultOpen?: boolean;
  isDisabled?: boolean;
  children: React.ReactNode;
  renderTitle?: (index: number | undefined, title: string) => React.ReactNode;
};
