"use client";
import {
  EnvelopeSimple,
  InstagramLogo,
  SealCheck,
  SealQuestion,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import React, { useState } from "react";

import {
  GetAccountProfileDetailsQuery,
  GetAccountSocialDetailsQuery,
  Roles,
} from "@/__generated__/graphql";
import GetVerifiedModal from "@/app/(public)/components/get-verified-modal";
import { getRoute } from "@/constants/routes";
import { useAuthMutation } from "@/lib/apollo-client";
import {
  SEND_VERIFICATION_EMAIL,
  UNLINK_SOCIAL_ACCOUNT,
} from "@/lib/mutations";

import AccountCard from "./account-card";
export default function ConnectionsSection({
  data,
  profile,
}: {
  data?: GetAccountSocialDetailsQuery;
  profile: NonNullable<GetAccountProfileDetailsQuery["user"]>;
}) {
  const [user, setUser] = useState(data?.user);
  const [unlinkSocialAccount] = useAuthMutation(UNLINK_SOCIAL_ACCOUNT);
  const [sendEmail, { data: success, loading, called }] = useAuthMutation(
    SEND_VERIFICATION_EMAIL,
  );

  const [isGetVerifiedModalOpen, setIsGetVerifiedModalOpen] = useState(false);
  if (!user) return null;
  return (
    <AccountCard title="Connections" subtitle="Your social connections">
      <div className="flex gap-1 justify-between items-start">
        <div className="flex gap-2 items-center  font-poppins">
          <EnvelopeSimple size={18} />
          <p>Email</p>
        </div>
        <div>
          <span className="flex gap-1 items-center justify-end font-light">
            {profile.email}
            {!profile.emailVerified && (
              <SealQuestion className="text-yellow-600" size={14} />
            )}
          </span>
          {!profile.emailVerified && (
            <button
              onClick={() => sendEmail()}
              className={
                "flex gap-1 justify-end items-center text-sm ml-auto " +
                "text-accent underline"
              }
            >
              {loading ? "Sending email..." : ""}
              {success ? "Email sent!" : ""}
              {!called ? "Verify now" : ""}
            </button>
          )}
        </div>
      </div>
      <div className="flex gap-1 justify-between items-start mt-4">
        <div className="flex gap-2 items-center font-poppins">
          <InstagramLogo size={18} />
          <p>Instagram</p>
        </div>
        {user.instagramStats ? (
          <div>
            <span className="flex gap-1 items-center justify-end font-light">
              @{user.instagramStats.username}
              {user.instagramStats.isVerified ? (
                <SealCheck
                  weight="fill"
                  className={
                    profile.role === Roles.Creator
                      ? "text-primary"
                      : "text-accent"
                  }
                  size={14}
                />
              ) : (
                <SealQuestion className="text-yellow-600" size={14} />
              )}
            </span>

            {!user.instagramStats.isVerified && (
              <div className="flex gap-2 justify-end  text-sm  items-center">
                <button
                  onClick={() => {
                    setUser((prev) => ({
                      ...prev,
                      instagramStats: null,
                      id: user.id,
                    }));
                    unlinkSocialAccount();
                  }}
                  className={"text-red-600 underline"}
                >
                  Unlink
                </button>
                <button
                  onClick={() => setIsGetVerifiedModalOpen(true)}
                  className={
                    "underline " +
                    (profile.role === Roles.Creator
                      ? "text-primary"
                      : "text-accent")
                  }
                >
                  Verify now
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href={getRoute("Onboarding")}
            className="text-primary underline underline-offset-4"
          >
            Connect now
          </Link>
        )}
      </div>
      <GetVerifiedModal
        isOpen={isGetVerifiedModalOpen}
        close={() => setIsGetVerifiedModalOpen(false)}
      />
    </AccountCard>
  );
}
