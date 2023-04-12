import { MumbleCard, MumbleCardVariant } from '@/components/cards/mumble-card';
import MainLayout from '@/components/layouts/main-layout';
import { MumbleList } from '@/components/lists/mumble-list';
import { onLikeClick } from '@/helpers/like-mumble';
import { fetchMumbleById, fetchRepliesByMumbleId } from '@/services/qwacker-api/posts';
import { Mumble } from '@/types/mumble';
import { Stack, StackDirection, StackSpacing } from '@smartive-education/design-system-component-library-team-ost';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getToken, JWT } from 'next-auth/jwt';
import Head from 'next/head';

type MumblePageProps = {
  jwtPayload: JWT;
  mumble: Mumble;
  replies: Mumble[];
};

export default function MumblePage(props: MumblePageProps): InferGetServerSidePropsType<typeof getServerSideProps> {
  return (
    <MainLayout>
      <>
        <Head>
          <title>Mumble</title>
        </Head>
        <div className="bg-white">
          <MumbleCard
            isLikeActionVisible={true}
            isReplyActionVisible={false}
            mumble={props.mumble}
            onLikeClick={onLikeClick}
            variant={MumbleCardVariant.detailpage}
          />
          <Stack direction={StackDirection.col} spacing={StackSpacing.s} withDivider={true}>
            <MumbleList
              canUpdate={false}
              count={props.replies.length}
              isLikeActionVisible={true}
              isReplyActionVisible={true}
              isWriteCardVisible={true}
              jwtPayload={props.jwtPayload}
              mumbles={props.replies}
              replyToMumbleId={props.mumble.id}
              variant={MumbleCardVariant.response}
            />
          </Stack>
        </div>
      </>
    </MainLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, query: { id } }) => {
  const jwtPayload = (await getToken({ req })) as JWT;

  const [mumble, replies] = await Promise.all([
    fetchMumbleById(id as string, jwtPayload.accessToken),
    fetchRepliesByMumbleId(id as string, jwtPayload.accessToken),
  ]);

  return {
    props: {
      jwtPayload,
      mumble,
      replies,
    },
  };
};
