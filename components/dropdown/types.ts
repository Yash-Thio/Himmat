import type { ReactNode } from "react";

export interface DropdownProps {
  trigger: ReactNode;
  onOpen?: () => void;
  onClose?: () => void;
  children: (close: () => void) => ReactNode;
}
