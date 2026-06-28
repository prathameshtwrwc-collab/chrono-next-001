"use client";

import { ClerkProvider } from "@clerk/nextjs";

export function Providers({ children }: { children: React.ReactNode }) {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return <>{children}</>;
  }

  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
    >
      {children}
    </ClerkProvider>
  );
}
