import { searchMumbles } from '@/services/qwacker-api/posts';
import { SearchMumblesParams } from '@/types/mumble';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { limit, offset, text, tags, mentions, likedBy } = req.query;

  const jwtPayload = await getToken({ req });

  if (!jwtPayload || !jwtPayload.accessToken) {
    return res.status(401).json({
      status: false,
      error: `No session.`,
    });
  }
  // todo: limit auch setzen?
  const searchParams: SearchMumblesParams = {
    accessToken: jwtPayload.accessToken,
    offset: Number(offset) | 0,
    limit: 5,
    text: text as string | undefined,
    tags: tags as string[] | undefined,
    mentions: mentions as string[] | undefined,
    likedBy: likedBy as string | undefined,
  };

  searchMumbles(searchParams)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
}
