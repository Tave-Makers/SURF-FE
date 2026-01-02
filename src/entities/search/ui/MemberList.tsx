import { MemberSearchItem } from '../model/types';
import { MemberItem } from './MemberItem';

interface MemberListProps {
  keyword?: string;
  members: MemberSearchItem[];
  onClick?: (id: number) => void;
}

export const MemberList = ({ members, keyword, onClick }: MemberListProps) => {
  return (
    <ul className="flex flex-col">
      {members.map((member) => (
        <li key={member.userId}>
          <MemberItem user={member} keyword={keyword} onClick={() => onClick?.(member.userId)} />
        </li>
      ))}
    </ul>
  );
};
