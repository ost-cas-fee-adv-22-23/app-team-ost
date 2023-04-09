import { fetchMumbles } from '@/services/qwacker-api/posts';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { creator, newerThan, olderThan } = req.query;
  const jwtPayload = await getToken({ req });

  fetchMumbles({
    limit: 5,
    creator: creator as string | undefined,
    newerThanMumbleId: newerThan as string | undefined,
    olderThanMumbleId: olderThan as string | undefined,
    accessToken: jwtPayload?.accessToken,
  })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
}
