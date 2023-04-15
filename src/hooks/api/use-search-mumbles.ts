import { FetchPagesApiError } from '@/types/error';
import { FetchData } from '@/types/fetch-data';
import { MumbleList } from '@/types/mumble';
import useSWR from 'swr';
import fetcher from './fetcher';

export const useSearchMumbles = (
  mentions?: string,
  offset?: string,
  tags?: string,
  text?: string,
  likedBy?: string
): FetchData<MumbleList> => {
  const urlParams = new URLSearchParams();
  if (mentions) {
    urlParams.set('mentions', mentions);
  }
  if (offset) {
    urlParams.set('offset', offset);
  }
  if (tags) {
    urlParams.set('tags', tags);
  }
  if (text) {
    urlParams.set('text', text);
  }
  if (likedBy) {
    urlParams.set('likedBy', likedBy);
  }

  const { data, error, isLoading } = useSWR<MumbleList, FetchPagesApiError>(
    `/api/posts/search-mumbles?${urlParams}`,
    fetcher
  );

  return {
    data,
    isLoading,
    error,
  };
};
