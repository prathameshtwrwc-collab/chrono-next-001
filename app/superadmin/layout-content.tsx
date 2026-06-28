"use client";

import { PortalLayout } from "@/components/PortalLayout";
import { superadminNavItems } from "@/lib/mock/superadmin-dashboard";

export function SuperadminLayoutContent({
  user,
  children,
}: {
  user?: { name: string; role: string; initials: string };
  children: React.ReactNode;
}) {
  return (
    <PortalLayout
      nav={superadminNavItems}
      badge="Super"
      badgeColor="bg-gradient-to-r from-gold to-sunrise text-midnight"
      user={user}
    >
      {children}
    </PortalLayout>
  );
}
