"use client";
import Image from "next/image";
import { useUser } from "@/lib/auth-client";
import Features from "./components/features";
import HowItWorks from "./components/how-it-works";

import { Button } from "@/components/ui/button";
import { HeroSection } from "./components/hero";
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
