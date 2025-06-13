import Image from "next/image";
import React from "react";

export default function Page() {
  return (
    <div
      className={
        "col-span-2 max-lg:hidden flex flex-col justify-center items-center"
      }
    >
      <Image
        alt="Quick Search"
        src="/chat.svg"
        height={500}
        width={500}
        className=""
      />
      <p className="mx-auto mt-4 sm:mt-6 max-w-2xl text-lg leading-8 text-gray-600">
        Open a chat to connect with potential collaborators.
      </p>
    </div>
  );
}
