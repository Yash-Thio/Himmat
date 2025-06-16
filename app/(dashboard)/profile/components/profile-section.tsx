"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { useUser } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import CopyText from "@/components/copy-link";
import Form from "@/components/form";
import { Input } from "@/components/input";
import UserImage from "@/components/user-image";
import {
  NAME_MAX_LENGTH,
  USERNAME_MAX_LENGTH,
} from "@/constants/constraints";
import { useAuthMutation, useAuthQuery } from "@/lib/apollo-client";
import { UPDATE_USER } from "@/lib/mutations";
import { IS_USERNAME_AVAILABLE } from "@/lib/queries";
import { getUsernameInputRules } from "@/lib/utils";
import { GetCurrentUserQuery } from "@/__generated__/graphql";

import AccountCard from "./account-card";

function ProfileForm({
  user,
  onCancel,
  setUser,
}: {
  user: NonNullable<GetCurrentUserQuery["user"]>;
  setUser: Dispatch<
    SetStateAction<NonNullable<GetCurrentUserQuery["user"]>>
  >;
  onCancel: () => void;
}) {
  const form = useForm({
    defaultValues: user,
  });

  const [updateUser, { loading }] = useAuthMutation(UPDATE_USER);
  const [isUsernameAvailable, { loading: loadingAvailability }] = useAuthQuery(
    IS_USERNAME_AVAILABLE,
  );
  const onSubmit = (data: typeof user) => {
    setUser((prev) => ({ ...prev, ...data }));
    onCancel();
    updateUser({
      updatedUser: {
        name: data.name,
        username: data.username !== user.username ? data.username : undefined,
      },
    });
  };

  return (
    <Form onSubmit={onSubmit} className="space-y-4" form={form}>
      <Input
        name="name"
        label="Full name"
        rules={{ required: true, maxLength: NAME_MAX_LENGTH }}
        maxLength={NAME_MAX_LENGTH}
      />
      <Input
        className="block"
        label="Username"
        name="username"
        onChange={() => {
          form.clearErrors("username");
        }}
        placeholder="Enter your desired username"
        rules={getUsernameInputRules(async (username: string) => {
          if (username === user.username) return true;
          const result = await isUsernameAvailable({ username });
          return Boolean(result.data?.isUsernameAvailable);
        })}
        maxLength={USERNAME_MAX_LENGTH}
      />
      <div className="flex gap-2 justify-end">
        <Button loading={loading || loadingAvailability} type="submit">
          Update
        </Button>
        <Button
          disabled={loading || loadingAvailability}
          type="button"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </Form>
  );
}
export default function ProfileSection({
  user: userData,
}: {
  user: NonNullable<GetCurrentUserQuery["user"]>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(userData);
  if (!user) return null;
  if (isEditing)
    return (
      <AccountCard>
        <ProfileForm
          setUser={setUser}
          user={user}
          onCancel={() => setIsEditing(false)}
        />
      </AccountCard>
    );
  return (
    <AccountCard>
      <div className="flex items-start gap-2">
        <UserImage size={96}/>
        <div>
          <h2 className="text-xl flex gap-x-2 gap-y-1 items-center flex-wrap">
            <span className="font-poppins">{user.name}</span>

            {user.username && (
              <CopyText
                text={user.username}
                toastMessage="Username copied!"
              />
            )}
          </h2>
          <div className="flex gap-2 items-stretch">
            <Button
              onClick={() => setIsEditing(true)}
              className="text-xs gap-1.5"
            >
              Edit Profile
            </Button>
          </div>
        </div>
      </div>
    </AccountCard>
  );
}
