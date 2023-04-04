import {
  IconCheckmark,
  IconMumble,
  Label,
  LabelSize,
  Paragraph,
  ParagraphSize,
  ProfileBanner,
  ProfilePicture,
  ProfilePictureSize,
  Stack,
  StackAlignItems,
  StackDirection,
  StackJustifyContent,
  StackSpacing,
  TabNav,
  TextButton,
  TextButtonColor,
  TextButtonDisplayMode,
  TextButtonSize,
  UserShortRepresentation,
  UserShortRepresentationLabelType,
} from '@smartive-education/design-system-component-library-team-ost';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getToken } from 'next-auth/jwt';
import { useSession } from 'next-auth/react';
import { useEffect, useReducer } from 'react';
import { MumbleCard, MumbleCardVariant } from '../../components/cards/mumble-card';
import MainLayout from '../../components/layouts/main-layout';
import { fetchMumbles, fetchMumblesSearch } from '../../services/qwacker-api/posts';
import { fetchUserById } from '../../services/qwacker-api/users';
import { Mumble } from '../../types/mumble';
import { User } from '../../types/user';
import Link from 'next/link';
import Image from 'next/image';
import { useFetchMumbles, useSearchMumbles } from '../../hooks/api/qwacker-api';
import Head from 'next/head';

type ProfilePageProps = {
  likedMumbles: Mumble[];
  likedCount: number;
  count: number;
  mumbles: Mumble[];
  user: User;
};

type ProfilePageState = {
  errorMessage: string;
  likedMumbles: Mumble[];
  likedCount: number;
  likedhasMore: boolean;
  loading: boolean;
  mumblesCount: number;
  mumblesHasMore: boolean;
  mumbles: Mumble[];
  postType: 'mumbles' | 'likedMumbles';
};

type ProfilePageAction =
  | {
      type: 'reinitialize';
      payload: { likedMumbles: Mumble[]; likedCount: number; count: number; mumbles: Mumble[]; user: User };
    }
  | { type: 'fetch_mumbles' }
  | { type: 'fetch_mumbles_success'; payload: Mumble[] }
  | { type: 'fetch_likes_success'; payload: Mumble[] }
  | { type: 'fetch_mumbles_error'; payload: string }
  | { type: 'switch_post_type' };

const profilePageReducer = (state: ProfilePageState, action: ProfilePageAction): ProfilePageState => {
  switch (action.type) {
    case 'reinitialize': {
      return {
        errorMessage: '',
        likedMumbles: action.payload.likedMumbles,
        likedCount: action.payload.likedCount,
        likedhasMore: action.payload.likedMumbles.length < action.payload.likedCount,
        loading: false,
        mumbles: action.payload.mumbles,
        mumblesCount: action.payload.count,
        mumblesHasMore: action.payload.mumbles.length < action.payload.count,
        postType: 'mumbles',
      };
    }
    case 'fetch_mumbles':
      return { ...state, loading: true };
    case 'fetch_mumbles_success':
      return {
        ...state,
        mumblesHasMore: state.mumbles.length + action.payload.length < state.mumblesCount,
        loading: false,
        mumbles: [...state.mumbles, ...action.payload],
      };
    case 'fetch_mumbles_error':
      return {
        ...state,
        errorMessage: action.payload,
        loading: false,
      };
    case 'fetch_likes_success':
      return {
        ...state,
        likedhasMore: state.likedMumbles.length + action.payload.length < state.likedCount,
        loading: false,
        likedMumbles: [...state.likedMumbles, ...action.payload],
      };
    case 'switch_post_type':
      return {
        ...state,
        postType: state.postType === 'mumbles' ? 'likedMumbles' : 'mumbles',
      };
    default:
      throw new Error(`Unknown action type`);
  }
};

export default function ProfilePage(props: ProfilePageProps): InferGetServerSidePropsType<typeof getServerSideProps> {
  const initialState: ProfilePageState = {
    errorMessage: '',
    likedMumbles: props.likedMumbles,
    likedCount: props.likedCount,
    likedhasMore: props.likedMumbles.length < props.likedCount,
    loading: false,
    mumbles: props.mumbles,
    mumblesCount: props.count,
    mumblesHasMore: props.mumbles.length < props.count,
    postType: 'mumbles',
  };
  const [state, dispatch] = useReducer(profilePageReducer, initialState);

  const {
    isLoading: mumbleLoading,
    error: mumbleError,
    data: moreMumbles,
  } = useFetchMumbles(props.user.id, undefined, state.mumbles[state.mumbles.length - 1].id);

  const {
    isLoading: likedLoading,
    error: likedError,
    data: moreLikedMumbles,
  } = useSearchMumbles(undefined, state.likedMumbles.length.toString(), undefined, undefined, props.user.id);

  //todo: Evtl. durch Page-Transitions lösen mit key=router.path
  useEffect(() => {
    dispatch({ type: 'reinitialize', payload: props });
  }, [props]);

  const { data: session } = useSession();
  const isCurrentUser = props.user.id === session?.user.id;

  const onLikeClick = async (mumble: Mumble) => {
    // useSWR Hook?
    // optimistic update
    // errorhandling?
    const res = await fetch(`/api/posts/${mumble.id}/like`, { method: mumble.likedByUser ? 'DELETE' : 'PUT' });
  };

  const loadMore = async () => {
    dispatch({ type: 'fetch_mumbles' });
    try {
      if (state.postType === 'mumbles') {
        moreMumbles && dispatch({ type: 'fetch_mumbles_success', payload: moreMumbles.mumbles });
      }
      if (state.postType === 'likedMumbles') {
        moreLikedMumbles && dispatch({ type: 'fetch_likes_success', payload: moreLikedMumbles.mumbles });
      }
    } catch (error) {
      dispatch({ type: 'fetch_mumbles_error', payload: error as string });
      throw new Error(`Error: ${error}`);
    }
  };

  const mumblesToRender: Record<string, Mumble[]> = {
    likedMumbles: state.likedMumbles,
    mumbles: state.mumbles,
  };

  return (
    <MainLayout>
      <>
        <Head>
          <title>Mumble - {props.user.displayName}</title>
        </Head>
        <Stack direction={StackDirection.col} spacing={StackSpacing.s}>
          <div className="relative">
            <div className="hidden md:block">
              <ProfileBanner
                alt={props.user.userName}
                canEdit={isCurrentUser}
                imageComponent={Image}
                fill
                priority
                sizes="(max-width: 768px) 0vw, (max-width: 1536px) 50vw, 30vw"
                onEditClick={() => console.log('click')}
                src="https://newinzurich.com/wp-content/uploads/2013/09/55769975_2481568891894108_3190627635357024256_o-compressed.jpg"
              />
            </div>
            <div className="flex justify-center md:absolute md:-bottom-20 md:right-8">
              <ProfilePicture
                alt={props.user.userName}
                canEdit={isCurrentUser}
                imageComponent={Image}
                width={200}
                height={200}
                onEditClick={() => console.log('click')}
                size={ProfilePictureSize.xl}
                src={props.user.avatarUrl}
              />
            </div>
          </div>
          <div className="text-slate-900>">
            <UserShortRepresentation
              displayName={props.user.displayName}
              hrefProfile={props.user.profileUrl}
              joined="Mitglied seit 4 Wochen"
              labelType={UserShortRepresentationLabelType.h3}
              linkComponent={Link}
              location="St. Gallen"
              onSettingsClick={() => console.log('click')}
              showSettings={isCurrentUser}
              username={props.user.userName}
            />
          </div>
          <div className="text-slate-400">
            <Paragraph size={ParagraphSize.m}>{props.user.bio || 'Dies ist meine Bio'}</Paragraph>
          </div>
          {isCurrentUser ? (
            <div className="w-fit my-m">
              <TabNav
                onTabChange={() => dispatch({ type: 'switch_post_type' })}
                tabNames={['Deine Mumbles', 'Deine Likes']}
              />
            </div>
          ) : (
            <div className="w-full my-m text-slate-400">
              <Stack
                alignItems={StackAlignItems.center}
                direction={StackDirection.row}
                spacing={StackSpacing.s}
                justifyContent={StackJustifyContent.flexend}
              >
                <Label size={LabelSize.m}>Folge {props.user.displayName}</Label>
                <TextButton
                  ariaLabel="Folgen"
                  color={TextButtonColor.slate}
                  displayMode={TextButtonDisplayMode.inline}
                  icon={<IconCheckmark />}
                  onClick={() => console.log('Click')}
                  size={TextButtonSize.m}
                >
                  Folgen
                </TextButton>
              </Stack>
            </div>
          )}
          {mumblesToRender[state.postType].length > 0 ? (
            mumblesToRender[state.postType].map((mumble) => (
              <MumbleCard key={mumble.id} variant={MumbleCardVariant.timeline} mumble={mumble} onLikeClick={onLikeClick} />
            ))
          ) : (
            <Label size={LabelSize.l}>Ziemlich leer hier</Label>
          )}
          {((state.mumblesHasMore && state.postType === 'mumbles') ||
            (state.likedhasMore && state.postType === 'likedMumbles')) && (
            <Stack alignItems={StackAlignItems.center} justifyContent={StackJustifyContent.center} spacing={StackSpacing.xl}>
              <TextButton
                ariaLabel="Load more mumbles"
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
        </Stack>
      </>
    </MainLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, query: { id } }) => {
  try {
    const decodedToken = await getToken({ req });
    if (!decodedToken || !decodedToken.accessToken) {
      throw new Error('No decodedToken found');
    }
    if (!id) {
      throw new Error('No id found');
    }

    const user = await fetchUserById({ id: id as string, accessToken: decodedToken.accessToken });
    const { count, mumbles } = await fetchMumbles({ creator: id as string, token: decodedToken.accessToken });

    const { count: likedCount, mumbles: likedMumbles } = await fetchMumblesSearch({
      accessToken: decodedToken.accessToken,
      userid: id as string,
    });

    if (mumbles.length === 0 && likedMumbles.length === 0) {
      return {
        redirect: {
          destination: `/newuser/${id}`,
          permanent: false,
        },
      };
    }

    return {
      props: {
        user,
        count,
        mumbles,
        likedMumbles,
        likedCount,
      },
    };
  } catch (error) {
    let message;
    if (error instanceof Error) {
      message = error.message;
    } else {
      message = String(error);
    }

    return { props: { error: message, user: '' } };
  }
};
