import { NextResponse } from "next/server";
import { getMemberDashboardData } from "@/lib/data/dashboard";

export async function GET() {
  const data = await getMemberDashboardData();
  return NextResponse.json(data || { member: null, latestResult: null, reports: [], recommendations: [] });
}
