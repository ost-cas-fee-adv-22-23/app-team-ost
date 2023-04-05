import {
  Stack,
  StackAlignItems,
  StackJustifyContent,
  StackSpacing,
  TextButton,
  TextButtonColor,
  TextButtonDisplayMode,
  IconMumble,
  TextButtonSize,
} from '@smartive-education/design-system-component-library-team-ost';
import { FC, useEffect, useReducer } from 'react';
import { useFetchMumbles, useSearchMumbles } from '../../hooks/api/qwacker-api';
import { Mumble } from '../../types/mumble';
import { MumbleCard, MumbleCardVariant } from '../cards/mumble-card';
import { ListState, listReducer } from './lists-reducer';

type LikesListProps = {
  mumbles: Mumble[];
  count: number;
  variant: MumbleCardVariant;
  creator?: string;
};

export const LikesList: FC<LikesListProps> = (props: LikesListProps) => {
  const initialState: ListState = {
    hasMore: props.mumbles.length < props.count,
    loading: false,
    mumbles: props.mumbles,
    mumblesCount: props.count,
    error: '',
  };

  const [listState, dispatchList] = useReducer(listReducer, initialState);

  useEffect(() => {
    dispatchList({ type: 'reinitialize', payload: props });
  }, [props]);

  const {
    isLoading: likedLoading,
    error: likedError,
    data: moreMumbles,
  } = useSearchMumbles(undefined, listState.mumbles.length.toString(), undefined, undefined, props.creator);

  const onLikeClick = async (mumble: Mumble) => {
    // useSWR Hook?
    // optimistic update
    // errorhandling?
    const res = await fetch(`/api/posts/${mumble.id}/like`, { method: mumble.likedByUser ? 'DELETE' : 'PUT' });
    if (res.status === 204) {
      console.warn('work');
    } else {
      console.warn('error');
    }
  };

  const loadMore = async () => {
    dispatchList({ type: 'fetch_mumbles' });
    try {
      moreMumbles && dispatchList({ type: 'fetch_mumbles_success', payload: moreMumbles.mumbles });
    } catch (error) {
      dispatchList({ type: 'fetch_mumbles_error', payload: error as string });
      throw new Error(`Error: ${error}`);
    }
  };

  if (!props.mumbles) {
    return <p>Uups. Wir finden keine Mumbles für dich.</p>;
  }

  return (
    <>
      {listState.mumbles.map((mumble) => (
        <MumbleCard key={mumble.id} variant={props.variant} mumble={mumble} onLikeClick={onLikeClick} />
      ))}
      {listState.hasMore && (
        <Stack alignItems={StackAlignItems.center} justifyContent={StackJustifyContent.center} spacing={StackSpacing.xl}>
          <TextButton
            ariaLabel="Weitere Mumbles laden"
            color={TextButtonColor.gradient}
            displayMode={TextButtonDisplayMode.inline}
            icon={<IconMumble />}
            onClick={() => loadMore()}
            size={TextButtonSize.l}
          >
            {listState.loading ? '...' : 'Weitere Mumbles laden'}
          </TextButton>
        </Stack>
      )}
    </>
  );
};
