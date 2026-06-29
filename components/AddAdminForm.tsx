"use client";

import { useState, useEffect, useTransition } from "react";
import { createPortal } from "react-dom";
import { addAdminToOrganizationAction } from "@/app/actions/organizations";

export function AddAdminForm() {
  const [open, setOpen] = useState(false);
  const [orgs, setOrgs] = useState<{ id: string; name: string }[]>([]);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetch("/api/organizations/list")
      .then((r) => r.json())
      .then(setOrgs)
      .catch(() => {});
  }, []);

  const submit = (formData: FormData) => {
    setMessage("");
    startTransition(async () => {
      const res = await addAdminToOrganizationAction(formData);
      setMessage(res.message || (res.ok ? "Admin added." : "Failed."));
      if (res.ok) setTimeout(() => setOpen(false), 1500);
    });
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="rounded-full bg-gradient-to-r from-champagne via-gold to-sunrise px-6 py-3 text-sm font-semibold text-midnight shadow-[0_8px_30px_rgba(244,181,77,0.25)]">
        Add Admin
      </button>
      {open && typeof window === "object" && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-midnight/80 p-4 backdrop-blur-xl" onClick={() => setOpen(false)}>
          <form action={submit} className="w-full max-w-lg rounded-2xl border border-white/10 bg-indigo-deep p-6 text-ivory shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-gold">Super Admin</p>
                <h2 className="mt-2 font-serif text-3xl">Add Admin</h2>
                <p className="mt-2 text-sm text-white/55">Add an administrator to an existing organization.</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/60">Close</button>
            </div>

            <div className="mt-6 space-y-4">
              <label>
                <span className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-white/42">Organization</span>
                <select name="organizationId" required className="w-full rounded-xl border border-white/12 bg-white/[0.045] px-4 py-3 text-sm text-ivory outline-none focus:border-gold/60">
                  <option value="">Select organization...</option>
                  {orgs.map((o) => (
                    <option key={o.id} value={o.id} className="bg-indigo-deep">{o.name}</option>
                  ))}
                </select>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label>
                  <span className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-white/42">First Name</span>
                  <input name="firstName" required className="w-full rounded-xl border border-white/12 bg-white/[0.045] px-4 py-3 text-sm outline-none focus:border-gold/60" />
                </label>
                <label>
                  <span className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-white/42">Last Name</span>
                  <input name="lastName" required className="w-full rounded-xl border border-white/12 bg-white/[0.045] px-4 py-3 text-sm outline-none focus:border-gold/60" />
                </label>
              </div>
              <label>
                <span className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-white/42">Admin Email</span>
                <input name="email" type="email" required className="w-full rounded-xl border border-white/12 bg-white/[0.045] px-4 py-3 text-sm outline-none focus:border-gold/60" />
              </label>
              <label>
                <span className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-white/42">Temporary Password</span>
                <input name="password" type="password" required minLength={8} className="w-full rounded-xl border border-white/12 bg-white/[0.045] px-4 py-3 text-sm outline-none focus:border-gold/60" />
              </label>
            </div>

            {message && <p className="mt-4 text-sm text-gold">{message}</p>}

            <div className="mt-6 flex justify-end">
              <button disabled={isPending} className="rounded-full bg-gradient-to-r from-champagne via-gold to-sunrise px-7 py-3 text-sm font-semibold text-midnight disabled:opacity-50">
                {isPending ? "Adding..." : "Add Admin"}
              </button>
            </div>
          </form>
        </div>, document.body
      )}
    </>
  );
}
