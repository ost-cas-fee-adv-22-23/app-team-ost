import { decodeTime } from 'ulid';

export type User = {
  id: string;
  userName: string;
  avatarUrl?: string;
  firstName: string;
  lastName: string;
};

// type RawMumble = Omit<User, "createdTimestamp">;

type QwackerUserResponse = {
  count: number;
  users: User[];
};

export type UploadImage = File & { preview: string };

export const fetchUsers = async (params?: { limit?: number; offset?: number; accessToken: string }) => {
  const { limit, offset, accessToken } = params || {};

  const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}users?${new URLSearchParams({
    limit: limit?.toString() || '100',
    offset: offset?.toString() || '0',
  })}`;
  const res = await fetch(url, {
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const { count, users } = (await res.json()) as QwackerUserResponse;

  return {
    count,
    users,
  };
};
