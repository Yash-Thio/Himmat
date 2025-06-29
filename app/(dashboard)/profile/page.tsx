import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

import { getRoute, Route } from "@/constants/routes";
import { Injector, queryGQL } from "@/lib/apollo-server";
import { GET_CURRENT_USER, GET_USER_TRUSTED_DETAILS } from "@/lib/queries";

import DashboardWrapper from "../components/dashboard-wrapper";
import ConnectionsSection from "./components/connections-section";
import ProfileSection from "./components/profile-section";
import TrustiesSection from "./components/trusties-section";
export default async function ProfilePage() {
  const Cookie = await cookies();
  const { user } = await queryGQL(GET_CURRENT_USER, undefined, Cookie, 0);
  if (!user)
    return redirect(`${getRoute("SignUp")}?redirectURL=${Route.Profile}`);
  return (
    <DashboardWrapper title={"Your profile"} activeKey={Route.Profile}>
      <div className="max-w-(--breakpoint-lg) mx-auto">
        <ProfileSection user={user} />
        <Injector
          fetch={() => queryGQL(GET_USER_TRUSTED_DETAILS, undefined, Cookie, 0)}
          Component={TrustiesSection}
        />
        <ConnectionsSection />
      </div>
    </DashboardWrapper>
  );
}
