"use client";

import { useState, useEffect } from "react";
import { updateOrgBrandingAction } from "@/app/actions/extras";
import { PageHeader, Card } from "@/components/PortalLayout";

export default function WhiteLabelPage() {
  const [orgId, setOrgId] = useState("");
  const [brandName, setBrandName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [savedName, setSavedName] = useState("");
  const [savedLogo, setSavedLogo] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetch("/api/admin-branding")
      .then((r) => r.json())
      .then((data) => {
        if (data) {
          setOrgId(data.orgId);
          setBrandName(data.brandName || data.orgName);
          setLogoUrl(data.logoUrl || "");
          setSavedName(data.brandName || data.orgName);
          setSavedLogo(data.logoUrl || "");
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const startEdit = () => {
    setBrandName(savedName);
    setLogoUrl(savedLogo);
    setEditing(true);
    setMessage("");
  };

  const cancel = () => {
    setBrandName(savedName);
    setLogoUrl(savedLogo);
    setEditing(false);
    setMessage("");
  };

  const save = async () => {
    if (!brandName.trim()) { setMessage("Brand name is required."); return; }
    setSaving(true); setMessage("");
    const result = await updateOrgBrandingAction({ orgId, brandName, logoUrl: logoUrl || undefined });
    setMessage(result.message);
    setSaving(false);
    if (result.ok) {
      setSavedName(brandName);
      setSavedLogo(logoUrl);
      setEditing(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <>
      <PageHeader eyebrow="White Label" title="Brand your organization" sub="Customize how your organization appears to members on shared links." />
      <Card>
        {loading ? (
          <p className="text-sm text-ivory/50">Loading...</p>
        ) : (
          <div className="max-w-lg space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/[0.035]">
              {savedLogo ? (
                <img src={savedLogo} alt="logo" className="h-12 w-12 rounded-xl object-contain bg-white/10" />
              ) : (
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/20 text-gold font-serif text-xl">
                  {(savedName || "C")[0].toUpperCase()}
                </span>
              )}
              <div>
                <p className="font-serif text-xl">{savedName || "Your Brand"}</p>
                <p className="text-xs text-ivory/40">Preview — shown on shared links</p>
              </div>
            </div>

            {editing ? (
              <>
                <label>
                  <span className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-white/42">Brand / Company Name</span>
                  <input value={brandName} onChange={(e) => setBrandName(e.target.value)}
                    className="w-full rounded-xl border border-white/12 bg-white/[0.045] px-4 py-3 text-sm text-ivory outline-none transition focus:border-gold/60" />
                </label>
                <label>
                  <span className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-white/42">Logo URL</span>
                  <input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://example.com/logo.png"
                    className="w-full rounded-xl border border-white/12 bg-white/[0.045] px-4 py-3 text-sm text-ivory outline-none transition focus:border-gold/60" />
                  <p className="mt-1.5 text-xs text-ivory/40">Paste a public URL to your logo image (PNG, SVG, or JPG).</p>
                </label>
                <div className="flex items-center gap-4">
                  <button onClick={save} disabled={saving || !orgId}
                    className="rounded-full bg-gradient-to-r from-champagne via-gold to-sunrise px-8 py-3.5 text-sm font-semibold text-midnight shadow-[0_8px_30px_rgba(244,181,77,0.35)] transition-transform hover:scale-[1.02] disabled:opacity-50">
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button onClick={cancel}
                    className="rounded-full border border-white/15 px-8 py-3.5 text-sm text-white/60 transition hover:bg-white/[0.06]">
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="border-b border-ivory/5 py-3 flex justify-between text-sm">
                  <span className="text-ivory/40">Brand Name</span>
                  <span className="text-ivory/75">{savedName}</span>
                </div>
                <div className="border-b border-ivory/5 py-3 flex justify-between text-sm">
                  <span className="text-ivory/40">Logo URL</span>
                  <span className="text-ivory/50 text-right max-w-xs truncate">{savedLogo || "—"}</span>
                </div>
                <button onClick={startEdit}
                  className="rounded-full border border-gold/40 px-8 py-3.5 text-sm text-gold transition hover:bg-gold/[0.08]">
                  Edit
                </button>
              </div>
            )}

            {message && <p className={`text-sm ${message.includes("updated") ? "text-emerald-400" : "text-gold"}`}>{message}</p>}
          </div>
        )}
      </Card>
    </>
  );
}
