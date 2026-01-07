import { promises as fs } from "fs";
import path from "path";

const LOGOS_DIR = path.join(process.cwd(), "assets/logos");
const MIME_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".avif": "image/avif",
};

export async function GET(_: Request, { params }: { params: { logo: string } }) {
  const logoName = params?.logo;
  if (!logoName) {
    return new Response("Logo name missing", { status: 400 });
  }

  const safeName = path.basename(logoName);
  const filePath = path.join(LOGOS_DIR, safeName);

  try {
    const stats = await fs.stat(filePath);
    if (!stats.isFile()) {
      return new Response("Logo not found", { status: 404 });
    }
  } catch {
    return new Response("Logo not found", { status: 404 });
  }

  const buffer = await fs.readFile(filePath);
  const ext = path.extname(safeName).toLowerCase();
  const contentType = MIME_TYPES[ext] ?? "application/octet-stream";
  const headers = new Headers({
    "Content-Type": contentType,
    "Cache-Control": "public, max-age=31536000, immutable",
  });

  return new Response(buffer, { headers });
}
