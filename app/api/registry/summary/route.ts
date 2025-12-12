"use server";

import { NextResponse } from "next/server";

/**
 * Local Development Stub for Registry Summary
 * -------------------------------------------
 * This ensures the front-end always has data,
 * even when the real backend registry service
 * is unavailable during MVP development.
 *
 * In production, you can replace this route
 * with a proxy or remove it entirely.
 */

const FAKE_SUMMARY = {
  totalItems: 12,
  purchased: 3,
  remaining: 9,
  curatedCount: 4,
  rows: [
    {
      id: "mock-uppa",
      name: "UPPAbaby Vista V2 Stroller",
      category: "Mobility",
      status: "Curated",
      price: 999,
    },
    {
      id: "mock-snoo",
      name: "SNOO Smart Sleeper",
      category: "Sleep",
      status: "Researching",
      price: 1695,
    },
    {
      id: "mock-nuna",
      name: "Nuna Pipa RX",
      category: "Travel",
      status: "Complete",
      price: 399,
    },
    {
      id: "mock-tub",
      name: "Angelcare Bath Support",
      category: "Bath",
      status: "Curated",
      price: 39,
    },
  ],
};

export async function GET() {
  return NextResponse.json(FAKE_SUMMARY, { status: 200 });
}
