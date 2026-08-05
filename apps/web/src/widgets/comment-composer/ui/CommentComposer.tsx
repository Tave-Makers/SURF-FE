'use client';

import { useDebouncedValue } from '@surf/hooks';
import { Avatar } from '@surf/ui/avatar';
import { Sheet } from '@surf/ui/sheet';
import { SheetItem } from '@surf/ui/sheet';
import { useToastStore } from '@surf/ui/store/toastStore';
import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import type { MentionSearchResponse } from '@/features/comment/api/types';
import { trackCommentEvent } from '@/features/comment/lib/trackCommentEvent';
import { COMMENT_EVENTS } from '@/features/comment/model/types';
import { useCreateCommentMutation } from '@/features/comment/model/useCreateCommentMutation';
import { useMentionSearchQuery } from '@/features/comment/model/useMentionSearchQuery';
import { ActionBar } from '@/shared/ui/action-bar';

function getMentionInfo(text: string, cursorIndex: number) {
  const left = text.slice(0, cursorIndex);
  const atIndex = left.lastIndexOf('@');
  if (atIndex === -1) return null;

  const afterAt = left.slice(atIndex + 1);
  if (/\s/.test(afterAt)) return null;

  return { atIndex, keyword: afterAt };
}

function uniqPush(arr: number[], id: number) {
  return arr.includes(id) ? arr : [...arr, id];
}

function extractMentionNicknames(text: string) {
  const res: string[] = [];
  const re = /@([^\s@]+)/g;
  let m: RegExpExecArray | null;

  while ((m = re.exec(text)) !== null) {
    const nick = m[1]?.trim();
    if (nick) res.push(nick);
  }
  return res;
}

function getCompletedMentionDeleteRange(text: string, cursorIndex: number) {
  const left = text.slice(0, cursorIndex);
  const match = /(^|\s)(@[^\s@]+\s)$/.exec(left);

  if (!match?.[2]) return null;

  const tokenStart = cursorIndex - match[2].length;
  return { start: tokenStart, end: cursorIndex };
}

interface Props {
  postId: number;
  keyboardOffset: number;
  pendingReply?: { commentId: number; memberId: number; nickname: string } | null;
  onConsumedReply?: () => void;
}

export const CommentComposer = ({
  postId,
  keyboardOffset,
  pendingReply,
  onConsumedReply,
}: Props) => {
  const showToast = useToastStore((s) => s.show);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const onConsumedReplyRef = useRef(onConsumedReply);

  const createMutation = useCreateCommentMutation(postId);

  // 입력 상태
  const [value, setValue] = useState('');

  // 대댓글
  const [replyParentId, setReplyParentId] = useState<number | null>(null);

  // 맨션 매핑
  const [mentionMap, setMentionMap] = useState<Record<string, number>>({});
  const [mentionMemberIds, setMentionMemberIds] = useState<number[]>([]);

  // 멘션 패널 상태
  const [mentionOpen, setMentionOpen] = useState(false);
  const [mentionKeyword, setMentionKeyword] = useState('');
  const [mentionAtIndex, setMentionAtIndex] = useState<number | null>(null);

  const isSelectingRef = useRef(false);

  const closeMentionPanel = () => {
    setMentionOpen(false);
    setMentionKeyword('');
    setMentionAtIndex(null);
  };

  // 디바운스된 키워드로만 검색
  const debouncedKeyword = useDebouncedValue(mentionKeyword, 250);

  const {
    data: mentionUsers = [],
    isLoading: isMentionLoading,
    isError: isMentionError,
  } = useMentionSearchQuery(debouncedKeyword, mentionOpen);

  useEffect(() => {
    onConsumedReplyRef.current = onConsumedReply;
  }, [onConsumedReply]);

  // 답글 클릭 이벤트를 페이지에서 받아서 입력창에 반영
  useEffect(() => {
    if (!pendingReply) return;

    setReplyParentId(pendingReply.commentId);

    const tokenNick = pendingReply.nickname.trim();
    const token = `@${tokenNick}`;

    setValue((prev) => {
      const trimmedStart = prev.trimStart();
      return trimmedStart.startsWith(token) ? prev : `${token} ${prev}`;
    });

    setMentionMap((prev) => ({ ...prev, [tokenNick]: pendingReply.memberId }));
    setMentionMemberIds((prev) => uniqPush(prev, pendingReply.memberId));

    requestAnimationFrame(() => inputRef.current?.focus());

    onConsumedReplyRef.current?.();
  }, [pendingReply]);

  const onChange = (next: string) => {
    setValue(next);

    if (isSelectingRef.current) return;

    const cursor = inputRef.current?.selectionStart ?? next.length;
    const info = getMentionInfo(next, cursor);

    if (!info || next[cursor - 1] === ' ') {
      closeMentionPanel();
    } else {
      setMentionOpen(true);
      setMentionAtIndex(info.atIndex);
      setMentionKeyword(info.keyword);
    }
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Backspace') return;

    const target = event.currentTarget;
    if (target.selectionStart !== target.selectionEnd) return;

    const range = getCompletedMentionDeleteRange(value, target.selectionStart);
    if (!range) return;

    event.preventDefault();

    const next = value.slice(0, range.start) + value.slice(range.end);
    setValue(next);
    closeMentionPanel();

    requestAnimationFrame(() => {
      inputRef.current?.setSelectionRange(range.start, range.start);
    });
  };

  const pickMention = (user: MentionSearchResponse) => {
    if (mentionAtIndex == null) return;

    isSelectingRef.current = true;

    const cursor = inputRef.current?.selectionStart ?? value.length;
    const before = value.slice(0, mentionAtIndex);
    const after = value.slice(cursor);
    const nick = user.nickname.trim();
    const inserted = `@${nick} `;
    const next = `${before}${inserted}${after}`;

    closeMentionPanel();
    setValue(next);

    setMentionMap((prev) => ({ ...prev, [nick]: user.memberId }));
    setMentionMemberIds((prev) => uniqPush(prev, user.memberId));

    requestAnimationFrame(() => {
      const pos = (before + inserted).length;
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(pos, pos);
      isSelectingRef.current = false;
    });
  };

  useEffect(() => {
    const nicksInText = extractMentionNicknames(value);
    const ids = Array.from(
      new Set(
        nicksInText
          .map((nick) => mentionMap[nick])
          .filter((id): id is number => typeof id === 'number'),
      ),
    );
    setMentionMemberIds(ids);
  }, [value, mentionMap]);

  useEffect(() => {
    if (!mentionOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMentionPanel();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mentionOpen]);

  const onSend = async (text: string) => {
    if (createMutation.isPending) return false;

    trackCommentEvent(COMMENT_EVENTS.CLICK_COMMENT_SUBMIT, {
      post_id: postId,
      comment_length: text.length,
    });
    try {
      await createMutation.mutateAsync({
        parentId: replyParentId,
        content: text,
        mentionMemberIds,
      });
      setValue('');
      setReplyParentId(null);
      setMentionMap({});
      setMentionMemberIds([]);
      closeMentionPanel();
      inputRef.current?.blur();
      return true;
    } catch (e) {
      console.error(e);
      showToast('댓글 등록에 실패했어요');
      return false;
    }
  };

  return (
    <div className="sticky bottom-0 w-full flex-none" style={{ paddingBottom: keyboardOffset }}>
      <div className="relative">
        {mentionOpen && (
          <>
            {/* Dim overlay */}
            <button
              type="button"
              aria-label="멘션 패널 닫기"
              onClick={closeMentionPanel}
              className="bg-effect-overlay-dim-normal fixed inset-0 z-[110]"
            />

            {/* Mention Sheet */}
            <div className="absolute right-0 bottom-[calc(100%)] left-0 z-[120]">
              <Sheet title="멘션하기">
                <div className="mt-12 flex min-h-[100px] flex-col">
                  {mentionKeyword.trim().length < 2 ? (
                    <div className="py-10 text-center text-sm text-gray-500">
                      두 글자 이상 입력하면 검색됩니다.
                    </div>
                  ) : isMentionLoading ? (
                    <div className="py-10 text-center text-sm text-gray-500">불러오는 중...</div>
                  ) : isMentionError ? (
                    <div className="py-10 text-center text-sm text-red-500">
                      오류가 발생했습니다
                    </div>
                  ) : mentionUsers.length > 0 ? (
                    mentionUsers.map((user) => (
                      <SheetItem
                        key={user.memberId}
                        title={`${user.firstGeneration}기 ${user.nickname}`}
                        node={<Avatar size="xs" src={user.profileImageUrl ?? undefined} />}
                        onClick={() => pickMention(user)}
                      />
                    ))
                  ) : (
                    <div className="py-10 text-center text-sm text-gray-500">유저가 없습니다.</div>
                  )}
                </div>
              </Sheet>
            </div>
          </>
        )}

        <div className="bg-background-normal relative z-[130]">
          <ActionBar
            ref={inputRef}
            value={value}
            onChange={onChange}
            placeholder={replyParentId ? '답글을 입력해주세요' : '댓글을 입력해주세요'}
            onSend={onSend}
            focusAfterSend={false}
            disabled={createMutation.isPending}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
    </div>
  );
};
