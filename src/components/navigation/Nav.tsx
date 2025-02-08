import Link from "next/link";
import MobileMenuButton from "./MobileMenuButton";
import NavLink from "./NavLink";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
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
          </div>

          {/* Mobile menu button */}
          <MobileMenuButton />
        </div>
      </div>
    </nav>
  );
}
