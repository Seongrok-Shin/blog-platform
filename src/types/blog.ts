export interface PostCardProps {
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  author: {
    name: string;
    image: string;
  };
  coverImage?: string;
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
  posts: Post[];
}
