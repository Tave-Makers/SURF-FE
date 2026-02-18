import { useCallback, useMemo, useRef, useState } from 'react';
import type { MemberBase } from '@/entities/member/model/types';

type Id = number;

type Init = {
  leader?: MemberBase;
  members?: MemberBase[];
};

type State = {
  leader?: MemberBase;
  members: MemberBase[];
};

export const useGroupMembersField = (init?: Init) => {
  // initial snapshot (취소/reset용)
  const initialRef = useRef<State>({
    leader: init?.leader,
    members: init?.members ?? [],
  });

  const [state, setState] = useState<State>({
    leader: init?.leader,
    members: init?.members ?? [],
  });

  const leader = state.leader;
  const members = state.members;

  /** 팀장 설정 */
  const pickLeader = useCallback((nextLeader: MemberBase | undefined) => {
    setState((prev) => {
      // 팀장 해제 케이스
      if (!nextLeader) {
        return { ...prev, leader: undefined };
      }

      // 새 팀장은 members에서 제거
      const membersWithoutNext = prev.members.filter((m) => m.id !== nextLeader.id);

      // 기존 팀장이 있었다면 members로 내려보냄
      const nextMembers =
        prev.leader && prev.leader.id !== nextLeader.id
          ? [prev.leader, ...membersWithoutNext]
          : membersWithoutNext;

      return {
        leader: nextLeader,
        members: nextMembers,
      };
    });
  }, []);

  /** 여러 명 추가 (중복 제거) */
  const addMembers = useCallback((newMembers: MemberBase[]) => {
    setState((prev) => {
      const map = new Map<Id, MemberBase>();

      // leader가 members에 들어오지 않게 제외
      const leaderId = prev.leader?.id;
      prev.members.forEach((m) => {
        if (m.id !== leaderId) map.set(m.id, m);
      });
      newMembers.forEach((m) => {
        if (m.id !== leaderId) map.set(m.id, m);
      });

      return { ...prev, members: Array.from(map.values()) };
    });
  }, []);

  /** 멤버 제거 */
  const removeMember = useCallback((memberId: Id) => {
    setState((prev) => {
      // 멤버 제거는 members만 변경
      const nextMembers = prev.members.filter((m) => m.id !== memberId);
      return { ...prev, members: nextMembers };
    });
  }, []);

  /** 초기값으로 되돌리기 (취소 버튼 용) */
  const reset = useCallback(() => {
    setState(initialRef.current);
  }, []);

  /** 초기값을 새로 세팅 (서버 데이터 재로딩/상세 페이지 진입 시 유용) */
  const reinitialize = useCallback((nextInit: Init) => {
    const nextState: State = {
      leader: nextInit.leader,
      members: nextInit.members ?? [],
    };
    initialRef.current = nextState;
    setState(nextState);
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

    leaderId,
    memberIds,
  };
};
