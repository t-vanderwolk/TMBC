import { NextRequest, NextResponse } from 'next/server';
import { updateRegistryItem } from '@/lib/services/registry.service';
import { getUserOrThrow } from '@/lib/auth/getUser';

export async function PATCH(request: NextRequest) {
  const user = await getUserOrThrow(request);
  const payload = await request.json();
  const updated = await updateRegistryItem(user.id, payload.itemId?.toString() ?? '', payload.fields);
  return NextResponse.json({ updated });
}
