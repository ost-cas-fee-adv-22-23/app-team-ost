import { HttpStatusCodesError } from '@/types/http';

export class ApiError extends Error {
  public statusCode: HttpStatusCodesError;

  constructor(message: string, statusCode: HttpStatusCodesError) {
    super(message);

    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

export class QwackerError extends Error {
  constructor(message: string) {
    super(message);

    this.name = 'QwackerError';
  }
}

// todo: ValidationError

export type ErrorResponse = {
  message: string;
  statusCode: HttpStatusCodesError;
};

export const createApiError = (message: string, statusCode: HttpStatusCodesError): void => {
  // todo: loggen
  throw new ApiError(message, statusCode);
};

export const createQwackerError = (message: string): void => {
  // todo: loggen
  throw new QwackerError(message);
};

export const createErrorResponse = (message: string, statusCode: HttpStatusCodesError): ErrorResponse => {
  return {
    message,
    statusCode,
  };
};
