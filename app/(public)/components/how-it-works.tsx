import Image from "next/image";
import React from "react";

import SectionWrapper from "./section-wrapper";

const timeline = [
  {
    name: "Create Your Free Account",
    image: "/how-it-works-1.svg",
    description:
      "Sign up in seconds — no approvals or credit card information required.",
  },
  {
    name: "Get On Board ",
    image: "/how-it-works-2.svg",
    description:
      "Seamlesly add details of your emergency contacts.",
  },
  {
    name: "Search Your Destination",
    image: "/how-it-works-3.svg",
    description:
      "Search for your destination and find the safest routes possible.",
  },
  {
    name: "Travel Safe.",
    image: "/how-it-works-4.svg",
    description:
      "Travel safely knowing your trusted contacts are just a tap away.",
  },
];
export default function HowItWorks() {
  return (
    <SectionWrapper
      description="Himmat makes it effortless for users to connect with help during emergencies and find the safest route possible."
      id="how-it-works"
      prefixTitle="Safety is not a choice — it&apos;s a route."
      title="How Himmat Works"
    >
      <ol className="mx-auto grid max-w-2xl grid-cols-1 gap-8 overflow-hidden lg:mx-0 lg:max-w-none lg:grid-cols-4">
        {timeline.map((item, i) => (
          <li key={item.name}>
            <Image
              alt={item.name}
              className="mb-10 h-28"
              height={200}
              src={item.image}
              width={200}
            />
            <p className="flex items-center text-sm font-semibold leading-6 text-secondary-foreground">
              <svg
                aria-hidden="true"
                className="mr-4 size-1 flex-none"
                viewBox="0 0 4 4"
              >
                <circle cx={2} cy={2} fill="currentColor" r={2} />
              </svg>
              Step {i + 1}
              <div
                aria-hidden="true"
                className="absolute -ml-2 h-px w-screen -translate-x-full bg-secondary-foreground sm:-ml-4 lg:static lg:-mr-6 lg:ml-8 lg:w-auto lg:flex-auto lg:translate-x-0"
              />
            </p>
            <h3 className="mt-6 font-poppins text-lg font-semibold leading-8">
              {item.name}
            </h3>
            <p className="mt-1 text-base leading-7 text-gray-400">
              {item.description}
            </p>
          </li>
        ))}
      </ol>
    </SectionWrapper>
  );
}
