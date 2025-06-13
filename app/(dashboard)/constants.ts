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

import { Roles } from "@/__generated__/graphql";
import { NavItem } from "@/app/(dashboard)/type";
import { Route } from "@/constants/routes";

export const NAV_ITEMS: NavItem[] = [
  {
    href: Route.Campaigns,
    navTitle: "Apply",
    icon: MoneyWavy,
    roles: [Roles.Creator],
  },
  {
    icon: ClockCounterClockwise,
    navTitle: "Applications",
    href: Route.Applications,
    parent: Route.Campaigns,
    roles: [Roles.Creator],
  },
  {
    icon: Handshake,
    navTitle: "Your Campaigns",
    href: Route.YourCampaigns,
    roles: [Roles.Brand, Roles.Agency],
  },
  {
    icon: Handshake,
    navTitle: "Review Campaigns",
    href: Route.ReviewCampaigns,
    roles: [Roles.Admin],
  },
  {
    icon: Plus,
    navTitle: "New Campaign",
    href: Route.NewCampaign,
    alwaysIcon: true,
    parent: Route.YourCampaigns,
    roles: [Roles.Brand, Roles.Agency],
    requireAuth: true,
    requireOnboarding: true,
  },
  {
    icon: MagnifyingGlass,
    navTitle: "Search",
    href: Route.Search,
    roles: [Roles.Brand, Roles.Agency],
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
