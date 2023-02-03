import { GetServerSideProps, InferGetStaticPropsType } from "next";
import MainLayout from "../components/layouts/mainLayout";
import {
  Stack,
  StackDirection,
  StackSpacing,
} from "@smartive-education/design-system-component-library-team-ost";
import Head from "next/head";

type PageProps = {};

export default function PageHome({}: PageProps): InferGetStaticPropsType<
  typeof getServerSideProps
> {
  return (
    <>
      <Head>
        <title>Mumble Home</title>
      </Head>
      <Stack
        direction={StackDirection.col}
        spacing={StackSpacing.s}
        withDivider={true}
      >
        <div>Mumble 1</div>
        <div>Mumble 2</div>
      </Stack>
    </>
  );
}

PageHome.layout = MainLayout;

export const getServerSideProps: GetServerSideProps = async () => ({
  props: { posts: require("../data/posts.json") },
});
