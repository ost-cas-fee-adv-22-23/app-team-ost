import { GetServerSideProps, InferGetStaticPropsType } from "next";
import { Header } from "../components/header";
import {
  TextButton,
  TextButtonColor,
  TextButtonSize,
} from "@smartive-education/design-system-component-library-team-ost";

type PageProps = {};

export default function PageHome({}: PageProps): InferGetStaticPropsType<
  typeof getServerSideProps
> {
  return (
    <>
      <Header title="Mumble">
        <span>
          Your custom network
          <TextButton
            ariaLabel="Start mumble"
            onClick={function noRefCheck() {}}
            color={TextButtonColor.slate}
            size={TextButtonSize.m}
          >
            Button Label
          </TextButton>
        </span>
      </Header>
    </>
  );
}
export const getServerSideProps: GetServerSideProps = async () => ({
  props: { posts: require("../data/posts.json") },
});
