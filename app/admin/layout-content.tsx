"use client";

import { PortalLayout } from "@/components/PortalLayout";
import { adminNavItems } from "@/lib/mock/admin-dashboard";

export function AdminLayoutContent({
  user,
  children,
}: {
  user?: { name: string; role: string; initials: string };
  children: React.ReactNode;
}) {
  return (
    <PortalLayout
      nav={adminNavItems}
      badge="Admin"
      badgeColor="bg-elegant/40 text-champagne"
      user={user}
    >
      {children}
    </PortalLayout>
  );
}
