import { Mumble } from '../../types/mumble';

export type MumbleListState = {
  hasMore: boolean;
  loading: boolean;
  mumblesCount: number;
  mumbles: Mumble[];
  error: string;
};

type MumbleListAction =
  | { type: 'fetch_mumbles' }
  | { type: 'fetch_mumbles_error'; payload: string }
  | { type: 'fetch_mumbles_success'; payload: Mumble[] }
  | { type: 'reinitialize'; payload: { mumbles: Mumble[]; count: number } };

export const mumbleListReducer = (state: MumbleListState, action: MumbleListAction): MumbleListState => {
  switch (action.type) {
    case 'fetch_mumbles':
      return { ...state, loading: true };
    case 'fetch_mumbles_error':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case 'fetch_mumbles_success':
      return {
        ...state,
        hasMore: state.mumbles.length + action.payload.length < state.mumblesCount,
        loading: false,
        mumbles: [...state.mumbles, ...action.payload],
      };
    case 'reinitialize': {
      return {
        hasMore: action.payload.mumbles.length < action.payload.count,
        loading: false,
        mumbles: action.payload.mumbles,
        mumblesCount: action.payload.count,
        error: '',
      };
    }
    default:
      throw new Error(`Unknown action type`);
  }
};
