export type PostTagProps = {
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
  tags?: PostTagProps[];
  thumbnailUrl?: string;
};

export type PostType = 'scraps' | 'my-posts';
