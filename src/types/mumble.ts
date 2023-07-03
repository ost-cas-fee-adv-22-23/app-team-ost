import { User } from '@/types/user';

export type MumbleList = { count: number; mumbles: Mumble[] };

export type Mumble = {
  id: string;
  creator: User;
  text: string;
  mediaUrl?: string;
  mediaType?: string;
  likeCount: number;
  likedByUser: boolean;
  replyCount?: number;
  createdAt: string;
  type: string;
  parentId?: string;
};

export type FetchMumblesParams = {
  accessToken?: string;
  limit?: number;
  offset?: number;
  newerThanMumbleId?: string;
  olderThanMumbleId?: string;
  creator?: string;
};

export type SearchMumblesParams = {
  accessToken: string;
  offset?: number;
  limit?: number;
  text?: string;
  tags?: string[];
  mentions?: string[];
  isReply?: boolean;
  likedBy?: string;
};

export type PostMumbleParams = {
  accessToken: string;
  text: string;
  file?: File | null;
};

export type PostReplyParams = {
  mumbleId: string;
  accessToken: string;
  text: string;
  file?: File | null;
};
