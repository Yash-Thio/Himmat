"use client";
import { useUser } from "@/lib/auth-client";

import Features from "./components/features";
import { HeroSection } from "./components/hero";
import HowItWorks from "./components/how-it-works";
export default function Home() {
  const [user] = useUser();

  return (
    <>
      <HeroSection />
      <HowItWorks />
      <Features />
    </>
  );
}
