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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const postMumble = async (text: string, file: UploadImage | null, accessToken?: string) => {
  /*  if (!accessToken) {
    throw new Error('No access token');
  }

  const formData = new FormData();
  formData.append('text', text);
  if (file) {
    formData.append('image', file);
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_QWACKER_API_URL}posts`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      throw new Error('Something was not okay');
    }

    return transformApiPostResultToMumble(await response.json());
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Could not post mumble');
  }
  */
};

const transformApiPostResultToMumble = async (mumble: ApiPostResult, token?: string): Promise<Mumble> => {
  const creator = await fetchUserById({ id: mumble.creator as string, accessToken: token });
  return {
    ...mumble,
    creator,
    createdAt: new Date(decodeTime(mumble.id)).toISOString(),
  };
};
