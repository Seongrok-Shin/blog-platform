"use client";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { useEffect, useState } from "react";

export default function ClientProviders({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: Session | null;
}) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return null;
  }
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
