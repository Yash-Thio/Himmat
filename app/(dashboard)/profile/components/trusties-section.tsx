"use client";
import { Plus, Trash, Users, ChatCircleDotsIcon } from "@phosphor-icons/react";
import React, { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useFieldArray, useForm } from "react-hook-form";

import type { GetUserTrustiesQuery } from "@/__generated__/graphql";
import Form from "@/components/form";
import { Input } from "@/components/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getRoute } from "@/constants/routes";
import {
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from "@/constants/constraints";
import { useAuthMutation, useAuthQuery } from "@/lib/apollo-client";
import { useUser } from "@/lib/auth-client";
import { UPDATE_USER } from "@/lib/mutations";
import { IS_USERNAME_AVAILABLE } from "@/lib/queries";
import { getUsernameInputRules } from "@/lib/utils";

import AccountCard from "./account-card";

interface TrustedContactInput {
  username: string;
}

interface FormFields {
  trusties: TrustedContactInput[];
}

interface TrustiesSectionProps {
  data?: GetUserTrustiesQuery;
  loading: boolean;
}

export default function TrustiesSection({
  data,
  loading,
}: TrustiesSectionProps) {
  const [user] = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [updateUser, { loading: updateLoading }] = useAuthMutation(UPDATE_USER);
  const [isUsernameAvailable, { loading: loadingAvailability }] = useAuthQuery(
    IS_USERNAME_AVAILABLE
  );
  const trusties = data?.trusties || [];

  const form = useForm<FormFields>({
    defaultValues: {
      trusties:
        trusties.length > 0
          ? trusties.map((t) => ({ username: t.username }))
          : [{ username: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "trusties",
  });

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    const validTrusties = data.trusties.filter((trusty) =>
      trusty.username.trim()
    );

    updateUser({
      updatedUser: {
        trusties: validTrusties,
      },
    });

    window.location.reload();
  };

  const addTrustedContact = () => {
    if (fields.length < 5) {
      append({ username: "" });
    }
  };

  const removeTrustedContact = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    } else {
      form.setValue(`trusties.${index}.username`, "");
    }
  };

  const startEditing = () => {
    form.reset({
      trusties:
        trusties.length > 0
          ? trusties.map((t) => ({ username: t.username }))
          : [{ username: "" }],
    });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    form.reset();
  };

  if (loading) {
    return (
      <AccountCard
        title="Emergency Contacts"
        subtitle="People who can help you in emergencies (up to 5)"
      >
        <div className="space-y-4">
          <div className="animate-pulse">
            <div className="h-4 bg-background rounded w-1/4 mb-2"></div>
            <div className="space-y-2">
              <div className="h-16 bg-background rounded"></div>
              <div className="h-16 bg-background rounded"></div>
            </div>
          </div>
        </div>
      </AccountCard>
    );
  }

  if (!user) return null;

  return (
    <AccountCard
      title="Emergency Contacts"
      subtitle="People who can help you in emergencies (up to 5)"
    >
      {!isEditing ? (
        // Display Mode
        <div className="space-y-4">
          {trusties.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users size={48} className="mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium mb-1">
                No emergency contacts added
              </p>
              <p className="text-sm">
                Add trusted people who can help you in emergencies
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {trusties.map((trusty, index) => (
                <div
                  key={trusty.username || index}
                  className="flex items-center justify-between p-3 bg-background rounded-lg border"
                >
                  <div className="flex-1">
                    <div className="font-medium">
                      {trusty.name || "Unknown Name"}
                    </div>
                    <div className="text-sm ">@{trusty.username}</div>
                    {trusty.email && (
                      <div className="text-sm">{trusty.email}</div>
                    )}
                  </div>
                  <Link
                    href={`${getRoute("Inbox")}/${trusty.username}`}
                  >
                  <Button variant="secondary" className="mt-4">
                    <ChatCircleDotsIcon size={18} />
                    <span>Chat</span>
                  </Button>
                  </Link>
                </div>
              ))}
              <div className="text-xs text-gray-400 mt-2">
                {trusties.length}/5 emergency contacts
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button onClick={startEditing} variant="outline" className="flex-1">
              <Plus size={16} className="mr-2" />
              {trusties.length === 0
                ? "Add Emergency Contacts"
                : "Manage Contacts"}
            </Button>
          </div>
        </div>
      ) : (
        <Form form={form} onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex items-end gap-2 p-3 border border-gray-200 rounded-lg"
              >
                <div className="flex-1">
                  <Input
                    className="block"
                    label="Username"
                    name={`trusties.${index}.username`}
                    onChange={() => {
                      form.clearErrors();
                    }}
                    placeholder="Enter username"
                    rules={getUsernameInputRules(async (username: string) => {
                      const result = await isUsernameAvailable({ username });
                      return (
                        !Boolean(result.data?.isUsernameAvailable) &&
                        user?.username !== username
                      );
                    })}
                    maxLength={USERNAME_MAX_LENGTH}
                    minLength={USERNAME_MIN_LENGTH}
                  />
                </div>

                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeTrustedContact(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 mb-1"
                  >
                    <Trash size={16} />
                  </Button>
                )}
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
              Add Another Contact ({fields.length}/5)
            </Button>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={cancelEditing}
              className="flex-1"
              disabled={updateLoading}
            >
              Cancel
            </Button>
            <Button
              variant="secondary"
              type="submit"
              className="flex-1"
              loading={updateLoading}
            >
              Save Changes
            </Button>
          </div>
        </Form>
      )}
    </AccountCard>
  );
}
