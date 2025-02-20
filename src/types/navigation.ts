import { type ReactNode } from "react";

export interface ActiveLinkProps {
  href: string;
  children: ReactNode;
}

export interface MobileMenuProps {
  isOpen: boolean;
  onClose?: () => void;
}

export interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}
