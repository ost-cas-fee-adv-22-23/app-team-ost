import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useSession } from 'next-auth/react';
import MainLayout from '../../components/layouts/main-layout';
import { fetchMumbleById, fetchRepliesByMumbleId } from '../../helpers/qwacker-api/mumble-api-functions';
import { MumbleType } from '../../types/mumble';
import { MumbleCard, MumbleCardVariant } from '../../components/cards/mumble-card';
import { UserType } from '../../types/user';
import { WriteCard, WriteCardVariant } from '../../components/cards/write-card';
import { Stack, StackDirection, StackSpacing } from '@smartive-education/design-system-component-library-team-ost';

type MumblePageProps = {
  mumble: MumbleType;
  replies: MumbleType[];
};

// todo: Static mit revalidate, wenn neue Response kommt.
export default function MumblePage(props: MumblePageProps): InferGetServerSidePropsType<typeof getServerSideProps> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: session } = useSession();
  //const isCurrentUser = user.id === session?.user.id;

  // Stack mit Post, Write Component, Replies
  return (
    <MainLayout>
      <>
        <MumbleCard variant={MumbleCardVariant.detailpage} mumble={props.mumble} />
        {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
        <WriteCard variant={WriteCardVariant.inline} handleChange={() => {}} handleSubmit={() => {}} />
        <Stack direction={StackDirection.col} spacing={StackSpacing.s} withDivider={true}>
          {props.replies.map((response) => (
            <MumbleCard key={response.id} variant={MumbleCardVariant.response} mumble={response} />
          ))}
        </Stack>
      </>
    </MainLayout>
  );
}
//  Stack mit Trennlinie und Responses

export const getServerSideProps: GetServerSideProps = async ({ query: { id } }) => {
  // get Post --> get UserData
  // get replies --> get UserData
  console.warn('fetchMumbleWithId', id);
  const mumble = await fetchMumbleById(id as string);
  const anonymUser: UserType = {
    id: mumble.creator,
    userName: 'anonym',
    lastName: '',
    firstName: '',
    displayName: '',
  };
  mumble.creator = anonymUser;
  console.warn('mumble', mumble);
  // was wenn Benutzer nicht gefunden wird?

  // Kann parallel abgefragt werden. rxjs? --> Promise.all geht auch
  const replies = await fetchRepliesByMumbleId(id as string);

  console.warn('replies', replies);
  return {
    props: {
      mumble,
      replies,
    },
  };
};
