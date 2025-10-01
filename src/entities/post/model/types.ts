export type Post = {
  id: number;
  title: string;
  content: string;
  writer: string;
  date: string;
  likes: number;
  comments: number;
  state?: 'default' | 'reserved';
  thumbnailUrl?: string;
};

export type PostType = 'scraps' | 'my-posts';
