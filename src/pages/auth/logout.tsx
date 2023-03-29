import { signOut, useSession } from 'next-auth/react';
import SplitScreenLayout from '../../components/layouts/split-screen-layout';
import Head from 'next/head';
import {
  Heading,
  HeadingSize,
  Paragraph,
  ParagraphSize,
  Stack,
  StackAlignItems,
  StackDirection,
  StackSpacing,
  TextButton,
  TextButtonColor,
  TextButtonSize,
  TextLink,
} from '@smartive-education/design-system-component-library-team-ost';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Logout() {
  const { data: session } = useSession();
  const router = useRouter();
  const callbackUrl = (router.query?.callbackUrl as string) ?? '/';

  const handleLogout = async (): Promise<void> => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <SplitScreenLayout>
      <>
        <Head>
          <title>Abmelden</title>
        </Head>

        <div className="w-full lg:w-4/5 2xl:w-1/2 p-xl">
          {!!session && (
            <Stack direction={StackDirection.col} spacing={StackSpacing.xl}>
              <Heading headingLevel={HeadingSize.h1}>Abmelden</Heading>

              <Stack direction={StackDirection.col} spacing={StackSpacing.l}>
                <Paragraph size={ParagraphSize.m}>Möchten Sie sich abmelden? </Paragraph>
                <TextButton
                  onClick={handleLogout}
                  type="submit"
                  ariaLabel={'logout'}
                  color={TextButtonColor.gradient}
                  size={TextButtonSize.l}
                >
                  Abmelden
                </TextButton>
              </Stack>

              <Stack spacing={StackSpacing.s} alignItems={StackAlignItems.center}>
                <TextLink href={callbackUrl} linkComponent={Link}>
                  Zurück
                </TextLink>
              </Stack>
            </Stack>
          )}

          {!session && (
            <Stack direction={StackDirection.col} spacing={StackSpacing.xl}>
              <Heading headingLevel={HeadingSize.h1}>Abmelden</Heading>
              <Paragraph size={ParagraphSize.m}>
                Sie sind bereits abgemeldet. Möchten Sie sich anmelden?{' '}
                <TextLink href={'/auth/login'} linkComponent={Link}>
                  Jetzt anmelden
                </TextLink>
              </Paragraph>
            </Stack>
          )}
        </div>
      </>
    </SplitScreenLayout>
  );
}
