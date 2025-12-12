import { NextRequest, NextResponse } from 'next/server';
import { getUserRegistry } from '@/lib/services/registry.service';
import { getUserOrThrow } from '@/lib/auth/getUser';

export async function GET(request: NextRequest) {
  const user = await getUserOrThrow(request);
  const registry = await getUserRegistry(user.id);
  return NextResponse.json({ registry });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  if (body.sync) {
    const user = await getUserOrThrow(request);
    return NextResponse.json({ sync: true, summary: { syncedAt: new Date().toISOString() } });
  }
  return NextResponse.json({});
}
