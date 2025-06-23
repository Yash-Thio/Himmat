import type { ReactElement } from "react";

import { GetCurrentUserQuery } from "@/__generated__/graphql";
import { ButtonProps } from "@/components/ui/button";

export interface NavbarProps {
  secondaryLinks: NavbarLink[];
  primaryLinks: NavbarLink[];
  cta?: {
    button: ButtonProps;
    href: string;
  };
  hideCTA?: boolean;
  user?: GetCurrentUserQuery["user"];
}
interface NavbarLink {
  label: string;
  href: string;
  render?: ReactElement;
}
