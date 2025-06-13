"use client";
import { ArrowLeft } from "@phosphor-icons/react";
import Link from "next/link";
import React, { useMemo } from "react";

import { useUserNavItems } from "@/app/(dashboard)/components/useUserNavItems";
import Logo from "@/app/logo";
import { Button } from "@/components/button";
import { Variants } from "@/components/constants";
import LinkWrapper from "@/components/link-wrapper";
import { getRoute } from "@/constants/routes";
import { useToken, useUser } from "@/lib/auth-client";

export default function TopNav({
  title,
  activeKey,
  backRoute,
}: {
  backRoute?: string;
  title: string;
  activeKey: string;
}) {
  const token = useToken();

  const { all } = useUserNavItems();
  const subPages = useMemo(
    () => all.filter((item) => item.parent === activeKey),
    [activeKey, all],
  );
  const [user] = useUser();
  return (
    <div
      onScroll={(e) => e.stopPropagation()}
      className="flex w-full items-center justify-between py-4 px-5 lg:px-8 lg:py-5 max-lg:sticky top-0 bg-background"
    >
      <div className="flex items-center gap-3">
        <Link
          className={!backRoute ? "lg:hidden" : ""}
          href={backRoute || getRoute("Home")}
        >
          {backRoute ? (
            <ArrowLeft size={32} />
          ) : (
            <Logo className="text-primary" size={32} />
          )}
        </Link>
        <h2 className="font-poppins line-clamp-1 text-2xl lg:text-3xl lg:pl-0.5 lg:h-10 font-medium text-gray-800">
          {title}
        </h2>
      </div>
      <div className="flex">
        {subPages.map((page) => (
          <LinkWrapper
            key={page.href}
            href={
              page.requireAuth && !token
                ? getRoute("SignUp")
                : page.requireOnboarding && !user?.isOnboarded
                  ? getRoute("Onboarding")
                  : page.href
            }
          >
            <button className={"lg:hidden"}>
              <page.icon size={24} />
            </button>
            {page.alwaysIcon && (
              <Button
                key={page.href}
                variant={Variants.DARK}
                className={"flex gap-2 items-center max-lg:hidden"}
              >
                {page.navTitle} <page.icon />
              </Button>
            )}
          </LinkWrapper>
        ))}
      </div>
    </div>
  );
}
