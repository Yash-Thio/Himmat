"use client";
import { CircleNotch, Plus } from "@phosphor-icons/react";
import { Pencil, Trash, UploadSimple, X } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { GetAccountPortfolioDetailsQuery } from "@/__generated__/graphql";
import { Button } from "@/components/button";
import Form from "@/components/form";
import ImageUploader from "@/components/image-uploader";
import { Input } from "@/components/input";
import LinkWrapper from "@/components/link-wrapper";
import Modal from "@/components/modal";
import { useAuthMutation } from "@/lib/apollo-client";
import { useToken } from "@/lib/auth-client";
import {
  ADD_PORTFOLIO,
  DELETE_PORTFOLIO,
  UPDATE_PORTFOLIO,
} from "@/lib/mutations";
import { handleImageUpload, HandleImageUploadType } from "@/lib/utils";

import AccountCard from "./account-card";
type Portfolio = NonNullable<
  GetAccountPortfolioDetailsQuery["user"]
>["portfolio"][number];

export default function PortfolioSection({
  data,
}: {
  data?: GetAccountPortfolioDetailsQuery;
}) {
  const user = data?.user;
  const [isEditing, setIsEditing] = useState(false);
  const [creatingGIF, setCreatingGIF] = useState(false);
  const [portfolios, setPortfolios] = useState<Portfolio[]>(
    user?.portfolio.filter((item) => item.imageURL) || [],
  );
  const [selectedPortfolio, setSelectedPortfolio] =
    useState<Portfolio | null>();
  const [selectedImage, setSelectedImage] = useState<FormData>();
  const [selectedImageURL, setSelectedImageURL] = useState<string | null>();
  const token = useToken();
  const [updatePortfolio] = useAuthMutation(UPDATE_PORTFOLIO);
  const [addPortfolio, { loading }] = useAuthMutation(ADD_PORTFOLIO);
  const [deletePortfolio] = useAuthMutation(DELETE_PORTFOLIO);
  const form = useForm({
    defaultValues: {
      caption: "",
      link: "",
      imageURL: "",
    },
  });
  if (!user) return null;

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const hasInstaURL = form.watch("imageURL");

  return (
    <AccountCard
      cta={
        <Button square borderless invert onClick={handleEditClick}>
          {isEditing ? <X /> : <Pencil />}
        </Button>
      }
      title="Portfolio"
      subtitle="Your past works"
    >
      <div className="grid grid-cols-3 gap-y-5 gap-x-3 lg:grid-cols-6">
        {portfolios.map((item) => (
          <div className="flex flex-col gap-1" key={item.id}>
            <LinkWrapper className="grow" href={item.link}>
              <Image
                height={100}
                width={50}
                className="w-full h-full object-cover rounded-md"
                src={item.imageURL || ""}
                alt={item.caption || ""}
              />
            </LinkWrapper>
            {isEditing && (
              <div className="flex justify-center">
                <Button
                  onClick={() => {
                    setSelectedPortfolio(item);
                    form.setValue("caption", item.caption || "");
                    form.setValue("link", item.link || "");
                  }}
                  square
                  borderless
                  invert
                >
                  <Pencil size={16} />
                </Button>
                <Button
                  square
                  borderless
                  invert
                  onClick={() => {
                    deletePortfolio({ id: item.id });
                    setPortfolios((prev) =>
                      prev.filter((o) => o.id !== item.id),
                    );
                  }}
                >
                  <Trash color="red" size={16} />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
      {isEditing && (
        <Button
          onClick={() => setSelectedPortfolio(null)}
          className="mx-auto flex items-center gap-2 mt-3 text-sm w-full"
        >
          Add portfolio <Plus />
        </Button>
      )}
      <Modal
        open={selectedPortfolio !== undefined}
        title={`${selectedPortfolio ? "Edit" : "Add"} portfolio`}
        close={() => {
          setSelectedPortfolio(undefined);
          form.reset();
        }}
      >
        <Form
          onSubmit={async (data) => {
            let id = selectedPortfolio?.id;
            if (selectedPortfolio) {
              setPortfolios((prev) =>
                prev.map((item) =>
                  item.id === selectedPortfolio?.id
                    ? {
                        ...item,
                        ...data,
                        imageURL: selectedImageURL,
                      }
                    : item,
                ),
              );
              updatePortfolio({
                updatedPortfolio: {
                  id: selectedPortfolio.id,
                  caption: data.caption,
                  link: data.link || undefined,
                },
              });
            } else {
              const res = await addPortfolio({
                portfolio: {
                  caption: data.caption,
                  link: data.link || undefined,
                  imageURL: data.imageURL || undefined,
                },
              });
              const portfolio = res.data?.addPortfolio;
              if (portfolio) {
                setPortfolios((prev) => [
                  ...prev,
                  {
                    ...data,
                    id: portfolio.id,
                    imageURL: portfolio.imageURL,
                  },
                ]);
                id = portfolio.id;
              }
            }
            if (selectedImage && token && id) {
              selectedImage.append("id", id.toString());
              handleImageUpload(
                selectedImage,
                token,
                HandleImageUploadType.PORTFOLIO,
              );
            }
            setSelectedPortfolio(undefined);
            setIsEditing(false);
          }}
          form={form}
          className=" mt-2"
        >
          <div className="">
            {(!hasInstaURL || selectedPortfolio) && (
              <ImageUploader
                allowVideo
                onGifLoadStart={() => {
                  setSelectedImage(undefined);
                  setSelectedImageURL(undefined);
                  setCreatingGIF(true);
                }}
                className="rounded-lg overflow-hidden h-64 w-40 mx-auto block"
                defaultPhoto={selectedPortfolio?.imageURL}
                onChange={(val) => {
                  setCreatingGIF(false);
                  setSelectedImage(val);
                }}
                onNewURL={(url) => setSelectedImageURL(url)}
              >
                <div className="h-full w-full flex items-center justify-center text-gray-500 bg-gray-100">
                  {creatingGIF ? (
                    <CircleNotch
                      className="animate-spin"
                      size={32}
                      weight="thin"
                    />
                  ) : (
                    <UploadSimple weight="thin" size={32} />
                  )}
                </div>
              </ImageUploader>
            )}
            <div className="space-y-2 col-span-2 mt-4">
              {selectedImage || selectedPortfolio ? (
                <Input name="link" label="Custom link (optional)" />
              ) : (
                <Input
                  disabled={creatingGIF}
                  name="imageURL"
                  label="Instagram post link"
                />
              )}
              <Input name="caption" label="Caption" />
            </div>
          </div>
          <Button
            loading={loading}
            type="submit"
            className="w-full mt-4 text-sm"
          >
            Save Portfolio
          </Button>
        </Form>
      </Modal>
    </AccountCard>
  );
}
