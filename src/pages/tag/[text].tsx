import { MumbleCardVariant } from '@/components/cards/mumble-card';
import MainLayout from '@/components/layouts/main-layout';
import { SearchList } from '@/components/lists/search-list';
import { searchMumbles } from '@/services/qwacker-api/posts';
import { MumbleList as TMumbleList } from '@/types/mumble';
import {
  Heading,
  HeadingSize,
  Stack,
  StackDirection,
  StackSpacing,
} from '@smartive-education/design-system-component-library-team-ost';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getToken, JWT } from 'next-auth/jwt';
import Head from 'next/head';

type TagPageProps = {
  jwtPayload: JWT;
  mumbleList: TMumbleList;
  tag: string;
};

export default function TagPage(props: TagPageProps): InferGetServerSidePropsType<typeof getServerSideProps> {
  return (
    <MainLayout jwtPayload={props.jwtPayload}>
      <>
        <Head>
          <title>Tag</title>
        </Head>
        <div className="text-violet-600">
          <Heading headingLevel={HeadingSize.h1}>{props.tag}</Heading>
        </div>
        <div className="text-slate-500 pt-xs pb-l">
          <Heading headingLevel={HeadingSize.h4}>Here you will find all mumbles with tag: {props.tag}</Heading>
        </div>
        <Stack direction={StackDirection.col} spacing={StackSpacing.s} withDivider={true}>
          <SearchList
            mumbles={props.mumbleList.mumbles}
            count={props.mumbleList.count}
            isLikeActionVisible={true}
            isReplyActionVisible={true}
            tag={props.tag}
            variant={MumbleCardVariant.timeline}
          />
        </Stack>
      </>
    </MainLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, query: { text } }) => {
  const jwtPayload = (await getToken({ req })) as JWT;

  const mumbleList = await searchMumbles({ tags: [text as string], accessToken: jwtPayload.accessToken as string });

  return {
    props: {
      jwtPayload,
      mumbleList,
      tag: text,
    },
  };
};
