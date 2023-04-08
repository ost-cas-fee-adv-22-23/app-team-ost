import { Mumble } from '@/types/mumble';
import useSWR from 'swr';
import fetcher from './fetcher';

type FetchMumbles = {
  mumbles: Mumble[];
  isLoading: boolean;
  error: string | any;
};

export const useFetchMumbles = (creator?: string, newerThanMumbleId?: string, olderThanMumbleId?: string) => {
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

  const { data, error, isLoading } = useSWR<FetchMumbles, Error>(`/api/posts/fetch-mumbles?${urlParams}`, fetcher);

  return {
    data,
    isLoading,
    error,
  };
};
