import React, { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import type { DropdownProps } from "./types";

function Dropdown({ trigger, children, onOpen }: DropdownProps) {
  const [isOpen, setOpen] = useState(false);
  const [isOpenFresh, setOpenFresh] = useState(false);
  const [isHoveringOptions, setIsHoveringOptions] = useState(false);
  const handleOpen = () => {
    setOpen(true);
    if (onOpen) onOpen();
  };
  const handleClose = () => {
    setOpen(false);
    setIsHoveringOptions(false);
  };
  useEffect(() => {
    setOpenFresh(isOpen);
  }, [isOpen]);
  return (
    <div className="relative w-full">
      <div
        className="w-full"
        onBlur={() => {
          if (!isHoveringOptions) handleClose();
        }}
        onFocus={handleOpen}
      >
        {trigger}
      </div>
      {isOpen ? (
        <div
          className={cn(
            "shadow-elevation-1 z-10 duration-300 absolute left-0 transition-opacity top-full max-h-60 overflow-auto min-w-full w-max translate-y-2 rounded-primary bg-white p-2 ",
            isOpenFresh ? "opacity-100" : "opacity-0",
          )}
          onMouseEnter={() => {
            setIsHoveringOptions(true);
          }}
          onMouseLeave={() => {
            setIsHoveringOptions(false);
          }}
        >
          {children(handleClose)}
        </div>
      ) : null}
    </div>
  );
}

export default Dropdown;
