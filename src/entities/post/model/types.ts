export type PostBadgeProps = {
  id: number | string;
  variation: 'event' | 'reservation';
};

export type Post = {
  id: number;
  title: string;
  content: string;
  writer: string;
  date: string;
  likeCount: number;
  isLiked: boolean;
  commentCount: number;
  isReserved?: boolean;
  thumbnailUrl?: string;
  boardId?: number;
  category: CategoryBadge;
};

export type PostType = 'scraps' | 'my-posts';

export type PostCategory = 'all' | 'event' | 'activity' | 'partnership' | 'release' | 'others';
export type CategoryBadge = Exclude<PostCategory, 'all'>;
