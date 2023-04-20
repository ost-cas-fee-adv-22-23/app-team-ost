import { MumbleCardVariant } from '@/components/cards/mumble-card';
import MainLayout from '@/components/layouts/main-layout';
import { MumbleList } from '@/components/lists/mumble-list';
import { fetchMumbles } from '@/services/qwacker-api/posts';
import { MumbleList as TMumbleList } from '@/types/mumble';
import {
  Heading,
  HeadingSize,
  Stack,
  StackDirection,
  StackSpacing,
} from '@smartive-education/design-system-component-library-team-ost';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';

type TimelinePublicPage = {
  mumbleList: TMumbleList;
};

export default function TimelinePublicPage(props: TimelinePublicPage): InferGetStaticPropsType<typeof getStaticProps> {
  return (
    <MainLayout>
      <>
        <Head>
          <title>Timeline</title>
        </Head>
        <div className="text-violet-600">
          <Heading headingLevel={HeadingSize.h1}>Willkommen auf Mumble</Heading>
        </div>
        <div className="text-slate-500 pt-xs pb-l">
          <Heading headingLevel={HeadingSize.h4}>
            Voluptatem qui cumque voluptatem quia tempora dolores distinctio vel repellat dicta.
          </Heading>
        </div>
        <Stack direction={StackDirection.col} spacing={StackSpacing.s} withDivider={true}>
          <MumbleList
            canUpdate={true}
            count={props.mumbleList.count}
            isLikeActionVisible={false}
            isReplyActionVisible={true}
            isWriteCardVisible={false}
            listStackWithSpacing={true}
            mumbles={props.mumbleList.mumbles}
            mumbleCardVariant={MumbleCardVariant.list}
          />
        </Stack>
      </>
    </MainLayout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const mumbleList = await fetchMumbles();

  return {
    // value could change after some experience with numbers of users, available server power / capacity, etc.
    revalidate: 5,
    props: {
      mumbleList,
    },
  };
};
