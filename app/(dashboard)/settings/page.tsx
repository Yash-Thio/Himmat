"use client";

import { SignOut } from "@phosphor-icons/react/dist/ssr";

import DashboardWrapper from "@/app/(dashboard)/components/dashboard-wrapper";
import { Route } from "@/constants/routes";
import { useLogout } from "@/lib/auth-client";
export default function SettingsPage() {
  const logout = useLogout();
  return (
    <DashboardWrapper
      backRoute={Route.Profile}
      title={"Settings"}
      activeKey={Route.Settings}
    >
      <div className="divide-y">
        <button
          className="py-3 px-4 text-start text-xl hover:bg-primary-foreground w-full rounded-xl flex items-center gap-2"
          onClick={logout}
        >
          <SignOut size={24} />
          Logout
        </button>
      </div>
    </DashboardWrapper>
  );
}
