import { Header } from '@/components/header';
import { PageWithTransition } from '@/components/layouts/page-with-transition';
import { JWT } from 'next-auth/jwt';
import Head from 'next/head';
import { ReactElement } from 'react';

export type MainLayoutProps = ({ children }: { children: ReactElement; jwtPayload?: JWT | null }) => ReactElement;

const MainLayout: MainLayoutProps = ({ children, jwtPayload }) => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-slate-100 h-full w-full">
        <Header jwtPayload={jwtPayload} />
        <PageWithTransition>
          {/*
            Es wurde bewusst entschieden, auf allen Seiten ein p-xl zu verwenden, um ein konsistentes UI zu haben.
            Gemäss Figma-Definition ist auf der Timeline nur ein pt-l definiert.
          */}
          <div className="min-h-main-layout-content w-full sm:w-2/3 2xl:w-1/2 mx-auto p-xl overflow-x-hidden">
            {children}
          </div>
        </PageWithTransition>
      </div>
    </>
  );
};
export default MainLayout;
