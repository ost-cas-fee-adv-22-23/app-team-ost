import { GetServerSideProps, GetServerSidePropsContext, InferGetStaticPropsType } from 'next';
import MainLayout from '../components/layouts/main-layout';
import {
  Heading,
  HeadingSize,
  Stack,
  StackDirection,
  StackSpacing,
} from '@smartive-education/design-system-component-library-team-ost';
import Head from 'next/head';
import { MumbleCardVariant } from '../components/cards/mumble-card';
import { Mumble } from '../types/mumble';
import { WriteCard, WriteCardVariant } from '../components/cards/write-card';
import { fetchMumbles, postMumble } from '../services/qwacker-api/posts';
import { getToken, JWT } from 'next-auth/jwt';
import { ChangeEvent, FormEvent, useReducer } from 'react';
import { validateFileinput } from '../helpers/validate-fileinput';
import { useFetchMumbles } from '../hooks/api/qwacker-api';
import { MumbleList } from '../components/lists/mumble-list';

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

export default function TimelinePage(props: TimelinePageProps): InferGetStaticPropsType<typeof getServerSideProps> {
  const initialState: TimelinePageState = {
    hasMore: props.mumbles.length < props.count,
    loading: false,
    mumbles: props.mumbles,
    mumblesCount: props.count,
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
      const newMumble = await postMumble(state.form.textinput, state.form.file, props.decodedToken?.accessToken as string);
      dispatch({ type: 'submit_form_success', payload: newMumble });
    } catch (error) {
      dispatch({ type: 'submit_form_error', payload: `Ein Fehler ist aufgetreten: ${error}` });
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
            {props.decodedToken && (
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
            <MumbleList mumbles={props.mumbles} count={props.count} variant={MumbleCardVariant.timeline} />
          </>
        </Stack>
      </>
    </MainLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }: GetServerSidePropsContext) => {
  try {
    const decodedToken = await getToken({ req });
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
