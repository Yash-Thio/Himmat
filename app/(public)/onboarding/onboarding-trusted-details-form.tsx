"use client";
import { UserCircle, Trash, Plus } from "@phosphor-icons/react";
import { GraphQLError } from "graphql/error";
import type { SubmitHandler } from "react-hook-form";
import { useFieldArray, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import Form from "@/components/form";
import { Input } from "@/components/input";
import { NAME_MAX_LENGTH } from "@/constants/constraints";
import { handleGQLErrors, useAuthMutation } from "@/lib/apollo-client";
import { useUser } from "@/lib/auth-client";
import { UPDATE_USER } from "@/lib/mutations";

interface TrustedContact {
  name: string;
  email: string;
}

interface FormFields {
  trusties: TrustedContact[];
}

export default function OnboardingTrustedDetailsForm({
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
      trusties:
        defaultValues.trusties.length > 0
          ? defaultValues.trusties
          : [{ name: "", email: "" }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "trusties",
  });
  const [updateTrustedDetails, { loading }] = useAuthMutation(UPDATE_USER);
  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const validTrusties = data.trusties.filter(
      (trusty) => trusty.name.trim() && trusty.email.trim()
    );

    if (validTrusties.length === 0) {
      form.setError("root", {
        message: "Please add at least one trusted contact",
      });
      return;
    }
    nextStep();
    updateTrustedDetails({
      updatedUser: {
        trusties: validTrusties,
      },
    }).catch((e) => {
      fallbackToStep();
      handleGQLErrors(e as GraphQLError);
    });
  };
  const addTrustedContact = () => {
    if (fields.length < 5) {
      append({ name: "", email: "" });
    }
  };

  const removeTrustedContact = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };
  return (
    <Form className="space-y-6" form={form} onSubmit={onSubmit}>
      <div className="text-center mb-6">
        <UserCircle size={40} className="mx-auto mb-2" />
        <h2 className="text-xl font-semibold">Add Trusted Contacts</h2>
        <p className="text-sm text-gray-600 mt-1">
          Add up to 5 people you trust. They'll be able to help in emergencies.
        </p>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="border border-gray-200 rounded-lg p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm">
                Trusted Contact {index + 1}
              </h3>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTrustedContact(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash size={16} />
                </Button>
              )}
            </div>

            <Input
              label="Full Name"
              name={`trusties.${index}.name`}
              placeholder="Enter full name"
              rules={{
                required: "Name is required",
                maxLength: {
                  value: NAME_MAX_LENGTH,
                  message: `Name cannot exceed ${NAME_MAX_LENGTH} characters`,
                },
              }}
              maxLength={NAME_MAX_LENGTH}
            />

            <Input
              label="Email Address"
              name={`trusties.${index}.email`}
              placeholder="Enter email address"
              type="email"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Please enter a valid email address",
                },
              }}
            />
          </div>
        ))}
      </div>

      {fields.length < 5 && (
        <Button
          type="button"
          variant="outline"
          onClick={addTrustedContact}
          className="w-full border-dashed border-2 py-3"
        >
          <Plus size={16} className="mr-2" />
          Add Another Trusted Contact ({fields.length}/5)
        </Button>
      )}

      {form.formState.errors.root && (
        <p className="text-red-500 text-sm text-center">
          {form.formState.errors.root.message}
        </p>
      )}

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={fallbackToStep}
          className="flex-1"
        >
          Back
        </Button>
        <Button className="flex-1" loading={loading} type="submit">
          Complete Setup
        </Button>
      </div>
    </Form>
  );
}
