import { createErrorResponse } from '@/types/error';
import { HttpStatusCodes } from '@/types/http';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

export const isAuthorized = async (req: NextApiRequest, res: NextApiResponse): Promise<boolean> => {
  const jwtPayload = await getToken({ req });

  if (!jwtPayload) {
    res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .json(
        createErrorResponse(`Not authorized to access ressource ${req.method} ${req.url}`, HttpStatusCodes.UNAUTHORIZED)
      );
    return false;
  }
  return true;
};
