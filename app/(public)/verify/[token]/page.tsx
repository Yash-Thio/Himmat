import { CheckCircle, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import type { GraphQLError } from "graphql/error";

import { queryGQL } from "@/lib/apollo-server";
import { VERIFY_EMAIL } from "@/lib/queries";

import AuthLayout from "../../components/auth/auth-layout";

export default async function VerifyEmailPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const token = (await params).token;
  let success,
    errorMessage = "";

  try {
    await queryGQL(VERIFY_EMAIL, { token }, undefined, 0);
    success = true;
  } catch (error) {
    success = false;
    errorMessage = (error as GraphQLError).message;
  }
  return (
    <AuthLayout title="Email verification">
      <div className="flex flex-col items-center gap-7">
        {success ? (
          <CheckCircle color="green" size={60} weight="fill" />
        ) : (
          <WarningCircle color="red" size={60} weight="fill" />
        )}
        <div className="font-poppins font-medium">
          {success ? "Email successfully verified!" : errorMessage}
        </div>
      </div>
    </AuthLayout>
  );
}
