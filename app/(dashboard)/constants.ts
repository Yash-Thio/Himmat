import { ChatCircleDots } from "@phosphor-icons/react";
import {
  ClockCounterClockwise,
  Gear,
  Handshake,
  MagnifyingGlass,
  MoneyWavy,
  Plus,
  UserCircle,
} from "@phosphor-icons/react/dist/ssr";

import { NavItem } from "@/app/(dashboard)/type";
import { Route } from "@/constants/routes";

export const NAV_ITEMS: NavItem[] = [
  {
    icon: MagnifyingGlass,
    navTitle: "Travel",
    href: Route.Travel,
    requireAuth: true,
    requireOnboarding: true,
  },
  {
    icon: ChatCircleDots,
    navTitle: "Messages",
    href: Route.Inbox,
    requireAuth: true,
    requireOnboarding: true,
  },
  {
    icon: UserCircle,
    navTitle: "Profile",
    href: Route.Profile,
    requireAuth: true,
    requireOnboarding: true,
  },
  {
    icon: Gear,
    navTitle: "Settings",
    href: Route.Settings,
    parent: Route.Profile,
    requireAuth: true,
  },
];

export const WRAPPER_ID = "dashboard-wrapper-container";