"use client";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import useHandleAuthorized from "@/app/(public)/components/auth/handle-authorized";
import { Button } from "@/components/ui/button";
import Form from "@/components/form";
import { Input } from "@/components/input";
import { getRoute } from "@/constants/routes";
import { handleGQLErrors } from "@/lib/apollo-client";
import { SEND_RESET_PASSWORD_EMAIL } from "@/lib/mutations";

import AuthLayout from "../components/auth/auth-layout";

const defaultValues = {
  email: "",
};

export default function ForgotPasswordForm() {
  useHandleAuthorized();
  const form = useForm({ defaultValues });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [forgotPassword] = useMutation(SEND_RESET_PASSWORD_EMAIL);
  const onSubmit: SubmitHandler<typeof defaultValues> = (data) => {
    setIsLoading(true);
    forgotPassword({
      variables: {
        email: data.email.toLowerCase(),
      },
    })
      .then(() => {
        toast.success(
          "An email with further details sent if an account exists with this email",
        );
        setSuccess(true);
      })
      .catch(handleGQLErrors)
      .finally(() => {
        form.reset();
        router.push(getRoute("Home"));
      });
  };

  return (
    <AuthLayout
      bottomHeading={{
        question: "Create a new account instead?",
        answer: "Get started now!",
        link: getRoute("SignUp"),
      }}
      title="Forgot password?"
    >
      <Form className="space-y-4" form={form} onSubmit={onSubmit}>
        <Input
          className="block"
          label="Email"
          name="email"
          placeholder="Enter your email"
          rules={{ required: true }}
        />
        <Button
          className="w-full"
          type="submit"
        >
          Send reset email
        </Button>
      </Form>
    </AuthLayout>
  );
}
