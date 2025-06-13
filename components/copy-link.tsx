"use client";

import { Check, LinkSimple } from "@phosphor-icons/react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CopyText({
  text,
  toastMessage,
}: {
  text: string;
  toastMessage?: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <div
      onClick={() => {
        navigator.clipboard.writeText(text);
        if (toastMessage) toast.success(toastMessage);
        setCopied(true);
        setTimeout(() => setCopied(false), 4000);
      }}
      className="cursor-pointer"
    >
      {copied ? <Check size={18} /> : <LinkSimple size={18} weight="light" />}
    </div>
  );
}
