"use client";
import { User } from "@phosphor-icons/react";
import { ArrowSquareOut, Dot, SealCheck } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
  GetAccountProfileDetailsQuery,
  GetAccountSocialDetailsQuery,
  Roles,
} from "@/__generated__/graphql";
import { Button } from "@/components/button";
import CopyText from "@/components/copy-link";
import Form from "@/components/form";
import ImageUploader from "@/components/image-uploader";
import { Input } from "@/components/input";
import UserImage from "@/components/user-image";
import categories from "@/constants/categories";
import {
  BIO_MAX_LENGTH,
  NAME_MAX_LENGTH,
  USERNAME_MAX_LENGTH,
} from "@/constants/constraints";
import countries from "@/constants/countries";
import genders from "@/constants/genders";
import { getMeURL, getRoute } from "@/constants/routes";
import { useAuthMutation, useAuthQuery } from "@/lib/apollo-client";
import { UPDATE_USER, UPDATE_USER_LOCATION } from "@/lib/mutations";
import { GET_CITIES, IS_USERNAME_AVAILABLE } from "@/lib/queries";
import { getUsernameInputRules } from "@/lib/utils";

import AccountCard from "./account-card";

function ProfileForm({
  user,
  onCancel,
  setUser,
}: {
  user: NonNullable<GetAccountProfileDetailsQuery["user"]>;
  setUser: Dispatch<
    SetStateAction<NonNullable<GetAccountProfileDetailsQuery["user"]>>
  >;
  onCancel: () => void;
}) {
  const isCreator = user.role === Roles.Creator;
  const form = useForm({
    defaultValues: user,
  });

  const [updateLocation] = useAuthMutation(UPDATE_USER_LOCATION);
  const [fetchCities, { data: citiesData }] = useAuthQuery(GET_CITIES);
  const [updateUser, { loading }] = useAuthMutation(UPDATE_USER);
  const [isUsernameAvailable, { loading: loadingAvailability }] = useAuthQuery(
    IS_USERNAME_AVAILABLE,
  );
  useEffect(() => {
    if (user.locationID?.country) {
      void fetchCities({
        countryID: user.locationID.country,
      });
    }
  }, [user.locationID?.country]);
  useEffect(() => {
    const sub = form.watch((_, { name }) => {
      if (name === "locationID.country") {
        const countryID = form.getValues("locationID.country");
        if (countryID) {
          void fetchCities({
            countryID,
          });
          form.setValue("locationID.city", null);
        }
      }
    });
    return sub.unsubscribe;
  }, [form.watch, fetchCities, form]);
  const onSubmit = (data: typeof user) => {
    setUser((prev) => ({ ...prev, ...data }));
    onCancel();
    updateUser({
      updatedUser: {
        name: data.name,
        bio: data.bio,
        gender: data.gender,
        category: data.category,
        username: data.username !== user.username ? data.username : undefined,
      },
    });
    if (
      data.locationID?.city !== user.locationID?.city &&
      data.locationID?.country &&
      data.locationID?.city
    ) {
      updateLocation({
        updatedLocation: {
          city: data.locationID?.city,
          country: data.locationID?.country,
        },
      });
      const country = countries.find(
        (c) => c.value === data.locationID?.country,
      );
      const city = citiesData?.cities.find(
        (c) => c.value === data.locationID?.city,
      );
      setUser((prev) => ({
        ...prev,
        location: {
          city: city?.label,
          country: country?.label,
        },
      }));
    }
  };

  return (
    <Form onSubmit={onSubmit} className="space-y-4" form={form}>
      <ImageUploader
        className="rounded-full flex items-center justify-center size-28 overflow-hidden mx-auto border border-gray-400"
        defaultPhoto={user.photo}
        onNewURL={(url) => {
          setUser({ ...user, photo: url });
          form.setValue("photo", url);
        }}
      >
        <User weight="thin" size={56} />
      </ImageUploader>
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
        suffix=".sociocube.me"
        maxLength={USERNAME_MAX_LENGTH}
      />

      <Input
        name="bio"
        label="About you"
        rows={4}
        textarea
        maxLength={BIO_MAX_LENGTH}
        rules={{
          maxLength: BIO_MAX_LENGTH,
        }}
      />
      {isCreator && (
        <Input
          className="block"
          label="Gender"
          name="gender"
          options={genders.map((gender) => ({
            label: gender,
            value: gender,
          }))}
          placeholder="Select your gender"
          rules={{ required: true }}
        />
      )}
      <Input
        label="Category"
        name="category"
        options={categories.map(({ title }) => ({
          label: title,
          value: title,
        }))}
        rules={{ required: isCreator }}
      />
      <Input
        className="block"
        label="Location"
        name="locationID.country"
        options={countries || []}
        placeholder="Select your country"
        rules={{ required: true }}
      />
      <Input
        className="block"
        name="locationID.city"
        options={citiesData?.cities || []}
        placeholder="Select your city"
        rules={{ required: true }}
      />
      <div className="flex gap-2 justify-end">
        <Button loading={loading || loadingAvailability} type="submit">
          Update
        </Button>
        <Button
          disabled={loading || loadingAvailability}
          type="button"
          invert
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </Form>
  );
}
export default function ProfileSection({
  data,
  user: userData,
}: {
  data?: GetAccountSocialDetailsQuery;
  user: NonNullable<GetAccountProfileDetailsQuery["user"]>;
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
        <UserImage size={96} photo={user.photo} />
        <div>
          <h2 className="text-xl flex gap-x-2 gap-y-1 items-center flex-wrap">
            <span className="font-poppins">{user.name}</span>
            {user.role === Roles.Creator ? (
              data?.user?.instagramStats?.isVerified && (
                <SealCheck weight="fill" className="text-primary" />
              )
            ) : (
              <span
                className={`text-xs text-white px-1.5 py-0.5 rounded-full bg-accent`}
              >
                {user.role}
              </span>
            )}

            {user.username && (
              <CopyText
                text={getMeURL(user.username, true)}
                toastMessage="Profile link copied!"
              />
            )}
          </h2>

          <p className="flex mb-2 mt-1 text-sm items-center text-gray-500 pl-px">
            {user.category} {user.category && <Dot />} {user.location?.city}
          </p>
          <div className="flex gap-2 items-stretch">
            <Button
              onClick={() => setIsEditing(true)}
              invert
              className="text-xs gap-1.5"
            >
              Edit Profile
            </Button>
            {user.username && (
              <Link href={getRoute("Profile") + "/" + user.username}>
                <Button borderless invert square className="h-full gap-1">
                  <ArrowSquareOut size={18} />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-3">{user.bio}</p>
    </AccountCard>
  );
}
