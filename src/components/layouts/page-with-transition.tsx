import {
  IconMumble,
  IconSize,
  Label,
  LabelSize,
  Stack,
  StackAlignItems,
  StackDirection,
  StackSpacing,
} from '@smartive-education/design-system-component-library-team-ost';
import { useRouter } from 'next/router';
import { FC, ReactElement, useEffect, useState } from 'react';

const classMap: Record<string, string> = {
  leave: 'animate-pageLeave',
  enter: 'animate-pageEnter',
};

type PageWithTransitionProps = {
  children?: ReactElement;
};

export const PageWithTransition: FC<PageWithTransitionProps> = ({ children }: PageWithTransitionProps) => {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const handler = (url: string) => {
      if (window.location.pathname !== url) {
        setIsTransitioning(true);
        // Waiting the page-leave-animation before showing the loading screen
        setTimeout(() => {
          setIsLoading(true);
        }, 780);
      }
    };
    router.events.on('routeChangeStart', handler);
    return () => {
      router.events.off('routeChangeStart', handler);
    };
  }, [router.events]);

  if (isLoading) {
    return (
      <div className="animate-pageEnter min-h-main-layout-content text-slate-300 pt-xxl">
        <Stack alignItems={StackAlignItems.center} direction={StackDirection.col} spacing={StackSpacing.s}>
          <IconMumble size={IconSize.l} />
          <Label size={LabelSize.m}>Loading...</Label>
        </Stack>
      </div>
    );
  }
  const animateClass = isTransitioning ? 'leave' : 'enter';

  return <div className={classMap[animateClass]}>{children}</div>;
};
