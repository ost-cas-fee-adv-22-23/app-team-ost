import { MumbleCard, MumbleCardVariant } from '@/components/cards/mumble-card';
import MainLayout from '@/components/layouts/main-layout';
import { MumbleList } from '@/components/lists/mumble-list';
import { onLikeClick } from '@/helpers/like-mumble';
import { fetchMumbleById, fetchRepliesByMumbleId } from '@/services/qwacker-api/posts';
import { Mumble } from '@/types/mumble';
import { Stack, StackDirection, StackSpacing } from '@smartive-education/design-system-component-library-team-ost';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';

type MumblePublicPageProps = {
  mumble: Mumble;
  replies: Mumble[];
};

export default function MumblePublicPage(props: MumblePublicPageProps): InferGetStaticPropsType<typeof getStaticProps> {
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
          />
          <Stack direction={StackDirection.col} spacing={StackSpacing.s} withDivider={true}>
            <MumbleList
              count={props.replies.length}
              mumbles={props.replies}
              variant={MumbleCardVariant.response}
              replyToPostId={props.mumble.id}
              isWriteCardVisible={false}
              isReplyActionVisible={true}
              isLikeActionVisible={false}
            />
          </Stack>
        </div>
      </>
    </MainLayout>
  );
}

export const getStaticPaths = async (): Promise<{ paths: { params: { id: string } }[]; fallback: string }> => {
  // Initially we would render all mumbles which are most visited. Another option is to render mumbles which
  // have the most likes or comments. These functionalities are missing in the current version of the api. So we
  // decided to prerender nothing and use the fallback blocking option with SSR.
  const mumbles: Mumble[] = [];

  // Get the paths we want to pre-render based on mumbles (just prepared for the future and api version 2 ;))
  const paths = mumbles.map((m) => ({
    params: { id: m.id },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: 'blocking' } will server-render pages
  // on-demand if the path doesn't exist.
  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const id = context.params?.id as string;

  if (!id) {
    throw new Error('No id found');
  }

  const [mumble, replies] = await Promise.all([fetchMumbleById(id), fetchRepliesByMumbleId(id)]);

  return {
    // value could change after some experience with numbers of users, available server power / capacity, etc.
    revalidate: 20,
    props: {
      mumble,
      replies,
    },
  };
};
