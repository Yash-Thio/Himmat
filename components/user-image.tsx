import { User } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import React from "react";

import { cn } from "@/lib/utils";

interface UserImageProps {
  photo?: string | null;
  alt?: string;
  size?: number;
  className?: string;
}

export default function UserImage({
  photo,
  alt = "User",
  size = 32,
  className,
}: UserImageProps) {
  if (!photo) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-full border border-gray-400",
          className,
        )}
        style={{ width: size, height: size }}
      >
        <User weight="thin" size={size * 0.5} />
      </div>
    );
  }

  return (
    <Image
      src={photo}
      alt={alt}
      width={size}
      height={size}
      className={cn("rounded-full object-cover", className)}
      style={{ width: size, height: size }}
    />
  );
}
