import { AccordionItemData } from '../model/types';

// 회칙 전용 UI 컴포넌트 Props

// 아코디언 안에 들어가는 개별 아이템 컴포넌트가 받을 props
export type AccordionTextItemProps = {
  index: number; // UI에서만 쓰이는 번호
  title: string;
  scoreChange?: string;
  descriptions?: string[];
  showIndex?: boolean; // 배열 길이 >= 2일 때만 true
};

// TextList (아이템 배열을 받음)
export type AccordionTextListProps = {
  items: AccordionItemData[];
};
