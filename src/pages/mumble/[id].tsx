import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import MainLayout from '../../components/layouts/main-layout';
import { MumbleCard, MumbleCardVariant } from '../../components/cards/mumble-card';
import { WriteCard, WriteCardVariant } from '../../components/cards/write-card';
import { Stack, StackDirection, StackSpacing } from '@smartive-education/design-system-component-library-team-ost';
import { fetchMumbleById, fetchRepliesByMumbleId, postReply } from '../../services/qwacker-api/posts';
import { Mumble } from '../../types/mumble';
import { getToken } from 'next-auth/jwt';
import { ChangeEvent, FormEvent, useEffect, useReducer } from 'react';
import { validateFileinput } from '../../helpers/validate-fileinput';
import { useSession } from 'next-auth/react';
import Head from 'next/head';

type MumblePageProps = {
  mumble: Mumble;
  replies: Mumble[];
};

type MumblePageState = {
  mumble: Mumble;
  replies: Mumble[];
  fileinputError: string;
  replyinputError: string;
  reply: {
    file: File | null;
    textinput: string;
    textinputError: string;
  };
  replyIsSubmitting: boolean;
};

type MumblePageAction =
  | { type: 'reinitialize'; payload: { mumble: Mumble; replies: Mumble[] } }
  | { type: 'file_change_valid'; payload: File }
  | { type: 'file_change_invalid'; payload: string }
  | { type: 'file_change_reset' }
  | { type: 'file_inputerror_reset' }
  | { type: 'reply_change'; payload: string }
  | { type: 'submit_reply' }
  | { type: 'submit_reply_success'; payload: Mumble }
  | { type: 'submit_reply_error'; payload: string };

const mumblePageReducer = (state: MumblePageState, action: MumblePageAction): MumblePageState => {
  switch (action.type) {
    case 'reinitialize': {
      return {
        mumble: action.payload.mumble,
        replies: action.payload.replies,
        fileinputError: '',
        replyinputError: '',
        reply: {
          file: null,
          textinput: '',
          textinputError: '',
        },
        replyIsSubmitting: false,
      };
    }
    case 'file_change_valid':
      return {
        ...state,
        reply: {
          ...state.reply,
          file: action.payload,
        },
      };
    case 'file_change_invalid':
      return {
        ...state,
        reply: {
          ...state.reply,
          file: null,
        },
        fileinputError: action.payload,
      };
    case 'file_change_reset':
      return {
        ...state,
        reply: {
          ...state.reply,
          file: null,
        },
        fileinputError: '',
      };
    case 'file_inputerror_reset':
      return {
        ...state,
        fileinputError: '',
      };
    case 'reply_change':
      return {
        ...state,
        reply: {
          ...state.reply,
          textinput: action.payload,
        },
      };
    case 'submit_reply':
      return {
        ...state,
        replyIsSubmitting: true,
      };
    case 'submit_reply_success':
      return {
        ...state,
        replies: [action.payload, ...state.replies],
        replyIsSubmitting: false,
        reply: {
          file: null,
          textinput: '',
          textinputError: '',
        },
      };
    case 'submit_reply_error':
      return {
        ...state,
      };
    default:
      throw new Error(`Unknown action type`);
  }
};

//Todo: Reset reducer on navigation to a detailpage of a 'submumble'/reply
export default function MumblePage(props: MumblePageProps): InferGetServerSidePropsType<typeof getServerSideProps> {
  const initialState: MumblePageState = {
    mumble: props.mumble,
    replies: props.replies,
    fileinputError: '',
    replyinputError: '',
    reply: {
      file: null,
      textinput: '',
      textinputError: '',
    },
    replyIsSubmitting: false,
  };
  const [state, dispatch] = useReducer(mumblePageReducer, initialState);

  //todo: Evtl. durch Page-Transitions lösen mit key=router.path
  useEffect(() => {
    dispatch({ type: 'reinitialize', payload: props });
  }, [props]);

  const { data: session } = useSession();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    //todo validate textinput
    dispatch({ type: 'reply_change', payload: e.target.value });
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
    dispatch({ type: 'submit_reply' });
    //todo: postMumble über next page/api aufrufen
    try {
      const newReply = await postReply(
        state.mumble.id,
        state.reply.textinput,
        state.reply.file,
        session?.accessToken as string
      );
      dispatch({ type: 'submit_reply_success', payload: newReply });
    } catch (error) {
      dispatch({ type: 'submit_reply_error', payload: `Ein Fehler ist aufgetreten: ${error}` });
    }
  };

  const onLikeClick = async (mumble: Mumble) => {
    // useSWR Hook?
    // optimistic update
    // errorhandling?
    const res = await fetch(`/api/posts/${mumble.id}/like`, { method: mumble.likedByUser ? 'DELETE' : 'PUT' });
  };

  return (
    <MainLayout>
      <>
        <Head>
          <title>Mumble - {props.mumble.id}</title>
        </Head>
        <div className="bg-white">
          <MumbleCard variant={MumbleCardVariant.detailpage} mumble={props.mumble} onLikeClick={onLikeClick} />
          {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
          <WriteCard
            form={state.reply}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
            resetFileinputError={resetFileinputError}
            fileinputError={state.fileinputError}
            handleSubmit={handleSubmit}
            isSubmitting={state.replyIsSubmitting}
            variant={WriteCardVariant.main}
          />
          <Stack direction={StackDirection.col} spacing={StackSpacing.s} withDivider={true}>
            {state.replies.map((response) => (
              <MumbleCard
                key={response.id}
                variant={MumbleCardVariant.response}
                mumble={response}
                onLikeClick={onLikeClick}
              />
            ))}
          </Stack>
        </div>
      </>
    </MainLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, query: { id } }) => {
  const decodedToken = await getToken({ req });

  if (!decodedToken || !decodedToken.accessToken) {
    throw new Error('No decodedToken found');
  }
  if (!id) {
    throw new Error('No id found');
  }

  const [mumble, replies] = await Promise.all([
    fetchMumbleById(id as string, decodedToken.accessToken),
    fetchRepliesByMumbleId(id as string, decodedToken.accessToken),
  ]);

  return {
    props: {
      mumble,
      replies,
    },
  };
};
