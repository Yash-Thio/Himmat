"use client";
import { useEffect } from "react";

import { GetCurrentUserQuery } from "@/__generated__/graphql";
import { useUser } from "@/lib/auth-client";

export default function AuthApply({ data }: { data?: GetCurrentUserQuery }) {
  const [, setUser] = useUser();
  useEffect(() => {
    if (data !== undefined) setUser(data.user || null);
  }, [data, setUser]);
  return null;
}
