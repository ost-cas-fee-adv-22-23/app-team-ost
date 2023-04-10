import SplitScreenLayout from '@/components/layouts/split-screen-layout';
import {
  Paragraph,
  ParagraphSize,
  Stack,
  StackDirection,
  StackSpacing,
  TextLink,
} from '@smartive-education/design-system-component-library-team-ost';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

export default function Custom404Page() {
  return (
    <SplitScreenLayout>
      <>
        <Head>
          <title>Error - 404</title>
        </Head>

        <div className="w-full lg:w-4/5 2xl:w-1/2 p-xl">
          <Stack spacing={StackSpacing.s} direction={StackDirection.col}>
            <Paragraph size={ParagraphSize.l}>Oops, that page doesn&apos;t exist.</Paragraph>
            <TextLink href={'/'} linkComponent={Link}>
              go to timeline
            </TextLink>
          </Stack>
        </div>
      </>
    </SplitScreenLayout>
  );
}
