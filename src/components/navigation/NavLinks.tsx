import ActiveLink from "./ActiveLink";

interface NavLinksProps {
  items: Array<{
    href: string;
    label: string;
  }>;
}

export default function NavLinks({ items }: NavLinksProps) {
  return (
    <>
      {items.map(({ href, label }) => (
        <ActiveLink key={href} href={href}>
          {label}
        </ActiveLink>
      ))}
    </>
  );
}
