"use client";
import { Pencil, Plus, Trash, X } from "@phosphor-icons/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { GetAccountPortfolioDetailsQuery } from "@/__generated__/graphql";
import { Button } from "@/components/button";
import { Variants } from "@/components/constants";
import Form from "@/components/form";
import { Input } from "@/components/input";
import LinkWrapper from "@/components/link-wrapper";
import Modal from "@/components/modal";
import { useAuthMutation } from "@/lib/apollo-client";
import {
  ADD_PORTFOLIO,
  DELETE_PORTFOLIO,
  UPDATE_PORTFOLIO,
} from "@/lib/mutations";

import AccountCard from "./account-card";

type Portfolio = NonNullable<
  GetAccountPortfolioDetailsQuery["user"]
>["portfolio"][number];

export default function LinksSection({
  data,
}: {
  data?: GetAccountPortfolioDetailsQuery;
}) {
  const user = data?.user;
  const [isEditing, setIsEditing] = useState(false);
  const [portfolios, setPortfolios] = useState<Portfolio[]>(
    user?.portfolio.filter((item) => !item.imageURL) || [],
  );
  const [selectedPortfolio, setSelectedPortfolio] =
    useState<Portfolio | null>();
  const [updatePortfolio] = useAuthMutation(UPDATE_PORTFOLIO);
  const [addPortfolio, { loading }] = useAuthMutation(ADD_PORTFOLIO);
  const [deletePortfolio] = useAuthMutation(DELETE_PORTFOLIO);
  const form = useForm({
    defaultValues: {
      caption: "",
      link: "",
    },
  });
  if (!user) return null;

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };
  return (
    <AccountCard
      cta={
        <Button square borderless invert onClick={handleEditClick}>
          {isEditing ? <X /> : <Pencil />}
        </Button>
      }
      title="Links"
      subtitle="Your important links"
    >
      <div className="space-y-3">
        {portfolios.map((item) => (
          <div className="flex gap-1" key={item.id}>
            <LinkWrapper className="grow" href={item.link}>
              <Button
                className="w-full text-sm line-clamp-1"
                variant={Variants.ACCENT}
              >
                {item.caption}
              </Button>
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
          invert
          onClick={() => setSelectedPortfolio(null)}
          className="mx-auto text-sm flex items-center gap-2 mt-5 w-full"
        >
          Add link <Plus />
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
            if (selectedPortfolio) {
              setPortfolios((prev) =>
                prev.map((item) =>
                  item.id === selectedPortfolio?.id
                    ? {
                        ...item,
                        ...data,
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
                },
              });
              const portfolio = res.data?.addPortfolio;
              if (!portfolio) return;
              setPortfolios((prev) => [...prev, { ...data, id: portfolio.id }]);
            }
            setSelectedPortfolio(undefined);
            form.reset();
          }}
          form={form}
          className=" mt-2"
        >
          <div className="space-y-2">
            <Input name="caption" label="Caption" />
            <Input name="link" label="URL" />
          </div>
          <Button
            loading={loading}
            type="submit"
            className="w-full mt-4 text-sm"
          >
            Save Link
          </Button>
        </Form>
      </Modal>
    </AccountCard>
  );
}
