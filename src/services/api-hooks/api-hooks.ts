import useSWR from 'swr';
import { Mumble } from '../../types/mumble';
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

  const { data, error, isLoading } = useSWR<FetchMumbles, Error>(`/api/posts/fetchmumbles?${urlParams}`, fetcher);

  return {
    data,
    isLoading,
    error,
  };
};

export const useSearchMumbles = (mentions?: string, offset?: string, tags?: string, text?: string, userid?: string) => {
  console.log('offset');
  console.log(offset, userid);

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

  const { data, error, isLoading } = useSWR<FetchMumbles, Error>(`/api/posts/searchmumbles?${urlParams}`, fetcher);

  return {
    data,
    isLoading,
    error,
  };
};
