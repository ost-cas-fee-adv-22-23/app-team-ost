import { User } from '../../types/user';

type ApiUserResult = {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
};

type QwackerUserResponse = {
  count: number;
  users: ApiUserResult[];
};

export type UploadImage = File & { preview: string };

// export const fetchUsers = async (params?: { limit?: number; offset?: number; accessToken: string }) => {
//   const { limit, offset, accessToken } = params || {};

//   const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}users?${new URLSearchParams({
//     limit: limit?.toString() || '100',
//     offset: offset?.toString() || '0',
//   })}`;
//   const res = await fetch(url, {
//     headers: {
//       'content-type': 'application/json',
//       Authorization: `Bearer ${accessToken}`,
//     },
//   });

//   const { count, users } = (await res.json()) as QwackerUserResponse;

//   const transformedUsers = users.map(transformUser) as User[];

//   return {
//     count,
//     transformedUsers,
//   };
// };

export const fetchUserById = async (params: { id: string; accessToken?: string }) => {
  const { id, accessToken } = params || {};
  let user: ApiUserResult;

  if(accessToken) {
      const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}users/${id}`;
      const res = await fetch(url, {
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    user = (await res.json());
  }
  else {
    user = {
      id: id,
      userName: 'anonym',
      firstName: '',
      lastName: '',
      avatarUrl: '',
    };
  }

  return transformUser(user);

};

const transformUser = (user: ApiUserResult): User => ({
  ...user,
  displayName: `${user.firstName} ${user.lastName}`,
  profileUrl: `/profile/${user.id}`,
});
