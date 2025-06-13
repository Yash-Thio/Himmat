"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { buttonVariants } from "@/components/ui/button";
import useHandleAuthorized from "@/app/(public)/components/auth/handle-authorized";
import { Button } from "@/components/ui/button";
import Form from "@/components/form";
import { Input } from "@/components/input";
import { getRoute, Route } from "@/constants/routes";
import { EMAIL_REGEX } from "@/constants/validations";
import { useLoginWithEmail } from "@/lib/auth-client";

import AuthLayout from "../components/auth/auth-layout";

const defaultValues = {
  email: "",
  password: "",
  c_password: "",
  name: "",
};

const CONTAINER_ID = "captcha-container";

export default function LoginForm({
  data: paramsRedirectURL,
}: {
  data?: string;
}) {
  useHandleAuthorized();
  const form = useForm({ defaultValues });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const loginWithEmail = useLoginWithEmail();
  const redirectURL = paramsRedirectURL || Route.Home;
  const onSubmit: SubmitHandler<typeof defaultValues> = async (data) => {
    setIsLoading(true);
    const error = await loginWithEmail(
      data.email.toLowerCase(),
      data.password,
    );
    if (error === null) {
      setSuccess(true);
      router.push(redirectURL);
      router.refresh();
    } else {
      toast.error(error || "Invalid credentials");
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      bottomHeading={{
        question: "New here?",
        answer: "Get started on a new account!",
        link: getRoute("SignUp"),
      }}
      redirectURL={redirectURL}
      title="Login to your account"
    >
      <Form className="space-y-4" form={form} onSubmit={onSubmit}>
        <Input
          autoFocus
          label="Email address"
          className="block"
          name="email"
          placeholder="Your email"
          rules={{
            required: true,
            pattern: { value: EMAIL_REGEX, message: "Invalid email" },
          }}
        />

        <Input
          label="Password"
          className="block"
          name="password"
          placeholder="Password"
          rules={{ required: true }}
          type="password"
        />

        <div className="flex items-center justify-between">
          <div className="text-sm leading-6">
            <Link
              className="link-accent font-semibold"
              href={getRoute("Forgot")}
            >
              Forgot password?
            </Link>
          </div>
        </div>
        <div id={CONTAINER_ID} />

        <div>
          <Button
            className="w-full"
            loading={isLoading}
            success={success}
            type="submit"
          >
            Login
          </Button>
        </div>
      </Form>
    </AuthLayout>
  );
}
