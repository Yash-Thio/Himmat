import type { PropsWithChildren } from "react";
import React from "react";
import type { UseFormReturn } from "react-hook-form";
import { useFormContext } from "react-hook-form";

import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { getBaseClassName, getInputErrorMessages } from "./constants";
import type { InputProps } from "./types";
function InputWrapper({
  label,
  error,
  children,
  suffix,
  prefix,
  required,
}: PropsWithChildren<{
  label?: string;
  error?: string;
  suffix?: string;
  prefix?: string;
  required?: boolean;
}>) {
  return (
    <div className="w-full">
      {label ? (
        <label className="mb-1.5 block pl-0.5 font-poppins font-medium">
          {label}
          {required && <span className="text-red-600">{" *"}</span>}
        </label>
      ) : null}
      <div className="flex items-stretch">
        {prefix ? (
          <div className="flex items-center rounded-l-xl bg-accent px-5 font-medium">
            {prefix}
          </div>
        ) : null}
        {children}
        {suffix ? (
          <div className="flex items-center rounded-r-xl bg-accent px-5 font-medium">
            {suffix}
          </div>
        ) : null}
      </div>
      <small className="text-red-600">{error}</small>
    </div>
  );
}

function Input({
  textarea = false,
  options,
  rules,
  label,
  error,
  suffix,
  prefix,
  multiple,
  ...rest
}: InputProps) {
  const formContext = useFormContext() as UseFormReturn | undefined;
  const formError = formContext?.formState.errors[rest.name];
  const errorMessage =
    error ||
    formError?.message?.toString() ||
    getInputErrorMessages(formError?.type?.toString());
  const className = cn(
    getBaseClassName(
      Boolean(suffix),
      Boolean(prefix),
      rest.type === "checkbox" || rest.type === "radio",
    ),
    rest.className,
  );
  if (options)
    return (
      <InputWrapper
        error={errorMessage}
        label={label}
        prefix={prefix}
        suffix={suffix}
        required={!!rules?.required}
      >
        <Select
          multiple={multiple}
          options={options}
          rules={rules}
          {...rest}
          className={className}
        />
      </InputWrapper>
    );
  if (textarea)
    return (
      <InputWrapper
        error={errorMessage}
        label={label}
        prefix={prefix}
        suffix={suffix}
      >
        <textarea
          {...(formContext?.register
            ? formContext.register(rest.name, rules)
            : {})}
          {...rest}
          className={className}
        />
      </InputWrapper>
    );
  return (
    <InputWrapper
      error={errorMessage}
      label={label}
      prefix={prefix}
      suffix={suffix}
    >
      <input
        {...(formContext?.register
          ? formContext.register(rest.name, rules)
          : {})}
        {...rest}
        className={className}
      />
    </InputWrapper>
  );
}

export default Input;
