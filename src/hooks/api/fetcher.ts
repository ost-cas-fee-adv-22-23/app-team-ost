import { ErrorResponse, FetchPagesApiError } from '@/types/error';

export default async function fetcher<JSON = unknown>(input: RequestInfo, init?: RequestInit): Promise<JSON> {
  const res = await fetch(input, init);

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const errorResponse = (await res.json()) as ErrorResponse;
    throw new FetchPagesApiError(errorResponse.message, res.status);
  }

  return res.json();
}
