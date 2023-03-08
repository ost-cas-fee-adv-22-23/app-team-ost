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
import { MumbleCard, MumbleCardVariant } from '../components/cards/mumble-card';
import { MumbleType } from '../types/mumble';
import { WriteCard, WriteCardVariant } from '../components/cards/write-card';
import { fetchMumbles } from '../helpers/qwacker-api/mumble-api-functions';
import { fetchUserById } from '../helpers/qwacker-api/user-api-functions';
import { getToken } from 'next-auth/jwt';
import { useSession } from 'next-auth/react';

type PageProps = {
  count: number;
  mumbles: MumbleType[];
};

export default function PageHome({
  count: count,
  mumbles: initialMumbles,
}: PageProps): InferGetStaticPropsType<typeof getServerSideProps> {
  // const [mumbles, setMumbles] = useState(initialMumbles);
  const mumbles = initialMumbles;
  const { data: session } = useSession();

  return (
    <MainLayout>
      <>
        <Head>
          <title>Mumble Home</title>
        </Head>
        <div className="text-violet-600 pt-l">
          <Heading headingLevel={HeadingSize.h1}>Willkommen auf Mumble {count}</Heading>
        </div>
        <div className="text-slate-500 pt-xs pb-l">
          <Heading headingLevel={HeadingSize.h4}>
            Voluptatem qui cumque voluptatem quia tempora dolores distinctio vel repellat dicta.
          </Heading>
        </div>
        <Stack direction={StackDirection.col} spacing={StackSpacing.s} withDivider={true}>
          <>
            {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
            {session && <WriteCard variant={WriteCardVariant.main} handleChange={() => {}} handleSubmit={() => {}} />}
            {mumbles.map((mumble) => (
              <MumbleCard key={mumble.id} variant={MumbleCardVariant.timeline} mumble={mumble} />
            ))}
          </>
        </Stack>
      </>
    </MainLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }: GetServerSidePropsContext) => {
  try {
    const token = await getToken({ req });

    // if (!token) {
    //   return {
    //     redirect: {
    //       destination: '/login',
    //       permanent: false,
    //     },
    //   };
    // }

    // eslint-disable-next-line prefer-const
    let { count, mumbles } = await fetchMumbles();

    // If user is not logged in, we show anonymised mumbles without user data
    if (token) {
      mumbles = await Promise.all(
        mumbles.map(async (mumble) => {
          const user = await fetchUserById({ id: mumble.creator as string, accessToken: token.accessToken as string });

          mumble.creator = user.creator;
          return mumble;
        })
      );
    }

    mumbles = mumbles.filter((mumble) => mumble.type === 'post');

    return {
      props: {
        count,
        mumbles,
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
