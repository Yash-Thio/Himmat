import type { PropsWithChildren } from "react";
import React, { Suspense } from "react";

import OptimisticNavbar from "@/app/(public)/components/optimistic-navbar";
import { UNAUTHORISED_NAVBAR_SECTIONS } from "@/app/(public)/constants";
import { Navbar } from "@/components/navbar";

// import { AuthFooter } from "./components/auth-footer";

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <main className="pt-24 min-h-svh flex flex-col no-scrollbar ">
      <Suspense fallback={<Navbar {...UNAUTHORISED_NAVBAR_SECTIONS} />}>
        <OptimisticNavbar />
      </Suspense>
      <div className="grow">{children}</div>

      {/* <AuthFooter /> */}
    </main>
  );
}
