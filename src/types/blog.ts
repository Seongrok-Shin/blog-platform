export interface PostCardProps {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  createdAt: string;
  author: {
    email: string | null | undefined;
    name: string;
    profileImageUrl: string;
  };
  coverImageUrl?: string;
}

export interface Post {
  title: string;
  content: string;
  slug: string;
  date: string;
  author: {
    name: string;
    image: string;
  };
  coverImage: string;
}

export interface PostListProps {
  posts: PostCardProps[];
}

export type PostParams = Promise<{ slug: string }>;
