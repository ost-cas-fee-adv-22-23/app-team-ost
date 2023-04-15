import { FetchPagesApiError } from '@/types/error';

export type FetchData<T> = {
  data?: T;
  isLoading: boolean;
  error?: FetchPagesApiError;
};
