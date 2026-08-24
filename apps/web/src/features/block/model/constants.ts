export const BLOCK_CONFIRM_TITLE = '해당 회원을 차단하시겠습니까?';
export const BLOCK_CONFIRM_INFO_TEXT =
  '차단할 경우, 해당 회원이 작성한 게시글과 댓글이 보이지 않습니다.';

export const BLOCK_SUCCESS_MESSAGE = '차단이 완료되었습니다.';
export const BLOCK_ERROR_MESSAGE = '차단에 실패했습니다. 잠시 후 다시 시도해주세요.';

/** POST /v1/user/blocks가 구분해서 내려주는 실패 사유 */
export const BLOCK_ERROR_MESSAGE_BY_STATUS: Record<number, string> = {
  400: '본인은 차단할 수 없습니다.',
  404: '존재하지 않거나 탈퇴한 회원입니다.',
  409: '이미 차단한 회원입니다.',
};

export const UNBLOCK_CONFIRM_TITLE = '해당 회원의 차단을 해제하시겠습니까?';
export const UNBLOCK_CONFIRM_INFO_TEXT =
  '차단을 해제할 경우, 해당 회원의 정보와 작성한 게시글 및 댓글을 확인할 수 있습니다.';

export const UNBLOCK_SUCCESS_MESSAGE = '차단 해제가 완료되었습니다.';
export const UNBLOCK_ERROR_MESSAGE = '차단 해제에 실패했습니다. 잠시 후 다시 시도해주세요.';

/** DELETE /v1/user/blocks/{userId}는 해당 방향의 차단이 없으면 404 */
export const UNBLOCK_ERROR_MESSAGE_BY_STATUS: Record<number, string> = {
  404: '이미 차단이 해제된 회원입니다.',
};
