import Head from "next/head";
import { LayoutProps } from "./types/page-with-layout";
import {
  Heading,
  HeadingSize,
  MumbleWhite,
} from "@smartive-education/design-system-component-library-team-ost";

const SplitScreenLayout: LayoutProps = ({ children }) => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="h-screen flex flex-col md:flex-row">
          <div className="flex flex-col justify-center items-center gap-l text-white w-screen md:w-1/2 h-full bg-gradient-to-b from-pink-500 to-violet-600">
            <div className="w-56 md:w-80 flex justify-center">
              <MumbleWhite ariaLabel="Mumble" />
            </div>
            <div className="text-white opacity-50 text-center px-5">
              <Heading headingLevel={HeadingSize.h1}>
                Find out whats new in
                <span className="opacity-100">#fashion.</span>
              </Heading>
            </div>
          </div>
          <div className="w-screen md:w-1/2 h-full flex justify-center items-center">
            {children}
          </div>
        </div>
      </main>
    </>
  );
};
export default SplitScreenLayout;
