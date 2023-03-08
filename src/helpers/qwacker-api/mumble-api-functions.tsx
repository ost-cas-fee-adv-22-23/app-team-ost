import { decodeTime } from 'ulid';
import { MumbleType } from '../../types/mumble';
import { UserType } from '../../types/user';
import { fetchUserById } from './user-api-functions';

type RawMumble = Omit<MumbleType, 'createdTimestamp'>;

type QwackerMumbleResponse = {
  count: number;
  data: RawMumble[];
};

export type UploadImage = File & { preview: string };

export const fetchMumbles = async (params?: {
  token?: string;
  limit?: number;
  offset?: number;
  newerThanMumbleId?: string;
}) => {
  const { token, limit, offset, newerThanMumbleId } = params || {};

  const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}posts?${new URLSearchParams({
    limit: limit?.toString() || '10',
    offset: offset?.toString() || '0',
    newerThan: newerThanMumbleId || '',
  })}`;

  const res = await fetch(url, {
    headers: {
      'content-type': 'application/json',
    },
  });
  const { count, data } = (await res.json()) as QwackerMumbleResponse;

  let mumbles = data.map(transformMumble);

  mumbles = await Promise.all(
    mumbles.map(async (mumble) => {
      if (token) {
        const user: UserType = await fetchUserById({ id: mumble.creator as string, accessToken: token });
        mumble.creator = user;
      } else {
        const creator: UserType = {
          id: mumble.id,
          userName: 'anonym',
          firstName: '',
          lastName: '',
          displayName: '',
        };
        mumble.creator = creator;
      }
      return mumble;
    })
  );

  return {
    count,
    mumbles,
  };
};

export const fetchMumblesByUserId = async (params?: { userId: string; accessToken?: string }) => {
  const { userId, accessToken } = params || {};
  const { mumbles } = await fetchMumbles({ token: accessToken });

  return mumbles.filter((mumble: MumbleType) => {
    const mumbleCreator: UserType = mumble.creator as UserType;
    if (mumbleCreator.id === userId) {
      return mumble;
    }
  });
};

export const postMumble = async (text: string, file: UploadImage | null, accessToken?: string) => {
  if (!accessToken) {
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

    return transformMumble(await response.json());
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Could not post mumble');
  }
};
const transformMumble = (mumble: RawMumble) => ({
  ...mumble,
  createdAt: new Date(decodeTime(mumble.id)).toISOString(),
});
