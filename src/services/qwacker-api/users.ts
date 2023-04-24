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

// Simple Cache System for ApiUserResults.
// Resultate werden zusätzlich mit einem Timestamp abgespeichert, wann diese im Cache abgespeichert wurden.
// Nach Ablauf von USER_CACHE_ENTRY_VALIDITY_IN_SECONDS (= 10 Minuten) ist ein Eintrag invalid, der User wird neu
// vom Qwacker-API geholt und der Eintrag im Cache wird aktualisiert. Cache könnte zwecks Wiederverwendbarkeit
// zukünftig noch ausgelagert werden, sodass er auch in anderen API-Routes eingesetzt werden könnte. Die aktuelle
// Implementation hat noch die Schwäche, dass wenn ein bestimmter Benutzer gleichzeitig mehrmals gefetched wird
// (z.B. wenn derselbe Benutzer in der MumblesList mehrmals aufgelöst werden muss) der Request nicht geteilt wird.
// Dies könnte z.B. noch mittels share rxjs-Operator realisiert werden. Darauf wurde hier aber bewusst verzichtet.
const userCache = new Map<string, [ApiUserResult, number]>();
const USER_CACHE_ENTRY_VALIDITY_IN_SECONDS = 600;

const isCacheEntryExpired = (id: string, seconds: number): boolean => {
  const entry = userCache.get(id);

  if (entry) {
    const timestamp = entry[1];

    return (Date.now() - timestamp) / 1000 > seconds;
  }

  return true;
};

export const fetchUserById = async (id: string, accessToken?: string): Promise<User> => {
  let userResult: ApiUserResult;

  if (accessToken) {
    if (userCache.has(id) && !isCacheEntryExpired(id, USER_CACHE_ENTRY_VALIDITY_IN_SECONDS)) {
      userResult = userCache.get(id)?.[0] as ApiUserResult;
    } else {
      userResult = await qwackerApi.get<ApiUserResult>(`users/${id}`, accessToken);
      userCache.set(userResult.id, [userResult, Date.now()]);
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

const transformApiUserResultToUser = (apiUserResult: ApiUserResult): User => ({
  ...apiUserResult,
  displayName: apiUserResult.userName === 'anonymous' ? '' : `${apiUserResult.firstName} ${apiUserResult.lastName}`,
  profileUrl: apiUserResult.userName === 'anonymous' ? `/auth/login` : `/profile/${apiUserResult.id}`,
});
