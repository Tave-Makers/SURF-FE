'use client';

import { create } from 'zustand';
import type { MemberBase } from '@/entities/member/model/types';
import type { ContentsType } from '@/shared/types/contents';

export type GroupFormDraft = {
  generation: number;
  groupType: ContentsType;
  groupName: string;
  groupIntroduction: string;
  leader?: MemberBase;
  members: MemberBase[];
};

type FormKey = string;

type FormState = {
  serverSnapshot: GroupFormDraft;
  draft: GroupFormDraft;
  dirty: boolean;
  updatedAt: number;
};

type Store = {
  forms: Record<FormKey, FormState | undefined>;
  moveForm: (fromKey: string, toKey: string, opts?: { overwrite?: boolean }) => void;

  hydrate: (key: FormKey, next: GroupFormDraft, opts?: { force?: boolean }) => void;

  // group info
  setGeneration: (key: FormKey, v: number) => void;
  setGroupType: (key: FormKey, v: ContentsType) => void;
  setGroupName: (key: FormKey, v: string) => void;
  setGroupIntroduction: (key: FormKey, v: string) => void;

  // members
  pickLeader: (key: FormKey, nextLeader: MemberBase | undefined) => void;
  addMembers: (key: FormKey, newMembers: MemberBase[]) => void;
  removeMember: (key: FormKey, memberId: number) => void;

  // misc
  resetDraft: (key: FormKey) => void;
  commit: (key: FormKey) => void;

  // derived
  getLeaderId: (key: FormKey) => number | null;
  getMemberIds: (key: FormKey) => number[];
  isValid: (key: FormKey) => boolean;
};

function normalize(d: GroupFormDraft): GroupFormDraft {
  return {
    ...d,
    members: [...(d.members ?? [])].sort((a, b) => a.id - b.id),
  };
}

function equalDraft(a: GroupFormDraft, b: GroupFormDraft) {
  return JSON.stringify(normalize(a)) === JSON.stringify(normalize(b));
}

function updateDraft(cur: FormState, updater: (prev: GroupFormDraft) => GroupFormDraft): FormState {
  const nextDraft = normalize(updater(cur.draft));
  const dirty = !equalDraft(nextDraft, cur.serverSnapshot);
  return { ...cur, draft: nextDraft, dirty, updatedAt: Date.now() };
}

export const useGroupFormStore = create<Store>((set, get) => ({
  forms: {},

  moveForm: (fromKey, toKey, opts) =>
    set((s) => {
      const from = s.forms[fromKey];
      if (!from) return s;

      const toExists = s.forms[toKey] != null;
      const overwrite = opts?.overwrite ?? false;

      if (toExists && !overwrite) {
        // 목적지에 이미 draft가 있으면 보호 (실수로 덮어쓰기 방지)
        return s;
      }

      const nextForms = { ...s.forms };
      nextForms[toKey] = {
        ...from,
        updatedAt: Date.now(),
      };
      delete nextForms[fromKey];

      return { forms: nextForms };
    }),

  hydrate: (key, next, opts) => {
    set((state) => {
      const prev = state.forms[key];
      const nextNorm = normalize(next);

      if (!prev) {
        return {
          forms: {
            ...state.forms,
            [key]: {
              serverSnapshot: nextNorm,
              draft: nextNorm,
              dirty: false,
              updatedAt: Date.now(),
            },
          },
        };
      }

      if (opts?.force) {
        return {
          forms: {
            ...state.forms,
            [key]: {
              serverSnapshot: nextNorm,
              draft: nextNorm,
              dirty: false,
              updatedAt: Date.now(),
            },
          },
        };
      }

      // 수정중이면 보호
      if (prev.dirty) return state;

      // dirty=false면 재주입 허용
      return {
        forms: {
          ...state.forms,
          [key]: { serverSnapshot: nextNorm, draft: nextNorm, dirty: false, updatedAt: Date.now() },
        },
      };
    });
  },

  setGeneration: (key, v) =>
    set((s) => {
      const cur = s.forms[key];
      if (!cur) return s;
      return { forms: { ...s.forms, [key]: updateDraft(cur, (d) => ({ ...d, generation: v })) } };
    }),

  setGroupType: (key, v) =>
    set((s) => {
      const cur = s.forms[key];
      if (!cur) return s;
      return { forms: { ...s.forms, [key]: updateDraft(cur, (d) => ({ ...d, groupType: v })) } };
    }),

  setGroupName: (key, v) =>
    set((s) => {
      const cur = s.forms[key];
      if (!cur) return s;
      return { forms: { ...s.forms, [key]: updateDraft(cur, (d) => ({ ...d, groupName: v })) } };
    }),

  setGroupIntroduction: (key, v) =>
    set((s) => {
      const cur = s.forms[key];
      if (!cur) return s;
      return {
        forms: { ...s.forms, [key]: updateDraft(cur, (d) => ({ ...d, groupIntroduction: v })) },
      };
    }),

  /** 팀장 설정 */
  pickLeader: (key, nextLeader) =>
    set((s) => {
      const cur = s.forms[key];
      if (!cur) return s;

      const next = updateDraft(cur, (prev) => {
        // 팀장 해제
        if (!nextLeader) return { ...prev, leader: undefined };

        // 새 팀장은 members에서 제거
        const membersWithoutNext = prev.members.filter((m) => m.id !== nextLeader.id);

        // 기존 팀장이 있었다면 members로 내려보냄
        const nextMembers =
          prev.leader && prev.leader.id !== nextLeader.id
            ? [prev.leader, ...membersWithoutNext]
            : membersWithoutNext;

        return { ...prev, leader: nextLeader, members: nextMembers };
      });

      return { forms: { ...s.forms, [key]: next } };
    }),

  /** 여러 명 추가 (중복 제거 + leader 제외) */
  addMembers: (key, newMembers) =>
    set((s) => {
      const cur = s.forms[key];
      if (!cur) return s;

      const next = updateDraft(cur, (prev) => {
        const map = new Map<number, MemberBase>();
        const leaderId = prev.leader?.id;

        prev.members.forEach((m) => {
          if (m.id !== leaderId) map.set(m.id, m);
        });
        newMembers.forEach((m) => {
          if (m.id !== leaderId) map.set(m.id, m);
        });

        return { ...prev, members: Array.from(map.values()) };
      });

      return { forms: { ...s.forms, [key]: next } };
    }),

  /** 멤버 제거 */
  removeMember: (key, memberId) =>
    set((s) => {
      const cur = s.forms[key];
      if (!cur) return s;

      const next = updateDraft(cur, (prev) => ({
        ...prev,
        members: prev.members.filter((m) => m.id !== memberId),
      }));

      return { forms: { ...s.forms, [key]: next } };
    }),

  resetDraft: (key) =>
    set((s) => {
      const cur = s.forms[key];
      if (!cur) return s;
      return {
        forms: {
          ...s.forms,
          [key]: { ...cur, draft: cur.serverSnapshot, dirty: false, updatedAt: Date.now() },
        },
      };
    }),

  commit: (key) =>
    set((s) => {
      const cur = s.forms[key];
      if (!cur) return s;
      const snap = normalize(cur.draft);
      return {
        forms: {
          ...s.forms,
          [key]: { ...cur, serverSnapshot: snap, draft: snap, dirty: false, updatedAt: Date.now() },
        },
      };
    }),

  getLeaderId: (key) => get().forms[key]?.draft.leader?.id ?? null,
  getMemberIds: (key) => get().forms[key]?.draft.members.map((m) => m.id) ?? [],

  isValid: (key) => {
    const form = get().forms[key];
    if (!form) return false;

    const d = form.draft;

    return (
      d.generation > 0 &&
      d.groupName.trim().length > 0 &&
      d.groupIntroduction.trim().length > 0 &&
      !!d.leader &&
      d.members.length > 0
    );
  },
}));
