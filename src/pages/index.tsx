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
import { getToken } from 'next-auth/jwt';
import { useSession } from 'next-auth/react';
import { ChangeEvent, FormEvent, useReducer } from 'react';
import { validateFileinput } from '../helpers/validate-fileinput';

type PageProps = {
  count: number;
  mumbles: Mumble[];
};

type FeedPageState = {
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

type FeedPageAction =
  | { type: 'fetch_mumbles' }
  | { type: 'fetch_mumbles_error'; payload: string }
  | { type: 'fetch_mumbles_success'; payload: Mumble[] }
  | { type: 'file_change_valid'; payload: File }
  | { type: 'file_change_invalid'; payload: string }
  | { type: 'file_change_reset' }
  | { type: 'form_change'; payload: string }
  | { type: 'submit_form' }
  | { type: 'submit_form_success'; payload: Mumble }
  | { type: 'submit_form_error'; payload: string };

const profilPageReducer = (state: FeedPageState, action: FeedPageAction): FeedPageState => {
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

export default function PageHome({
  count: initialCount,
  mumbles: initialMumbles,
}: PageProps): InferGetStaticPropsType<typeof getServerSideProps> {
  const initialState: FeedPageState = {
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
  const [state, dispatch] = useReducer(profilPageReducer, initialState);

  //todo: pass session from server with getServerSession (is used to show the writecard)
  const { data: session } = useSession();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    //todo validate textinput
    dispatch({ type: 'form_change', payload: e.target.value });
  };

  const handleFileChange = (file: File) => {
    dispatch({ type: 'file_change_reset' });

    const validationResult = validateFileinput(file);
    validationResult.valid
      ? dispatch({ type: 'file_change_valid', payload: file })
      : dispatch({ type: 'file_change_invalid', payload: validationResult.message });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({ type: 'submit_form' });
    //todo: postMumble über next page/api aufrufen
    try {
      const newMumble = await postMumble(state.form.textinput, state.form.file, session?.accessToken as string);
      dispatch({ type: 'submit_form_success', payload: newMumble });
    } catch (error) {
      dispatch({ type: 'submit_form_error', payload: `Ein Fehler ist aufgetreten: ${error}` });
    }
  };

  const loadMore = async () => {
    dispatch({ type: 'fetch_mumbles' });
    try {
      const { count, mumbles: newMumbles } = await fetchMumbles({
        limit: 10,
        offset: state.mumbles.length,
        token: session?.accessToken,
      });
      dispatch({ type: 'fetch_mumbles_success', payload: newMumbles });
    } catch (error) {
      dispatch({ type: 'fetch_mumbles_error', payload: error as string });
      throw new Error(`Unable to load more Mumbles ${error}`);
    }
  };

  return (
    <MainLayout>
      <>
        <Head>
          <title>Mumble Home</title>
        </Head>
        <div className="text-violet-600 pt-l">
          <Heading headingLevel={HeadingSize.h1}>Willkommen auf Mumble</Heading>
        </div>
        <div className="text-slate-500 pt-xs pb-l">
          <Heading headingLevel={HeadingSize.h4}>
            Voluptatem qui cumque voluptatem quia tempora dolores distinctio vel repellat dicta.
          </Heading>
        </div>
        <Stack direction={StackDirection.col} spacing={StackSpacing.s} withDivider={true}>
          <>
            {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
            {/* STATE AKTUALISIEREN UND PROXY API CALL*/}
            {session && (
              <WriteCard
                form={state.form}
                handleChange={handleChange}
                handleFileChange={handleFileChange}
                fileinputError={state.fileinputError}
                handleSubmit={handleSubmit}
                isSubmitting={state.formIsSubmitting}
                variant={WriteCardVariant.main}
              />
            )}
            {state.mumbles.map((mumble) => (
              <MumbleCard key={mumble.id} variant={MumbleCardVariant.timeline} mumble={mumble} />
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

export const getServerSideProps: GetServerSideProps = async ({ req }: GetServerSidePropsContext) => {
  try {
    const token = await getToken({ req });

    // if (!token) {
    //   return {
    //     redirect: {
    //       destination: '/login',
    //       permanent: false,
    //     },
    //   };
    // }

    // eslint-disable-next-line prefer-const
    let { count, mumbles } = await fetchMumbles({ token: token?.accessToken as string });

    return {
      props: {
        count,
        mumbles,
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
