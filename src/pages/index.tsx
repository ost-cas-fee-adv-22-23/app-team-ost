import { GetServerSideProps, InferGetStaticPropsType } from 'next';
import MainLayout from '../components/layouts/main-layout';
import {
  Heading,
  HeadingSize,
  Stack,
  StackDirection,
  StackSpacing,
} from '@smartive-education/design-system-component-library-team-ost';
import Head from 'next/head';

// eslint-disable-next-line @typescript-eslint/ban-types
type PageProps = {};

// eslint-disable-next-line no-empty-pattern
export default function PageHome({}: PageProps): InferGetStaticPropsType<typeof getServerSideProps> {
  return (
    <MainLayout>
      <>
        <Head>
          <title>Mumble Home</title>
        </Head>
        <div className="text-violet-600 pt-l">
          <Heading headingLevel={HeadingSize.h1}>Willkommen auf Mumble</Heading>
        </div>
        <div className="text-slate-500 pt-xs pb-l">
          <Heading headingLevel={HeadingSize.h4}>
            Voluptatem qui cumque voluptatem quia tempora dolores distinctio vel repellat dicta.
          </Heading>
        </div>
        <div className="bg-white">
          <Stack direction={StackDirection.col} spacing={StackSpacing.s} withDivider={true}>
            <div>Mumble 1</div>
            <div>Mumble 2</div>
          </Stack>
        </div>
      </>
    </MainLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => ({
  props: { posts: require('../data/posts.json') },
});
