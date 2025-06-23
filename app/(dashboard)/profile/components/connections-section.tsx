"use client";
import {
  EnvelopeSimple,
  Phone,
  SealQuestion,
} from "@phosphor-icons/react/dist/ssr";
import React, { useState } from "react";

import { useAuthMutation } from "@/lib/apollo-client";
import { useUser } from "@/lib/auth-client";
import { SEND_VERIFICATION_EMAIL } from "@/lib/mutations";

import AccountCard from "./account-card";
export default function ConnectionsSection() {
  const [user] = useUser();
  const [sendEmail, { data: success, loading, called }] = useAuthMutation(
    SEND_VERIFICATION_EMAIL,
  );

  const [isGetVerifiedModalOpen, setIsGetVerifiedModalOpen] = useState(false);
  if (!user) return null;
  return (
    <AccountCard title="Connections" subtitle="Your contact details">
      <div className="flex gap-1 justify-between items-start">
        <div className="flex gap-2 items-center  font-poppins">
          <EnvelopeSimple size={18} />
          <p>Email</p>
        </div>
        <div>
          <span className="flex gap-1 items-center justify-end font-light">
            {user.email}
            {!user.emailVerified && (
              <SealQuestion className="text-yellow-600" size={14} />
            )}
          </span>
          {!user.emailVerified && (
            <button
              onClick={() => sendEmail()}
              className={
                "flex gap-1 justify-end items-center text-sm ml-auto " +
                "text-blue-600 underline"
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
          <Phone size={18} />
          <p>Phone</p>
        </div>
        <div>
          <span className="flex gap-1 items-center justify-end font-light">
            {user.phone || "Not provided"}
          </span>
          {!user.phone && (
            <button
              onClick={() => setIsGetVerifiedModalOpen(true)}
              className={
                "flex gap-1 justify-end items-center text-sm ml-auto " +
                "text-accent underline"
              }
            >
              Add phone number
            </button>
          )}
        </div>
      </div>
    </AccountCard>
  );
}
