import { likeMumbleById, unlikeMumbleById } from '@/services/qwacker-api/posts';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const method = req.method as 'PUT' | 'DELETE';
  const decodedToken = await getToken({ req });

  if (!decodedToken || !decodedToken.accessToken) {
    return res.status(401).json({
      status: false,
      error: `No session.`,
    });
  }

  switch (method) {
    // todo: httpMethods verwenden
    case 'PUT': {
      // todo; id prüfen ob string; sonst bad request
      // status Codes als return?
      try {
        const responseFromAPI = await likeMumbleById(id as string, decodedToken.accessToken);
        if (responseFromAPI) {
          return res.status(204);
        }
      } catch (e) {
        return res.status(500).json({
          status: false,
          error: `Serverfehler`,
        });
      }

      break;
    }
    case 'DELETE': {
      try {
        const responseFromAPI = await unlikeMumbleById(id as string, decodedToken.accessToken);
        if (responseFromAPI) {
          return res.status(204);
        }
      } catch (e) {
        return res.status(500).json({
          status: false,
          error: `Serverfehler`,
        });
      }
      break;
    }
    default: {
      return res.status(405).json({
        status: false,
        error: `Method not allowed.`,
      });
    }
  }
}
