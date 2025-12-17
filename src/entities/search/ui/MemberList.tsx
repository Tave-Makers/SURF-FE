import { MemberItemUser } from '../model/types';
import { MemberItem } from './MemberItem';

interface MemberListProps {
  members: MemberItemUser[];
}

export const MemberList = ({ members }: MemberListProps) => {
  return (
    <ul className="flex flex-col">
      {members.map((member) => (
        <li key={member.userId}>
          <MemberItem user={member} />
        </li>
      ))}
    </ul>
  );
};
