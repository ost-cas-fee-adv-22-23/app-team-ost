import { Mumble } from '@/types/mumble';
import useSWR from 'swr';
import fetcher from './fetcher';

type FetchMumbles = {
  mumbles: Mumble[];
  isLoading: boolean;
  error: string | any;
};

export const useSearchMumbles = (mentions?: string, offset?: string, tags?: string, text?: string, userid?: string) => {
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
    urlParams.set('tags', text);
  }
  if (userid) {
    urlParams.set('userid', userid);
  }

  const { data, error, isLoading } = useSWR<FetchMumbles, Error>(`/api/posts/search-mumbles?${urlParams}`, fetcher);

  return {
    data,
    isLoading,
    error,
  };
};
