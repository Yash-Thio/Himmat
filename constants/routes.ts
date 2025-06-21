export enum Route {
  Home = "/",
  Login = "/login",
  Forgot = "/forgot",
  SignUp = "/join",
  Onboarding = "/onboarding",
  Profile = "/profile",
  Settings = "/settings",
  Inbox = "/inbox",
  Chat = "/chat",
  Travel = "/travel",
  PrivacyPolicy = "/privacy-policy",
  TermsConditions = "/terms-and-conditions",
  Sos = "/sos",
}

export function getRoute(route: keyof typeof Route) {
  return process.env.NEXT_PUBLIC_BASE_URL + Route[route];
}

