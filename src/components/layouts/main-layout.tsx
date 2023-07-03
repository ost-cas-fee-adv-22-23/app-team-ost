import { Header } from '@/components/header';
import { PageWithTransition } from '@/components/layouts/page-with-transition';
import { JWT } from 'next-auth/jwt';
import { FC, ReactElement } from 'react';

type MainLayoutProps = {
  children?: ReactElement;
  jwtPayload?: JWT | null;
};

const MainLayout: FC<MainLayoutProps> = (props: MainLayoutProps) => {
  return (
    <div className="bg-slate-100 h-full w-full">
      <Header jwtPayload={props.jwtPayload} />
      <PageWithTransition>
        {/*
            Es wurde bewusst entschieden, auf allen Seiten ein p-xl zu verwenden, um ein konsistentes UI zu haben.
            Gemäss Figma-Definition ist auf der Timeline nur ein pt-l definiert.
          */}
        <div className="min-h-main-layout-content w-full sm:w-2/3 2xl:w-1/2 mx-auto p-xl overflow-x-hidden">
          {props.children}
        </div>
      </PageWithTransition>
    </div>
  );
};
export default MainLayout;
