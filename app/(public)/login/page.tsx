import React from "react";

import { Injector } from "@/lib/apollo-server";

import LoginForm from "./form";

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectURL: string }>;
}) {
  return (
    <Injector
      Component={LoginForm}
      fetch={async () => (await searchParams).redirectURL}
    />
  );
}
