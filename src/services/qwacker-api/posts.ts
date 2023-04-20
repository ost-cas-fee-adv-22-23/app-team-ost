import { qwackerApi } from '@/services/qwacker-api/api';
import { fetchUserById } from '@/services/qwacker-api/users';
import {
  FetchMumblesParams,
  Mumble,
  MumbleList,
  PostMumbleParams,
  PostReplyParams,
  SearchMumblesParams,
} from '@/types/mumble';
import { decodeTime } from 'ulid';

// Qwacker API-Types. Same types / names as implemented in the cas-fee-adv-qwacker-api. Only used in this File.
type BasePost = {
  id: string;
  creator: string;
  text: string;
  mediaUrl?: string;
  mediaType?: string;
  likeCount: number;
  likedByUser: boolean;
};

type Post = BasePost & {
  type: 'post';
  replyCount: number;
};

type Reply = BasePost & {
  type: 'reply';
  parentId: string;
};

type ApiPostResult = Post | Reply;

type QwackerMumbleResponse = {
  count: number;
  data: ApiPostResult[];
};

type SearchParams = {
  text?: string;
  tags?: string[];
  mentions?: string[];
  isReply?: boolean;
  likedBy?: string[];
};

type PostSearchParams = SearchParams & {
  offset?: number;
  limit?: number;
};

export const fetchMumbles = async (params?: FetchMumblesParams): Promise<MumbleList> => {
  const { accessToken, limit, offset, newerThanMumbleId, olderThanMumbleId, creator } = params || {};

  const searchParams = new URLSearchParams({
    limit: limit?.toString() || '5',
    offset: offset?.toString() || '0',
    newerThan: newerThanMumbleId || '',
    olderThan: olderThanMumbleId || '',
    creator: creator || '',
  });

  const { count, data } = accessToken
    ? await qwackerApi.get<QwackerMumbleResponse>('posts', accessToken, searchParams)
    : await qwackerApi.getWithoutAuth<QwackerMumbleResponse>('posts', searchParams);

  const mumbles: Mumble[] = await Promise.all(
    data.map(async (mumble: ApiPostResult): Promise<Mumble> => await transformApiPostResultToMumble(mumble, accessToken))
  );

  return {
    count,
    mumbles,
  };
};

export const postMumble = async (params: PostMumbleParams): Promise<Mumble> => {
  const { accessToken, text, file } = params || {};

  const formDataBody = new FormData();
  formDataBody.append('text', text);

  if (file) {
    formDataBody.append('image', file);
  }

  const apiPostResult: Post = await qwackerApi.postFormData<Post>(`posts`, accessToken, formDataBody);

  return await transformApiPostResultToMumble(apiPostResult, accessToken);
};

export const postReply = async (params: PostReplyParams): Promise<Mumble> => {
  const { accessToken, mumbleId, text, file } = params || {};

  const formDataBody = new FormData();
  formDataBody.append('text', text);

  if (file) {
    formDataBody.append('image', file);
  }

  const apiPostResult = await qwackerApi.postFormData<Reply>(`posts/${mumbleId}`, accessToken, formDataBody);
  return await transformApiPostResultToMumble(apiPostResult, accessToken);
};

export const fetchMumbleById = async (id: string, accessToken?: string): Promise<Mumble> => {
  let apiPostResult;
  if (accessToken) {
    apiPostResult = await qwackerApi.get<ApiPostResult>(`posts/${id}`, accessToken);
  } else {
    apiPostResult = await qwackerApi.getWithoutAuth<ApiPostResult>(`posts/${id}`);
  }

  return await transformApiPostResultToMumble(apiPostResult, accessToken);
};

export const fetchRepliesByMumbleId = async (id: string, accessToken?: string): Promise<Mumble[]> => {
  let apiPostResult;
  if (accessToken) {
    apiPostResult = await qwackerApi.get<Reply[]>(`posts/${id}/replies`, accessToken);
  } else {
    apiPostResult = await qwackerApi.getWithoutAuth<Reply[]>(`posts/${id}/replies`);
  }

  return await Promise.all(
    apiPostResult.map(async (reply: Reply): Promise<Mumble> => await transformApiPostResultToMumble(reply, accessToken))
  );
};

export const searchMumbles = async (params: SearchMumblesParams): Promise<MumbleList> => {
  const { accessToken, limit, offset, text, tags, mentions, isReply, likedBy } = params || {};

  const body: PostSearchParams = {
    limit: limit || 5,
    offset: offset || 0,
  };

  if (text !== undefined && text !== null) {
    body.text = text;
  }
  if (tags !== undefined && tags !== null) {
    body.tags = tags;
  }
  if (mentions !== undefined && mentions !== null) {
    body.mentions = mentions;
  }
  if (isReply !== undefined && isReply !== null) {
    body.isReply = isReply;
  }
  if (likedBy !== undefined && likedBy !== null) {
    body.likedBy = [likedBy];
  }

  const { count, data } = await qwackerApi.post<PostSearchParams, QwackerMumbleResponse>(`posts/search`, accessToken, body);
  const mumbles: Mumble[] = await Promise.all(
    data.map(async (mumble: ApiPostResult): Promise<Mumble> => await transformApiPostResultToMumble(mumble, accessToken))
  );

  return { mumbles, count };
};

export const likeMumbleById = async (id: string, accessToken: string): Promise<boolean> => {
  return qwackerApi.put(`posts/${id}/likes`, accessToken);
};

export const unlikeMumbleById = async (id: string, accessToken: string): Promise<boolean> => {
  return qwackerApi.delete(`posts/${id}/likes`, accessToken);
};

const transformApiPostResultToMumble = async (apiPostResult: ApiPostResult, accessToken?: string): Promise<Mumble> => {
  const creator = await fetchUserById(apiPostResult.creator, accessToken);

  return {
    ...apiPostResult,
    creator,
    createdAt: new Date(decodeTime(apiPostResult.id)).toISOString(),
  };
};
