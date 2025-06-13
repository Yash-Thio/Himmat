import { useMemo } from "react";

import { Roles } from "@/__generated__/graphql";
import { useUser } from "@/lib/auth-client";

import { NAV_ITEMS } from "../constants";

export function useUserNavItems() {
  const [user] = useUser();
  return useMemo(() => {
    const allItems = user
      ? NAV_ITEMS.filter(
          (item) => !item.roles || item.roles.includes(user.role),
        )
      : NAV_ITEMS.filter((item) => !item.roles?.includes(Roles.Admin));
    return {
      all: allItems,
      primary: allItems.filter((item) => !item.parent),
    };
  }, [user]);
}
