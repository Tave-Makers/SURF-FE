// features/group-management/model/useGroupMembersField.ts
import { useCallback, useMemo, useRef, useState } from 'react';
import type { MemberBase } from '@/entities/member/model/types';

type Id = number;

type Init = {
  leader?: MemberBase;
  members?: MemberBase[];
};

export const useGroupMembersField = (init?: Init) => {
  // initial snapshot (취소/reset용)
  const initialRef = useRef<{
    leader?: MemberBase;
    members: MemberBase[];
  }>({
    leader: init?.leader,
    members: init?.members ?? [],
  });

  const [leader, setLeader] = useState<MemberBase | undefined>(init?.leader);
  const [members, setMembers] = useState<MemberBase[]>(init?.members ?? []);

  /** 팀장 설정 */
  const pickLeader = useCallback((nextLeader: MemberBase | undefined) => {
    setLeader((prevLeader) => {
      // 팀장 해제 케이스
      if (!nextLeader) {
        return undefined;
      }

      setMembers((prevMembers) => {
        let updatedMembers = [...prevMembers];

        // 새 팀장은 members에서 제거
        updatedMembers = updatedMembers.filter((m) => m.id !== nextLeader.id);

        // 기존 팀장이 있었다면 members로 내려보냄
        if (prevLeader && prevLeader.id !== nextLeader.id) {
          updatedMembers.unshift(prevLeader);
        }

        return updatedMembers;
      });

      return nextLeader;
    });
  }, []);

  /** 여러 명 추가 (중복 제거) */
  const addMembers = useCallback((newMembers: MemberBase[]) => {
    setMembers((prev) => {
      const map = new Map<Id, MemberBase>();
      prev.forEach((m) => map.set(m.id, m));
      newMembers.forEach((m) => map.set(m.id, m));
      return Array.from(map.values());
    });
  }, []);

  /** 멤버 제거 */
  const removeMember = useCallback((memberId: Id) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
  }, []);

  /** 초기값으로 되돌리기 (취소 버튼 용) */
  const reset = useCallback(() => {
    setLeader(initialRef.current.leader);
    setMembers(initialRef.current.members);
  }, []);

  /** 초기값을 새로 세팅 (서버 데이터 재로딩/상세 페이지 진입 시 유용) */
  const reinitialize = useCallback((nextInit: Init) => {
    initialRef.current = {
      leader: nextInit.leader,
      members: nextInit.members ?? [],
    };
    setLeader(nextInit.leader);
    setMembers(nextInit.members ?? []);
  }, []);

  /** 저장 payload */
  const leaderId = leader?.id ?? null;
  const memberIds = useMemo(() => members.map((m) => m.id), [members]);

  return {
    leader,
    members,

    pickLeader,
    addMembers,
    removeMember,

    reset,
    reinitialize,

    // 저장에 필요한 값만 따로
    leaderId,
    memberIds,
  };
};
