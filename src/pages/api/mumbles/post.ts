import { apiHandler } from '@/helpers/api/api-handler';
import { isAuthorized } from '@/helpers/api/is-authorized';
import { fetchMumbles, postMumble } from '@/services/qwacker-api/posts';
import { HttpStatusCodes } from '@/types/http';
import { Mumble } from '@/types/mumble';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken, JWT } from 'next-auth/jwt';



const postNewMumble = async (nextReq: NextApiRequest, nextRes: NextApiResponse): Promise<void> => {
const {text, file} = nextReq.body;
  
console.log(text);
console.log(file);

  
  if (await isAuthorized(nextReq, nextRes)) {
    const jwtPayload = (await getToken({ req: nextReq })) as JWT;
    const response = await postMumble({     
      accessToken: jwtPayload.accessToken as string,
      text: text as string,
      file: file as File,
    });

    console.log(response);
    
    nextRes.status(HttpStatusCodes.OK).json(response);
  };
}

export default apiHandler({
  POST: postNewMumble,
});
