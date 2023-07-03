import { FetchPagesApiError } from '@/types/error';
import { FetchData } from '@/types/fetch-data';
import { MumbleList } from '@/types/mumble';
import useSWR from 'swr';
import fetcher from './fetcher';

export const useFetchMumbles = (
  creator?: string,
  newerThanMumbleId?: string,
  olderThanMumbleId?: string
): FetchData<MumbleList> => {
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

  const { data, error, isLoading } = useSWR<MumbleList, FetchPagesApiError>(`/api/mumbles?${urlParams}`, fetcher);
  return {
    data,
    isLoading,
    error,
  };
};
