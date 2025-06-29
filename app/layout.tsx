import "./globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { PropsWithChildren } from "react";
import { Toaster } from "react-hot-toast";

import { ApolloWrapper } from "@/lib/apollo-client";
import { Injector } from "@/lib/apollo-server";
import { queryGQL } from "@/lib/apollo-server";
import { GlobalStateWrapper } from "@/lib/auth-client";
import { GET_CURRENT_USER } from "@/lib/queries";

import SOSButton from "./(dashboard)/components/sos-button";
import AuthApply from "./(public)/components/auth/auth-apply";
import TokenApply from "./(public)/components/auth/token-apply";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HIMMAT",
  description: "A platform to help you in emergencies",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html className="scroll-smooth no-scrollbar" lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex flex-col`}
      >
        <Toaster />
        <ApolloWrapper>
          <GlobalStateWrapper>
            <Injector
              fetch={async () =>
                queryGQL(GET_CURRENT_USER, undefined, await cookies(), 0)
              }
              Component={AuthApply}
            />
            <Injector
              fetch={async () =>
                fetch(process.env.NEXT_PUBLIC_BACKEND_BASE_URL + `/email`, {
                  credentials: "include",
                  headers: {
                    Cookie: (await cookies()).toString(),
                  },
                })
                  .then((res) => res.text())
                  .catch(() => null)
              }
              Component={TokenApply}
            />
            {children}
            <SOSButton />
          </GlobalStateWrapper>
        </ApolloWrapper>
      </body>
    </html>
  );
}
