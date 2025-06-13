"use client";
import Link from "next/link";
import React, { useMemo } from "react";

import Logo from "@/app/logo";
import { getRoute, Route } from "@/constants/routes";
import { useToken, useUser } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

import { useUserNavItems } from "./useUserNavItems";

export default function SideNav({
  activeKey,
  collapse,
}: {
  activeKey?: string;
  collapse?: boolean;
}) {
  const [user] = useUser();
  const { primary, all } = useUserNavItems();
  const token = useToken();
  const primaryKey =
    all.find((item) => item.href === activeKey)?.parent || activeKey;
  const subLinks = useMemo(
    () => all.filter((item) => item.parent === primaryKey),
    [all, primaryKey],
  );
  return (
    <ul className="space-y-1 shrink-0 border-r border-gray-200 px-3 max-lg:hidden ">
      <Link
        className="my-7 pl-2 gap-2 flex items-center text-primary"
        href={Route.Home}
        key={Route.Home}
      >
        <Logo size={36} />

        {!collapse && (
          <h1 className="translate-y-0.5 font-madina text-5xl leading-0">
            sociocube
          </h1>
        )}
      </Link>
      {primary.map((item) => (
        <React.Fragment key={item.href}>
          <Link
            className={cn(
              "flex gap-2.5 items-center py-3 hover:bg-gray-100 rounded-lg",
              activeKey === item.href && "bg-gray-100 text-primary",
              collapse ? "px-3" : "pl-3 pr-14",
            )}
            href={
              item.requireAuth && !token
                ? getRoute("SignUp")
                : item.requireOnboarding && !user?.isOnboarded
                  ? getRoute("Onboarding")
                  : item.href
            }
            key={item.href}
          >
            <item.icon
              size={28}
              weight={activeKey === item.href ? "bold" : "regular"}
            />
            {!collapse && (
              <h4 className="text-lg font-medium">{item.navTitle}</h4>
            )}
          </Link>
          {primaryKey === item.href
            ? subLinks.map((page) => (
                <Link
                  className={cn(
                    "flex gap-2.5 items-center py-3 hover:bg-gray-100 rounded-lg",
                    activeKey === page.href && "bg-gray-100 text-primary",
                    collapse ? "px-3 justify-center" : "pl-7",
                  )}
                  href={
                    page.requireAuth && !token
                      ? getRoute("SignUp")
                      : page.requireOnboarding && !user?.isOnboarded
                        ? getRoute("Onboarding")
                        : page.href
                  }
                  key={page.href}
                >
                  <page.icon
                    size={20}
                    weight={activeKey === page.href ? "bold" : "regular"}
                  />
                  {!collapse && (
                    <h4 className="text-base font-medium">{page.navTitle}</h4>
                  )}
                </Link>
              ))
            : null}
        </React.Fragment>
      ))}
      <div />
    </ul>
  );
}
