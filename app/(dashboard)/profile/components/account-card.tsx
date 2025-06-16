import React, { PropsWithChildren, ReactNode } from "react";

import { cn } from "@/lib/utils";

export default function AccountCard({
  children,
  className,
  title,
  subtitle,
  cta,
}: PropsWithChildren<{
  className?: string;
  title?: ReactNode;
  subtitle?: string;
  cta?: ReactNode;
}>) {
  return (
    <section
      className={cn(
        "shadow-md rounded-xl mb-5 p-5 border bg-card",
        className,
      )}
    >
      <div className="flex justify-between items-start">
        <div>
          {title && (
            <h2 className="text-xl font-medium">{title}</h2>
          )}
          {subtitle && <p className="text-sm mb-4">{subtitle}</p>}
        </div>
        {cta && cta}
      </div>
      {children}
    </section>
  );
}
