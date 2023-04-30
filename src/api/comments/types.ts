import {User} from 'api/posts/types';

export interface ResponseCreateComment {
  id: number;
  postId: number;
  content: string;
  photo?: string;
  likes: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateComment {
  postId: number;
  content: string;
  photo?: string;
}

export interface CreateSubComment extends CreateComment {
  repFor: number;
}

export interface Comment extends Omit<ResponseCreateComment, 'userId'> {
  user: User;
  child: ChildComment[];
}

export interface ChildComment
  extends Omit<ResponseCreateComment, 'userId' | 'postId'> {
  repFor: number;
  user: User;
}
