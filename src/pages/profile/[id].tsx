import {
  Paragraph,
  ParagraphSize,
  ProfileBanner,
  ProfilePicture,
  ProfilePictureSize,
  Stack,
  StackDirection,
  StackSpacing,
  TabNav,
  UserShortRepresentation,
  UserShortRepresentationLabelType,
  Label,
  LabelSize,
  StackAlignItems,
  IconCheckmark,
  TextButton,
  TextButtonSize,
  TextButtonColor,
  TextButtonDisplayMode,
  StackJustifyContent,
  IconMumble,
} from '@smartive-education/design-system-component-library-team-ost';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getToken } from 'next-auth/jwt';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { MumbleCard, MumbleCardVariant } from '../../components/cards/mumble-card';
import MainLayout from '../../components/layouts/main-layout';
import { fetchMumbles, searchMumbles } from '../../services/qwacker-api/posts';
import { fetchUserById } from '../../services/qwacker-api/users';
import { Mumble } from '../../types/mumble';
import { User } from '../../types/user';

type ProfilePageProps = {
  count: number;
  mumbles: Mumble[];
  user: User;
};

export default function ProfilePage({
  count: initialCount,
  mumbles: initialMumbles,
  user: user,
}: ProfilePageProps): InferGetServerSidePropsType<typeof getServerSideProps> {
  // todo: reducer statt useState verwenden
  const [mumbles, setMumbles] = useState(initialMumbles);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [count, setCount] = useState(initialCount);
  const [hasMore, setHasMore] = useState(initialMumbles.length < count);

  const { data: session } = useSession();
  const isCurrentUser = user.id === session?.user.id;

  const loadMore = async () => {
    const { count, mumbles: newMumbles } = await fetchMumbles({
      limit: 10,
      offset: mumbles.length,
      token: session?.accessToken,
      creator: user.id,
    });

    setLoading(false);
    setHasMore(mumbles.length + newMumbles.length < count);
    setMumbles([...mumbles, ...newMumbles]);
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
              <TabNav onTabChange={(e) => console.log('click' + e)} tabNames={['Deine Mumbles', 'Deine Likes']} />
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
          {mumbles.map((mumble) => (
            <MumbleCard key={mumble.id} variant={MumbleCardVariant.timeline} mumble={mumble} />
          ))}
          {hasMore && (
            <Stack alignItems={StackAlignItems.center} justifyContent={StackJustifyContent.center} spacing={StackSpacing.xl}>
              <TextButton
                ariaLabel="Start mumble"
                color={TextButtonColor.gradient}
                displayMode={TextButtonDisplayMode.inline}
                icon={<IconMumble />}
                onClick={() => loadMore()}
                size={TextButtonSize.l}
              >
                {loading ? '...' : 'Weitere Mumbles laden'}
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
    const { count: likedCount, mumbles: likedMumbles } = await searchMumbles({
      likedBy: id as string,
      token: token.accessToken,
    });

    return {
      props: {
        user,
        count,
        mumbles,
        likedCount,
        likedMumbles,
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
