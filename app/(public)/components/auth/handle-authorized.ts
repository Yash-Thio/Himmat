import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { getRoute } from "@/constants/routes";
import { useUser } from "@/lib/auth-client";

export default function useHandleAuthorized() {
  const [user] = useUser();
  const router = useRouter();
  useEffect(() => {
    if (user) router.push(getRoute("Profile"));
  }, [router, user]);
  return;
}
