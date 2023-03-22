import { decodeTime } from 'ulid';
import { Mumble } from '../../types/mumble';
import { fetchUserById } from './users';
import { qwackerApi } from './api';

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

// todo: Braucht es diesen noch? Type verschieben? Muss er exportiert werden?
export type UploadImage = File & { preview: string };

// todo: Eigener Typ für QueryParams
// todo: Schreibweise params vereinheitlichen
// todo: Neuer Type erstellen für ReturnType (count: number, mumbles: Mumble[]), da count benötigt wird
export const fetchMumbles = async (params?: {
  token?: string;
  limit?: number;
  offset?: number;
  newerThanMumbleId?: string;
  creator?: string;
}): Promise<{ count: number; mumbles: Mumble[] }> => {
  const { token, limit, offset, newerThanMumbleId, creator } = params || {};
  const searchParams = new URLSearchParams({
    limit: limit?.toString() || '10',
    offset: offset?.toString() || '0',
    newerThan: newerThanMumbleId || '',
    creator: creator || '',
  });

  try {
    const { count, data } = await qwackerApi.getWithoutAuth<QwackerMumbleResponse>('posts', searchParams);
    const mumbles = await Promise.all(data.map(async (mumble) => await transformApiPostResultToMumble(mumble, token)));

    return {
      count,
      mumbles,
    };
  } catch (error) {
    // todo: Handle any error happened.
    throw new Error('Something was not okay');
  }
};

// todo: Interface für CreateParameters
export const postMumble = async (text: string, file: UploadImage | null, accessToken: string) => {
  // todo: prüfen ob ein Text gesetzt ist
  const formDataBody = new FormData();
  formDataBody.append('text', text);

  if (file) {
    formDataBody.append('image', file);
  }
  try {
    const postResult = await qwackerApi.postFormData<Post>(`posts`, accessToken, formDataBody);
    const mumble = await transformApiPostResultToMumble(postResult, accessToken);
    return mumble;
  } catch (error) {
    // todo: Handle any error happened.
    throw new Error('Something was not okay');
  }
};

export const fetchMumbleById = async (id: string, accessToken: string) => {
  const apiPostResult = await qwackerApi.get<Post>(`posts/${id}`, accessToken);
  const mumble = await transformApiPostResultToMumble(apiPostResult, accessToken);
  return mumble;
};

export const fetchRepliesByMumbleId = async (id: string, accessToken: string) => {
  const apiPostResult = await qwackerApi.get<Reply[]>(`posts/${id}/replies`, accessToken);
  const replies = await Promise.all(
    apiPostResult.map(async (reply) => await transformApiPostResultToMumble(reply, accessToken))
  );
  return replies;
};

const transformApiPostResultToMumble = async (mumble: ApiPostResult, token?: string): Promise<Mumble> => {
  const creator = await fetchUserById({ id: mumble.creator as string, accessToken: token });
  return {
    ...mumble,
    creator,
    createdAt: new Date(decodeTime(mumble.id)).toISOString(),
  };
};
