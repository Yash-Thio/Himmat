import { cn } from "@/lib/utils";

export const getBaseClassName = (
  isSuffixed: boolean,
  isPrefixed: boolean,
  isCheckbox: boolean,
) =>
  cn(
    `focus:ring-accent m-px accent-accent block py-2.5 px-4 shadow-xs ring-gray-700 placeholder:text-gray-400 outline-0 text-base sm:leading-6`,
    {
      "w-full focus:ring-2 ring-1": !isCheckbox,
    },
    {
      "rounded-l-xl": !isPrefixed,
      "rounded-r-xl": !isSuffixed,
    },
  );

export const getInputErrorMessages = (type?: string) => {
  if (!type) return undefined;
  switch (type) {
    case "required":
      return "This field is required";
    case "passwordMatch":
      return "Password don't match";
    default:
      return "Invalid field";
  }
};
