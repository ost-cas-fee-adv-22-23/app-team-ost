import { MumbleCard, MumbleCardVariant } from '@/components/cards/mumble-card';
import { WriteCard, WriteCardVariant } from '@/components/cards/write-card';
import { onLikeClick } from '@/helpers/like-mumble';
import { listReducer, ListState } from '@/helpers/reducers/list-reducer';
import { writeReducer, WriteState } from '@/helpers/reducers/write-reducer';
import { validateFileinput } from '@/helpers/validate-fileinput';
import { useFetchMumbles } from '@/hooks/api/use-fetch-mumbles';
import { useFetchMumblesRefresh } from '@/hooks/api/use-fetch-mumbles-refresh';
import { postMumble, postReply } from '@/services/qwacker-api/posts';
import { Mumble } from '@/types/mumble';
import {
  IconArrowUp,
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
import { JWT } from 'next-auth/jwt';
import { ChangeEvent, FC, FormEvent, useEffect, useReducer } from 'react';

type MumbleListProps = {
  count: number;
  mumbles: Mumble[];
  mumbleCardVariant: MumbleCardVariant;
  canUpdate?: boolean;
  creatorUserId?: string;
  isLikeActionVisible?: boolean;
  isReplyActionVisible?: boolean;
  isWriteCardVisible?: boolean;
  jwtPayload?: JWT | null;
  listStackWithDivider?: boolean;
  listStackWithSpacing?: boolean;
  replyToMumbleId?: string;
  writeCardVariant?: WriteCardVariant;
};

export const MumbleList: FC<MumbleListProps> = (props: MumbleListProps) => {
  const initialListState: ListState = {
    hasMore: props.mumbles.length < props.count,
    hasUpdate: false,
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

  const [listState, dispatchList] = useReducer(listReducer, initialListState);
  const [writeState, dispatchWrite] = useReducer(writeReducer, initialWriteState);

  const { data: moreMumbles } = useFetchMumbles(
    props.creatorUserId,
    undefined,
    listState.mumbles.length > 0 ? listState.mumbles[listState.mumbles.length - 1].id : undefined
  );

  const { data: newMumbles } = useFetchMumblesRefresh(
    props.creatorUserId,
    listState.mumbles.length > 0 ? listState.mumbles[0].id : undefined,
    undefined
  );

  useEffect(() => {
    newMumbles && newMumbles?.mumbles.length > 0 && dispatchList({ type: 'new_mumbles_available' });
  }, [newMumbles]);

  const handleLoadNewMumbles = (): void => {
    newMumbles && dispatchList({ type: 'new_mumbles_add_to_list', payload: newMumbles.mumbles });
    window.scrollTo({
      top: 180,
      behavior: 'smooth',
    });
  };

  const loadMore = (): void => {
    dispatchList({ type: 'fetch_mumbles' });
    try {
      moreMumbles && dispatchList({ type: 'fetch_mumbles_success', payload: moreMumbles.mumbles });
    } catch (error) {
      dispatchList({ type: 'fetch_mumbles_error', payload: error as string });
      throw new Error(`Error: ${error}`);
    }
  };

  const handleWriteCardFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
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
    dispatchWrite({ type: 'submit_form' });
    // todo: postMumble/replyMumble über next page/api aufrufen, gem. Architektur.
    // Dazu muss der Next-API Handler mit next-connect erweitert
    // und multer (oder ähnliches) verwendet werden, um das Filehandling
    // mit multipart/formdata zu unterstützen.
    // Das wurde aus zeitlichen Gründen nicht mehr umgesetzt.
    try {
      let newMumble: Mumble;
      props.replyToMumbleId
        ? (newMumble = await postReply({
            accessToken: props.jwtPayload?.accessToken as string,
            mumbleId: props.replyToMumbleId,
            text: writeState.form.textinput,
            file: writeState.form.file,
          }))
        : (newMumble = await postMumble({
            accessToken: props.jwtPayload?.accessToken as string,
            text: writeState.form.textinput,
            file: writeState.form.file,
          }));
      dispatchList({ type: 'add_new_post_to_list', payload: newMumble });
      dispatchWrite({ type: 'submit_form_success' });
    } catch (error) {
      dispatchWrite({ type: 'submit_form_error', payload: `Ein Fehler ist aufgetreten: ${error}` });
    }
  };

  if (!props.mumbles || (props.mumbles.length <= 0 && props.creatorUserId)) {
    return <Paragraph size={ParagraphSize.l}>Uups. Wir finden keine Mumbles für dich.</Paragraph>;
  }

  return (
    <>
      {listState.hasUpdate && props.canUpdate && (
        <div className="fixed z-60 top-32 left-1/2 -translate-x-1/2 drop-shadow-lg">
          <TextButton
            ariaLabel="Neue Mumbles sind verfügbar. Jetzt laden."
            color={TextButtonColor.gradient}
            displayMode={TextButtonDisplayMode.inline}
            icon={<IconArrowUp />}
            onClick={() => handleLoadNewMumbles()}
            size={TextButtonSize.l}
          >
            Neue Mumbles sind verfügbar. Jetzt laden.
          </TextButton>
        </div>
      )}
      {props.isWriteCardVisible && props.jwtPayload && (
        <WriteCard
          fileinputError={writeState.fileinputError}
          form={writeState.form}
          handleChange={handleWriteCardFormChange}
          handleFileChange={handleFileChange}
          handleSubmit={handleSubmit}
          isSubmitting={writeState.formIsSubmitting}
          jwtPayload={props.jwtPayload}
          resetFileinputError={resetFileinputError}
          variant={props.writeCardVariant ? props.writeCardVariant : WriteCardVariant.newMumble}
        />
      )}
      <Stack
        direction={StackDirection.col}
        spacing={props.listStackWithSpacing ? StackSpacing.s : StackSpacing.none}
        withDivider={props.listStackWithDivider ? props.listStackWithDivider : false}
      >
        {listState.mumbles.map((mumble) => (
          <MumbleCard
            key={mumble.id}
            variant={props.mumbleCardVariant}
            mumble={mumble}
            onLikeClick={onLikeClick}
            isLikeActionVisible={props.isLikeActionVisible}
            isReplyActionVisible={props.isReplyActionVisible}
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
