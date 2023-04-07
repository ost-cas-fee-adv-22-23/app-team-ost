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

// todo: Eigener Typ für QueryParams
// todo: Schreibweise params vereinheitlichen
// todo: Neuer Type erstellen für ReturnType (count: number, mumbles: Mumble[]), da count benötigt wird
export const fetchMumbles = async (params?: {
  token?: string;
  limit?: number;
  offset?: number;
  newerThanMumbleId?: string;
  olderThanMumbleId?: string;
  creator?: string;
}): Promise<{ count: number; mumbles: Mumble[] }> => {
  const { token, limit, offset, newerThanMumbleId, olderThanMumbleId, creator } = params || {};
  const searchParams = new URLSearchParams({
    limit: limit?.toString() || '2',
    offset: offset?.toString() || '0',
    newerThan: newerThanMumbleId || '',
    olderThan: olderThanMumbleId || '',
    creator: creator || '',
  });

  try {
    // likes mittels auth nicht vorhanden. Was ist mit dem transformApiPostResultToMumble?
    // todo: muss nach dem login/auth merge geprüft werden
    const { count, data } = token
      ? await qwackerApi.get<QwackerMumbleResponse>('posts', token, searchParams)
      : await qwackerApi.getWithoutAuth<QwackerMumbleResponse>('posts', searchParams);
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

// todo: Braucht es das preview string?
// export type UploadImage = File & { preview: string };
type UploadImage = File;

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

// todo: Interface für CreateParameters
export const postReply = async (postid: string, text: string, file: UploadImage | null, accessToken: string) => {
  // todo: prüfen ob ein Text gesetzt ist
  const formDataBody = new FormData();
  formDataBody.append('text', text);

  if (file) {
    formDataBody.append('image', file);
  }
  try {
    const postResult = await qwackerApi.postFormData<Post>(`posts/${postid}`, accessToken, formDataBody);
    const mumble = await transformApiPostResultToMumble(postResult, accessToken);
    return mumble;
  } catch (error) {
    // todo: Handle any error happened.
    throw new Error('Something was not okay');
  }
};

export const fetchMumbleById = async (id: string, accessToken?: string) => {
  let apiPostResult;
  if (accessToken) {
    apiPostResult = await qwackerApi.get<ApiPostResult>(`posts/${id}`, accessToken);
  } else {
    apiPostResult = await qwackerApi.getWithoutAuth<ApiPostResult>(`posts/${id}`);
  }

  const mumble = await transformApiPostResultToMumble(apiPostResult, accessToken);
  return mumble;
};

export const fetchRepliesByMumbleId = async (id: string, accessToken?: string) => {
  let apiPostResult;
  if (accessToken) {
    apiPostResult = await qwackerApi.get<Reply[]>(`posts/${id}/replies`, accessToken);
  } else {
    apiPostResult = await qwackerApi.getWithoutAuth<Reply[]>(`posts/${id}/replies`);
  }

  const replies = await Promise.all(
    apiPostResult.map(async (reply) => await transformApiPostResultToMumble(reply, accessToken))
  );
  return replies;
};

type SearchPostsBody = {
  isReply?: boolean;
  likedBy?: string[];
  limit?: number;
  mentions?: string[];
  offset?: number;
  tags?: string[];
  text?: string;
};

export const fetchMumblesSearch = async (params: {
  accessToken: string;
  isReply?: boolean;
  limit?: number;
  mentions?: string;
  offset?: number;
  tags?: string;
  text?: string;
  userid?: string;
}) => {
  const { accessToken, isReply, limit, mentions, offset, tags, text, userid } = params || {};

  const body: SearchPostsBody = {
    limit: limit || 2,
    offset: offset || 0,
  };

  if (isReply != null) {
    body.isReply = isReply;
  }
  if (mentions != null) {
    body.mentions = [mentions];
  }
  if (tags != null) {
    body.tags = [tags];
  }
  if (text != null) {
    body.text = text;
  }
  if (userid != null) {
    body.likedBy = [userid];
  }

  try {
    const { count, data } = await qwackerApi.post<SearchPostsBody, QwackerMumbleResponse>(`posts/search`, accessToken, body);
    const mumbles = await Promise.all(data.map(async (mumble) => await transformApiPostResultToMumble(mumble, accessToken)));

    return { mumbles, count };
  } catch (error) {
    // todo: Handle any error happened.
    throw new Error('Something was not okay - fetchLikedMumblesByUserId');
  }
};

export const likeMumbleById = async (id: string, accessToken: string) => {
  // errorhandling wird nicht hier gemacht, da client api function
  return qwackerApi.put(`posts/${id}/likes`, accessToken);
};

export const unlikeMumbleById = async (id: string, accessToken: string) => {
  return qwackerApi.delete(`posts/${id}/likes`, accessToken);
};
const transformApiPostResultToMumble = async (mumble: ApiPostResult, token?: string): Promise<Mumble> => {
  const creator = await fetchUserById({ id: mumble.creator as string, accessToken: token });
  return {
    ...mumble,
    creator,
    createdAt: new Date(decodeTime(mumble.id)).toISOString(),
  };
};
