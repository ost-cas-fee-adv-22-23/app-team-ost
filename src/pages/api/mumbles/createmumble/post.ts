import middleware from './middleware';
import nextConnect from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import { isAuthorized } from '@/helpers/api/is-authorized';
import { postMumble } from '@/services/qwacker-api/posts';
import { HttpStatusCodes } from '@/types/http';
import { getToken, JWT } from 'next-auth/jwt';
import { text } from 'stream/consumers';

type NextApiRequestWithFile = {
  file: File;
} & NextApiRequest;

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req: NextApiRequestWithFile, res: NextApiResponse) => {
  console.log('HANDLER GO');

  try {
    // const file = req.file;
    // const body = req.body;

    if (await isAuthorized(req, res)) {
      const jwtPayload = (await getToken({ req: req })) as JWT;
      const response = await postMumble({
        accessToken: jwtPayload.accessToken as string,
        text: req.body.text,
        file: req.file,
      });

      res.status(HttpStatusCodes.OK).json(response);
    }

    // do stuff with files and body
    res.status(200).json({});
  } catch (err) {
    res.status(500).json({ 'error: err.message': err });
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
