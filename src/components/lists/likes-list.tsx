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
  Paragraph,
  ParagraphSize,
} from '@smartive-education/design-system-component-library-team-ost';
import { FC, useEffect, useReducer } from 'react';
import { useSearchMumbles } from '../../hooks/api/useSearchMumbles';
import { Mumble } from '../../types/mumble';
import { MumbleCard, MumbleCardVariant } from '../cards/mumble-card';
import { ListState, listReducer } from '../../helpers/reducers/lists-reducer';
import { onLikeClick } from '../../helpers/like-mumble';

type LikesListProps = {
  mumbles: Mumble[];
  count: number;
  variant: MumbleCardVariant;
  creator?: string;
  isReplyActionVisible?: boolean;
  isLikeActionVisible?: boolean;
};

export const LikesList: FC<LikesListProps> = (props: LikesListProps) => {
  const initialState: ListState = {
    hasMore: props.mumbles.length < props.count,
    isLoading: false,
    mumbles: props.mumbles,
    mumblesCount: props.count,
    error: '',
  };

  const [listState, dispatchList] = useReducer(listReducer, initialState);

  const fetchInitialUserLikes = async (userid: string) => {
    dispatchList({ type: 'fetch_mumbles' });
    const urlParams = new URLSearchParams();
    urlParams.set('userid', userid);
    try {
      const res = await fetch(`/api/posts/searchmumbles?${urlParams}`);
      if (res.status === 200) {
        // Todo: Vielleich verstehst du, warum ich als Response keine Mumbles erhalte...
        // console.log(res);
        // dispatchList({ type: 'fetch_mumbles_success', payload: res.mumbles });
      } else {
        console.warn('error');
      }
    } catch (error) {
      dispatchList({ type: 'fetch_mumbles_error', payload: error as string });
      throw new Error(`Error: ${error}`);
    }
  };

  const {
    isLoading: isLoadingMoreMumbles,
    error: errorMoreMumbles,
    data: moreMumbles,
  } = useSearchMumbles(undefined, listState.mumbles.length.toString(), undefined, undefined, props.creator);

  useEffect(() => {
    props.creator && fetchInitialUserLikes(props.creator);
  }, []);

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
