'use client';

import { useAlertStore } from '@surf/ui/store/alertStore';
import { useToastStore } from '@surf/ui/store/toastStore';
import { safeUUID, UploadImage } from '@surf/utils';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import type { Badge } from '@/entities/badge/model/types';
import { useImageUploader } from '@/entities/image/model/useImageUploader';
import { useDeleteBadgeMutation } from '@/features/badge/model/queries/useDeleteBadgeMutation';
import { useRemoveBadgeMembersMutation } from '@/features/badge/model/queries/useRemoveBadgeMembersMutation';
import { useUpdateBadgeMutation } from '@/features/badge/model/queries/useUpdateBadgeMutation';
import type { BadgeAwardedMember, BadgeEditFormData } from '@/features/badge/model/types';
import { PAGE_ROUTES } from '@/shared/config/path';

const INITIAL_FORM: BadgeEditFormData = {
  name: '',
  imageUrl: '',
  imageFile: null,
  removedMemberIds: [],
};

/**
 * 배지 수정 화면의 폼 상태와 저장/삭제 액션을 관리하는 훅.
 *
 * 초기 배지 정보와 부여 멤버 목록을 받아 수정 가능 상태로 변환하고,
 * 이미지 업로드, 배지 정보 수정, 멤버 회수, 배지 삭제 플로우를 조합한다.
 */
export const useBadgeEditForm = (
  badgeId: number,
  initialBadge: Badge | undefined,
  members: BadgeAwardedMember[] = [],
) => {
  const router = useRouter();
  const { uploadImages } = useImageUploader();

  const openAlert = useAlertStore((s) => s.open);
  const closeAlert = useAlertStore((s) => s.close);
  const showToast = useToastStore((s) => s.show);

  const { mutateAsync: updateBadge } = useUpdateBadgeMutation(badgeId);
  const { mutateAsync: removeBadgeMembers } = useRemoveBadgeMembersMutation(badgeId);
  const { mutateAsync: deleteBadge, isPending: isDeleting } = useDeleteBadgeMutation(badgeId);

  const [initial, setInitial] = useState<Badge | null>(null);
  const [form, setForm] = useState<BadgeEditFormData>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /** 서버에서 받은 배지 상세값을 수정 폼 초기값으로 동기화한다. */
  useEffect(() => {
    if (!initialBadge) return;

    setInitial(initialBadge);
    setForm({
      name: initialBadge.name,
      imageUrl: initialBadge.imageUrl,
      imageFile: null,
      removedMemberIds: [],
    });
  }, [badgeId, initialBadge]);

  /** 회수 예정 멤버를 화면 목록에서 제외한 표시용 멤버 목록이다. */
  const visibleMembers = useMemo(() => {
    const removedIds = new Set(form.removedMemberIds);
    return members.filter((member) => !removedIds.has(member.id));
  }, [form.removedMemberIds, members]);

  /** 배지 기본 정보, 이미지 파일, 회수 예정 멤버 중 하나라도 바뀌었는지 판단한다. */
  const isChanged = useMemo(() => {
    if (!initial) return false;
    return (
      initial.name !== form.name ||
      initial.imageUrl !== form.imageUrl ||
      form.imageFile !== null ||
      form.removedMemberIds.length > 0
    );
  }, [initial, form]);

  /** 필수값과 변경 여부, 제출 상태를 기준으로 수정 가능 여부를 계산한다. */
  const canSubmit = useMemo(() => {
    const hasName = form.name.trim().length > 0;
    const hasImage = form.imageUrl.trim().length > 0 || form.imageFile !== null;
    return !!initial && hasName && hasImage && isChanged && !isSubmitting && !isDeleting;
  }, [initial, form, isChanged, isSubmitting, isDeleting]);

  /** 배지명 입력값을 수정 폼에 반영한다. */
  const setBadgeName = (name: string) => {
    setForm((prev) => ({ ...prev, name }));
  };

  /** 새로 선택한 배지 이미지 파일을 수정 폼에 반영한다. */
  const setBadgeFile = (file: File | null) => {
    setForm((prev) => ({ ...prev, imageFile: file }));
  };

  /** 멤버 회수를 즉시 요청하지 않고 저장 시 처리할 회수 예정 목록에 추가한다. */
  const removeMember = (memberId: number) => {
    setForm((prev) => {
      if (prev.removedMemberIds.includes(memberId)) return prev;
      return { ...prev, removedMemberIds: [...prev.removedMemberIds, memberId] };
    });
  };

  /** 이미지 업로드, 배지 정보 수정, 멤버 회수를 순서대로 처리한다. */
  const handleSubmit = async () => {
    if (!initial || !canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    try {
      let imageUrl = form.imageUrl;

      if (form.imageFile) {
        const uploadItem: UploadImage = {
          id: safeUUID(),
          file: form.imageFile,
          preview: '',
          status: 'pending',
        };
        const [result] = await uploadImages([uploadItem]);

        if (result.status !== 'uploaded' || !result.uploadedUrl) {
          showToast('이미지 업로드에 실패했습니다.');
          return;
        }

        imageUrl = result.uploadedUrl;
      }

      const apiTasks: Promise<unknown>[] = [];
      const hasBadgeInfoChanged = initial.name !== form.name || initial.imageUrl !== imageUrl;

      if (hasBadgeInfoChanged) {
        apiTasks.push(updateBadge({ name: form.name.trim(), imageUrl }));
      }

      if (form.removedMemberIds.length > 0) {
        apiTasks.push(removeBadgeMembers({ memberIds: form.removedMemberIds }));
      }

      await Promise.all(apiTasks);
      showToast('배지가 수정되었습니다.');
      router.replace(PAGE_ROUTES.BADGE_MNG.DETAIL(badgeId));
    } catch {
      showToast('배지 수정에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /** 배지를 삭제하고 목록 페이지로 이동한다. */
  const handleDelete = async () => {
    if (isDeleting || isSubmitting) return;

    try {
      await deleteBadge();
      showToast('배지가 삭제되었습니다.');
      router.replace(PAGE_ROUTES.BADGE_MNG.LIST);
    } catch {
      showToast('배지 삭제에 실패했습니다.');
    }
  };

  /** 저장 확인 Alert을 열고 확인 시 수정 요청을 실행한다. */
  const handleOpenSaveAlert = () => {
    openAlert({
      state: 'default',
      title: '수정하시겠습니까?',
      infoText: '수정하기 버튼을 누를 시, 수정된 배지 정보가 반영됩니다.',
      actions: [
        { type: 'solid', variant: 'secondary', label: '취소', onClick: closeAlert },
        {
          type: 'solid',
          variant: 'primary',
          label: '수정하기',
          onClick: () => {
            closeAlert();
            void handleSubmit();
          },
        },
      ],
    });
  };

  /** 삭제 확인 Alert을 열고 확인 시 삭제 요청을 실행한다. */
  const handleOpenDeleteAlert = () => {
    openAlert({
      state: 'default',
      title: '삭제하시겠습니까?',
      infoText:
        '삭제하기 버튼을 누를 시, 해당 뱃지 데이터와 함께 부여된 회원들의 뱃지 목록에서도 해당 뱃지가 삭제됩니다.',
      actions: [
        { type: 'solid', variant: 'secondary', label: '취소', onClick: closeAlert },
        {
          type: 'solid',
          variant: 'danger',
          label: '삭제하기',
          onClick: () => {
            closeAlert();
            void handleDelete();
          },
        },
      ],
    });
  };

  return {
    state: {
      form,
      visibleMembers,
      canSubmit,
      isChanged,
      isSubmitting,
      isDeleting,
      isLoading: !initial,
    },
    actions: {
      setForm,
      setBadgeName,
      setBadgeFile,
      removeMember,
      handleSubmit,
      handleOpenSaveAlert,
      handleOpenDeleteAlert,
    },
  };
};
