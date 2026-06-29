import { Avatar } from '@surf/ui/avatar';
import type { ActivityScoreMember } from '../model/types';

type ScoreMemberScoreListProps = {
  members: ActivityScoreMember[];
  onClickMember: (memberId: number) => void;
};

const headerClassName =
  'grid grid-cols-[minmax(0,1fr)_3.5rem_3.75rem_3.75rem_3.75rem] items-center px-13 pt-11 pb-8 text-body-body11 text-foreground-normal';
const rowClassName =
  'grid min-h-[3rem] w-full grid-cols-[minmax(0,1fr)_3.5rem_3.75rem_3.75rem_3.75rem] items-center px-13 text-left';
const scoreClassName = 'text-body-body8 text-foreground-normal text-center';

export const ScoreTableHeader = () => {
  return (
    <div className={headerClassName}>
      <span>이름</span>
      <span className="text-center">파트</span>
      <span className="text-center">상점</span>
      <span className="text-center">벌점</span>
      <span className="text-center">종합</span>
    </div>
  );
};

export const ScoreMemberScoreList = ({ members, onClickMember }: ScoreMemberScoreListProps) => {
  return (
    <ul>
      {members.map((member) => (
        <li key={member.id}>
          <button
            type="button"
            className={rowClassName}
            onClick={() => onClickMember(member.id)}
            aria-label={`${member.name} 점수 상세 보기`}
          >
            <span className="flex min-w-0 items-center gap-7">
              <Avatar src={member.profileImageUrl} size="xs" alt={`${member.name} 프로필 이미지`} />
              <span className="text-body-body6 text-foreground-normal truncate">{member.name}</span>
            </span>
            <span className={scoreClassName}>{member.partCode}</span>
            <span className={scoreClassName}>{member.positiveScore}</span>
            <span className={scoreClassName}>{member.negativeScore}</span>
            <span className={scoreClassName}>{member.totalScore}</span>
          </button>
        </li>
      ))}
    </ul>
  );
};
