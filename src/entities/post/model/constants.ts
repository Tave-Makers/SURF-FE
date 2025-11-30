export const POST_CATEGORIES = ['행사', '활동', '제휴', '릴리즈', '기타'] as const;
export type PostCategory = (typeof POST_CATEGORIES)[number];
