import { MumbleCardVariant } from '@/components/cards/mumble-card';
import MainLayout from '@/components/layouts/main-layout';
import { LikesList } from '@/components/lists/likes-list';
import { MumbleList } from '@/components/lists/mumble-list';
import { fetchMumbles, fetchMumblesSearch } from '@/services/qwacker-api/posts';
import { fetchUserById } from '@/services/qwacker-api/users';
import { Mumble } from '@/types/mumble';
import { User } from '@/types/user';
import {
  IconCheckmark,
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
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

type ProfilePageProps = {
  likedMumbles: Mumble[];
  likedCount: number;
  count: number;
  mumbles: Mumble[];
  user: User;
};

enum ProfilePageStateTypes {
  mumbles = 'mumbles',
  likedMumbles = 'likedMumbles',
}
export default function ProfilePage(props: ProfilePageProps): InferGetServerSidePropsType<typeof getServerSideProps> {
  const [postType, setPostType] = useState<ProfilePageStateTypes>(ProfilePageStateTypes.mumbles);
  const { data: session } = useSession();
  const isCurrentUser = props.user.id === session?.user.id;

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
                onTabChange={() =>
                  setPostType(
                    postType === ProfilePageStateTypes.mumbles
                      ? ProfilePageStateTypes.likedMumbles
                      : ProfilePageStateTypes.mumbles
                  )
                }
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
          {postType === ProfilePageStateTypes.mumbles ? (
            <MumbleList
              count={props.count}
              mumbles={props.mumbles}
              variant={MumbleCardVariant.timeline}
              creator={props.user.id}
              isWriteCardVisible={false}
              isReplyActionVisible={!!session}
              isLikeActionVisible={!!session}
            />
          ) : (
            <LikesList
              count={props.likedCount}
              mumbles={props.likedMumbles}
              variant={MumbleCardVariant.timeline}
              creator={props.user.id}
              isReplyActionVisible={!!session}
              isLikeActionVisible={!!session}
            />
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
