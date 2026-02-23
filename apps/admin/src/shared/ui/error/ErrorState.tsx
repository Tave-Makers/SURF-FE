import { ReactNode } from 'react';
import ErrorSpaceIcon from '@/shared/assets/icons/error-space-icon.svg';

/**
 * 공통 에러 상태 UI 설정값입니다.
 */
type ErrorStateProps = {
  /** 에러 메시지 텍스트 (기본값: 다시 시도해주세요) */
  message?: string;
  /** 메시지 아래에 추가로 렌더링할 액션 영역 */
  action?: ReactNode;
  /** 최상위 컨테이너에 병합할 클래스명 */
  className?: string;
  /** true면 부모 높이를 가득 채워 중앙 정렬 */
  fullHeight?: boolean;
};

/**
 * 아이콘 + 메시지 형태의 공통 에러 UI 컴포넌트입니다.
 */
export const ErrorState = ({
  message = '다시 시도해주세요',
  action,
  className,
  fullHeight = true,
}: ErrorStateProps) => {
  /** fullHeight/className 옵션을 반영한 컨테이너 클래스 */
  const containerClassName = [
    'flex w-full items-center justify-center',
    fullHeight ? 'h-full' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClassName}>
      <div className="flex flex-col items-center gap-11 text-center">
        <ErrorSpaceIcon aria-hidden="true" />
        <p className="text-body-body8 text-foreground-tertiary">{message}</p>
        {action}
      </div>
    </div>
  );
};
