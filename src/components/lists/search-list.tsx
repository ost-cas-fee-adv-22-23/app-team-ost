import { MumbleCard, MumbleCardVariant } from '@/components/cards/mumble-card';
import { onLikeClick } from '@/helpers/like-mumble';
import { listReducer, ListState } from '@/helpers/reducers/list-reducer';
import { useSearchMumbles } from '@/hooks/api/use-search-mumbles';
import { Mumble } from '@/types/mumble';
import {
  IconMumble,
  Paragraph,
  ParagraphSize,
  Stack,
  StackAlignItems,
  StackDirection,
  StackJustifyContent,
  StackSpacing,
  TextButton,
  TextButtonColor,
  TextButtonDisplayMode,
  TextButtonSize,
} from '@smartive-education/design-system-component-library-team-ost';
import { FC, useReducer } from 'react';

type SearchListProps = {
  count: number;
  mumbles: Mumble[];
  mumbleCardVariant: MumbleCardVariant;
  creator?: string;
  tag?: string;
  isLikeActionVisible?: boolean;
  isReplyActionVisible?: boolean;
  listStackWithDivider?: boolean;
  listStackWithSpacing?: boolean;
};

// We decided to make two different lists for mumbles and search
// as the behavior of the two is different in initializing
// and they use different hooks for loading more mumbles.
// But they use the same reducer for state handling.
export const SearchList: FC<SearchListProps> = (props: SearchListProps) => {
  const initialListState: ListState = {
    hasMore: props.mumbles.length < props.count,
    hasUpdate: false,
    isLoading: false,
    mumbles: props.mumbles,
    mumblesCount: props.count,
    error: '',
  };

  const [listState, dispatchList] = useReducer(listReducer, initialListState);

  const { data: moreMumbles } = useSearchMumbles(
    undefined,
    listState.mumbles.length.toString(),
    props.tag,
    undefined,
    props.creator
  );

  const loadMore = (): void => {
    dispatchList({ type: 'fetch_mumbles' });
    try {
      moreMumbles && dispatchList({ type: 'fetch_mumbles_success', payload: moreMumbles.mumbles });
    } catch (error) {
      dispatchList({ type: 'fetch_mumbles_error', payload: error as string });
      throw new Error(`Error: ${error}`);
    }
  };

  if (!listState.mumbles || listState.mumbles.length <= 0) {
    return <Paragraph size={ParagraphSize.l}>Uups. Da sind noch keine Mumbles.</Paragraph>;
  }

  return (
    <>
      <Stack
        direction={StackDirection.col}
        spacing={props.listStackWithSpacing ? StackSpacing.s : StackSpacing.none}
        withDivider={props.listStackWithDivider}
      >
        {listState.mumbles.map((mumble) => (
          <MumbleCard
            key={mumble.id}
            variant={props.mumbleCardVariant}
            mumble={mumble}
            onLikeClick={onLikeClick}
            isReplyActionVisible={props.isReplyActionVisible}
            isLikeActionVisible={props.isLikeActionVisible}
          />
        ))}
      </Stack>
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
