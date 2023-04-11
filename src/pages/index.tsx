import { MumbleCardVariant } from '@/components/cards/mumble-card';
import MainLayout from '@/components/layouts/main-layout';
import { MumbleList } from '@/components/lists/mumble-list';
import { fetchMumbles } from '@/services/qwacker-api/posts';
import { Mumble } from '@/types/mumble';
import {
  Heading,
  HeadingSize,
  Stack,
  StackDirection,
  StackSpacing,
} from '@smartive-education/design-system-component-library-team-ost';
import { GetServerSideProps, GetServerSidePropsContext, InferGetStaticPropsType } from 'next';
import { getToken, JWT } from 'next-auth/jwt';
import Head from 'next/head';

type TimelinePageProps = {
  count: number;
  mumbles: Mumble[];
  jwtPayload: JWT | null;
};

export default function TimelinePage(props: TimelinePageProps): InferGetStaticPropsType<typeof getServerSideProps> {
  return (
    <MainLayout>
      <>
        <Head>
          <title>Mumble - Timeline</title>
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
            accessToken={props.jwtPayload?.accessToken}
            mumbles={props.mumbles}
            count={props.count}
            variant={MumbleCardVariant.timeline}
            canUpdate={true}
            isWriteCardVisible={!!props.jwtPayload}
            isReplyActionVisible={true}
            isLikeActionVisible={!!props.jwtPayload}
          />
        </Stack>
      </>
    </MainLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }: GetServerSidePropsContext) => {
  const jwtPayload = await getToken({ req });

  try {
    const { count, mumbles } = await fetchMumbles({ accessToken: jwtPayload?.accessToken });

    return {
      props: {
        count,
        mumbles,
        jwtPayload,
      },
    };
  } catch (error) {
    let message;
    if (error instanceof Error) {
      message = error.message;
    } else {
      message = String(error);
    }

    return { props: { error: message, mumbles: [], count: 0 } };
  }
};
