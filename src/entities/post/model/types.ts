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
  tags?: PostBadgeProps[];
  thumbnailUrl?: string;
  boardId?: number;
};

export type PostType = 'scraps' | 'my-posts';
