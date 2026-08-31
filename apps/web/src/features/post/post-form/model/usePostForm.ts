import { useCallback, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PAGE_ROUTES } from '@/shared/config/path';

import { stripHtml } from '@/shared/lib/stripHtml';
import { categoryKeyToId } from '@/entities/post/model/category';
import { POST_VALIDATION } from '@/entities/post/model/validation';

import { useCreatePost } from '@/features/post/create-post/model/useCreatePost';
import { useUpdatePost } from '@/features/post/update-post/model/useUpdatePost';
import { useCreatePostSchedule } from '@/features/schedule/create-post-schedule/model/useCreatePostSchedule';
import { useEditSchedule } from '@/features/schedule/edit/model/useEditSchedule';

import { usePostFormStore } from './usePostFormStore';
import { useCreatePostScheduleStore } from '@/features/schedule/create-post-schedule/model/useCreatePostScheduleStore';
import { usePostDirtyCheck } from '@/features/post/post-form/model/useDirtyCheck';
import { leavePostFormGuardEntry } from '@/features/post/post-form/model/usePostFormExitGuard';

import { PostPageMode } from './types';
import { useDeletePostSchedule } from '@/features/schedule/delete/model/useDelPostSchedule';
import { useQueryClient } from '@tanstack/react-query';
import { postQueryKeys } from '@/entities/post/api/queryKeys';
import { scheduleQueryKeys } from '@/features/calendar/api/queryKeys';
import { format } from 'date-fns';
import { PostDetail } from '@/entities/post/model/types';
import type { UploadImage } from '@surf/utils';
import { PostScheduleData } from '@/entities/post/api/types';

type Props = {
  mode: PostPageMode;
  boardId: string;
  postId?: string;
  postDetail?: PostDetail;
  postSchedule?: PostScheduleData;
};

/**
 * 아직 S3 업로드가 끝나지 않은 상태.
 * 이 상태로 등록하면 uploadedUrl 이 없어 첨부가 조용히 누락된다.
 */
const isUploadInFlight = (status: UploadImage['status']) =>
  status === 'pending' || status === 'uploading';

export const usePostForm = ({ mode, boardId, postId, postDetail, postSchedule }: Props) => {
  const router = useRouter();
  const numericPostId = mode === 'edit' && postId ? Number(postId) : undefined;

  // 1. Store & State Management
  const { title, category, content, images, files, reserved, reservedAt, resetForm } =
    usePostFormStore();

  const { linkedSchedule, clearLinkedSchedule } = useCreatePostScheduleStore();

  const [showExitAlert, setShowExitAlert] = useState(false);

  // 뮤테이션의 isPending 은 본 요청만 덮는다. 등록은 그 뒤로도 일정 생성·캐시 무효화·
  // 라우팅까지 이어지므로, 그 사이 버튼이 다시 살아나지 않도록 전 구간을 직접 표시한다.
  const [isSubmitting, setIsSubmitting] = useState(false);
  // 상태 반영 전 연타로 두 번 들어오는 것을 막는다
  const submittingRef = useRef(false);

  // 2. Mutations

  // 생성/수정 뮤테이션
  const { mutateAsync: createMutate } = useCreatePost();
  const { mutateAsync: updateMutate } = useUpdatePost(numericPostId!);
  const { mutateAsync: createScheduleMutate } = useCreatePostSchedule();
  const { mutateAsync: editScheduleMutate } = useEditSchedule();
  const { mutateAsync: deleteScheduleMutate } = useDeletePostSchedule();

  // 3. Logic Hooks (Dirty Check)

  // 변경 사항 감지
  const { checkHasChanges } = usePostDirtyCheck();

  // 4. Utility Functions & Callbacks
  const resetPostState = useCallback(() => {
    clearLinkedSchedule();
    resetForm();
  }, [clearLinkedSchedule, resetForm]);

  // 첨부가 아직 올라가는 중이면 등록을 막는다
  const isUploading = useMemo(
    () =>
      images.some((img) => isUploadInFlight(img.status)) ||
      files.some((file) => isUploadInFlight(file.status)),
    [images, files],
  );

  const isSubmitDisabled = useMemo(() => {
    const { isEmpty } = checkHasChanges();
    return (
      !title.trim() ||
      stripHtml(content).trim() === '' ||
      stripHtml(content).trim() === '<p></p>' ||
      isEmpty ||
      isUploading ||
      isSubmitting
    );
  }, [title, content, checkHasChanges, isUploading, isSubmitting]);

  // 이미 발행된 글인지 판단 (툴바 비활성화용)
  // 수정 모드이고 서버 데이터상 예약 중이 아닌 경우
  const isPublished = !!(mode === 'edit' && postDetail && !postDetail.isReserved);

  // 5. Event Handlers
  const hasUnsavedChanges = useCallback(() => {
    const { hasChanges, isEmpty } = checkHasChanges();
    return hasChanges && !isEmpty;
  }, [checkHasChanges]);

  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    if (submittingRef.current) return;

    // Validation
    const { MAX_TITLE_LENGTH, MAX_CONTENT_LENGTH, MAX_IMAGES } = POST_VALIDATION;
    const textContent = stripHtml(content);

    if (title.length > MAX_TITLE_LENGTH)
      return alert(`제목은 최대 ${MAX_TITLE_LENGTH}자까지입니다.`);
    if (textContent.length > MAX_CONTENT_LENGTH)
      return alert(`본문은 최대 ${MAX_CONTENT_LENGTH}자까지입니다.`);
    if (images.length > MAX_IMAGES) return alert(`이미지는 최대 ${MAX_IMAGES}개까지입니다.`);

    const { isContentChanged, isImagesChanged, isFilesChanged, isReservationChanged } =
      checkHasChanges();
    const imageUrlList = images
      .filter((img) => img.uploadedUrl)
      .map((img, idx) => ({ originalUrl: img.uploadedUrl!, sequence: idx + 1 }));

    const fileList = files
      .filter((f) => f.uploadedUrl)
      .map((f, idx) => ({
        fileUrl: f.uploadedUrl!,
        originalFileName: f.originalFileName,
        sequence: idx + 1,
      }));

    const categoryId = categoryKeyToId(category, Number(boardId)) ?? 1;
    const formattedReservedAt =
      reserved && reservedAt ? format(reservedAt, "yyyy-MM-dd'T'HH:mm:ss") : null;

    submittingRef.current = true;
    setIsSubmitting(true);

    try {
      let targetPostId = numericPostId;

      if (mode === 'create') {
        const res = await createMutate({
          boardId: Number(boardId),
          categoryId,
          title,
          content,
          pinned: false,
          reservedAt: formattedReservedAt,
          imageUrlList,
          fileList,
          hasSchedule: !!linkedSchedule,
          reserved,
        });
        targetPostId = res.postId;

        if (linkedSchedule && targetPostId) {
          await createScheduleMutate({
            postId: targetPostId,
            data: {
              title: linkedSchedule.title,
              startAt: format(new Date(linkedSchedule.startDate), "yyyy-MM-dd'T'HH:mm:ss"),
              endAt: format(new Date(linkedSchedule.endDate), "yyyy-MM-dd'T'HH:mm:ss"),
              location: linkedSchedule.location ?? '미정',
              category: linkedSchedule.category,
            },
          });
        }
      } else {
        await updateMutate({
          title,
          content,
          categoryId,
          pinned: false,
          isReservationChanged,
          reserved,
          reservedAt: formattedReservedAt,
          isContentChanged,
          isImageChanged: isImagesChanged,
          imageUrlList,
          isFileChanged: isFilesChanged,
          fileList,
          hasSchedule: !!linkedSchedule,
        });

        if (linkedSchedule) {
          if (linkedSchedule.id) {
            // 기존에 일정이 있었던 경우 -> 수정 훅 호출
            try {
              await editScheduleMutate({
                scheduleId: linkedSchedule.id,
                data: {
                  category: linkedSchedule.category,
                  title: linkedSchedule.title,
                  startAt: format(new Date(linkedSchedule.startDate), "yyyy-MM-dd'T'HH:mm:ss"),
                  endAt: format(new Date(linkedSchedule.endDate), "yyyy-MM-dd'T'HH:mm:ss"),
                  location: linkedSchedule.location ?? '미정',
                },
              });
            } catch (err) {
              console.error('일정 수정 실패:', err);
            }
          } else if (targetPostId) {
            // 기존에 일정이 없었는데 새로 추가한 경우 (id가 없음) -> 생성 훅 호출
            try {
              await createScheduleMutate({
                postId: targetPostId, // 수정 중인 현재 게시글 ID
                data: {
                  title: linkedSchedule.title,
                  startAt: format(new Date(linkedSchedule.startDate), "yyyy-MM-dd'T'HH:mm:ss"),
                  endAt: format(new Date(linkedSchedule.endDate), "yyyy-MM-dd'T'HH:mm:ss"),
                  location: linkedSchedule.location ?? '미정',
                  category: linkedSchedule.category,
                },
              });
            } catch (err) {
              console.error('일정 생성 실패:', err);
            }
          }
        } else {
          if (postSchedule?.scheduleId) {
            await deleteScheduleMutate({
              postId: targetPostId!,
              scheduleId: postSchedule.scheduleId,
            });
            if (process.env.NODE_ENV === 'development') {
              console.log(`게시글 화면 일정 -> 삭제 성공: ${postSchedule.scheduleId}`);
            }
          }
        }
      }

      // 캐시 무효화 작업
      // 게시글 저장 완료 후, 최신 데이터를 받도록 관련 캐시를 무효화합니다.
      const invalidatePromises = [
        // 게시글 상세 정보 캐시 무효화
        queryClient.invalidateQueries({
          queryKey: postQueryKeys.detail(targetPostId!),
        }),
        // 게시글 목록 캐시 무효화 (필요시)
        queryClient.invalidateQueries({
          queryKey: postQueryKeys.lists(),
        }),
      ];

      // 만약 일정이 존재한다면 일정 관련 캐시도 모두 무효화
      if (linkedSchedule) {
        invalidatePromises.push(
          queryClient.invalidateQueries({
            queryKey: scheduleQueryKeys.lists(),
          }),
        );

        // 기존 일정 편집 시에만 해당 일정의 상세 캐시 무효화
        if (linkedSchedule.id) {
          invalidatePromises.push(
            queryClient.invalidateQueries({
              queryKey: scheduleQueryKeys.detail(linkedSchedule.id),
            }),
          );
        }
      }

      // 모든 무효화 작업이 완료될 때까지 대기
      await Promise.all(invalidatePromises);

      // 뒤로가기 가드용 더미 히스토리 엔트리가 쌓여 있으면 먼저 걷어낸다.
      // 남겨두면 저장 후 뒤로가기 시 비워진 글쓰기 페이지로 되돌아온다.
      await leavePostFormGuardEntry();

      resetPostState();
      if (mode === 'create') {
        if (targetPostId) router.replace(PAGE_ROUTES.BOARD.POST_DETAIL(boardId, targetPostId));
      } else {
        router.back();
      }
    } catch (err) {
      console.error('게시글 처리 실패', err);
      alert('게시글 저장 중 오류가 발생했습니다.');
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return {
    // UI State
    showExitAlert,

    isSubmitDisabled,
    isPublished,

    // Actions
    setShowExitAlert,

    // Handlers
    hasUnsavedChanges,
    handleSubmit,
    handleScheduleRemove: clearLinkedSchedule,
    resetPostState,
  };
};
