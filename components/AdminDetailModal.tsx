"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { updateAdminAction, toggleAdminStatusAction } from "@/app/actions/organizations";

export function AdminDetailModal({ admin }: { admin: any }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [fn, setFn] = useState(admin.firstName || admin.name.split(" ")[0]);
  const [ln, setLn] = useState(admin.lastName || admin.name.split(" ").slice(1).join(" "));
  const [email, setEmail] = useState(admin.email);
  const [phone, setPhone] = useState(admin.phone === "-" ? "" : admin.phone);
  const [role, setRole] = useState(admin.role);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const save = async () => {
    const fd = new FormData();
    fd.set("id", admin.id); fd.set("firstName", fn); fd.set("lastName", ln);
    fd.set("email", email); fd.set("phone", phone); fd.set("role", role);
    setBusy(true); setMessage("");
    const r = await updateAdminAction(fd);
    setMessage(r.message); setBusy(false);
    if (r.ok) { setEditing(false); window.location.reload(); }
  };

  const toggle = async () => {
    const fd = new FormData();
    fd.set("id", admin.id);
    fd.set("status", admin.status === "Active" ? "INACTIVE" : "ACTIVE");
    setBusy(true);
    const r = await toggleAdminStatusAction(fd);
    setMessage(r.message); setBusy(false);
    if (r.ok) window.location.reload();
  };

  return (
    <>
      <button onClick={() => { setOpen(true); setEditing(false); setMessage(""); }}
        className="text-left hover:text-gold transition-colors">{admin.name}</button>
      {open && typeof window === "object" && createPortal(
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-midnight/80 p-4 backdrop-blur-xl overflow-y-auto" onClick={() => setOpen(false)}>
          <div className="w-full max-w-lg my-8 rounded-2xl border border-white/10 bg-indigo-deep p-6 text-ivory shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4 mb-6">
              <p className="font-serif text-2xl">{admin.name}</p>
              <div className="flex gap-2">
                <button onClick={() => setEditing(!editing)} className="rounded-full border border-gold/40 px-4 py-2 text-xs text-gold hover:bg-gold/10">
                  {editing ? "Cancel" : "Edit"}
                </button>
                <button onClick={() => setOpen(false)} className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/60">Close</button>
              </div>
            </div>

            <div className="space-y-4">
              {editing ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <label><span className="mb-2 block text-[10px] uppercase text-white/42">First Name</span>
                      <input value={fn} onChange={(e) => setFn(e.target.value)} className="w-full rounded-xl border border-white/12 bg-white/[0.045] px-4 py-3 text-sm outline-none focus:border-gold/60" />
                    </label>
                    <label><span className="mb-2 block text-[10px] uppercase text-white/42">Last Name</span>
                      <input value={ln} onChange={(e) => setLn(e.target.value)} className="w-full rounded-xl border border-white/12 bg-white/[0.045] px-4 py-3 text-sm outline-none focus:border-gold/60" />
                    </label>
                  </div>
                  <label><span className="mb-2 block text-[10px] uppercase text-white/42">Email</span>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-white/12 bg-white/[0.045] px-4 py-3 text-sm outline-none focus:border-gold/60" />
                  </label>
                  <label><span className="mb-2 block text-[10px] uppercase text-white/42">Phone</span>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-xl border border-white/12 bg-white/[0.045] px-4 py-3 text-sm outline-none focus:border-gold/60" />
                  </label>
                  <label><span className="mb-2 block text-[10px] uppercase text-white/42">Role</span>
                    <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full rounded-xl border border-white/12 bg-white/[0.045] px-4 py-3 text-sm outline-none focus:border-gold/60 [&>option]:bg-indigo-deep">
                      <option value="admin">admin</option>
                      <option value="org_admin">org_admin</option>
                      <option value="wellbeing_admin">wellbeing_admin</option>
                    </select>
                  </label>
                  <button onClick={save} disabled={busy} className="w-full rounded-full bg-gradient-to-r from-champagne via-gold to-sunrise px-7 py-3 text-sm font-semibold text-midnight disabled:opacity-50">
                    {busy ? "Saving..." : "Save Changes"}
                  </button>
                </>
              ) : (
                <div className="space-y-3">
                  {[
                    ["Name", admin.name],
                    ["Email", admin.email],
                    ["Phone", admin.phone],
                    ["Role", admin.role],
                    ["Status", admin.status],
                    ["Organization", admin.organization],
                    ["Created", new Date(admin.createdAt).toLocaleString()],
                    ["Updated", admin.updatedAt ? new Date(admin.updatedAt).toLocaleString() : "-"],
                  ].map(([l, v]) => (
                    <div key={l as string} className="flex justify-between border-b border-ivory/5 py-2 text-sm last:border-0">
                      <span className="text-ivory/40">{l}</span>
                      <span className="text-ivory/75">{v as string}</span>
                    </div>
                  ))}
                  <button onClick={toggle} disabled={busy}
                    className={`w-full rounded-full px-7 py-3 text-sm font-semibold disabled:opacity-50 ${admin.status === "Active" ? "border border-red-400/30 text-red-400 hover:bg-red-400/10" : "border border-emerald-400/30 text-emerald-400 hover:bg-emerald-400/10"}`}>
                    {busy ? "..." : admin.status === "Active" ? "Deactivate Admin" : "Activate Admin"}
                  </button>
                </div>
              )}
            </div>
            {message && <p className={`mt-4 text-sm ${message.includes("updated") || message.includes("activated") || message.includes("deactivated") ? "text-emerald-400" : "text-gold"}`}>{message}</p>}
          </div>
        </div>, document.body
      )}
    </>
  );
}
