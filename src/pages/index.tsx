import { GetServerSideProps, InferGetStaticPropsType } from "next";
import MainLayout from "../components/layouts/main-layout";
import {
  Heading,
  HeadingSize,
  Stack,
  StackDirection,
  StackSpacing,
  ProfilePicture,
  ProfilePictureSize,
  ImageContainer,
  Like,
  Paragraph,
  Reply,
  Share,
  UserShortRepresentation,
  UserShortRepresentationLabelType,
  ParagraphSize,
  Card,
  BorderRadiusType,
  Form,
  IconUpload,
  Textarea,
  TextButton,
  TextButtonColor,
  TextButtonDisplayMode,
  TextButtonSize,
} from "@smartive-education/design-system-component-library-team-ost";
import Head from "next/head";
import { useState } from "react";
import { stringify } from "querystring";

export type Mumble = {
  id: string;
  creator: string;
  text: string;
  mediaUrl: string;
  mediaType: string;
  likeCount: number;
  likedByUser: boolean;
  type: string;
  replyCount: number;
  createdTimestamp: number;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type PageProps = {
  data: Mumble[];
};

// eslint-disable-next-line no-empty-pattern
export default function PageHome({
  data: initialMumbles,
}: PageProps): InferGetStaticPropsType<typeof getServerSideProps> {
  const [mumbles, setMumbles] = useState(initialMumbles);

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
            Voluptatem qui cumque voluptatem quia tempora dolores distinctio vel
            repellat dicta.
          </Heading>
        </div>
        <Stack direction={StackDirection.col} spacing={StackSpacing.s}>
          <Card borderRadiusType={BorderRadiusType.roundedFull}>
            <div className="absolute -left-l top-m">
              <ProfilePicture
                alt="Robert Vogt"
                size={ProfilePictureSize.m}
                src="https://media.licdn.com/dms/image/D4E03AQEXHsHgH4BwJg/profile-displayphoto-shrink_800_800/0/1666815812197?e=2147483647&v=beta&t=Vx6xecdYFjUt3UTCmKdh2U-iHvY0bS-fcxlp_LKbxYw"
              />
            </div>
            <Stack direction={StackDirection.col} spacing={StackSpacing.s}>
              <Heading headingLevel={HeadingSize.h4}>Hey, was läuft?</Heading>
              <Form handleSubmit={function noRefCheck() {}}>
                <Textarea
                  ariaLabel="Und was meinst du dazu?"
                  errorMessage=""
                  name="text"
                  onChange={function noRefCheck() {}}
                  placeholder="Und was meinst du dazu?"
                  required
                  rows={5}
                  value=""
                />
              </Form>
              <Stack spacing={StackSpacing.s}>
                <TextButton
                  color={TextButtonColor.slate}
                  displayMode={TextButtonDisplayMode.fullWidth}
                  icon={<IconUpload />}
                  onClick={function noRefCheck() {}}
                  size={TextButtonSize.m}
                >
                  Bild hochladen
                </TextButton>
                <TextButton
                  color={TextButtonColor.violet}
                  displayMode={TextButtonDisplayMode.fullWidth}
                  icon={<IconUpload />}
                  onClick={function noRefCheck() {}}
                  size={TextButtonSize.m}
                  type="submit"
                >
                  Absenden
                </TextButton>
              </Stack>
            </Stack>
          </Card>
          {mumbles.map((mumble) => {
            return (
              <Card
                borderRadiusType={BorderRadiusType.roundedFull}
                isInteractive
              >
                <div className="absolute -left-l">
                  <ProfilePicture
                    alt={mumble.creator.userName}
                    size={ProfilePictureSize.m}
                    src={mumble.creator.avatarUrl}
                  />
                </div>
                <Stack direction={StackDirection.col} spacing={StackSpacing.s}>
                  <UserShortRepresentation
                    displayName={`${mumble.creator.firstName} ${mumble.creator.lastName}`}
                    hrefProfile="#"
                    labelType={UserShortRepresentationLabelType.m}
                    timestamp="vor 42 Minuten"
                    username={mumble.creator.userName}
                  />
                  <div className="text-slate-900">
                    <Paragraph size={ParagraphSize.m}>{mumble.text}</Paragraph>
                  </div>
                  <ImageContainer
                    alt={mumble.text}
                    onClick={function noRefCheck() {
                      console.log("click");
                    }}
                    src={mumble.mediaUrl}
                  />
                  <Stack spacing={StackSpacing.m}>
                    <Reply
                      onClick={function noRefCheck() {
                        console.log("click");
                      }}
                      repliesCount={mumble.replyCount}
                      withReaction
                    />
                    <Like
                      likesCount={mumble.likeCount}
                      onClick={function noRefCheck() {
                        console.log("click");
                      }}
                      withReaction
                    />
                    <Share linkToCopy="https://www.fcsg.ch/" />
                  </Stack>
                </Stack>
              </Card>
            );
          })}
        </Stack>
      </>
    </MainLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { count, data } = require("../data/posts.json");

  return {
    props: {
      count,
      data,
    },
  };
};
