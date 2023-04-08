import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import MainLayout from '../../components/layouts/main-layout';
import { MumbleCard, MumbleCardVariant } from '../../components/cards/mumble-card';
import { Stack, StackDirection, StackSpacing } from '@smartive-education/design-system-component-library-team-ost';
import { fetchMumbleById, fetchRepliesByMumbleId } from '../../services/qwacker-api/posts';
import { Mumble } from '../../types/mumble';
import { getToken } from 'next-auth/jwt';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { MumbleList } from '../../components/lists/mumble-list';
import { onLikeClick } from '../../helpers/like-mumble';

type MumblePageProps = {
  mumble: Mumble;
  replies: Mumble[];
};

export default function MumblePage(props: MumblePageProps): InferGetServerSidePropsType<typeof getServerSideProps> {
  const { data: session } = useSession();

  return (
    <MainLayout>
      <>
        <Head>
          <title>Mumble - {props.mumble.id}</title>
        </Head>
        <div className="bg-white">
          <MumbleCard
            variant={MumbleCardVariant.detailpage}
            mumble={props.mumble}
            onLikeClick={onLikeClick}
            isReplyActionVisible={false}
            isLikeActionVisible={!!session?.accessToken}
          />
          <Stack direction={StackDirection.col} spacing={StackSpacing.s} withDivider={true}>
            <MumbleList
              count={props.replies.length}
              mumbles={props.replies}
              variant={MumbleCardVariant.response}
              isWriteCardVisible={!!session?.accessToken}
              isReplyActionVisible={!!session?.accessToken}
              isLikeActionVisible={!!session?.accessToken}
              replyToPostId={props.mumble.id}
              accessToken={session?.accessToken}
            />
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
