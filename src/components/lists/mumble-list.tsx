import { MumbleCard, MumbleCardVariant } from '@/components/cards/mumble-card';
import { WriteCard, WriteCardVariant } from '@/components/cards/write-card';
import { onLikeClick } from '@/helpers/like-mumble';
import { listReducer, ListState } from '@/helpers/reducers/lists-reducer';
import { writeReducer, WriteState } from '@/helpers/reducers/write-reducer';
import { validateFileinput } from '@/helpers/validate-fileinput';
import { useFetchMumbles } from '@/hooks/api/use-fetch-mumbles';
import { postMumble, postReply } from '@/services/qwacker-api/posts';
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
import { ChangeEvent, FC, FormEvent, useReducer } from 'react';

type MumbleListProps = {
  mumbles: Mumble[];
  count: number;
  variant: MumbleCardVariant;
  creator?: string;
  likesFilter?: boolean;
  isWriteCardVisible?: boolean;
  isReplyActionVisible?: boolean;
  isLikeActionVisible?: boolean;
  accessToken?: string;
  replyToPostId?: string;
};

export const MumbleList: FC<MumbleListProps> = (props: MumbleListProps) => {
  const initialState: ListState = {
    hasMore: props.mumbles.length < props.count,
    isLoading: false,
    mumbles: props.mumbles,
    mumblesCount: props.count,
    error: '',
  };
  const initialWriteState: WriteState = {
    fileinputError: '',
    forminputError: '',
    form: {
      file: null,
      textinput: '',
      textinputError: '',
    },
    formIsSubmitting: false,
  };

  const [listState, dispatchList] = useReducer(listReducer, initialState);
  const [writeState, dispatchWrite] = useReducer(writeReducer, initialWriteState);

  const {
    isLoading: isLoadingMoreMumbles,
    error: errorMoreMumbles,
    data: moreMumbles,
  } = useFetchMumbles(
    props.creator,
    undefined,
    listState.mumbles.length > 0 ? listState.mumbles[listState.mumbles.length - 1].id : undefined
  );

  const loadMore = async (): Promise<void> => {
    dispatchList({ type: 'fetch_mumbles' });
    try {
      moreMumbles && dispatchList({ type: 'fetch_mumbles_success', payload: moreMumbles.mumbles });
    } catch (error) {
      dispatchList({ type: 'fetch_mumbles_error', payload: error as string });
      throw new Error(`Error: ${error}`);
    }
  };

  const handleWriteCardFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    //todo validate textinput
    dispatchWrite({ type: 'form_change', payload: e.target.value });
  };

  const handleFileChange = (file: File): boolean => {
    dispatchWrite({ type: 'file_change_reset' });

    const validationResult = validateFileinput(file);
    validationResult.valid
      ? dispatchWrite({ type: 'file_change_valid', payload: file })
      : dispatchWrite({ type: 'file_change_invalid', payload: validationResult.message });

    return validationResult.valid;
  };

  const resetFileinputError = (): void => {
    dispatchWrite({ type: 'file_inputerror_reset' });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const isReply = false;
    dispatchWrite({ type: 'submit_form' });
    //todo: postMumble über next page/api aufrufen
    try {
      let newMumble: Mumble;
      props.replyToPostId
        ? (newMumble = await postReply({
            accessToken: props.accessToken as string,
            mumbleId: props.replyToPostId,
            text: writeState.form.textinput,
            file: writeState.form.file,
          }))
        : (newMumble = await postMumble({
            accessToken: props.accessToken as string,
            text: writeState.form.textinput,
            file: writeState.form.file,
          }));
      dispatchList({ type: 'add_new_post_to_list', payload: newMumble });
      dispatchWrite({ type: 'submit_form_success' });
    } catch (error) {
      dispatchWrite({ type: 'submit_form_error', payload: `Ein Fehler ist aufgetreten: ${error}` });
    }
  };

  if (!props.mumbles) {
    return <Paragraph size={ParagraphSize.l}>Uups. Wir finden keine Mumbles für dich.</Paragraph>;
  }

  return (
    <>
      {props.isWriteCardVisible && (
        <WriteCard
          form={writeState.form}
          handleChange={handleWriteCardFormChange}
          handleFileChange={handleFileChange}
          resetFileinputError={resetFileinputError}
          fileinputError={writeState.fileinputError}
          handleSubmit={handleSubmit}
          isSubmitting={writeState.formIsSubmitting}
          variant={WriteCardVariant.main}
        />
      )}
      {listState.mumbles.map((mumble) => (
        <MumbleCard
          key={mumble.id}
          variant={props.variant}
          mumble={mumble}
          onLikeClick={onLikeClick}
          isLikeActionVisible={props.isLikeActionVisible}
          isReplyActionVisible={props.isReplyActionVisible}
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
