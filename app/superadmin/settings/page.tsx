"use client";

import { useState, useEffect } from "react";
import { PageHeader, Card } from "@/components/PortalLayout";

const defaultLabels = [
  "Platform name",
  "Primary region",
  "Default plan",
  "Support email",
  "Brand accent",
  "Time format",
];

const defaults: Record<string, string> = {
  "Platform name": "CHRONOTYPE Intelligence",
  "Primary region": "EU-West",
  "Default plan": "Growth",
  "Support email": "ops@somna.io",
  "Brand accent": "Warm Gold",
  "Time format": "24-hour",
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>(defaults);
  const [draft, setDraft] = useState<Record<string, string>>(defaults);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data && Object.keys(data).length) {
          setSettings({ ...defaults, ...data });
          setDraft({ ...defaults, ...data });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const startEdit = () => {
    setDraft({ ...settings });
    setEditing(true);
    setSaved(false);
  };

  const cancel = () => {
    setDraft({ ...settings });
    setEditing(false);
  };

  const update = (label: string, value: string) => {
    setDraft((prev) => ({ ...prev, [label]: value }));
  };

  const save = async () => {
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (res.ok) {
        setSettings({ ...draft });
        setEditing(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {}
  };

  return (
    <>
      <PageHeader eyebrow="Settings" title="Platform settings" />
      <Card>
        {loading ? (
          <p className="text-sm text-ivory/50">Loading settings...</p>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2">
              {defaultLabels.map((label) => (
                <label key={label}>
                  <p className="text-xs uppercase tracking-widest text-ivory/40">{label}</p>
                  {editing ? (
                    <input
                      value={draft[label] || ""}
                      onChange={(e) => update(label, e.target.value)}
                      className="mt-1 w-full rounded-xl border border-white/12 bg-white/[0.045] px-4 py-3 text-sm text-ivory outline-none transition focus:border-gold/60"
                    />
                  ) : (
                    <p className="mt-1 rounded-xl border border-transparent px-4 py-3 text-sm text-ivory/85">
                      {settings[label] || "-"}
                    </p>
                  )}
                </label>
              ))}
            </div>
            <div className="mt-8 flex items-center gap-4">
              {editing ? (
                <>
                  <button onClick={save} className="rounded-full bg-gradient-to-r from-champagne via-gold to-sunrise px-8 py-3.5 text-sm font-semibold text-midnight shadow-[0_8px_30px_rgba(244,181,77,0.35)] transition-transform hover:scale-[1.02]">
                    Save Changes
                  </button>
                  <button onClick={cancel} className="rounded-full border border-white/15 px-8 py-3.5 text-sm text-white/60 transition hover:bg-white/[0.06]">
                    Cancel
                  </button>
                </>
              ) : (
                <button onClick={startEdit} className="rounded-full border border-gold/40 px-8 py-3.5 text-sm text-gold transition hover:bg-gold/[0.08]">
                  Edit
                </button>
              )}
              {saved && <span className="text-sm text-emerald-400">Settings saved.</span>}
            </div>
          </>
        )}
      </Card>
    </>
  );
}
