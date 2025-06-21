import { redirect } from "next/navigation";
import React from "react";
import { cookies } from "next/headers";
import { getRoute, Route } from "@/constants/routes";
import DashboardWrapper from "../../components/dashboard-wrapper";
import { GET_CURRENT_USER, GET_IS_USER_TRUSTED } from "@/lib/queries";
import { queryGQL } from "@/lib/apollo-server";
import { Injector } from "@/lib/apollo-server";

interface SosPage {
  params: Promise<{ username: string }>;
}

export default async function Page({ params }: SosPage) {
  const Cookie = await cookies();
  const { user } = await queryGQL(GET_CURRENT_USER, undefined, Cookie, 0);
  if (!user) return redirect(`${getRoute("SignUp")}?redirectURL=${Route.Sos}`);

  return (
    <DashboardWrapper collapse title={"SOS"} activeKey={Route.Sos}>
      <div className="max-w-(--breakpoint-lg) mx-auto">
        <Injector
          fetch={async () =>
            queryGQL(
              GET_IS_USER_TRUSTED,
              {
                username: (await params).username,
              },
              Cookie,
              0
            )
          }
          Component={({ data }) => (
            data?.getIsUserTrusted ? (
              <div className="text-center text-green-500">
                You are a trusted contact for this user.
              </div>
            ) : (
              <div className="text-center text-red-500">
                You are not a trusted contact for this user.
              </div>
            )
          )}
        />
      </div>
    </DashboardWrapper>
  );
}
