'use client';

import { useEffect, useRef, useState } from 'react';

import { Comment } from '@/features/comment/ui/Comment';
import type { CommentResponse, MentionSearchResponse } from '@/features/comment/api/types';

import { useGetCommentsQuery } from '@/features/comment/model/useGetCommentsQuery';
import { useToggleCommentLikeMutation } from '@/features/comment/model/useToggleCommentLikeMutation';
import { useCreateCommentMutation } from '@/features/comment/model/useCreateCommentMutation';
import { useDeleteCommentMutation } from '@/features/comment/model/useDeleteCommentMutation';
import { useMentionSearchQuery } from '@/features/comment/model/useMentionSearchQuery';

import { ActionBar } from '@/shared/ui/action-bar/ActionBar';
import { Sheet } from '@/shared/ui/sheet/Sheet';
import { SheetItem } from '@/shared/ui/sheet/SheetItem';
import { Avatar } from '@/shared/ui/avatar/Avatar';
import { Sheet as ModalSheet } from 'react-modal-sheet';

import { useToastStore } from '@/shared/store/toastStore';
import { useAlertStore } from '@/shared/store/alertStore';
import { toDate, toKST, formatDateTime } from '@/shared/utils/date';
import { useKeyboardOffset } from '@/shared/hooks/useKeyboardOffset';
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';

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

/**
 * '@' 다음부터 공백 전까지를 닉네임으로 간주
 */
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

interface Props {
  postId: number;
  memberId?: number;
}

export const CommentSection = ({ postId, memberId }: Props) => {
  const page = 0;
  const size = 10;

  const keyboardOffset = useKeyboardOffset();
  const showToast = useToastStore((s) => s.show);
  const openAlert = useAlertStore((s) => s.open);
  const closeAlert = useAlertStore((s) => s.close);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { data, isLoading, isError } = useGetCommentsQuery(postId, page, size, true);
  const createMutation = useCreateCommentMutation(postId, page, size);
  const toggleLikeMutation = useToggleCommentLikeMutation(postId, page, size);
  const deleteMutation = useDeleteCommentMutation(postId, page, size);

  const comments = data?.comments ?? [];
  const totalCount = data?.totalCount ?? 0;

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

  // 디바운스된 키워드로만 검색
  const debouncedKeyword = useDebouncedValue(mentionKeyword, 250);

  const {
    data: mentionUsers = [],
    isLoading: isMentionLoading,
    isError: isMentionError,
  } = useMentionSearchQuery(debouncedKeyword, mentionOpen);

  // 옵션/삭제/신고
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [activeComment, setActiveComment] = useState<CommentResponse | null>(null);

  const isMine = (c: CommentResponse) => (memberId != null ? c.memberId === memberId : false);

  const closeMentionPanel = () => {
    setMentionOpen(false);
    setMentionKeyword('');
    setMentionAtIndex(null);
  };

  const isSelectingRef = useRef(false);

  const onChange = (next: string) => {
    setValue(next);

    // 만약 아이템 클릭으로 인한 변경이라면 멘션 패널 로직을 건너뜁니다.
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

    // 2) mentionMemberIds 동기화 (기존 로직)
    const nicksInText = extractMentionNicknames(next);
    const ids = Array.from(
      new Set(
        nicksInText
          .map((nick) => mentionMap[nick])
          .filter((id): id is number => typeof id === 'number'),
      ),
    );
    setMentionMemberIds(ids);
  };

  /** 답글 클릭: 자동 @닉네임 삽입 + mentionMap/ids 갱신 */
  const startReply = (c: CommentResponse) => {
    setReplyParentId(c.id);

    const tokenNick = c.nickname.trim();
    const token = `@${tokenNick}`;

    const trimmedStart = value.trimStart();
    const nextValue = trimmedStart.startsWith(token) ? value : `${token} ${value}`;

    setValue(nextValue);

    setMentionMap((prev) => ({ ...prev, [tokenNick]: c.memberId }));
    setMentionMemberIds((prev) => uniqPush(prev, c.memberId));

    requestAnimationFrame(() => inputRef.current?.focus());
  };

  /** 멘션 유저 클릭: @키워드를 @닉네임 으로 치환 + mentionMap/ids 갱신 */
  const pickMention = (user: MentionSearchResponse) => {
    if (mentionAtIndex == null) return;

    // 2. 클릭 시작 시 플래그를 true로 설정
    isSelectingRef.current = true;

    const cursor = inputRef.current?.selectionStart ?? value.length;
    const before = value.slice(0, mentionAtIndex);
    const after = value.slice(cursor);
    const nick = user.nickname.trim();
    const inserted = `@${nick} `;
    const next = `${before}${inserted}${after}`;

    // 3. 상태 업데이트 순서 조정
    closeMentionPanel(); // 먼저 패널 닫기 상태로 변경
    setMentionKeyword('');
    setValue(next); // onChange 트리거 (플래그 덕분에 패널이 다시 열리지 않음)

    setMentionMap((prev) => ({ ...prev, [nick]: user.memberId }));
    setMentionMemberIds((prev) => uniqPush(prev, user.memberId));

    // 4. 다음 프레임에서 플래그 해제 및 포커스
    requestAnimationFrame(() => {
      const pos = (before + inserted).length;
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(pos, pos);
      isSelectingRef.current = false; // 플래그 해제
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

  /** 전송 */
  const onSend = async (text: string) => {
    try {
      await createMutation.mutateAsync({
        parentId: replyParentId,
        content: text,
        mentionMemberIds,
      });

      // reset
      setValue('');
      setReplyParentId(null);
      setMentionMap({});
      setMentionMemberIds([]);

      // 멘션 패널 reset
      closeMentionPanel();

      showToast('댓글이 등록됐어요');
    } catch (e) {
      console.error(e);
      showToast('댓글 등록에 실패했어요');
    }
  };

  /** 더보기 */
  const openOptions = (c: CommentResponse) => {
    setActiveComment(c);
    setOptionsOpen(true);
  };

  const clickDelete = () => {
    setOptionsOpen(false);
    if (!activeComment) return;

    const commentId = activeComment.id;

    openAlert({
      state: 'default',
      title: '댓글을 정말 삭제하시겠습니까?',
      infoText: '삭제된 댓글은 복구되지 않습니다.',
      actions: [
        {
          type: 'solid',
          variant: 'secondary',
          label: '취소',
          onClick: () => closeAlert(),
        },
        {
          type: 'solid',
          variant: 'danger',
          label: '삭제하기',
          onClick: () => {
            void (async () => {
              try {
                await deleteMutation.mutateAsync(commentId);
                closeAlert();
                setActiveComment(null);
                showToast('댓글이 삭제됐어요');
              } catch (e) {
                console.error(e);
                closeAlert();
                showToast('댓글 삭제에 실패했어요');
              }
            })();
          },
        },
      ],
    });
  };

  const clickReport = () => {
    setOptionsOpen(false);
    showToast('신고 기능 준비 중입니다.');
  };

  if (isLoading) {
    return <div className="px-13 py-16 text-center text-gray-500">댓글을 불러오는 중...</div>;
  }
  if (isError) {
    return <div className="px-13 py-16 text-center text-red-500">댓글을 불러오지 못했습니다.</div>;
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-11 px-13 py-16">
        <div className="flex items-center gap-5">
          <span className="text-body-body4 text-foreground-normal">댓글 {totalCount}</span>
        </div>

        <div className="flex flex-col gap-13">
          {comments.map((c) => {
            const createdAtKst = toKST(toDate(c.createdAt));
            const dateText = formatDateTime(createdAtKst);

            return (
              <div key={c.id} style={{ paddingLeft: c.depth * 16 }}>
                <Comment
                  name={c.nickname}
                  profileImageUrl={c.profileImageUrl ?? undefined}
                  date={dateText}
                  content={c.content}
                  mentions={c.mentions}
                  likeCount={c.likeCount}
                  isLiked={c.liked}
                  onLikeToggle={() =>
                    toggleLikeMutation.mutate(c.id, {
                      onError: () => showToast('좋아요 처리에 실패했어요'),
                    })
                  }
                  onReplyClick={() => startReply(c)}
                  onMoreClick={() => openOptions(c)}
                />
              </div>
            );
          })}

          {comments.length === 0 && (
            <div className="py-8 text-center text-gray-500">첫 댓글을 남겨보세요.</div>
          )}
        </div>
      </div>

      {/* ActionBar + 멘션 패널 */}
      <div
        className="sticky bottom-0 z-[100] w-full bg-white"
        style={{ paddingBottom: keyboardOffset }}
      >
        <div className="relative">
          {mentionOpen && (
            <>
              {/* Dim overlay - ActionBar보다는 아래에 있도록 z-index 조정 */}
              <button
                type="button"
                aria-label="멘션 패널 닫기"
                onClick={closeMentionPanel}
                className="bg-effect-overlay-dim-normal fixed inset-0 z-[110]"
              />

              {/* Mention Sheet - Dim 보다 위에 노출 */}
              <div className="absolute right-0 bottom-[calc(100%)] left-0 z-[120]">
                <Sheet title="멘션하기">
                  <div className="flex min-h-[100px] flex-col">
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
                      <div className="py-10 text-center text-sm text-gray-500">
                        유저가 없습니다.
                      </div>
                    )}
                  </div>
                </Sheet>
              </div>
            </>
          )}

          {/* ActionBar - z-index를 명시적으로 높여서 Dim 위에 오도록 함 */}
          <div className="bg-background-normal relative z-[130]">
            <ActionBar
              ref={inputRef}
              value={value}
              onChange={onChange}
              placeholder={replyParentId ? '답글을 입력해주세요' : '댓글을 입력해주세요'}
              onSend={(val) => void onSend(val)}
            />
          </div>
        </div>
      </div>

      {/* 댓글 옵션 Sheet */}
      <ModalSheet isOpen={optionsOpen} onClose={() => setOptionsOpen(false)}>
        <ModalSheet.Container className="!right-0 !left-0 mx-auto max-w-[360px]">
          <ModalSheet.Content>
            <Sheet title="댓글 옵션">
              <div className="flex flex-col">
                {activeComment && isMine(activeComment) ? (
                  <SheetItem title="삭제하기" textColor="danger" onClick={clickDelete} />
                ) : (
                  <SheetItem title="신고하기" onClick={clickReport} />
                )}
              </div>
            </Sheet>
          </ModalSheet.Content>
        </ModalSheet.Container>
        <ModalSheet.Backdrop onTap={() => setOptionsOpen(false)} />
      </ModalSheet>
    </div>
  );
};
