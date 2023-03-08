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
} from '@smartive-education/design-system-component-library-team-ost';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getToken } from 'next-auth/jwt';
import { useSession } from 'next-auth/react';
import { MumbleCard, MumbleCardVariant } from '../../components/cards/mumble-card';
import MainLayout from '../../components/layouts/main-layout';
import { fetchMumblesByUserId } from '../../helpers/qwacker-api/mumble-api-functions';
import { fetchUserById } from '../../helpers/qwacker-api/user-api-functions';
import { MumbleType } from '../../types/mumble';
import { UserType } from '../../types/user';

type ProfilePageProps = {
  user: UserType;
  mumbles: MumbleType[];
};

export default function ProfilePage({
  user: user,
  mumbles: mumbles,
}: ProfilePageProps): InferGetServerSidePropsType<typeof getServerSideProps> {
  const { data: session } = useSession();
  const isCurrentUser = user.id === session?.user.id;

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
        </Stack>
        <div className="w-7/12 my-m">
          <TabNav onTabChange={() => console.log('click')} tabNames={['Deine Mumbles', 'Deine Likes']} />
        </div>
        {mumbles.map((mumble) => (
          <MumbleCard key={mumble.id} variant={MumbleCardVariant.timeline} mumble={mumble} />
        ))}
      </>
    </MainLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, query: { alias } }) => {
  try {
    const token = await getToken({ req });
    if (!token) {
      throw new Error('No token found');
    }
    const user = await fetchUserById({ id: alias as string, accessToken: token.accessToken as string });
    const mumbles = await fetchMumblesByUserId({ userId: alias as string, accessToken: token.accessToken as string });

    return {
      props: {
        user,
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

    return { props: { error: message, user: '' } };
  }
};
