import Head from "next/head";
import { LayoutProps } from "./types/PageWithLayout";

const SplitScreenLayout: LayoutProps = ({ children }) => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      Splitscreen Layout
      <main>{children}</main>
    </>
  );
};
export default SplitScreenLayout;
