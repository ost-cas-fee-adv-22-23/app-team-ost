import { User } from '@/types/user';

export type Mumble = {
  id: string;
  creator: User;
  text: string;
  mediaUrl?: string;
  // Todo: Typ prüfen
  // mediaType?: 'image/jpeg' | 'image/png' | 'image/gif';
  mediaType?: string;
  likeCount: number;
  likedByUser: boolean;
  replyCount?: number;
  createdAt: string;
  type: string;
  parentId?: string;
};
