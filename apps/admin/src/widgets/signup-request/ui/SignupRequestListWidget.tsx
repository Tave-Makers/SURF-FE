import { SignupRequestMember } from '@/features/signup-request/model/types';
import { RequestListTopBar } from '@/features/signup-request/ui/RequestListTopBar';
import { SignupRequestList } from '@/features/signup-request/ui/SignupRequestList';

interface SignupRequestListWidgetProps {
  members: SignupRequestMember[];
  totalCount: number;
  isLoading: boolean;
  isError: boolean;
}

/**
 * 가입 신청 목록 위젯
 *
 * 가입 신청 목록과 관련된 UI 요소들을 조합합니다.
 * - 상단 바 (전체 멤버 수, 선택 모드)
 * - 가입 신청 목록
 * - 하단 액션 바 (승인/거절)
 */
export const SignupRequestListWidget = ({
  members,
  totalCount,
  isLoading,
  isError,
}: SignupRequestListWidgetProps) => {
  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (isError) {
    return <div>에러가 발생했습니다.</div>;
  }

  return (
    <>
      {/* 회원가입 요청 상단 바 (전체 멤버 수, 선택하기 버튼) */}
      <RequestListTopBar mode="view" selectCount={0} totalCount={totalCount} />
      {/* 회원가입 요청 멤버 리스트 */}
      <SignupRequestList members={members} />
    </>
  );
};
