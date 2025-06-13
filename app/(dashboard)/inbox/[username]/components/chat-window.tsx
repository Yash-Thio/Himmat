"use client";
import {
  getConversationChannelName,
  NEW_MESSAGE,
} from "@backend/(rest)/pusher/utils";
import { PaperPlaneTilt } from "@phosphor-icons/react";
import Pusher from "pusher-js";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import type { GetChatQuery } from "@/__generated__/graphql";
import { Input } from "@/components/input";
import { useAuthMutation } from "@/lib/apollo-client";
import { useToken, useUser } from "@/lib/auth-client";
import { READ_MESSAGE, SEND_CHAT } from "@/lib/mutations";

import { ChatBubble } from "./chat-bubble";

interface FormValues {
  text: string;
}

export default function ChatWindow({
  chat,
}: {
  chat: NonNullable<GetChatQuery["chat"]>;
}) {
  const [user] = useUser();
  const token = useToken();
  const { register, handleSubmit, resetField } = useForm<FormValues>();
  const [sendMessage] = useAuthMutation(SEND_CHAT);
  const [readMessage] = useAuthMutation(READ_MESSAGE);
  const [messages, setMessages] = useState<
    (NonNullable<GetChatQuery["chat"]>["messages"][number] & {
      loading?: boolean;
      failed?: boolean;
    })[]
  >(chat.messages.slice().reverse());

  function onSubmit(data: FormValues) {
    if (!user || !data.text) return;
    const index = messages.length;
    resetField("text");
    setMessages((old) => [
      ...old,
      {
        body: data.text,
        createdAt: new Date().getTime(),
        by: user.id,
        loading: true,
      },
    ]);
    if (chat.user?.id)
      sendMessage({
        body: data.text,
        userID: chat.user.id,
      })
        .then((result) => {
          if (!result.data?.sendMessage) {
            setMessages((old) => {
              if (old[index]) old[index].failed = true;
              return [...old];
            });
          }
          setMessages((old) => {
            if (old[index]) old[index].loading = false;
            return [...old];
          });
        })
        .catch(() => {
          setMessages((old) => {
            if (old[index]) old[index].failed = true;
            return [...old];
          });
        });
  }

  useEffect(() => {
    if (chat?.id && user) {
      readMessage({
        conversationID: chat.id,
      });
    }
  }, [chat.id, user]);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY || "", {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "",
      channelAuthorization: {
        endpoint: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/pusher`,
        transport: "ajax",
        headers: { Authorization: `Bearer ${token}` },
      },
    });

    pusher.subscribe(getConversationChannelName(chat.id));
    pusher.bind(
      NEW_MESSAGE,
      (message: NonNullable<GetChatQuery["chat"]>["messages"][number]) => {
        if (!user) return;
        if (message.by !== user.id) {
          void readMessage({
            conversationID: chat.id,
          });
          setMessages((old) => [
            ...old,
            {
              body: message.body,
              by: message.by,
              createdAt: message.createdAt,
            },
          ]);
        }
      },
    );
    return () => {
      pusher.unbind();
      pusher.unsubscribe(getConversationChannelName(chat.id));
    };
  }, [chat.id, readMessage, token, user]);

  return (
    <div className="h-full flex flex-col">
      <div className="grow space-y-2 overflow-y-auto no-scrollbar p-4">
        {user &&
          messages.map((msg, index) => (
            <div
              className={`flex ${msg.by === user?.id ? "justify-end max-sm:pl-14" : "justify-start max-sm:pr-14"}`}
              key={index}
            >
              <ChatBubble
                body={msg.body}
                isCurrentUser={msg.by === user?.id}
                loading={msg.loading}
                failed={msg.failed}
              />
            </div>
          ))}
      </div>
      <form
        className="flex pb-4 px-4 relative w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="relative w-full">
          <Input
            placeholder={"Message..."}
            {...register("text", { required: true })}
            className={"rounded-full w-full pr-12"}
          />
          <button
            type="submit"
            className={"absolute right-3 top-1/2 transform -translate-y-1/2"}
          >
            <PaperPlaneTilt className={"text-gray-600"} size={22} />
          </button>
        </div>
      </form>
    </div>
  );
}
