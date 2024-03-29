import { apiHandler } from '@/helpers/api/api-handler';
import { isAuthorized } from '@/helpers/api/is-authorized';
import { searchMumbles } from '@/services/qwacker-api/posts';
import { HttpStatusCodes } from '@/types/http';
import { SearchMumblesParams } from '@/types/mumble';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken, JWT } from 'next-auth/jwt';

const getSearch = async (nextReq: NextApiRequest, nextRes: NextApiResponse): Promise<void> => {
  const { offset, text, tags, mentions, likedBy } = nextReq.query;

  if (await isAuthorized(nextReq, nextRes)) {
    const jwtPayload = (await getToken({ req: nextReq })) as JWT;

    const searchParams: SearchMumblesParams = {
      accessToken: jwtPayload.accessToken as string,
      offset: Number(offset) | 0,
      limit: 5,
      text: text as string | undefined,
      tags: tags ? [tags as string] : undefined,
      mentions: mentions as string[] | undefined,
      likedBy: likedBy as string | undefined,
    };

    const response = await searchMumbles(searchParams);
    nextRes.status(HttpStatusCodes.OK).json(response);
  }
};

export default apiHandler({
  GET: getSearch,
});
