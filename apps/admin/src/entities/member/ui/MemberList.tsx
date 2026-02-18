import type { MemberBase } from '@/entities/member/model/types';

type MemberListProps = {
  members: MemberBase[];
  isLoading?: boolean;
  loadingFallback?: React.ReactNode;
  renderItem: (m: MemberBase) => React.ReactNode;
};

const loadingView = <div className="text-foreground-tertiary py-4">불러오는 중…</div>;
const emptyView = <div className="text-foreground-tertiary py-4">멤버가 없어요.</div>;

export const MemberList = ({
  members,
  isLoading = false,
  loadingFallback,
  renderItem,
}: MemberListProps) => {
  if (isLoading) return loadingFallback ?? loadingView;
  if (members.length === 0) return emptyView;
  return members.map((m) => <div key={m.id}>{renderItem(m)}</div>);
};
