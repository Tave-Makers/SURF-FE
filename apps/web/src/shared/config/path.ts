export const PAGE_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  ONBOARDING: '/onboarding',

  // 외부 공개 약관 (비로그인 접근)
  PUBLIC_POLICY: {
    SERVICE: '/terms-of-service',
    PRIVACY: '/privacy-policy',
    OPERATING: '/operational-policy',
  },

  // 멤버 관련
  MEMBER: {
    // boardId는 차단 후 돌아갈 게시판을 알기 위한 진입 맥락 (게시글/댓글에서 진입한 경우에만 붙는다)
    PROFILE: (memberId: string | number, boardId?: string | number) =>
      boardId === undefined ? `/member/${memberId}` : `/member/${memberId}?boardId=${boardId}`,
    // 프로필(닉네임·프로필 사진·자기소개) 신고. 게시글/댓글 신고와 별개 대상이다.
    REPORT: (memberId: string | number) => `/member/${memberId}/report`,
    MEMBER_SEARCH: '/member/search',
  },

  // 캘린더 관련
  CALENDAR: {
    MAIN: '/calendar',
    CREATE: '/calendar/schedule/create',
    SCHEDULE_DETAIL: (id: string | number) => `/calendar/schedule/${id}`,
    SCHEDULE_EDIT: (id: string | number) => `/calendar/schedule/${id}/edit`,
  },

  // 게시판 관련
  BOARD: {
    MAIN: '/board/1',
    SELECT_CATEGORY: (boardId: string | number) => `/board/${boardId}`,
    // 검색은 진입한 게시판 안에서만 수행한다(boardId 미지정 시 통합 검색)
    SEARCH: (params?: { boardId?: string | number; keyword?: string; category?: string }) => {
      const searchParams = new URLSearchParams();

      if (params?.boardId !== undefined) {
        searchParams.set('boardId', String(params.boardId));
      }

      if (params?.keyword) {
        searchParams.set('keyword', params.keyword);
      }

      if (params?.category) {
        searchParams.set('category', params.category);
      }

      const query = searchParams.toString();
      return query ? `/board/search?${query}` : '/board/search';
    },
    POST_DETAIL: (boardId: string | number, postId: string | number) =>
      `/board/${boardId}/post/${postId}`,
    POST_CREATE: (boardId: string | number) => `/board/${boardId}/post/create`,
    POST_REPORT: (
      boardId: string | number,
      postId: string | number,
      options?: { commentId?: number },
    ) => {
      const path = `/board/${boardId}/post/${postId}/report`;
      return options?.commentId !== undefined ? `${path}?commentId=${options.commentId}` : path;
    },
    POST_SCHEDULE: '/post/schedule', // PostEditorToolbar.tsx
    COMMUNITY: '/board/2',
  },

  // 마이페이지 & 설정
  MYPAGE: {
    MAIN: '/mypage',
    EDIT: '/mypage/edit',
    PASSWORD: '/mypage/password',
    ACTIVITY_SCORE: {
      MAIN: '/mypage/activity-score',
      BYLAWS: '/mypage/activity-score/bylaws',
    },
    SETTINGS: '/settings',
    FEEDBACK: '/settings/feedback',
    SCRAPS: '/settings/scraps',
    MY_POSTS: '/settings/my-posts',
    BLOCKED_MEMBERS: '/settings/blocked-members',
    MODE: '/settings/mode',
    POLICY: {
      MAIN: '/settings/policy',
      SERVICE: '/policy/service',
      PRIVACY: '/policy/personal-info',
      OPERATING: '/policy/operating-info',
    },
  },

  MESSAGE: (params: { memberId: number | string; nickname?: string; profileImageUrl?: string }) => {
    const searchParams = new URLSearchParams({
      memberId: String(params.memberId),
    });

    if (params.nickname) {
      searchParams.set('nickname', params.nickname);
    }

    if (params.profileImageUrl) {
      searchParams.set('profileImageUrl', params.profileImageUrl);
    }

    return `/message?${searchParams.toString()}`;
  },

  NOTIFICATION: '/notification',
  UNAUTHORIZED: '/unauthorized',

  // 기타
  REDIRECT: {
    MSG_PENDING: '/login?msg=pending',
    MSG_REJECTED: '/login?msg=rejected',
    MSG_INCOMPLETE: '/onboarding?msg=incomplete',
  },
} as const;
