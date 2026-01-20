'use client';

import { TextInput } from '@surf/ui/text-input';
import { useState } from 'react';
import { useSignupRequestList } from '@/features/signup-request/model/queries/useSignupRequestList';
import { SignupRequestListWidget } from '@/widgets/signup-request/ui/SignupRequestListWidget';

/**
 * 가입 신청 목록 페이지
 *
 * 검색 상태를 관리하고 useSignupRequestList 훅을 호출하여
 * 데이터를 가져와 Widget에 전달합니다.
 */
export const SignupRequestPage = () => {
  const [keyword, setKeyword] = useState('');

  const { members, totalCount, isLoading, isError } = useSignupRequestList({
    keyword,
  });

  return (
    <main className="w-full flex-1 flex-col overflow-y-auto">
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
      {/* 회원가입 요청 리스트 위젯, 승인/거절 액션 수행 */}
      <SignupRequestListWidget
        members={members}
        totalCount={totalCount}
        isLoading={isLoading}
        isError={isError}
      />
    </main>
  );
};
