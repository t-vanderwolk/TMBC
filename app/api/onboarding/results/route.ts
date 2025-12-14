"use server";

import { NextResponse } from "next/server";

import { buildCuratedRegistry } from "@/lib/registry/recommendations";

const parseTags = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter((tag): tag is string => typeof tag === "string");
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter((tag): tag is string => typeof tag === "string");
      }
    } catch {
      if (value.trim().length) {
        return [value];
      }
    }
  }

  return [];
};

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const payload = typeof body === "object" && body !== null ? body : {};
  const tags = parseTags(payload.tags);

  const registry = await buildCuratedRegistry(tags);

  return NextResponse.json({ registry });
}
