"use client";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { List, X } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

// import Logo from "@/app/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import UserImage from "../user-image";
import type { NavbarProps } from "./types";

function Navbar({
  primaryLinks,
  secondaryLinks,
  cta,
  hideCTA,
  user,
}: NavbarProps) {
  const activeHref = usePathname();
  const darkOnTop = activeHref === "/";
  const [scrollPosition, setScrollPosition] = useState(0);
  const handleScroll = () => {
    const position = window.scrollY;
    setScrollPosition(position);
  };

  useEffect(() => {
    if (darkOnTop) {
      setScrollPosition(window.scrollY);
      window.addEventListener("scroll", handleScroll, { passive: true });

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);
  return (
    <header className="fixed top-0 z-10 w-full p-2">
      <nav
        aria-label="Global"
        className={cn(
          "relative mx-auto flex max-w-7xl ease-in-out transition-colors duration-300 items-center justify-between rounded-xl  px-3 py-2  sm:gap-x-6",
          !darkOnTop || scrollPosition > 25
            ? "bg-background shadow-sm "
            : "bg-transparent",
        )}
      >
        <div className="flex items-center gap-5">
          <Link
            className={cn(
              " flex items-center gap-2 transition-colors ease-in-out duration-300 leading-none text-primary",
            )}
            href={process.env.NEXT_PUBLIC_BASE_URL || "/public"}
          >
            {/* <Logo size={36} /> */}
            <h1 className="translate-y-0.5 text-4xl leading-none  sm:hidden">
              Himmat
            </h1>
          </Link>
          <div className="h-5 w-0.5 bg-gray-400 max-sm:hidden" />
          <div className="hidden sm:flex gap-x-3.5">
            {primaryLinks.map(
              (item) =>
                item.render || (
                  <Link
                    className={cn(
                      "text-base leading-6  hover:underline  hover:underline-offset-8 ",
                      activeHref === item.href
                        ? "pointer-events-none underline-offset-8 underline"
                        : "",
                    )}
                    href={item.href}
                    key={item.label}
                  >
                    {item.label}
                  </Link>
                ),
            )}
          </div>
        </div>
        <div className="flex items-center">
          {cta && !hideCTA ? (
            <Link href={cta.href}>
              <Button
                compact
                {...cta.button}
                className={cn(cta.button.className, "max-sm:text-sm")}
              />
            </Link>
          ) : null}
          <Menu as="div" className=" ml-3.5">
            <MenuButton className="relative flex rounded-full text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:ring-offset-2">
              {({ open }) => (
                <>
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  {user ? (
                    <UserImage />
                  ) : open ? (
                    <X className="sm:hidden" size={24} />
                  ) : (
                    <List className="sm:hidden" size={24} />
                  )}
                </>
              )}
            </MenuButton>
            <Transition
              enter="transition ease-out duration-200"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <MenuItems className="absolute shadow-sm top-full right-0 z-10 mt-2 w-full sm:w-48 origin-top rounded-md bg-white py-2 ring-1 ring-black/5 focus:outline-hidden">
                {primaryLinks.map((item) => (
                  // @ts-expect-error -- type missing
                  <MenuItem className="sm:hidden" key={item.href}>
                    {({ focus }) =>
                      item.render || (
                        <Link
                          className={cn(
                            focus ? "bg-gray-100" : "",
                            "block px-4 py-1.5 sm:py-2 text-gray-700",
                          )}
                          href={item.href}
                          key={item.label}
                        >
                          {item.label}
                        </Link>
                      )
                    }
                  </MenuItem>
                ))}
                {secondaryLinks.map((item) => (
                  <MenuItem key={item.href}>
                    {({ focus }) =>
                      item.render || (
                        <Link
                          className={cn(
                            focus ? "bg-gray-100" : "",
                            "block px-4 py-1.5 sm:py-2  text-gray-700",
                          )}
                          href={item.href}
                          key={item.label}
                        >
                          {item.label}
                        </Link>
                      )
                    }
                  </MenuItem>
                ))}
              </MenuItems>
            </Transition>
          </Menu>
          {!user &&
            secondaryLinks.map((item) => (
              <Link
                className={cn(
                  "max-sm:hidden text-base font-medium leading-6 hover:underline hover:underline-offset-8 ",
                  activeHref === item.href
                    ? "pointer-events-none underline-offset-8 underline"
                    : "",
                )}
                href={item.href}
                key={item.label}
              >
                {item.label}
              </Link>
            ))}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
