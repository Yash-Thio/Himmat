import React, { useState } from "react";

import { cn } from "@/lib/utils";

import { CHAR_LIMIT } from "../../constants";

interface ChatBubbleProps {
  body: string;
  isCurrentUser: boolean;
  loading?: boolean;
  failed?: boolean;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  body,
  isCurrentUser,
  loading,
  failed,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLongMessage = body.length > CHAR_LIMIT;

  const displayText =
    isLongMessage && !isExpanded
      ? body.substring(0, CHAR_LIMIT) + " ..."
      : body;

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div>
      <div
        className={cn(
          "max-w-sm text-justify rounded-3xl px-4 py-2",
          isCurrentUser ? "bg-accent text-white" : "bg-gray-100 text-gray-700",
        )}
      >
        {displayText}
        {isLongMessage && (
          <button
            onClick={toggleExpand}
            className={cn(
              "block mt-1 underline font-semibold",
              isCurrentUser ? "text-white/80" : "text-gray-500",
            )}
          >
            {isExpanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>
      <div
        className={cn(
          "text-xs mt-0.5",
          isCurrentUser ? "text-end pr-1" : "pl-1",
          failed ? "text-red-400" : "text-gray-500",
        )}
      >
        {loading ? "Sending" : null} {failed ? "Unable to send" : null}
      </div>
    </div>
  );
};
