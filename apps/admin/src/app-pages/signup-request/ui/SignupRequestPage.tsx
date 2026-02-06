'use client';

import { TextInput } from '@surf/ui/text-input';
import { Suspense, useState } from 'react';

import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary';
import { SignupRequestListWidget } from '@/widgets/signup-request/ui/SignupRequestListWidget';

/**
 * 가입 신청 목록 페이지
 */
export const SignupRequestPage = () => {
  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebouncedValue(keyword, 300);

  return (
    <main className="flex h-full w-full flex-col">
      {/* 회원 이름 검색 인풋  */}
      <div className="px-16">
        <TextInput
          mode="search"
          placeholder="회원이름을 검색해주세요"
          iconName="Search"
          value={keyword}
          onChange={(value) => setKeyword(value)}
        />
      </div>
      {/* 회원가입 요청 리스트 위젯, 승인/거절 액션 수행 
        TODO: 에러/로딩 컴포넌트 적용 필요
      */}
      <ErrorBoundary fallback={<div>error</div>}>
        <Suspense fallback={<div>loading...</div>}>
          <SignupRequestListWidget keyword={debouncedKeyword} />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
};
