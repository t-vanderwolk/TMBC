import { NextRequest, NextResponse } from 'next/server';
import { addRegistryItem } from '@/lib/services/registry.service';
import { getUserOrThrow } from '@/lib/auth/getUser';

export async function POST(request: NextRequest) {
  const user = await getUserOrThrow(request);
  const payload = await request.json();
  const item = await addRegistryItem(user.id, payload);
  return NextResponse.json({ item });
}
