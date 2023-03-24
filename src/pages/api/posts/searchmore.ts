import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { fetchMumblesSearch } from '../../../services/qwacker-api/posts';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { mentions, offset, tags, text, userid } = req.query;
  const decodedToken = await getToken({ req });

  if (!decodedToken || !decodedToken.accessToken) {
    return res.status(401).json({
      status: false,
      error: `No session.`,
    });
  }

  fetchMumblesSearch({
    accessToken: decodedToken.accessToken,
    limit: 1,
    mentions: mentions as string | undefined,
    offset: Number(offset) | 0,
    tags: tags as string | undefined,
    text: text as string | undefined,
    userid: userid as string | undefined,
  })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
}
