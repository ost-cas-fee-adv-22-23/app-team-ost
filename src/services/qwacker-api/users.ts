import { qwackerApi } from '@/services/qwacker-api/api';
import { User } from '@/types/user';

// Qwacker API-Types. Same types / names as implemented in the cas-fee-adv-qwacker-api. Only used in this File.
type ApiUserResult = {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
};

export const fetchUserById = async (id: string, accessToken?: string): Promise<User> => {
  let userResult: ApiUserResult;

  if (accessToken) {
    userResult = await qwackerApi.get<ApiUserResult>(`users/${id}`, accessToken);
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

const transformApiUserResultToUser = (apiUserResult: ApiUserResult): User => ({
  ...apiUserResult,
  displayName: apiUserResult.userName === 'anonymous' ? '' : `${apiUserResult.firstName} ${apiUserResult.lastName}`,
  profileUrl: apiUserResult.userName === 'anonymous' ? `/auth/login` : `/profile/${apiUserResult.id}`,
});
