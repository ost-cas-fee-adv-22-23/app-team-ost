import { Heading, HeadingSize, MumbleWhite } from '@smartive-education/design-system-component-library-team-ost';
import { FC, ReactElement } from 'react';

type SplitScreenLayoutProps = {
  children?: ReactElement;
};

const SplitScreenLayout: FC<SplitScreenLayoutProps> = (props: SplitScreenLayoutProps) => {
  return (
    <main>
      <div className="h-screen flex flex-col md:flex-row">
        <div className="flex flex-col justify-center items-center gap-l text-white w-screen md:w-1/2 h-1/4 md:h-full bg-gradient-to-b from-pink-500 to-violet-600">
          <div className="w-56 md:w-80 flex justify-center">
            <MumbleWhite ariaLabel="Mumble" />
          </div>
          <div className="hidden md:block text-white opacity-50 text-center px-5">
            <Heading headingLevel={HeadingSize.h1}>
              Find out whats new in
              <span className="opacity-100">#fashion.</span>
            </Heading>
          </div>
        </div>
        <div className="w-screen md:w-1/2 h-3/4 md:h-full flex justify-center md:items-center">{props.children}</div>
      </div>
    </main>
  );
};
export default SplitScreenLayout;
