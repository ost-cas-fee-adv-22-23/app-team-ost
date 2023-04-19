import { apiHandler } from '@/helpers/api/api-handler';
import { isAuthorized } from '@/helpers/api/is-authorized';
import { likeMumbleById, unlikeMumbleById } from '@/services/qwacker-api/posts';
import { QwackerError } from '@/types/error';
import { HttpStatusCodes } from '@/types/http';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken, JWT } from 'next-auth/jwt';

const likeMumble = async (nextReq: NextApiRequest, nextRes: NextApiResponse): Promise<void> => {
  const { id } = nextReq.query;

  if (await isAuthorized(nextReq, nextRes)) {
    const jwtPayload = (await getToken({ req: nextReq })) as JWT;
    const response = await likeMumbleById(id as string, jwtPayload.accessToken as string);
    if (response) {
      nextRes.status(HttpStatusCodes.NO_CONTENT);
    } else {
      throw new QwackerError(
        `Failed to like mumble - something went wrong with the communication with the qwacker-api at ${nextReq.url}`
      );
    }
  }
};

const unlikeMumble = async (nextReq: NextApiRequest, nextRes: NextApiResponse): Promise<void> => {
  const { id } = nextReq.query;

  if (await isAuthorized(nextReq, nextRes)) {
    const jwtPayload = (await getToken({ req: nextReq })) as JWT;
    const response = await unlikeMumbleById(id as string, jwtPayload.accessToken as string);
    if (response) {
      nextRes.status(HttpStatusCodes.NO_CONTENT);
    } else {
      throw new QwackerError(
        `Failed to unlike mumble - something went wrong with the communication with the qwacker-api at ${nextReq.url}`
      );
    }
  }
};

export default apiHandler({
  PUT: likeMumble,
  DELETE: unlikeMumble,
});
