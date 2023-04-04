import { GetServerSideProps, GetServerSidePropsContext, InferGetStaticPropsType } from 'next';
import MainLayout from '../components/layouts/main-layout';
import {
  Heading,
  HeadingSize,
  IconMumble,
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
import Head from 'next/head';
import { MumbleCard, MumbleCardVariant } from '../components/cards/mumble-card';
import { Mumble } from '../types/mumble';
import { WriteCard, WriteCardVariant } from '../components/cards/write-card';
import { fetchMumbles, postMumble } from '../services/qwacker-api/posts';
import { getToken, JWT } from 'next-auth/jwt';
import { ChangeEvent, FormEvent, useReducer } from 'react';
import { validateFileinput } from '../helpers/validate-fileinput';
import { useFetchMumbles } from '../hooks/api/qwacker-api';

type TimelinePageProps = {
  count: number;
  mumbles: Mumble[];
  decodedToken: JWT | null;
};

type TimelinePageState = {
  hasMore: boolean;
  loading: boolean;
  mumblesCount: number;
  mumbles: Mumble[];
  fileinputError: string;
  forminputError: string;
  form: {
    file: File | null;
    textinput: string;
    textinputError: string;
  };
  formIsSubmitting: boolean;
};

type TimelinePageAction =
  | { type: 'fetch_mumbles' }
  | { type: 'fetch_mumbles_error'; payload: string }
  | { type: 'fetch_mumbles_success'; payload: Mumble[] }
  | { type: 'file_change_valid'; payload: File }
  | { type: 'file_change_invalid'; payload: string }
  | { type: 'file_change_reset' }
  | { type: 'file_inputerror_reset' }
  | { type: 'form_change'; payload: string }
  | { type: 'submit_form' }
  | { type: 'submit_form_success'; payload: Mumble }
  | { type: 'submit_form_error'; payload: string };

// todo: sollen die reducer ausgelagert werden?
const timelinePageReducer = (state: TimelinePageState, action: TimelinePageAction): TimelinePageState => {
  switch (action.type) {
    case 'fetch_mumbles':
      return { ...state, loading: true };
    case 'fetch_mumbles_error':
      return {
        ...state,
        forminputError: action.payload,
        loading: false,
      };
    case 'fetch_mumbles_success':
      return {
        ...state,
        hasMore: state.mumbles.length + action.payload.length < state.mumblesCount,
        loading: false,
        mumbles: [...state.mumbles, ...action.payload],
      };
    case 'file_change_valid':
      return {
        ...state,
        form: {
          ...state.form,
          file: action.payload,
        },
      };
    case 'file_change_invalid':
      return {
        ...state,
        form: {
          ...state.form,
          file: null,
        },
        fileinputError: action.payload,
      };
    case 'file_change_reset':
      return {
        ...state,
        form: {
          ...state.form,
          file: null,
        },
        fileinputError: '',
      };
    case 'file_inputerror_reset':
      return {
        ...state,
        fileinputError: '',
      };
    case 'form_change':
      return {
        ...state,
        form: {
          ...state.form,
          textinput: action.payload,
        },
      };
    case 'submit_form':
      return {
        ...state,
        formIsSubmitting: true,
      };
    case 'submit_form_success':
      return {
        ...state,
        mumbles: [action.payload, ...state.mumbles],
        formIsSubmitting: false,
        form: {
          file: null,
          textinput: '',
          textinputError: '',
        },
      };
    case 'submit_form_error':
      return {
        ...state,
      };
    default:
      throw new Error(`Unknown action type`);
  }
};

export default function TimelinePage({
  count: initialCount,
  mumbles: initialMumbles,
  decodedToken,
}: TimelinePageProps): InferGetStaticPropsType<typeof getServerSideProps> {
  const initialState: TimelinePageState = {
    hasMore: initialMumbles.length < initialCount,
    loading: false,
    mumbles: initialMumbles,
    mumblesCount: initialCount,
    fileinputError: '',
    forminputError: '',
    form: {
      file: null,
      textinput: '',
      textinputError: '',
    },
    formIsSubmitting: false,
  };
  const [state, dispatch] = useReducer(timelinePageReducer, initialState);

  const {
    isLoading: mumbleLoading,
    error: mumbleError,
    data: moreMumbles,
  } = useFetchMumbles(undefined, undefined, state.mumbles[state.mumbles.length - 1].id);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    //todo validate textinput
    dispatch({ type: 'form_change', payload: e.target.value });
  };

  const handleFileChange = (file: File): boolean => {
    dispatch({ type: 'file_change_reset' });

    const validationResult = validateFileinput(file);
    validationResult.valid
      ? dispatch({ type: 'file_change_valid', payload: file })
      : dispatch({ type: 'file_change_invalid', payload: validationResult.message });

    return validationResult.valid;
  };

  const resetFileinputError = () => {
    dispatch({ type: 'file_inputerror_reset' });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({ type: 'submit_form' });
    //todo: postMumble über next page/api aufrufen
    try {
      const newMumble = await postMumble(state.form.textinput, state.form.file, decodedToken?.accessToken as string);
      dispatch({ type: 'submit_form_success', payload: newMumble });
    } catch (error) {
      dispatch({ type: 'submit_form_error', payload: `Ein Fehler ist aufgetreten: ${error}` });
    }
  };

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
    dispatch({ type: 'fetch_mumbles' });
    try {
      moreMumbles && dispatch({ type: 'fetch_mumbles_success', payload: moreMumbles.mumbles });
    } catch (error) {
      dispatch({ type: 'fetch_mumbles_error', payload: error as string });
      throw new Error(`Error: ${error}`);
    }
  };

  return (
    <MainLayout>
      <>
        <Head>
          <title>Mumble - Timeline</title>
        </Head>
        <div className="text-violet-600">
          <Heading headingLevel={HeadingSize.h1}>Willkommen auf Mumble</Heading>
        </div>
        <div className="text-slate-500 pt-xs pb-l">
          <Heading headingLevel={HeadingSize.h4}>
            Voluptatem qui cumque voluptatem quia tempora dolores distinctio vel repellat dicta.
          </Heading>
        </div>
        <Stack direction={StackDirection.col} spacing={StackSpacing.s} withDivider={true}>
          <>
            {/* TODO PROXY API CALL*/}
            {decodedToken && (
              <WriteCard
                form={state.form}
                handleChange={handleChange}
                handleFileChange={handleFileChange}
                resetFileinputError={resetFileinputError}
                fileinputError={state.fileinputError}
                handleSubmit={handleSubmit}
                isSubmitting={state.formIsSubmitting}
                variant={WriteCardVariant.main}
              />
            )}
            {state.mumbles.map((mumble) => (
              <MumbleCard key={mumble.id} variant={MumbleCardVariant.timeline} mumble={mumble} onLikeClick={onLikeClick} />
            ))}
            {state.hasMore && (
              <Stack
                alignItems={StackAlignItems.center}
                justifyContent={StackJustifyContent.center}
                spacing={StackSpacing.xl}
              >
                <TextButton
                  ariaLabel="Start mumble"
                  color={TextButtonColor.gradient}
                  displayMode={TextButtonDisplayMode.inline}
                  icon={<IconMumble />}
                  onClick={() => loadMore()}
                  size={TextButtonSize.l}
                >
                  {state.loading ? '...' : 'Weitere Mumbles laden'}
                </TextButton>
              </Stack>
            )}
          </>
        </Stack>
      </>
    </MainLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }: GetServerSidePropsContext) => {
  try {
    const decodedToken = await getToken({ req });
    if (!decodedToken || !decodedToken.accessToken) {
      throw new Error('No decodedToken found');
    }
    const { count, mumbles } = await fetchMumbles({ token: decodedToken?.accessToken as string });

    return {
      props: {
        count,
        mumbles,
        decodedToken,
      },
    };
  } catch (error) {
    let message;
    if (error instanceof Error) {
      message = error.message;
    } else {
      message = String(error);
    }

    return { props: { error: message, mumbles: [], count: 0 } };
  }
};
