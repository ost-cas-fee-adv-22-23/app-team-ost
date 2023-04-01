type HttpMethods = 'GET' | 'POST' | 'PUT' | 'DELETE';

const buildRequestConfig = (
  method: HttpMethods,
  accessToken?: string,
  body?: BodyInit | Record<string, unknown>
): RequestInit => {
  const config: RequestInit = {};
  config.method = method;
  config.body = body instanceof FormData ? body : JSON.stringify(body);
  config.headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${accessToken}`,
    'content-type': 'application/json',
  };

  if (!accessToken) {
    delete config.headers['Authorization'];
  }

  if (body instanceof FormData) {
    delete config.headers['content-type'];
  }

  if (!body) {
    delete config.body;
  }

  return config;
};

async function request<TResponse>(urlPart: string, config: RequestInit, searchParams?: URLSearchParams): Promise<TResponse> {
  const url =
    searchParams !== undefined
      ? `${process.env.NEXT_PUBLIC_QWACKER_API_URL}${urlPart}?${searchParams}`
      : `${process.env.NEXT_PUBLIC_QWACKER_API_URL}${urlPart}`;

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error('Something was not okay');
    }

    if (response.status === 204) {
      return true as TResponse;
    }

    return (await response.json()) as TResponse;
  } catch (error) {
    console.warn('error', error);
    // todo: Handle the error. eg. unresolved promises and basic network errors (Page Not Found, Bad Request, etc.)
    throw new Error('Something was not okay');
  }
}

export const qwackerApi = {
  /*
   * Sends an anonymous GET request to the qwacker api.
   */
  getWithoutAuth: <TResponse>(urlPart: string, searchParams?: URLSearchParams) =>
    request<TResponse>(urlPart, buildRequestConfig('GET'), searchParams),
  /*
   * Sends a GET request to the qwacker api. An access token is required.
   */
  get: <TResponse>(urlPart: string, accessToken: string, searchParams?: URLSearchParams) =>
    request<TResponse>(urlPart, buildRequestConfig('GET', accessToken), searchParams),
  /*
   * Sends a POST request to the qwacker api. An access token is required.
   */
  post: <TBody extends BodyInit | Record<string, unknown>, TResponse>(urlPart: string, accessToken: string, body: TBody) =>
    request<TResponse>(urlPart, buildRequestConfig('POST', accessToken, body)),
  /*
   * Sends a POST request with a FormData body to the qwacker api. An access token is required.
   */
  postFormData: <TResponse>(urlPart: string, accessToken: string, body: FormData) =>
    qwackerApi.post<FormData, TResponse>(urlPart, accessToken, body),
  /*
   * Sends a PUT request to the qwacker api. An access token is required.
   */
  put: (urlPart: string, accessToken: string) => request<boolean>(urlPart, buildRequestConfig('PUT', accessToken)),
  /*
   * Sends a PUT request to the qwacker api. An access token is required.
   */
  delete: (urlPart: string, accessToken: string) => request<boolean>(urlPart, buildRequestConfig('DELETE', accessToken)),
};
