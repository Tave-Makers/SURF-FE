import { SignupRequestMember } from '../model/types';
import { SignupRequestItem } from '@/entities/signup-request/ui/SignupRequestItem';

interface SignupRequestListProps {
  members: SignupRequestMember[];
}

/**
 * 가입 신청 목록 프레젠테이션 컴포넌트
 *
 * members 배열을 받아서 SignupRequestItem으로 렌더링합니다.
 */
export const SignupRequestList = ({ members }: SignupRequestListProps) => {
  //TODO: Empty Space 적용 필요
  if (members.length === 0) {
    return <div>가입 신청 내역이 없습니다.</div>;
  }

  return (
    <div className="flex w-full grow flex-col">
      {members.map((member) => (
        <SignupRequestItem
          key={member.id}
          name={member.name}
          university={member.university}
          tracks={member.tracks}
          registeredAt={member.registeredAt}
          checked={false}
          status="waiting"
        />
      ))}
    </div>
  );
};
