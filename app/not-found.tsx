import React from "react";

import { getRoute } from "@/constants/routes";

export default function NotFound() {
  return (
    <section className="mt-20">
      <div className="mx-auto max-w-(--breakpoint-xl) px-4 py-8 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-(--breakpoint-sm) text-center">
          <h2 className="mb-4 text-7xl font-extrabold tracking-tight text-primary lg:text-9xl">
            404
          </h2>
          <p className="mb-4 text-3xl font-semibold tracking-tight text-gray-600  md:text-4xl ">
            Something's missing.
          </p>
          <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
            Sorry, we can't find that page. You'll find lots to explore on the
            home page.{" "}
          </p>
          <a
            className="my-4 inline-flex rounded-lg px-5 py-2.5 text-center text-sm font-medium text-accent underline focus:outline-hidden focus:ring-4"
            href={getRoute("Home")}
          >
            Back to Homepage
          </a>
        </div>
      </div>
    </section>
  );
}
