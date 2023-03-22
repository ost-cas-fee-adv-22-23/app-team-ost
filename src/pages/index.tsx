import { GetServerSideProps, GetServerSidePropsContext, InferGetStaticPropsType } from 'next';
import MainLayout from '../components/layouts/main-layout';
import {
  Heading,
  HeadingSize,
  IconMumble,
  Stack,
  StackAlignItems,
  StackDirection,
  StackJustifyContent,
  StackSpacing,
  TextButton,
  TextButtonColor,
  TextButtonDisplayMode,
  TextButtonSize,
} from '@smartive-education/design-system-component-library-team-ost';
import Head from 'next/head';
import { MumbleCard, MumbleCardVariant } from '../components/cards/mumble-card';
import { Mumble } from '../types/mumble';
import { WriteCard, WriteCardVariant } from '../components/cards/write-card';
import { fetchMumbles, postMumble } from '../services/qwacker-api/posts';
import { getToken } from 'next-auth/jwt';
import { useSession } from 'next-auth/react';
import { ChangeEvent, useState } from 'react';

type PageProps = {
  count: number;
  mumbles: Mumble[];
};

export default function PageHome({
  count: initialCount,
  mumbles: initialMumbles,
}: PageProps): InferGetStaticPropsType<typeof getServerSideProps> {
  // todo: reducer statt useState verwenden
  const [mumbles, setMumbles] = useState(initialMumbles);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [count, setCount] = useState(initialCount);
  const [hasMore, setHasMore] = useState(initialMumbles.length < count);

  const { data: session } = useSession();

  const [form, setForm] = useState({
    text: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    const newMumble = await postMumble(form.text, null, session?.accessToken as string);
    console.warn('handleSubmit', newMumble);
    // todo: update state
  };

  const loadMore = async () => {
    const { count, mumbles: newMumbles } = await fetchMumbles({
      limit: 10,
      offset: mumbles.length,
      token: session?.accessToken,
    });

    setLoading(false);
    setHasMore(mumbles.length + newMumbles.length < count);
    setMumbles([...mumbles, ...newMumbles]);
  };

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
            {/* STATE AKTUALISIEREN UND PROXY API CALL*/}
            {session && (
              <WriteCard
                form={form}
                variant={WriteCardVariant.main}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
              />
            )}
            {mumbles.map((mumble) => (
              <MumbleCard key={mumble.id} variant={MumbleCardVariant.timeline} mumble={mumble} />
            ))}
            {hasMore && (
              <Stack
                alignItems={StackAlignItems.center}
                justifyContent={StackJustifyContent.center}
                spacing={StackSpacing.xl}
              >
                <TextButton
                  ariaLabel="Start mumble"
                  color={TextButtonColor.gradient}
                  displayMode={TextButtonDisplayMode.inline}
                  icon={<IconMumble />}
                  onClick={() => loadMore()}
                  size={TextButtonSize.l}
                >
                  {loading ? '...' : 'Weitere Mumbles laden'}
                </TextButton>
              </Stack>
            )}
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
    let { count, mumbles } = await fetchMumbles({ token: token?.accessToken as string });

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
