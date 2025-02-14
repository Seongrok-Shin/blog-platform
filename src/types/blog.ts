export interface PostCardProps {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  createdAt: string;
  author: {
    name: string;
    email?: string;
    profileImageUrl: string;
  };
  coverImageUrl?: string;
}

export interface Post {
  title: string;
  excerpt: string;
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
