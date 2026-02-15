import { Accordion } from '@surf/ui/accordion';
import { MemberBase } from '@/entities/member/model/types';

type MemberGenerationAccordionProps = {
  generation: number;
  label?: string;
  members: MemberBase[];
  isLoading?: boolean;
  loadingFallback?: React.ReactNode;
  contentClassName?: string;
  contentRef?: React.Ref<HTMLDivElement>;
  footer?: React.ReactNode;
  renderItem: (m: MemberBase) => React.ReactNode;
  onToggle?: (isOpen: boolean) => void;
};

const loadingView = <div className="text-foreground-tertiary py-4">불러오는 중…</div>;
const emptyView = <div className="text-foreground-tertiary py-4">멤버가 없어요.</div>;

export const MemberGenerationAccordion = ({
  generation,
  label,
  members,
  footer,
  isLoading = false,
  loadingFallback,
  contentClassName,
  contentRef,
  renderItem,
  onToggle,
}: MemberGenerationAccordionProps) => {
  return (
    <Accordion title={label ?? `${generation}기`} onToggle={onToggle}>
      <div ref={contentRef} className={contentClassName}>
        {isLoading
          ? (loadingFallback ?? loadingView)
          : members.length === 0
            ? emptyView
            : members.map((m) => <div key={m.id}>{renderItem(m)}</div>)}
        {footer}
      </div>
    </Accordion>
  );
};
