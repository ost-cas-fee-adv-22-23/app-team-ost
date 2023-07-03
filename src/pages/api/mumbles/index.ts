import { apiHandler } from '@/helpers/api/api-handler';
import { fetchMumbles } from '@/services/qwacker-api/posts';
import { HttpStatusCodes } from '@/types/http';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

const getMumbles = async (nextReq: NextApiRequest, nextRes: NextApiResponse): Promise<void> => {
  const { creator, newerThan, olderThan } = nextReq.query;
  const jwtPayload = await getToken({ req: nextReq });

  // Es wird bewusst nicht geprüft ob der Benutzer engemeldet ist. Ist der Benutzer nicht angemeldet, erhält dieser
  // anonymisierte Benutzerdaten
  const response = await fetchMumbles({
    limit: 5,
    creator: creator as string | undefined,
    newerThanMumbleId: newerThan as string | undefined,
    olderThanMumbleId: olderThan as string | undefined,
    accessToken: jwtPayload?.accessToken,
  });

  nextRes.status(HttpStatusCodes.OK).json(response);
};

export default apiHandler({
  GET: getMumbles,
});
