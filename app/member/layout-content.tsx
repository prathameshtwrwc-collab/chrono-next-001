"use client";

import { PortalLayout } from "@/components/PortalLayout";
import { memberNavItems } from "@/lib/mock/member-dashboard";

export function MemberLayoutContent({
  user,
  children,
}: {
  user?: { name: string; role: string; initials: string };
  children: React.ReactNode;
}) {
  return (
    <PortalLayout
      nav={memberNavItems}
      badge="Member"
      badgeColor="bg-gold/20 text-gold"
      user={user}
    >
      {children}
    </PortalLayout>
  );
}
