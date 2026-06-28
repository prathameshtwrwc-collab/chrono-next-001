"use client";

import { PageHeader, Card } from "@/components/PortalLayout";
import { MiniLine } from "@/components/charts";
import { memberEnergyCurve, memberEnergyLabels, memberEnergyCards } from "@/lib/mock/member-dashboard";

export default function EnergyPage() {
  return (
    <>
      <PageHeader eyebrow="Energy Timeline" title="Your 24-hour rhythm" sub="Plan your day around your natural energy — work with the wave, not against it." />
      <Card>
        <div className="relative h-72">
          <MiniLine data={memberEnergyCurve} h={280} color="#e7a95b" />
          <div className="mt-2 flex justify-between text-xs text-ivory/40">{memberEnergyLabels.map((l, i) => <span key={i}>{l}</span>)}</div>
        </div>
      </Card>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {memberEnergyCards.map((r) => (
          <Card key={r.label}>
            <span className="inline-block h-3 w-3 rounded-full" style={{ background: r.color, boxShadow: `0 0 12px ${r.color}` }} />
            <p className="mt-3 text-xs uppercase tracking-widest text-ivory/40">{r.label}</p>
            <p className="mt-1 font-serif text-2xl">{r.time}</p>
          </Card>
        ))}
      </div>
    </>
  );
}
