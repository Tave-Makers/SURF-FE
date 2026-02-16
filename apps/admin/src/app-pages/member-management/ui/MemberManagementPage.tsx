'use client';
import { useDebouncedValue } from '@surf/hooks';
import { TextInput } from '@surf/ui/text-input';
import { useState } from 'react';
import { MemberDirectoryWidget } from '@/widgets/member-directory/ui/MemberDirectoryWidget';

/**
 * 멤버 관리 페이지
 */
export const MemberManagementPage = () => {
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
      <MemberDirectoryWidget keyword={debouncedKeyword} />
    </main>
  );
};
