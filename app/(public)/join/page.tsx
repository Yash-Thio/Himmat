import { Injector } from "@/lib/apollo-server";

import SignupForm from "./form";

export default function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectURL: string }>;
}) {
  return (
    <Injector
      Component={SignupForm}
      fetch={async () => (await searchParams).redirectURL}
    />
  );
}
