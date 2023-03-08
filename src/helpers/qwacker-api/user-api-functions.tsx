import { UserType } from '../../types/user';

type RawUser = Omit<UserType, 'profileUrl, displayName'>;

type QwackerUserResponse = {
  count: number;
  users: UserType[];
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

  const transformedUsers = users.map(transformUser) as UserType[];

  return {
    count,
    transformedUsers,
  };
};

export const fetchUserById = async (params: { id: string; accessToken: string }) => {
  const { id, accessToken } = params || {};

  const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}users/${id}`;
  const res = await fetch(url, {
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const creator = (await res.json()) as UserType;

  return transformUser(creator);
};

const transformUser = (user: RawUser): UserType => ({
  ...user,
  displayName: `${user.firstName} ${user.lastName}`,
  profileUrl: `/profile/${user.id}`,
});
