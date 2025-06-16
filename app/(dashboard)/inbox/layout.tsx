import { cookies } from "next/headers";
import React, { PropsWithChildren } from "react";

import DashboardWrapper from "@/app/(dashboard)/components/dashboard-wrapper";
import ChatList from "@/app/(dashboard)/inbox/chat-list";
import { Route } from "@/constants/routes";
import { queryGQL } from "@/lib/apollo-server";
import { GET_CHATS } from "@/lib/queries";

export default async function AllChatPage({ children }: PropsWithChildren) {
  const { chats } = await queryGQL(GET_CHATS, {}, await cookies(), 0);
  return (
    <DashboardWrapper
      noPadding
      noTopNav
      collapse
      title={"Messages"}
      activeKey={Route.Inbox}
    >
      <div
        className={
          "grid grid-cols-1 lg:grid-cols-3 min-h-full h-full border-t border-gray-800 overflow-hidden"
        }
      >
        <ChatList chats={chats} />
        {children}
      </div>
    </DashboardWrapper>
  );
}
