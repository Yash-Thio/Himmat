"use client";
import {
  Calendar,
  CaretLeft,
  CaretRight,
  FlagCheckered,
  Link as LinkIcon,
  MapPin,
  MoneyWavy,
  PencilSimple,
  ShareNetwork,
} from "@phosphor-icons/react";
import { Spinner } from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import type {
  GetDefaultOnboardingDetailsQuery,
} from "@/__generated__/graphql";
import { getRoute } from "@/constants/routes";
import { useUser } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

import OnboardingBasicDetailsForm from "./onboarding-basic-details-form";
import OnboardingUsername from "./onboarding-username";
import OnboardingTrustedDetailsForm from "./onboarding-trusted-details-form";
import OnboardingStepper from "./stepper";

export function getStep(
  currentUser: GetDefaultOnboardingDetailsQuery["getCurrentUser"],
  trusties?: GetDefaultOnboardingDetailsQuery["trusties"],
) {
  if (!currentUser) return 0;
  if (!currentUser.phone || !currentUser.name || !currentUser.dob) {
    return 0;
  }
  if (!currentUser.username) {
    return 1;
  }
  if (!trusties || trusties.length === 0) {
    return 2;
  }
  return -1;
}

function OnboardingWizard({
  data,
  loading: dataLoading,
}: {
  data?: {
    user: GetDefaultOnboardingDetailsQuery["getCurrentUser"];
    redirectURL: string | null;
    trusties: GetDefaultOnboardingDetailsQuery["trusties"];
  };
  loading?: boolean;
}) {
  const currentUser = data?.user;
  const redirectURL = data?.redirectURL;
  const trusties = data?.trusties;
  const router = useRouter();
  const [step, setStep] = useState(getStep(currentUser, trusties));
  const [maxTouchedStep, setMaxTouchedStep] = useState(getStep(currentUser, trusties));
  const nextStep = useCallback(() => {
    setStep((o) => Math.min(o + 1, MAX_STEPS - 1));
    setMaxTouchedStep((o) => Math.max(o, step + 1));
  }, [step]);

  const fallbackToStep = useCallback(
    (fallbackStep: number) => {
      setStep(fallbackStep);
      setMaxTouchedStep(fallbackStep);
      router.refresh();
    },
    [router],
  );

  const steps = useMemo(
    () => [
      {
        title: "Basic details",
        heading: "Let's know you better",
        description: "Information about you",
        longDescription:
          "Provide information about you so we can help you be found!",
        icon: PencilSimple,
        key: 0,
        component: currentUser ? (
          <OnboardingBasicDetailsForm
            defaultValues={{
              name: currentUser.name || "",
              dob: currentUser?.dob || undefined,
            }}
            fallbackToStep={() => {
              fallbackToStep(2);
            }}
            nextStep={nextStep}
            key={1}
          />
        ) : null,
      },
      {
        title: "Username",
        heading: "Username Setup",
        description: "Username Setup",
        longDescription:
          "Your username should be between 4 and 16 characters long and can include letters (a-z), numbers (0-9), and hyphens (-). Choose something unique and easy to remember.",
        icon: LinkIcon,
        key: 1,
        component: (
          <OnboardingUsername
            defaultValues={{
              username: currentUser?.username || "",
            }}
            redirectURL={redirectURL}
            key={1}
          />
        ),
      },
      {
        title: "Trusties",
        heading: "Close Ones",
        description: "Add your close ones",
        longDescription:
          "Add Details of people you want to notify in case of an emergency.",
        icon: ShareNetwork,
        key: 2,
        component:(
          <OnboardingTrustedDetailsForm
            defaultValues={{
              trusties: trusties || [],
            }}
            nextStep={nextStep}
            fallbackToStep={() => {
              fallbackToStep(1);
            }}
            key={2}
          />
        )
      }
    ],
    [
      currentUser,
      nextStep,
      redirectURL,
    ],
  );

  useEffect(() => {
    if (!currentUser && !dataLoading) {
      router.replace(getRoute("SignUp"));
    }
  }, [currentUser, dataLoading, redirectURL, router]);

  useEffect(() => {
    if (step === -1) {
      router.push(getRoute("Profile"));
    }
  }, [step, router]);
  const routeLoading = !currentUser && !dataLoading;
  const MAX_STEPS = steps.length;

  function prevStep() {
    setStep((o) => Math.max(o - 1, 0));
  }

  const allowForward = step < maxTouchedStep;
  const currentStep = steps[step];
  const loading = dataLoading || routeLoading;

  return (
    <>
      <div className="w-full max-w-lg rounded-xl sm:p-5 sm:shadow-elevation-1">
        {!loading && (
          <div className="h-full">
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                {step > 0 ? (
                  <>
                    <button onClick={prevStep} type="button">
                      <CaretLeft />
                    </button>
                    ({step}/{MAX_STEPS - 1}) {currentStep?.title}
                  </>
                ) : null}
              </div>
              {allowForward ? (
                <button onClick={nextStep} type="button">
                  <CaretRight />
                </button>
              ) : null}
            </div>
            {steps.map((stepValue, i) => (
              <div
                className={cn("h-full sm:px-6 ", i !== step && "hidden")}
                key={stepValue.key || stepValue.heading}
              >
                {stepValue.heading && (
                  <h2 className="mb-1 mt-6 text-center text-3xl font-semibold sm:mt-14">
                    {stepValue.heading}
                  </h2>
                )}
                {stepValue.longDescription && (
                  <p className="mb-5 text-center text-gray-400 sm:mb-10">
                    {stepValue.longDescription}
                  </p>
                )}
                {stepValue.component}
              </div>
            ))}
          </div>
        )}
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Spinner className="animate-spin fill-primary " size={60} />
          </div>
        ) : null}
      </div>
      <div className="flex grow items-center justify-center px-4 max-sm:hidden">
        <OnboardingStepper currentStep={step - 1} steps={steps.slice(1)} />
      </div>
    </>
  );
}

export default OnboardingWizard;
