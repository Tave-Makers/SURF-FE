import { MemberSearchItem } from '../model/types';
import { MemberItem } from './MemberItem';

interface MemberListProps {
  keyword?: string;
  members: MemberSearchItem[];
}

export const MemberList = ({ members, keyword }: MemberListProps) => {
  return (
    <ul className="flex flex-col">
      {members.map((member) => (
        <li key={member.userId}>
          <MemberItem user={member} keyword={keyword} />
        </li>
      ))}
    </ul>
  );
};
