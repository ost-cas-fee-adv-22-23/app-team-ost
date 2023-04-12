import { MumbleCardVariant } from '@/components/cards/mumble-card';
import MainLayout from '@/components/layouts/main-layout';
import { LikesList } from '@/components/lists/likes-list';
import { MumbleList } from '@/components/lists/mumble-list';
import { fetchMumbles } from '@/services/qwacker-api/posts';
import { fetchUserById } from '@/services/qwacker-api/users';
import { MumbleList as TMumbleList } from '@/types/mumble';
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
import { getToken, JWT } from 'next-auth/jwt';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

type ProfilePageProps = {
  jwtPayload: JWT;
  mumbleList: TMumbleList;
  user: User;
};

enum ProfilePageStateTypes {
  mumbles = 'mumbles',
  likedMumbles = 'likedMumbles',
}

export default function ProfilePage(props: ProfilePageProps): InferGetServerSidePropsType<typeof getServerSideProps> {
  const [postType, setPostType] = useState<ProfilePageStateTypes>(ProfilePageStateTypes.mumbles);
  const isCurrentUser = props.user.id === props.jwtPayload.user.id;

  return (
    <MainLayout jwtPayload={props.jwtPayload}>
      <>
        <Head>
          <title>Profile</title>
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
              canUpdate={false}
              count={props.mumbleList.count}
              creator={props.user.id}
              isLikeActionVisible={true}
              isReplyActionVisible={true}
              isWriteCardVisible={false}
              mumbles={props.mumbleList.mumbles}
              variant={MumbleCardVariant.timeline}
            />
          ) : (
            /* todo: Falscher Anwendungsfall der MumbleCardVariant */
            <LikesList
              creator={props.user.id}
              isLikeActionVisible={true}
              isReplyActionVisible={true}
              variant={MumbleCardVariant.timeline}
            />
          )}
        </Stack>
      </>
    </MainLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, query: { id } }) => {
  const jwtPayload = (await getToken({ req })) as JWT;

  const [user, mumbleList] = await Promise.all([
    fetchUserById(id as string, jwtPayload.accessToken),
    fetchMumbles({ creator: id as string, accessToken: jwtPayload.accessToken }),
  ]);

  return {
    props: {
      jwtPayload,
      mumbleList,
      user,
    },
  };
};
