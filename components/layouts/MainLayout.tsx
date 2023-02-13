import Head from "next/head";
import { Header } from "../Header";
import { LayoutProps } from "./types/PageWithLayout";

const MainLayout: LayoutProps = ({ children }) => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="w-full sm:w-7/12 px-s my-0 mx-auto">{children}</div>
    </>
  );
};
export default MainLayout;
