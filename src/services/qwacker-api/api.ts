export async function request<TResponse>(
  urlPart: string,
  token?: string,
  searchParams?: URLSearchParams
): Promise<TResponse> {
  const url =
    searchParams !== undefined
      ? `${process.env.NEXT_PUBLIC_QWACKER_API_URL}${urlPart}?${searchParams}`
      : `${process.env.NEXT_PUBLIC_QWACKER_API_URL}${urlPart}`;

  const config: RequestInit =
    token !== undefined && token !== ''
      ? {
          headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      : {
          headers: {
            'content-type': 'application/json',
          },
        };

  try {
    const response = await fetch(url, config);
    return (await response.json()) as TResponse;
  } catch (error) {
    // todo: Handle the error. eg. unresolved promises and basic network errors (Page Not Found, Bad Request, etc.)
    throw new Error('Something was not okay');
  }
}

export const qwackerApi = {
  getWithoutAuth: <TResponse>(urlPart: string, searchParams?: URLSearchParams) =>
    request<TResponse>(urlPart, undefined, searchParams),
  get: <TResponse>(urlPart: string, token: string, searchParams?: URLSearchParams) =>
    request<TResponse>(urlPart, token, searchParams),

  // todo: request Methode und quackerApi um Post erweitern
  // Using `extends` to set a type constraint:
  // post: <TBody extends BodyInit, TResponse>(url: string, body: TBody) => request<TResponse>(url, { method: 'POST', body }),
};
