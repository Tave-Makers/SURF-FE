'use client';

import { BlockedMemberList, useBlockedMembersQuery, useUnblockMember } from '@/features/block';
import SearchEmpty from '@/shared/assets/icons/empty-space/search-empty.svg';

const BlockedMembersPage = () => {
  const { data: members, isLoading, isError } = useBlockedMembersQuery();
  const confirmUnblock = useUnblockMember();

  if (isLoading) return <div className="flex h-full w-full items-center justify-center" />;

  if (isError) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <span className="text-body-body8 text-foreground-tertiary">
          차단한 회원을 불러오지 못했습니다.
        </span>
      </div>
    );
  }

  if (!members || members.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 pb-25">
        <SearchEmpty
          className="h-[5.59944rem] w-[5.59944rem]"
          aria-hidden="true"
          focusable="false"
        />
        <span className="text-body-body8 text-foreground-tertiary">차단한 회원이 없어요</span>
      </div>
    );
  }

  return <BlockedMemberList members={members} onSelectMember={confirmUnblock} />;
};

export default BlockedMembersPage;
