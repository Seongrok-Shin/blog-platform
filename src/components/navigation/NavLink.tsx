"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavLinkProps } from "@/types/navigation";

export default function NavLink({ href, children, className }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
        isActive
          ? "border-primary text-gray-900"
          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
      } ${className}`}
    >
      {children}
    </Link>
  );
}
