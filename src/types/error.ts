import { HttpStatusCodesError } from '@/types/http';

// Error, welcher beim Aufruf der pages/api geworfen werden kann (clientseitig).
export class FetchPagesApiError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);

    this.name = 'FetchPagesApiError';
    this.statusCode = statusCode;
  }
}

// Error, welcher beim Aufruf der pages/api geworfen werden kann (serverseitig).
export class PagesApiError extends Error {
  public statusCode: HttpStatusCodesError;

  constructor(message: string, statusCode: HttpStatusCodesError) {
    super(message);

    this.name = 'PagesApiError';
    this.statusCode = statusCode;
  }
}

// Error, welcher bei der Kommunikation mit der Qwacker-Api geworfen werden kann.
export class QwackerError extends Error {
  constructor(message: string) {
    super(message);

    this.name = 'QwackerError';
  }
}

// Error, welcher bei der Like/Unlike Action geworfen werden kann.
export class LikeError extends Error {
  constructor(message: string) {
    super(message);

    this.name = 'LikeError';
  }
}

// Error, welcher bei Ausführung einer ungültigen Action eines Reducers geworfen werden kann.
export class UnknownReducerActionError extends Error {
  public actionType: string;
  constructor(actionType: string) {
    super();

    this.name = 'UnknownReducerActionError';

    this.message = 'Unknown action type';
    this.actionType = actionType;
  }
}

export type ErrorResponse = {
  message: string;
  statusCode: HttpStatusCodesError;
};

export const createPagesApiError = (message: string, statusCode: HttpStatusCodesError): void => {
  // todo: Hier könnte ein PagesApiError geloggt werden.
  throw new PagesApiError(message, statusCode);
};

export const createErrorResponse = (message: string, statusCode: HttpStatusCodesError): ErrorResponse => {
  return {
    message,
    statusCode,
  };
};
