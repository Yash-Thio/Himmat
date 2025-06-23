"use client";
import { User } from "@phosphor-icons/react";
import { GraphQLError } from "graphql/error";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import Form from "@/components/form";
import { Input } from "@/components/input";
import { Button } from "@/components/ui/button";
import { NAME_MAX_LENGTH } from "@/constants/constraints";
import { handleGQLErrors, useAuthMutation } from "@/lib/apollo-client";
import { useUser } from "@/lib/auth-client";
import { UPDATE_USER } from "@/lib/mutations";

interface FormFields {
  name: string;
  dob?: string;
}

export default function OnboardingBasicDetailsForm({
  defaultValues,
  nextStep,
  fallbackToStep,
}: {
  defaultValues: FormFields;
  nextStep: () => void;
  fallbackToStep: () => void;
}) {
  const [user, setUser] = useUser();
  const form = useForm<FormFields>({
    defaultValues: { 
      name: defaultValues.name,
      dob: defaultValues.dob || "2000-01-01" 
    },
  });
  const [updateBasicDetails, { loading }] = useAuthMutation(UPDATE_USER);
  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    nextStep();
    setUser(
      (prev) =>
        prev && {
          ...prev,
          name: data.name,
        },
    );
    updateBasicDetails({
      updatedUser: {
        name: data.name,
        dob: data.dob,
      },
    }).catch((e) => {
      fallbackToStep();
      handleGQLErrors(e as GraphQLError);
    });
  };
  return (
    <Form className=" space-y-3" form={form} onSubmit={onSubmit}>
      <User size={40} />
      <Input
        className="block mt-3"
        label="Full name"
        name="name"
        placeholder="Enter your name"
        rules={{ required: true, maxLength: NAME_MAX_LENGTH }}
        maxLength={NAME_MAX_LENGTH}
      />
      <Input
        className="block"
        label="Date of Birth"
        name="dob"
        placeholder="2000-01-01"
        rules={{
          required: true,
        }}
        type="date"
      />
      <Button
        className="mb-5! mt-8! ml-auto block"
        loading={loading}
        type="submit"
      >
        Next
      </Button>
    </Form>
  );
}
