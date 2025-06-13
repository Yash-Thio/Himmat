"use client";
import React from "react";

import { SubscriptionPlanStatus } from "@/__generated__/graphql";
import { Button } from "@/components/button";
import { useSubscription, useToggleSubscribeModal } from "@/lib/auth-client";

import AccountCard from "./account-card";

export default function PlanSection() {
  const [sub] = useSubscription();
  const toggleSubModal = useToggleSubscribeModal();

  return (
    <AccountCard
      title="Subscriptions"
      subtitle="Manage your billing and subscriptions."
    >
      {sub?.existing?.status !== SubscriptionPlanStatus.Active && (
        <Button onClick={() => toggleSubModal("Get Sociocube today")}>
          Get Sociocube+
        </Button>
      )}
    </AccountCard>
  );
}
