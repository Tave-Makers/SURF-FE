export type Post = {
  id: number;
  state?: 'default' | 'reserved';
  title: string;
  content: string;
  writer: string;
  date: string;
  likes: number;
  comments: number;
  thumbnailUrl?: string;
};

export type PostType = 'scraps' | 'my-posts';
