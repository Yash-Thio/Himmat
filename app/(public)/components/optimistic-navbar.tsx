import { cookies } from "next/headers";

import { Navbar } from "@/components/navbar";

import { UNAUTHORISED_NAVBAR_SECTIONS } from "../constants";
import OnboardedNavbar from "./onboarded-navbar";

export default async function OptimisticNavbar() {
  const token = (await cookies()).get("refresh")?.value;
  if (!token) return <Navbar {...UNAUTHORISED_NAVBAR_SECTIONS} />;
  return <OnboardedNavbar />;
}
