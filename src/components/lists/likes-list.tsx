import { MumbleCard, MumbleCardVariant } from '@/components/cards/mumble-card';
import { onLikeClick } from '@/helpers/like-mumble';
import { listReducer, ListState } from '@/helpers/reducers/lists-reducer';
import { useSearchMumbles } from '@/hooks/api/use-search-mumbles';
import { Mumble } from '@/types/mumble';
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
import { FC, useReducer } from 'react';

type LikesListProps = {
  mumbles: Mumble[];
  count: number;
  variant: MumbleCardVariant;
  creator?: string;
  isReplyActionVisible?: boolean;
  isLikeActionVisible?: boolean;
};

// We decided to make to different lists for mumbles and likes
// as the behavior of the two is different in initializing
// and they use different hooks for loading more mumbles.
// But they use the same reducer for state handling.
export const LikesList: FC<LikesListProps> = (props: LikesListProps) => {
  const initialState: ListState = {
    hasMore: props.mumbles.length < props.count,
    isLoading: false,
    mumbles: props.mumbles,
    mumblesCount: props.count,
    error: '',
  };

  const [listState, dispatchList] = useReducer(listReducer, initialState);

  const {
    isLoading: isLoadingMoreMumbles,
    error: errorMoreMumbles,
    data: moreMumbles,
  } = useSearchMumbles(undefined, listState.mumbles.length.toString(), undefined, undefined, props.creator);

  const loadMore = async () => {
    dispatchList({ type: 'fetch_mumbles' });
    try {
      moreMumbles && dispatchList({ type: 'fetch_mumbles_success', payload: moreMumbles.mumbles });
    } catch (error) {
      dispatchList({ type: 'fetch_mumbles_error', payload: error as string });
      throw new Error(`Error: ${error}`);
    }
  };

  if (!listState.mumbles) {
    return <Paragraph size={ParagraphSize.l}>Uups. Wir finden keine Mumbles für dich.</Paragraph>;
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
