"use client";
import React, { PropsWithChildren } from "react";

import BottomNav from "@/app/(dashboard)/components/bottom-nav";
import SideNav from "@/app/(dashboard)/components/side-nav";
import TopNav from "@/app/(dashboard)/components/top-nav";
import { cn } from "@/lib/utils";

import { WRAPPER_ID } from "../constants";

export default function DashboardWrapper({
  children,
  backRoute,
  title,
  activeKey,
  collapse,
  noPadding,
  noTopNav,
}: PropsWithChildren<{
  title: string;
  activeKey: string;
  backRoute?: string;
  collapse?: boolean;
  noPadding?: boolean;
  noTopNav?: boolean;
}>) {
  return (
    <>
      <div
        className={cn(
          "mx-auto flex w-full max-w-8xl grow overflow-x-hidden no-scrollbar",
        )}
      >
        <SideNav collapse={collapse} activeKey={activeKey} />
        <div className={cn("relative w-full grow flex flex-col min-w-0")}>
          {!noTopNav && (
            <TopNav backRoute={backRoute} activeKey={activeKey} title={title} />
          )}
          <div
            id={WRAPPER_ID}
            className={cn(
              "h-full min-h-0 w-full  overflow-auto snap-y snap-mandatory snap-always",
              noPadding ? "" : "px-4 lg:px-8",
            )}
          >
            {children}
          </div>
        </div>
      </div>
      <BottomNav activeKey={activeKey} />
    </>
  );
}
