import { Suspense } from 'react';
import { SignupRequestListContent } from './SignupRequestListContent';
import { RequestListTopBar } from '@/features/signup-request/ui/RequestListTopBar';
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary';

interface SignupRequestListWidgetProps {
  keyword: string;
}

/**
 * 가입 신청 목록 위젯
 *
 * 가입 신청 목록과 관련된 UI 요소들을 조합합니다.
 * - 상단 바 (전체 멤버 수, 선택 모드) - 항상 표시
 * - 가입 신청 목록 (스크롤 가능) - Suspense로 로딩 처리
 *
 */
export const SignupRequestListWidget = ({ keyword }: SignupRequestListWidgetProps) => {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* 회원가입 요청 상단 바 */}
      <RequestListTopBar mode="view" selectCount={0} totalCount={0} />
      {/* 회원가입 요청 멤버 리스트*/}
      <ErrorBoundary fallback={<div>error</div>}>
        <Suspense fallback={<div>loading...</div>}>
          <SignupRequestListContent keyword={keyword} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};
