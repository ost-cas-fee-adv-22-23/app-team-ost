import { User } from '../../types/user';
import { qwackerApi } from './api';

type ApiUserResult = {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
};

// todo: kann gelöscht werden? Wird nur für fetchAllUsers benötigt.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type QwackerUserResponse = {
  count: number;
  users: ApiUserResult[];
};

export const fetchUserById = async (params: { id: string; accessToken?: string }): Promise<User> => {
  // todo: Naming accessToken und token konsolidieren
  const { id, accessToken } = params || {};
  let userResult: ApiUserResult;

  if (accessToken) {
    try {
      userResult = await qwackerApi.get<ApiUserResult>(`users/${id}`, accessToken);
    } catch (error) {
      // todo: Handle any error happened.
      throw new Error('Something was not okay');
    }
  } else {
    userResult = {
      id: id,
      userName: 'anonymous',
      firstName: '',
      lastName: '',
      avatarUrl: '',
    };
  }

  return transformApiUserResultToUser(userResult);
};

const transformApiUserResultToUser = (user: ApiUserResult): User => ({
  ...user,
  displayName: user.userName === 'anonymous' ? '' : `${user.firstName} ${user.lastName}`,
  profileUrl: user.userName === 'anonymous' ? `/login` : `/profile/${user.id}`,
});
