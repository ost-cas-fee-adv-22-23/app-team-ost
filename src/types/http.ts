export type HttpMethod = 'GET' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'POST' | 'PUT' | 'PATCH' | 'PURGE' | 'LINK' | 'UNLINK';

export enum HttpStatusCodesSuccess {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
}
export enum HttpStatusCodesError {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  INTERNAL_SERVER_ERROR = 500,
}

export const HttpStatusCodes = {
  ...HttpStatusCodesSuccess,
  ...HttpStatusCodesError,
};
