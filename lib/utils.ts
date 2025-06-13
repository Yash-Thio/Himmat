import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH } from "@/constants/constraints";
import { USERNAME_REGEX } from "@/constants/regex";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getUsernameInputRules = (
  isAvailable: (username: string) => Promise<boolean>,
) => ({
  required: true,
  pattern: {
    value: USERNAME_REGEX,
    message: "Username can only contain alphabets, numbers and '-'",
  },
  minLength: {
    value: USERNAME_MIN_LENGTH,
    message: `Username must be at least ${USERNAME_MIN_LENGTH} characters long`,
  },
  maxLength: {
    value: USERNAME_MAX_LENGTH,
    message: `Username can only contain maximum ${USERNAME_MAX_LENGTH} characters`,
  },
  validate: {
    availability: async (username: string) => {
      const result = await isAvailable(username);
      return result || "Username already taken!";
    },
  },
});