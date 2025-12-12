import { NextRequest, NextResponse } from 'next/server';
import { removeRegistryItem } from '@/lib/services/registry.service';
import { getUserOrThrow } from '@/lib/auth/getUser';

export async function DELETE(request: NextRequest) {
  const user = await getUserOrThrow(request);
  const payload = await request.json();
  await removeRegistryItem(user.id, payload.itemId?.toString() ?? '');
  return NextResponse.json({ success: true });
}
