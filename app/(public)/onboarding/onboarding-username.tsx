"use client";
import type { GraphQLError } from "graphql/error";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import Form from "@/components/form";
import { Input } from "@/components/input";
import { Button } from "@/components/ui/button";
import {
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from "@/constants/constraints";
import { getRoute } from "@/constants/routes";
import {
  handleGQLErrors,
  useAuthMutation,
  useAuthQuery,
} from "@/lib/apollo-client";
import { useUser } from "@/lib/auth-client";
import { UPDATE_USER } from "@/lib/mutations";
import { IS_USERNAME_AVAILABLE } from "@/lib/queries";
import { getUsernameInputRules } from "@/lib/utils";

export default function OnboardingUsername({
  defaultValues,
  redirectURL,
}: {
  defaultValues: { username?: string | null };
  redirectURL?: string | null;
}) {
  const router = useRouter();
  const form = useForm({ defaultValues, reValidateMode: "onSubmit" });
  const [updateUsername] = useAuthMutation(UPDATE_USER);
  const [, setUser] = useUser();
  const [loading, setLoading] = useState(false);
  const [isUsernameAvailable, { loading: loadingAvailability }] = useAuthQuery(
    IS_USERNAME_AVAILABLE,
  );
  const onSubmit: SubmitHandler<typeof defaultValues> = (data) => {
    if (data.username) {
      setLoading(true);
      router.replace(redirectURL ?? getRoute("Profile"));
      setUser(
        (prev) =>
          prev && {
            ...prev,
            isOnboarded: true,
            username: data.username?.toLowerCase(),
          },
      );
      updateUsername({
        updatedUser: {
          username: data.username.toLowerCase(),
        },
      }).catch((e) => {
        handleGQLErrors(e as GraphQLError);
        setLoading(false);
      });
    }
  };
  return (
    <Form className="space-y-3" form={form} onSubmit={onSubmit}>
      <Input
        className="block"
        label="Username"
        name="username"
        onChange={() => {
          form.clearErrors();
        }}
        placeholder="Enter your desired username"
        rules={getUsernameInputRules(async (username: string) => {
          const result = await isUsernameAvailable({ username });
          return Boolean(result.data?.isUsernameAvailable);
        })}
        maxLength={USERNAME_MAX_LENGTH}
        minLength={USERNAME_MIN_LENGTH}
      />

      <div className="mt-6! flex justify-end">
        <Button loading={loading || loadingAvailability} type="submit">
          Next
        </Button>
      </div>
    </Form>
  );
}
