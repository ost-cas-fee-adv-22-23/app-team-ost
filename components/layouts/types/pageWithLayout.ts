import { NextPage } from "next";
import type { ReactElement } from "react";
import MainLayout from "../MainLayout";
import SplitScreenLayout from "../SplitScreenLayout";

export type PageWithMainLayoutType = NextPage & { layout: typeof MainLayout };

export type PageWithSplitScreenLayoutType = NextPage & {
  layout: typeof SplitScreenLayout;
};

export type PageWithLayoutType =
  | PageWithMainLayoutType
  | PageWithSplitScreenLayoutType;

export type LayoutProps = ({
  children,
}: {
  children: ReactElement;
}) => ReactElement;
