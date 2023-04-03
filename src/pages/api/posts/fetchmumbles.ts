import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { fetchMumbles } from '../../../services/qwacker-api/posts';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { creator, newerThan, olderThan } = req.query;
  const decodedToken = await getToken({ req });

  if (!decodedToken || !decodedToken.accessToken) {
    return res.status(401).json({
      status: false,
      error: `No session.`,
    });
  }

  fetchMumbles({
    limit: 5,
    creator: creator as string | undefined,
    newerThanMumbleId: newerThan as string | undefined,
    olderThanMumbleId: olderThan as string | undefined,
    token: decodedToken.accessToken,
  })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
}
