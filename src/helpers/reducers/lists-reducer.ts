import { Mumble } from '../../types/mumble';

export type ListState = {
  hasMore: boolean;
  isLoading: boolean;
  mumblesCount: number;
  mumbles: Mumble[];
  error: string;
};

type ListAction =
  | { type: 'fetch_mumbles' }
  | { type: 'fetch_mumbles_error'; payload: string }
  | { type: 'fetch_mumbles_success'; payload: Mumble[] }
  | { type: 'add_new_post_to_list'; payload: Mumble };

export const listReducer = (state: ListState, action: ListAction): ListState => {
  switch (action.type) {
    case 'fetch_mumbles':
      return { ...state, isLoading: true };
    case 'fetch_mumbles_error':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case 'fetch_mumbles_success':
      return {
        ...state,
        hasMore: state.mumbles.length + action.payload.length < state.mumblesCount,
        isLoading: false,
        mumbles: [...state.mumbles, ...action.payload],
      };
    case 'add_new_post_to_list':
      return {
        ...state,
        mumbles: [action.payload, ...state.mumbles],
      };
    default:
      throw new Error(`Unknown action type`);
  }
};
