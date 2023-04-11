import { Mumble } from '@/types/mumble';
import useSWR from 'swr';
import fetcher from './fetcher';

type FetchMumbles = {
  mumbles: Mumble[];
  isLoading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: string | any;
};

export const useFetchMumblesRefresh = (creator?: string, newerThanMumbleId?: string, olderThanMumbleId?: string) => {
  const urlParams = new URLSearchParams();
  if (creator) {
    urlParams.set('creator', creator);
  }
  if (newerThanMumbleId) {
    urlParams.set('newerThan', newerThanMumbleId);
  }
  if (olderThanMumbleId) {
    urlParams.set('olderThan', olderThanMumbleId);
  }

  const { data, error, isLoading } = useSWR<FetchMumbles, Error>(`/api/posts/fetch-mumbles?${urlParams}`, fetcher, {
    refreshInterval: 5000,
  });
  return {
    data,
    isLoading,
    error,
  };
};
