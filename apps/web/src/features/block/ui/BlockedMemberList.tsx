'use client';

import { Avatar } from '@surf/ui/avatar';

import type { BlockedMemberResponse } from '../api/types';

type BlockedMemberListProps = {
  members: BlockedMemberResponse[];
  onSelectMember: (memberId: number) => void;
};

/** 차단한 회원 목록 — 항목을 누르면 차단 해제 확인으로 이어진다 */
export const BlockedMemberList = ({ members, onSelectMember }: BlockedMemberListProps) => (
  <ul className="flex w-full flex-col gap-5 px-13 pt-10 pb-13">
    {members.map((member) => (
      <li key={member.memberId}>
        <button
          type="button"
          onClick={() => onSelectMember(member.memberId)}
          className="flex w-full items-center gap-8 px-12 py-10 text-left"
        >
          <Avatar size="xs" src={member.profileImageUrl} alt={`${member.nickname} 프로필 이미지`} />
          <span className="text-body-body6 text-foreground-normal min-w-0 flex-1 truncate">
            {member.nickname}
          </span>
        </button>
      </li>
    ))}
  </ul>
);
