import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import MainLayout from '../../components/layouts/main-layout';
import { MumbleCard, MumbleCardVariant } from '../../components/cards/mumble-card';
import { WriteCard, WriteCardVariant } from '../../components/cards/write-card';
import { Stack, StackDirection, StackSpacing } from '@smartive-education/design-system-component-library-team-ost';
import { fetchMumbleById, fetchRepliesByMumbleId } from '../../services/qwacker-api/posts';
import { Mumble } from '../../types/mumble';
import { getToken } from 'next-auth/jwt';

type MumblePageProps = {
  mumble: Mumble;
  replies: Mumble[];
};

export default function MumblePage(props: MumblePageProps): InferGetServerSidePropsType<typeof getServerSideProps> {
  return (
    <MainLayout>
      <div className="bg-white">
        <MumbleCard variant={MumbleCardVariant.detailpage} mumble={props.mumble} />
        {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
        {/* <WriteCard
          variant={WriteCardVariant.inline}
          file={null} 
          fileError=''
          handleFileChange={() => { }}
          handleChange={() => { }}
          handleSubmit={() => { }}
        /> */}
        <Stack direction={StackDirection.col} spacing={StackSpacing.s} withDivider={true}>
          {props.replies.map((response) => (
            <MumbleCard key={response.id} variant={MumbleCardVariant.response} mumble={response} />
          ))}
        </Stack>
      </div>
    </MainLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, query: { id } }) => {
  const decodedToken = await getToken({ req });

  if (!decodedToken || !decodedToken.accessToken) {
    throw new Error('No decodedToken found');
  }
  if (!id) {
    throw new Error('No id found');
  }

  const [mumble, replies] = await Promise.all([
    fetchMumbleById(id as string, decodedToken.accessToken),
    fetchRepliesByMumbleId(id as string, decodedToken.accessToken),
  ]);

  return {
    props: {
      mumble,
      replies,
    },
  };
};
