"use client";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { UseFormReturn } from "react-hook-form";
import { FixedSizeList } from "react-window";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { SelectProps } from "../input/types";

export function Select({ options, rules, multiple, ...rest }: SelectProps) {
  const [open, setOpen] = useState(false);
  const formContext = useFormContext() as UseFormReturn | undefined;
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState<(string | number)[]>([]);

  const filteredOptions = useMemo(
    () =>
      !searchTerm
        ? options
        : options.filter((option) =>
            option.label
              .toLowerCase()
              .replaceAll(" ", "")
              .includes(searchTerm.toLowerCase().replaceAll(" ", "")),
          ),
    [searchTerm, options],
  );

  const updateValue = (newValue: string | number | (string | number)[]) => {
    setSelected(
      Array.isArray(newValue) ? newValue : newValue ? [newValue] : [],
    );
  };

  useEffect(() => {
    const value = formContext?.getValues(rest.name);
    updateValue(value);
    const sub = formContext?.watch((values, { name }) => {
      if (name !== rest.name) return;
      const newValue = values[rest.name];
      updateValue(newValue);
    });
    return sub?.unsubscribe;
  }, [formContext, rest.name]);

  const { values, labels } = useMemo(() => {
    const selectedValues = options.filter((option) =>
      selected.includes(option.value),
    );
    return {
      values: selectedValues.map((option) => option.value),
      labels: selectedValues.map((option) => option.label),
    };
  }, [options, selected]);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <input
        {...(formContext?.register
          ? formContext.register(rest.name, rules)
          : {})}
        {...rest}
        className="hidden"
        placeholder={undefined}
      />
      <PopoverTrigger asChild>
        <button
          role="combobox"
          aria-expanded={open}
          className={cn(
            rest.className,
            "flex justify-between items-center",
            values.length ? "" : "text-gray-400",
          )}
        >
          {values.length
            ? labels.join(", ")
            : rest.placeholder || <span className="opacity-0">.</span>}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <Command shouldFilter={false}>
          {options.length > 4 && (
            <CommandInput
              value={searchTerm}
              onValueChange={setSearchTerm}
              placeholder={rest.placeholder}
            />
          )}
          <CommandList>
            <CommandEmpty>No matches found.</CommandEmpty>
            <CommandGroup>
              <FixedSizeList
                itemSize={32}
                height={Math.min(filteredOptions.length, 9) * 32}
                itemCount={filteredOptions.length}
                width={"100%"}
                itemData={filteredOptions}
              >
                {({ index, style }) => {
                  const option = filteredOptions[index];
                  if (!option) return null;
                  return (
                    <CommandItem
                      style={style}
                      key={option.value}
                      value={option.label}
                      onSelect={() => {
                        if (multiple) {
                          setSelected((prev) =>
                            prev.includes(option.value)
                              ? prev.filter((value) => value !== option.value)
                              : [...prev, option.value],
                          );
                          formContext?.setValue(rest.name, [option.value]);
                        } else {
                          formContext?.setValue(rest.name, option.value);
                          setSelected([option.value]);
                          if (!multiple) setOpen(false);
                        }
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4 text-accent",
                          values.includes(option.value)
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  );
                }}
              </FixedSizeList>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
