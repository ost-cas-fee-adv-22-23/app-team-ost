import { Header } from '@/components/header';
import { LayoutProps } from '@/components/layouts/types/page-with-layout';

import Head from 'next/head';
import Motion from './motion';

const MainLayout: LayoutProps = ({ children }) => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-slate-100 h-full w-full">
        <Header />
        <Motion>
          {/*
            Es wurde bewusst entschieden, auf allen Seiten ein p-xl zu verwenden, um ein konsistentes UI zu haben.
            Gemäss Figma-Definition ist auf der Timeline nur ein pt-l definiert.
          */}
          <div className="min-h-main-layout-content w-full sm:w-2/3 2xl:w-1/2 mx-auto p-xl overflow-x-hidden">
            {children}
          </div>
        </Motion>
      </div>
    </>
  );
};
export default MainLayout;
