export interface CommentProps {
  id: number;
  content: string;
  user: {
    id: number;
    name: string;
    image: string | null;
  };
  created_at: Date;
}

export type RawComment = {
  id: number;
  content: string;
  user_id: number;
  created_at: string;
  name: string;
  image: string | null;
};

export interface SessionType {
  user: {
    id: number;
    name: string;
    email: string;
    image: string;
  };
}
