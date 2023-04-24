import nextConnect from 'next-connect';
import multer from 'multer';
import { NextApiRequest, NextApiResponse } from 'next';
import { isAuthorized } from '@/helpers/api/is-authorized';
import { postMumble } from '@/services/qwacker-api/posts';
import { HttpStatusCodes } from '@/types/http';
import { getToken, JWT } from 'next-auth/jwt';
import { apiHandler } from '@/helpers/api/api-handler';

type NextApiRequestWithFile = {
  file: File;
} & NextApiRequest;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const apiRoute = nextConnect()
  .use(upload.single('file'))
  .post(async (req: NextApiRequestWithFile, res: NextApiResponse) => {
    const file = req.file;
    const text = req.body.text;

    console.log(file);
    console.log(text);

    if (await isAuthorized(req, res)) {
      const jwtPayload = (await getToken({ req: req })) as JWT;
      const response = await postMumble({
        accessToken: jwtPayload.accessToken as string,
        text: req.body.text,
        file: req.file,
      });
      res.status(HttpStatusCodes.OK).json(response);
    }
  });

export default apiHandler({
  POST: apiRoute,
});
