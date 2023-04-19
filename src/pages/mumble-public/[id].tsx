import { MumbleCard, MumbleCardVariant } from '@/components/cards/mumble-card';
import { WriteCardVariant } from '@/components/cards/write-card';
import MainLayout from '@/components/layouts/main-layout';
import { MumbleList } from '@/components/lists/mumble-list';
import { onLikeClick } from '@/helpers/like-mumble';
import { fetchMumbleById, fetchRepliesByMumbleId } from '@/services/qwacker-api/posts';
import { Mumble } from '@/types/mumble';
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
          <title>Mumble</title>
        </Head>
        <MumbleCard
          isReplyActionVisible={false}
          mumble={props.mumble}
          onLikeClick={onLikeClick}
          variant={MumbleCardVariant.detail}
        />
        <MumbleList
          canUpdate={false}
          count={props.replies.length}
          isLikeActionVisible={false}
          isReplyActionVisible={true}
          isWriteCardVisible={false}
          listStackWithDivider={true}
          mumbles={props.replies}
          mumbleCardVariant={MumbleCardVariant.reply}
          replyToMumbleId={props.mumble.id}
          writeCardVariant={WriteCardVariant.replyMumble}
        />
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

  const [mumble, replies] = await Promise.all([fetchMumbleById(id), fetchRepliesByMumbleId(id)]);

  /*
   * "Not found" status code is not supported by qwacker-api for route GET /posts/:id. Hence the custom error page will
   * be displayed.
   */

  return {
    // value could change after some experience with numbers of users, available server power / capacity, etc.
    revalidate: 20,
    props: {
      mumble,
      replies,
    },
  };
};
