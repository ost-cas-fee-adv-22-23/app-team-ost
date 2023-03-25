import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import MainLayout from '../../components/layouts/main-layout';
import { MumbleCard, MumbleCardVariant } from '../../components/cards/mumble-card';
import { WriteCard, WriteCardVariant } from '../../components/cards/write-card';
import { Stack, StackDirection, StackSpacing } from '@smartive-education/design-system-component-library-team-ost';
import { fetchMumbleById, fetchRepliesByMumbleId, postMumble, postReply } from '../../services/qwacker-api/posts';
import { Mumble } from '../../types/mumble';
import { getToken } from 'next-auth/jwt';
import { ChangeEvent, FormEvent, useReducer } from 'react';
import { validateFileinput } from '../../helpers/validate-fileinput';
import { useSession } from 'next-auth/react';

type MumblePageProps = {
  mumble: Mumble;
  replies: Mumble[];
};

type FeedPageState = {
  mumble: Mumble;
  replies: Mumble[];
  fileInputError: string;
  replyInputError: string;
  reply: {
    file: File | null;
    textinput: string;
    textinputError: string;
  };
  replyIsSubmitting: boolean;
};

type FeedPageAction =
  | { type: 'file_change_valid'; payload: File }
  | { type: 'file_change_invalid'; payload: string }
  | { type: 'file_change_reset' }
  | { type: 'reply_change'; payload: string }
  | { type: 'submit_reply' }
  | { type: 'submit_reply_success'; payload: Mumble }
  | { type: 'submit_reply_error'; payload: string };

const profilPageReducer = (state: FeedPageState, action: FeedPageAction): FeedPageState => {
  switch (action.type) {
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
        fileInputError: action.payload,
      };
    case 'file_change_reset':
      return {
        ...state,
        reply: {
          ...state.reply,
          file: null,
        },
        fileInputError: '',
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

export default function MumblePage(props: MumblePageProps): InferGetServerSidePropsType<typeof getServerSideProps> {
  const initialState: FeedPageState = {
    mumble: props.mumble,
    replies: props.replies,
    fileInputError: '',
    replyInputError: '',
    reply: {
      file: null,
      textinput: '',
      textinputError: '',
    },
    replyIsSubmitting: false,
  };
  const [state, dispatch] = useReducer(profilPageReducer, initialState);
  const { data: session } = useSession();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    //todo validate textinput
    dispatch({ type: 'reply_change', payload: e.target.value });
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

  return (
    <MainLayout>
      <div className="bg-white">
        <MumbleCard variant={MumbleCardVariant.detailpage} mumble={props.mumble} />
        {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
        <WriteCard
          form={state.reply}
          handleChange={handleChange}
          handleFileChange={handleFileChange}
          fileInputError={state.fileInputError}
          handleSubmit={handleSubmit}
          isSubmitting={state.replyIsSubmitting}
          variant={WriteCardVariant.main}
        />
        <Stack direction={StackDirection.col} spacing={StackSpacing.s} withDivider={true}>
          {state.replies.map((response) => (
            <MumbleCard key={response.id} variant={MumbleCardVariant.response} mumble={response} />
          ))}
        </Stack>
      </div>
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
