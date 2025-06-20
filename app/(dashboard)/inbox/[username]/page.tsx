import { CaretLeft } from "@phosphor-icons/react/dist/ssr";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

import UserImage from "@/components/user-image";
import { getRoute } from "@/constants/routes";
import { queryGQL } from "@/lib/apollo-server";
import { GET_CHAT } from "@/lib/queries";

import ChatWindow from "./components/chat-window";

interface ChatPage {
  params: Promise<{ username: string }>;
}
export default async function Page({ params }: ChatPage) {
  const { chat } = await queryGQL(
    GET_CHAT,
    {
      username: (await params).username,
    },
    await cookies(),
    0,
  );
  if (!chat) return notFound();
  // const photo = chat.user?.photo;
  const name = chat.user?.name;
  return (
    <div
      className={
        "lg:col-span-2 max-lg:h-[calc(100svh-55px)] h-screen flex flex-col overflow-hidden"
      }
    >
      <div className="flex gap-3 items-center py-3 px-3 lg:px-6 border-b border-gray-800 flex-shrink-0">
        <Link className={"lg:hidden"} href={getRoute("Inbox")}>
          <CaretLeft size={26} />
        </Link>

        <UserImage
          className={"lg:hidden"}
          size={40}
          // photo={photo}
          alt={name || ""}
        />
        <UserImage
          className={"max-lg:hidden"}
          size={48}
          // photo={photo}
          alt={name || ""}
        />
        <h2 className={"font-semibold text-lg"}>{name}</h2>
      </div>
      <div className="flex-grow overflow-hidden">
        <ChatWindow chat={chat} />
      </div>
    </div>
  );
}
