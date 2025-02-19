"use client";

import Link from "next/link";
import { useState } from "react";
import NavLink from "./NavLink";
import { useSession, signOut } from "next-auth/react";
import MobileMenu from "./MobileMenu";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const onOpenMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          {/* Logo and primary nav */}
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                Blog Platform
              </Link>
            </div>
            {/* Desktop navigation */}
            <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
              {navigationItems.map((item) => (
                <NavLink key={item.href} href={item.href}>
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Right side buttons */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {session?.user ? (
              <>
                <Link
                  href="/profile"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Profile
                </Link>
                <button
                  onClick={() => signOut()}
                  className="rounded-md bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary/90"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            aria-label="Open main menu"
            onClick={onOpenMobileMenu}
            className="sm:hidden p-2 text-gray-500 hover:text-gray-700"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>

          {/* Mobile menu dropdown */}
          <MobileMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          />
        </div>
      </div>
    </nav>
  );
}
