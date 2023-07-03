import SplitScreenLayout from '@/components/layouts/split-screen-layout';
import { Paragraph, ParagraphSize } from '@smartive-education/design-system-component-library-team-ost';
import Head from 'next/head';
import React from 'react';

export default function Custom500Page() {
  return (
    <SplitScreenLayout>
      <>
        <Head>
          <title>Error - 500</title>
        </Head>

        <div className="w-full lg:w-4/5 2xl:w-1/2 p-xl">
          {/* Expose no sensitive data */}
          <Paragraph size={ParagraphSize.l}>
            Oops, something went wrong. Try to refresh this page or feel free to contact us if the problem persists.
          </Paragraph>
        </div>
      </>
    </SplitScreenLayout>
  );
}
