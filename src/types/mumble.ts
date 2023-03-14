import { User } from './user';

export type Mumble = {
  id: string;
  creator: User;
  text: string;
  mediaUrl?: string;
  mediaType: 'image/jpeg' | 'image/png' | 'image/gif';
  likeCount: number;
  likedByUser: boolean | string;
  replyCount: number;
  createdAt: string;
  type: string;
};
