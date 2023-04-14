import { FetchPagesApiError } from '@/types/error';
import { FetchData } from '@/types/fetch-data';
import { MumbleList } from '@/types/mumble';
import useSWR from 'swr';
import fetcher from './fetcher';

export const useFetchMumblesRefresh = (
  creator?: string | undefined,
  newerThanMumbleId?: string | undefined,
  olderThanMumbleId?: string | undefined
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

  const { data, error, isLoading } = useSWR<MumbleList, FetchPagesApiError>(
    `/api/posts/fetch-mumbles?${urlParams}`,
    fetcher,
    {
      refreshInterval: 5000,
    }
  );
  return {
    data,
    isLoading,
    error,
  };
};
