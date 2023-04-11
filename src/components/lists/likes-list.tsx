import { MumbleCard, MumbleCardVariant } from '@/components/cards/mumble-card';
import { onLikeClick } from '@/helpers/like-mumble';
import { listReducer, ListState } from '@/helpers/reducers/lists-reducer';
import { useSearchMumbles } from '@/hooks/api/use-search-mumbles';
import {
  IconMumble,
  Paragraph,
  ParagraphSize,
  Stack,
  StackAlignItems,
  StackJustifyContent,
  StackSpacing,
  TextButton,
  TextButtonColor,
  TextButtonDisplayMode,
  TextButtonSize,
} from '@smartive-education/design-system-component-library-team-ost';
import { FC, useEffect, useReducer } from 'react';

type LikesListProps = {
  variant: MumbleCardVariant;
  creator?: string;
  isReplyActionVisible?: boolean;
  isLikeActionVisible?: boolean;
};

// We decided to make two different lists for mumbles and likes
// as the behavior of the two is different in initializing
// and they use different hooks for loading more mumbles.
// But they use the same reducer for state handling.
export const LikesList: FC<LikesListProps> = (props: LikesListProps) => {
  const initialState: ListState = {
    hasMore: false,
    hasUpdate: false,
    isLoading: false,
    mumbles: [],
    mumblesCount: 0,
    error: '',
  };

  const [listState, dispatchList] = useReducer(listReducer, initialState);

  useEffect(() => {
    // We us this ignore to workaround the twice fired effects in react development mode
    // https://react.dev/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development
    let ignore = false;

    dispatchList({ type: 'fetch_mumbles' });
    async function startFetching() {
      const urlParams = new URLSearchParams();

      props.creator && urlParams.set('likedBy', props.creator);
      try {
        const res = await fetch(`/api/posts/search-mumbles?${urlParams}`);
        const data = await res.json();

        !ignore &&
          dispatchList({ type: 'fetch_initialmumbles_success', payload: { mumbles: data.mumbles, count: data.count } });
      } catch (error) {
        throw new Error(`Error: ${error}`);
      }
    }
    startFetching();

    return () => {
      ignore = true;
    };
  }, []);

  const { data: moreMumbles } = useSearchMumbles(
    undefined,
    listState.mumbles.length.toString(),
    undefined,
    undefined,
    props.creator
  );

  const loadMore = () => {
    dispatchList({ type: 'fetch_mumbles' });
    try {
      moreMumbles && dispatchList({ type: 'fetch_mumbles_success', payload: moreMumbles.mumbles });
    } catch (error) {
      dispatchList({ type: 'fetch_mumbles_error', payload: error as string });
      throw new Error(`Error: ${error}`);
    }
  };

  if (listState.isLoading) {
    return <Paragraph size={ParagraphSize.l}>Deine Likes werden gerade gesammelt.</Paragraph>;
  }

  if (!listState.mumbles || listState.mumbles.length <= 0) {
    return <Paragraph size={ParagraphSize.l}>Uups. Da sind noch keine Likes von dir.</Paragraph>;
  }

  return (
    <>
      {listState.mumbles.map((mumble) => (
        <MumbleCard
          key={mumble.id}
          variant={props.variant}
          mumble={mumble}
          onLikeClick={onLikeClick}
          isReplyActionVisible={props.isReplyActionVisible}
          isLikeActionVisible={props.isLikeActionVisible}
        />
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
            {listState.isLoading ? '...' : 'Weitere Mumbles laden'}
          </TextButton>
        </Stack>
      )}
    </>
  );
};
