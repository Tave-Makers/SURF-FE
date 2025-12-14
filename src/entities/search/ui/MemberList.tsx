import { MemberItemUser } from '../model/types';
import { MemberItem } from './MemberItem';

export type MemberListProps = {
  members: MemberItemUser[];
};

export const MemberList = ({ members }: MemberListProps) => {
  return (
    <ul className="flex flex-col">
      {members.map((member) => (
        <li key={member.name}>
          <MemberItem user={member} />
        </li>
      ))}
    </ul>
  );
};
