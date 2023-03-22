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
import { useReducer } from 'react';
import { MumbleCard, MumbleCardVariant } from '../../components/cards/mumble-card';
import MainLayout from '../../components/layouts/main-layout';
import { fetchMumbles } from '../../services/qwacker-api/posts';
import { fetchUserById } from '../../services/qwacker-api/users';
import { Mumble } from '../../types/mumble';
import { User } from '../../types/user';

type ProfilePageProps = {
  likedMumbles: Mumble[];
  mumblesCount: number;
  mumbles: Mumble[];
  user: User;
};

type ProfilePageState = {
  errorMessage: string;
  hasMore: boolean;
  likedMumbles: Mumble[];
  loading: boolean;
  mumblesCount: number;
  mumbles: Mumble[];
  postType: 'mumbles' | 'likedMumbles';
};

type ProfilePageAction =
  | { type: 'fetch_mumbles' }
  | { type: 'fetch_mumbles_success'; payload: Mumble[] }
  | { type: 'fetch_mumbles_error'; payload: string }
  | { type: 'switch_post_type' };

const profilPageReducer = (state: ProfilePageState, action: ProfilePageAction): ProfilePageState => {
  switch (action.type) {
    case 'fetch_mumbles':
      return { ...state, loading: true };
    case 'fetch_mumbles_success':
      return {
        ...state,
        hasMore: state.mumbles.length + action.payload.length < state.mumblesCount,
        loading: false,
        mumbles: [...state.mumbles, ...action.payload],
      };
    case 'fetch_mumbles_error':
      return {
        ...state,
        errorMessage: action.payload,
        loading: false,
      };
    case 'switch_post_type':
      return {
        ...state,
        postType: state.postType == 'mumbles' ? 'likedMumbles' : 'mumbles',
      };
    default:
      throw new Error(`Unknown action type`);
  }
};

export default function ProfilePage({
  likedMumbles: initialLikes,
  mumblesCount: initialCount,
  mumbles: initialMumbles,
  user: user,
}: ProfilePageProps): InferGetServerSidePropsType<typeof getServerSideProps> {
  const initialState: ProfilePageState = {
    errorMessage: '',
    hasMore: initialMumbles.length < initialCount,
    likedMumbles: initialLikes,
    loading: false,
    mumbles: initialMumbles,
    mumblesCount: initialCount,
    postType: 'mumbles',
  };
  const [state, dispatch] = useReducer(profilPageReducer, initialState);

  const { data: session } = useSession();
  const isCurrentUser = user.id === session?.user.id;

  // TODO Implement a api route for client fetchMumbles
  const loadMore = async () => {
    dispatch({ type: 'fetch_mumbles' });
    try {
      const { count, mumbles: newMumbles } = await fetchMumbles({
        creator: user.id,
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

  const mumblesToRender: Record<string, Mumble[]> = {
    likedMumbles: state.likedMumbles,
    mumbles: state.mumbles,
  };

  return (
    <MainLayout>
      <>
        <Stack direction={StackDirection.col} spacing={StackSpacing.s}>
          <div className="relative">
            <ProfileBanner
              alt={user.userName}
              canEdit={isCurrentUser}
              onEditClick={() => console.log('click')}
              src="https://newinzurich.com/wp-content/uploads/2013/09/55769975_2481568891894108_3190627635357024256_o-compressed.jpg"
            />
            <div className="absolute -bottom-20 right-8">
              <ProfilePicture
                alt={user.userName}
                canEdit={isCurrentUser}
                onEditClick={() => console.log('click')}
                size={ProfilePictureSize.xl}
                src={user.avatarUrl}
              />
            </div>
          </div>
          <div className="text-slate-900>">
            <UserShortRepresentation
              displayName={user.displayName}
              hrefProfile={user.profileUrl}
              joined="Mitglied seit 4 Wochen"
              labelType={UserShortRepresentationLabelType.h3}
              location="St. Gallen"
              onSettingsClick={() => console.log('click')}
              showSettings={isCurrentUser}
              username={user.userName}
            />
          </div>
          <div className="text-slate-400">
            <Paragraph size={ParagraphSize.m}>{user.bio || 'Dies ist meine Bio'}</Paragraph>
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
                <Label size={LabelSize.m}>Folge {user.displayName}</Label>
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
          {/* TODO Prüfen ob mumble oder likedMumble leer sind -> Fallback -> Wenn beides leer ist, dann NewUser Seite anzeigen */}
          {mumblesToRender[state.postType].map((mumble) => (
            <MumbleCard key={mumble.id} variant={MumbleCardVariant.timeline} mumble={mumble} />
          ))}
          {/* We decided to show the load-more button only for mumbles and not for likes, 
          as we the api endpoint (post/search) we use for getting the likes doesn't provide an offset and limit */}
          {state.hasMore && state.postType == 'mumbles' && (
            <Stack alignItems={StackAlignItems.center} justifyContent={StackJustifyContent.center} spacing={StackSpacing.xl}>
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
        </Stack>
      </>
    </MainLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, query: { id } }) => {
  try {
    const token = await getToken({ req });
    if (!token) {
      throw new Error('No token found');
    }
    if (!id) {
      throw new Error('No id found');
    }
    const user = await fetchUserById({ id: id as string, accessToken: token.accessToken });
    const { count, mumbles } = await fetchMumbles({ creator: id as string, token: token.accessToken });
    // const { count: likedCount, mumbles: likes } = await searchMumbles({
    //   likedBy: id as string,
    //   token: token.accessToken,
    // });

    //TODO integrate searchMumbles by LikedBy
    const likedMumbles: Mumble[] = [
      {
        id: '01GW2GR85REHE19SHTW019R54K',
        creator: {
          id: '201164885894103297',
          userName: 'mthomann',
          firstName: 'Martin',
          lastName: 'Thomann',
          avatarUrl:
            'https://cas-fee-advanced-ocvdad.zitadel.cloud/assets/v1/179828644300980481/users/201164885894103297/avatar?v=4e270c9e1b43fdcc701bcc315d75ebec',
          displayName: 'Martin Thomann',
          profileUrl: '/profile/201164885894103297',
        },
        text: 'Hello World! #test',
        mediaUrl: '',
        mediaType: '',
        likeCount: 0,
        likedByUser: false,
        type: 'post',
        replyCount: 1,
        createdAt: '2023-03-21T16:41:33.624Z',
      },
    ];
    const likedCount = 1;

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
