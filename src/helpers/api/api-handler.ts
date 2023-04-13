import { ApiError, createErrorResponse, createApiError } from '@/types/error';
import { HttpMethod, HttpStatusCodes } from '@/types/http';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

type ApiMethodHandlers = {
  [key in Uppercase<HttpMethod>]?: NextApiHandler;
};

export const apiHandler = (handler: ApiMethodHandlers) => {
  return async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    try {
      const method = req.method ? (req.method.toUpperCase() as keyof ApiMethodHandlers) : undefined;

      // check if handler supports current HTTP method
      if (!method) {
        return createApiError(`No method specified on path ${req.url}!`, HttpStatusCodes.METHOD_NOT_ALLOWED);
      }

      const methodHandler = handler[method];
      if (!methodHandler) {
        return createApiError(`No method specified on path ${req.url}!`, HttpStatusCodes.METHOD_NOT_ALLOWED);
      }

      // call method handler
      await methodHandler(req, res);
    } catch (error) {
      // global error handler
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(createErrorResponse(error.message, error.statusCode));
      } else {
        // Errors with statusCode >= 500 should not be exposed in detail
        res
          .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
          .json(createErrorResponse('Oops - Something went wrong.', HttpStatusCodes.INTERNAL_SERVER_ERROR));
      }
    }
  };
};
