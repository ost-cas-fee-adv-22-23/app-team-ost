import { decodeTime } from 'ulid';

export type User = {
  id: string;
  userName: string;
  avatarUrl?: string;
  firstName: string;
  lastName: string;
};

// type RawMumble = Omit<User, "createdTimestamp">;

type QwackerMumbleResponse = {
  count: number;
  users: User[];
};

export type UploadImage = File & { preview: string };

export const fetchUsers = async (params?: { limit?: number; offset?: number; accessToken: string }) => {
  const { limit, offset } = params || {};

  const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}/users?${new URLSearchParams({
    limit: limit?.toString() || '1000',
    offset: offset?.toString() || '0',
  })}`;

  const res = await fetch(url, {
    headers: {
      'content-type': 'application/json',
    },
  });
  const { count, users } = (await res.json()) as QwackerMumbleResponse;

  // const mumbles = data.map(transformMumble);

  return {
    count,
    users,
  };
};

// const transformMumble = (user: User) => ({
//   ...user,
//   createdTimestamp: decodeTime(mumble.id),
// });
