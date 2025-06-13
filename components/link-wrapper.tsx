import Link from "next/link";
import type { PropsWithChildren } from "react";
import React from "react";

export default function LinkWrapper({
  href,
  external,
  className,
  children,
}: PropsWithChildren<{
  href?: string | null;
  external?: boolean;
  className?: string;
}>) {
  if (!href) return children;
  if (
    external ||
    (!href.startsWith(process.env.NEXT_PUBLIC_BASE_URL || "/") &&
      !href.startsWith("/"))
  )
    return (
      <a className={className} href={href} rel="noopener" target="_blank">
        {children}
      </a>
    );
  return (
    <Link className={className} href={href}>
      {children}
    </Link>
  );
}
