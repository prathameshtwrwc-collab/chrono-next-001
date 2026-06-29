"use client";

import { useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { createOrganizationAction, setOrganizationLinkActiveAction } from "@/app/actions/organizations";

export function AddOrganizationForm() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const submit = (formData: FormData) => {
    setMessage("");
    startTransition(async () => {
      const response = await createOrganizationAction({
        name: formData.get("name"),
        organizationType: formData.get("organizationType"),
        contactPerson: formData.get("contactPerson"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        country: formData.get("country"),
        address: formData.get("address"),
        adminFirstName: formData.get("adminFirstName"),
        adminLastName: formData.get("adminLastName"),
        adminEmail: formData.get("adminEmail"),
        adminPassword: formData.get("adminPassword"),
        linkActive: formData.get("linkActive") === "on",
      });

      setMessage(response.message || (response.ok ? "Organization created." : "Could not create organization."));
      if (response.ok) setOpen(false);
    });
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-full bg-gradient-to-r from-champagne via-gold to-sunrise px-6 py-3 text-sm font-semibold text-midnight shadow-[0_8px_30px_rgba(244,181,77,0.25)]"
      >
        Add Organization
      </button>
      {message && <p className="mt-3 text-sm text-gold">{message}</p>}

      {open && typeof window === "object" && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-midnight/80 p-4 backdrop-blur-xl" onClick={() => setOpen(false)}>
          <form action={submit} className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-white/10 bg-indigo-deep p-6 text-ivory shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-gold">Super Admin</p>
                <h2 className="mt-2 font-serif text-4xl">Create organization</h2>
                <p className="mt-2 text-sm text-white/55">Creates organization, unique code/link, organization admin profile, and Clerk admin user.</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/60">Close</button>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <Input name="name" label="Organization Name" />
              <Input name="organizationType" label="Organization Type" defaultValue="Corporate" />
              <Input name="contactPerson" label="Contact Person" />
              <Input name="email" label="Organization Email" type="email" />
              <Input name="phone" label="Phone" />
              <Input name="country" label="Country" />
              <label className="md:col-span-2">
                <span className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-white/42">Address</span>
                <textarea name="address" className="min-h-20 w-full rounded-xl border border-white/12 bg-white/[0.045] px-4 py-3 text-sm outline-none focus:border-gold/60" />
              </label>
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.035] p-5">
              <p className="font-serif text-2xl">Organization admin login</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Input name="adminFirstName" label="Admin First Name" />
                <Input name="adminLastName" label="Admin Last Name" />
                <Input name="adminEmail" label="Admin Email" type="email" />
                <Input name="adminPassword" label="Temporary Password" type="password" />
              </div>
              <label className="mt-5 flex items-center gap-3 text-sm text-white/65">
                <input name="linkActive" type="checkbox" defaultChecked className="h-4 w-4 accent-[#f4b54d]" />
                Enable organization assessment link immediately
              </label>
            </div>

            <div className="mt-6 flex justify-end">
              <button disabled={isPending} className="rounded-full bg-gradient-to-r from-champagne via-gold to-sunrise px-7 py-3 text-sm font-semibold text-midnight disabled:opacity-50">
                {isPending ? "Creating..." : "Create Organization"}
              </button>
            </div>
          </form>
        </div>, document.body
      )}
    </>
  );
}

export function LinkToggle({ organizationId, active }: { organizationId: string; active: boolean }) {
  const [enabled, setEnabled] = useState(active);
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => {
        const next = !enabled;
        setEnabled(next);
        startTransition(async () => {
          const response = await setOrganizationLinkActiveAction(organizationId, next);
          if (!response.ok) setEnabled(!next);
        });
      }}
      className={`rounded-full px-3 py-1 text-xs ${enabled ? "bg-emerald-400/15 text-emerald-300" : "bg-amber-400/15 text-amber-300"}`}
    >
      {enabled ? "Link active" : "Link paused"}
    </button>
  );
}

function Input({ name, label, type = "text", defaultValue = "" }: { name: string; label: string; type?: string; defaultValue?: string }) {
  return (
    <label>
      <span className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-white/42">{label}</span>
      <input name={name} type={type} defaultValue={defaultValue} className="w-full rounded-xl border border-white/12 bg-white/[0.045] px-4 py-3 text-sm outline-none focus:border-gold/60" />
    </label>
  );
}
