import {User} from 'api/posts/types';

export interface PostNotis {
  id: number;
  postId: number;
  content: string;
  title: string;
  seen: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  photo: string;
}

export interface CmtNotis extends Omit<PostNotis, 'title'> {}
