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
import { ChangeEvent, FC, FormEvent, useReducer } from 'react';
import { useFetchMumbles } from '../../hooks/api/qwacker-api';
import { Mumble } from '../../types/mumble';
import { MumbleCard, MumbleCardVariant } from '../cards/mumble-card';
import { ListState, listReducer } from '../../helpers/reducers/lists-reducer';
import { WriteCard, WriteCardVariant } from '../cards/write-card';
import { validateFileinput } from '../../helpers/validate-fileinput';
import { postMumble } from '../../services/qwacker-api/posts';
import { writeReducer, WriteState } from '../../helpers/reducers/write-reducer';
import { onLikeClick } from '../../helpers/like-mumble';

type MumbleListProps = {
  mumbles: Mumble[];
  count: number;
  variant: MumbleCardVariant;
  creator?: string;
  likesFilter?: boolean;
  accessToken?: string;
};

export const MumbleList: FC<MumbleListProps> = (props: MumbleListProps) => {
  const initialState: ListState = {
    hasMore: props.mumbles.length < props.count,
    loading: false,
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
    isLoading: mumbleLoading,
    error: mumbleError,
    data: moreMumbles,
  } = useFetchMumbles(
    props.creator,
    undefined,
    listState.mumbles.length > 0 ? listState.mumbles[listState.mumbles.length - 1].id : undefined
  );

  const loadMore = async () => {
    dispatchList({ type: 'fetch_mumbles' });
    try {
      moreMumbles && dispatchList({ type: 'fetch_mumbles_success', payload: moreMumbles.mumbles });
    } catch (error) {
      dispatchList({ type: 'fetch_mumbles_error', payload: error as string });
      throw new Error(`Error: ${error}`);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const resetFileinputError = () => {
    dispatchWrite({ type: 'file_inputerror_reset' });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatchWrite({ type: 'submit_form' });
    //todo: postMumble über next page/api aufrufen
    try {
      const newMumble = await postMumble(writeState.form.textinput, writeState.form.file, props.accessToken as string);
      dispatchWrite({ type: 'submit_form_success', payload: newMumble });
    } catch (error) {
      dispatchWrite({ type: 'submit_form_error', payload: `Ein Fehler ist aufgetreten: ${error}` });
    }
  };

  if (!props.mumbles) {
    return <p>Uups. Wir finden keine Mumbles für dich.</p>;
  }

  return (
    <>
      {props.accessToken && (
        <WriteCard
          form={writeState.form}
          handleChange={handleChange}
          handleFileChange={handleFileChange}
          resetFileinputError={resetFileinputError}
          fileinputError={writeState.fileinputError}
          handleSubmit={handleSubmit}
          isSubmitting={writeState.formIsSubmitting}
          variant={WriteCardVariant.main}
        />
      )}
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
