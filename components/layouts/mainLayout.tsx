import Head from "next/head";
import { Header } from "../header";
import { LayoutProps } from "./types/pageWithLayout";

const MainLayout: LayoutProps = ({ children }) => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="w-7/12 my-0 mx-auto">{children}</div>
    </>
  );
};
export default MainLayout;
