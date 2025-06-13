// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";
// import React from "react";

// import { Roles } from "@/__generated__/graphql";
// import { getRoute, Route } from "@/constants/routes";
// import { getSEO } from "@/constants/seo";
// import { Injector, queryGQL } from "@/lib/apollo-server";
// import {
//   GET_ACCOUNT_PORTFOLIO_DETAILS,
//   GET_ACCOUNT_PROFILE_DETAILS,
//   GET_ACCOUNT_SOCIAL_DETAILS,
// } from "@/lib/queries";

// import DashboardWrapper from "../components/dashboard-wrapper";
// import ConnectionsSection from "./components/connections-section";
// import LinksSection from "./components/links-section";
// import PlanSection from "./components/plan-section";
// import PortfolioSection from "./components/portfolio-section";
// import ProfileSection from "./components/profile-section";
// import StatsSection from "./components/stats-section";
// export default async function ProfilePage() {
//   const Cookie = await cookies();
//   const { user } = await queryGQL(
//     GET_ACCOUNT_PROFILE_DETAILS,
//     undefined,
//     Cookie,
//     0,
//   );
//   if (!user) return redirect(getRoute("SignUp"));
//   return (
//     <DashboardWrapper title={"Your profile"} activeKey={Route.Profile}>
//       <div className="max-w-(--breakpoint-lg) mx-auto">
//         <Injector
//           fetch={() =>
//             queryGQL(GET_ACCOUNT_SOCIAL_DETAILS, undefined, Cookie, 0)
//           }
//           Component={ProfileSection}
//           props={{ user }}
//         />
//         <Injector
//           fetch={() =>
//             queryGQL(GET_ACCOUNT_SOCIAL_DETAILS, undefined, Cookie, 0)
//           }
//           Component={StatsSection}
//         />
//         {user.role !== Roles.Creator && <PlanSection />}
//         <Injector
//           fetch={() =>
//             queryGQL(GET_ACCOUNT_PORTFOLIO_DETAILS, undefined, Cookie, 0)
//           }
//           Component={PortfolioSection}
//         />
//         <Injector
//           fetch={() =>
//             queryGQL(GET_ACCOUNT_PORTFOLIO_DETAILS, undefined, Cookie, 0)
//           }
//           Component={LinksSection}
//         />
//         <Injector
//           fetch={() =>
//             queryGQL(GET_ACCOUNT_SOCIAL_DETAILS, undefined, Cookie, 0)
//           }
//           Component={ConnectionsSection}
//           props={{ profile: user }}
//         />
//       </div>
//     </DashboardWrapper>
//   );
// }
// export const metadata = getSEO("Manage your Account");


export default function ProfilePage() {
  return (
    <div className="mx-auto flex min-h-[83vh] w-full max-w-7xl px-6 sm:px-8 sm:pt-10">
      <div className="flex w-full items-center justify-center">
        <h1 className="text-2xl font-bold">Profile Page</h1>
      </div>
    </div>
  );
}