import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardWrapper from "../components/dashboard-wrapper";

import { getRoute, Route } from "@/constants/routes";
import TravelPage from "./components/travel"; 

import { queryGQL } from "@/lib/apollo-server";
import { GET_CURRENT_USER } from "@/lib/queries";


export default async function TravePage() {

  const Cookie = await cookies();
  const { user } = await queryGQL(GET_CURRENT_USER, undefined, Cookie, 0);
  if (!user)
      return redirect(`${getRoute("SignUp")}?redirectURL=${Route.Profile}`);

  return (
    <DashboardWrapper title={"Safe Path Router"} activeKey={Route.Travel}>
    <TravelPage />
    </DashboardWrapper>
  );
}
