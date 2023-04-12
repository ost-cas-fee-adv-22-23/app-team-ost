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
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { getToken, JWT } from 'next-auth/jwt';
import Head from 'next/head';

type TimelinePageProps = {
  jwtPayload: JWT;
  mumbleList: TMumbleList;
};

export default function TimelinePage(props: TimelinePageProps): InferGetServerSidePropsType<typeof getServerSideProps> {
  return (
    <MainLayout jwtPayload={props.jwtPayload}>
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
            isLikeActionVisible={true}
            isReplyActionVisible={true}
            isWriteCardVisible={true}
            jwtPayload={props.jwtPayload}
            mumbles={props.mumbleList.mumbles}
            variant={MumbleCardVariant.timeline}
          />
        </Stack>
      </>
    </MainLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }: GetServerSidePropsContext) => {
  const jwtPayload = (await getToken({ req })) as JWT;

  const mumbleList = await fetchMumbles({ accessToken: jwtPayload.accessToken });

  return {
    props: {
      jwtPayload,
      mumbleList,
    },
  };
};
