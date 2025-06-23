import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

import { GetCurrentUserQuery } from "@/__generated__/graphql";
import { getRoute } from "@/constants/routes";

const NAVBAR_COMMON_SECTIONS = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "About Us", href: "/#about-us" },
  { label: "Features", href: "/#features" },
];
export const NAVBAR_COMMON_ROUTES = [
  { label: "Home", href: getRoute("Home") },
  ...NAVBAR_COMMON_SECTIONS,
];

export const UNAUTHORISED_NAVBAR_SECTIONS = {
  primaryLinks: NAVBAR_COMMON_ROUTES,
  secondaryLinks: [
    {
      label: "Sign In",
      href: getRoute("Login"),
    },
  ],
  cta: {
    button: {
      children: (
        <span className="flex items-center gap-1">
          Sign Up <ArrowRight />
        </span>
      ),
    },
    href: getRoute("SignUp"),
  },
};
export const AUTHORISED_USER_NAVBAR_SECTIONS = {
  primaryLinks: NAVBAR_COMMON_ROUTES,
  secondaryLinks: [
    {
      label: "Profile",
      href: getRoute("Profile"),
    },
    {
      label: "Settings",
      href: getRoute("Settings"),
    },
  ],
  cta: {
    button: {
      children: "Onboard",
    },
    href: getRoute("Onboarding"),
  },
};
export const getOnboardedUserNavbarSections = (
  user: NonNullable<GetCurrentUserQuery["user"]>,
) => ({
  primaryLinks: [
    { label: "Home", href: getRoute("Home") },
    ...NAVBAR_COMMON_SECTIONS,
  ],
  secondaryLinks: [
    {
      label: "Profile",
      href: getRoute("Profile"),
    },
    {
      label: "Settings",
      href: getRoute("Settings"),
    },
  ],
  cta: undefined,
});
