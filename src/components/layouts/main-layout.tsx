import Head from 'next/head';
import { Header } from '../header';
import { LayoutProps } from './types/page-with-layout';

const MainLayout: LayoutProps = ({ children }) => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="w-screen h-full bg-slate-100 pb-xl">
        <div className="w-full sm:w-7/12 px-s my-0 mx-auto">{children}</div>
      </div>
    </>
  );
};
export default MainLayout;
