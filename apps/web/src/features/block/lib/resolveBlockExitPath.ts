import { PAGE_ROUTES } from '@/shared/config/path';

/**
 * 차단 완료 후 이동할 경로
 *
 * 차단한 회원의 게시글 상세는 404가 되므로 back()으로 돌아가면 안 된다.
 * 게시글·댓글에서 진입했다면 그 게시판 목록으로, 그 외(주소록 등)는 주소록으로 보낸다.
 *
 * @param boardIdParam 프로필 URL의 `boardId` 쿼리. 숫자가 아니면 진입 맥락이 없는 것으로 본다.
 */
export const resolveBlockExitPath = (boardIdParam: string | null): string => {
  const boardId = Number(boardIdParam);

  if (!boardIdParam || !Number.isInteger(boardId) || boardId <= 0) {
    return PAGE_ROUTES.MEMBER.MEMBER_SEARCH;
  }

  return PAGE_ROUTES.BOARD.SELECT_CATEGORY(boardId);
};
