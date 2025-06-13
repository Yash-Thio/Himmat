import { ElementType } from "react";

import { Roles } from "@/__generated__/graphql";
import { Route } from "@/constants/routes";

export interface NavItem {
  href: Route;
  navTitle: string;
  icon: ElementType;
  parent?: Route;
  alwaysIcon?: boolean;
  requireAuth?: boolean;
  requireOnboarding?: boolean;
  roles?: Roles[];
}
