type HttpStatusCodesSuccess = 200 | 201 | 204;
type HttpStatusCodesError = 401 | 403;
type HttpStatusCodes = 200 | 201 | 204 | 401 | 403;

export type Error = {
  statusCode: HttpStatusCodesError;
  message: string;
};
