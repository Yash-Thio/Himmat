import React from "react";

import { GetAccountSocialDetailsQuery } from "@/__generated__/graphql";
import { convertToAbbreviation } from "@/lib/utils";

import AccountCard from "./account-card";
export default function StatsSection({
  data,
}: {
  data?: GetAccountSocialDetailsQuery;
}) {
  const user = data?.user;
  if (!user?.instagramStats) return null;
  return (
    <AccountCard
      title="Instagram Stats"
      subtitle="These are just estimates and not official data."
    >
      <div className="grid grid-cols-3 gap-y-5 gap-x-3 lg:grid-cols-6">
        {[
          [convertToAbbreviation(user.instagramStats?.followers), "Followers"],
          [convertToAbbreviation(user.instagramStats?.er) + "%", "Engagement"],
          [
            convertToAbbreviation(
              user.instagramStats?.er * user.instagramStats?.followers,
            ),
            "Reach",
          ],
          [
            convertToAbbreviation(user.instagramStats?.mediaCount),
            "Media count",
          ],
          [
            convertToAbbreviation(user.instagramStats?.averageLikes),
            "Avg. Likes",
          ],
          [
            convertToAbbreviation(user.instagramStats?.averageComments),
            "Avg. Comments",
          ],
        ].map(([value, label]) => (
          <div key={label}>
            <p className="text-2xl font-poppins font-medium text-center text-gray-700">
              {value}
            </p>
            <p className="text-xs text-gray-500 text-center">{label}</p>
          </div>
        ))}
      </div>
    </AccountCard>
  );
}
