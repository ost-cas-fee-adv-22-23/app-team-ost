import { GetServerSideProps, GetServerSidePropsContext, InferGetStaticPropsType } from 'next';
import MainLayout from '../components/layouts/main-layout';
import {
  Heading,
  HeadingSize,
  Stack,
  StackDirection,
  StackSpacing,
} from '@smartive-education/design-system-component-library-team-ost';
import Head from 'next/head';
import { MumbleCardVariant } from '../components/cards/mumble-card';
import { Mumble } from '../types/mumble';
import { fetchMumbles } from '../services/qwacker-api/posts';
import { getToken, JWT } from 'next-auth/jwt';
import { MumbleList } from '../components/lists/mumble-list';

type TimelinePageProps = {
  count: number;
  mumbles: Mumble[];
  decodedToken: JWT | null;
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
            mumbles={props.mumbles}
            count={props.count}
            variant={MumbleCardVariant.timeline}
            isWriteCardVisible={!!props.decodedToken?.accessToken}
            isReplyActionVisible={true}
            isLikeActionVisible={!!props.decodedToken?.accessToken}
          />
        </Stack>
      </>
    </MainLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }: GetServerSidePropsContext) => {
  try {
    const decodedToken = await getToken({ req });
    const { count, mumbles } = await fetchMumbles({ token: decodedToken?.accessToken as string });

    return {
      props: {
        count,
        mumbles,
        decodedToken,
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
