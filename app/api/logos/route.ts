import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

const LOGOS_DIR = path.join(process.cwd(), "assets/logos");

export async function GET() {
  const entries = await fs.readdir(LOGOS_DIR, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

  return NextResponse.json(files, {
    headers: {
      "Cache-Control": "public, max-age=86400",
    },
  });
}
