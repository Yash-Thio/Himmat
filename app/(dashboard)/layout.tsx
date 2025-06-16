import React, { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex max-lg:h-[calc(100svh-55px)] h-screen flex-col no-scrollbar ">
      {children}
    </div>
  );
}
